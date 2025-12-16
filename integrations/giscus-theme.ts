/**
 * Astro Integration: Giscus Theme Generator
 *
 * Generates Giscus CSS theme files from theme colors.
 * Colors are sourced from src/config/themeConfig.ts (via themeColors.ts).
 *
 * Watches src/config/themeConfig.ts and regenerates:
 * - public/styles/giscus-custom.css (dark mode)
 * - public/styles/giscus-custom-light.css (light mode)
 */

import { execSync } from 'node:child_process';
import { unwatchFile, watchFile } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

interface GiscusThemeOptions {
    sourceFile?: string;
    outputDir?: string;
    watch?: boolean;
}

/**
 * Executes the Giscus CSS generation script using tsx
 */
function runGiscusGenerator(projectRoot: string): { changed: boolean; primary?: string; secondary?: string } {
    try {
        const scriptPath = join(projectRoot, 'scripts/generate-giscus-css.ts');
        const result = execSync(`npx tsx "${scriptPath}"`, {
            cwd: projectRoot,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });

        const lines = result.trim().split('\n');
        const changed = lines[0] === 'CHANGED';

        if (changed && lines.length >= 3) {
            return {
                changed: true,
                primary: lines[1].replace('Primary: ', ''),
                secondary: lines[2].replace('Secondary: ', '')
            };
        }

        return { changed };
    } catch (error) {
        console.error('❌ Error generating Giscus CSS:', error);
        throw error;
    }
}

/**
 * Main Giscus theme integration
 */
export default function giscusTheme(options: GiscusThemeOptions = {}): AstroIntegration {
    const {
        sourceFile = 'src/config/themeConfig.ts', // Watch the main config, not themeColors
        outputDir = 'public/styles',
        watch = true
    } = options;

    let projectRoot: string;
    let isGenerating = false;

    return {
        name: 'giscus-theme',
        hooks: {
            'astro:config:setup': ({ config, command }) => {
                projectRoot = fileURLToPath(config.root);

                // Generate CSS on setup
                generate();

                console.log('🎨 Giscus theme integration initialized');
                console.log(`   📁 Watching: ${sourceFile}`);
                console.log(`   📄 Output: ${outputDir}/giscus-custom*.css`);

                // Watch for changes in development
                if (command === 'dev' && watch) {
                    const watchPath = join(projectRoot, sourceFile);
                    let timeout: NodeJS.Timeout | null = null;

                    watchFile(watchPath, { interval: 500 }, () => {
                        // Debounce rapid file changes
                        if (timeout) clearTimeout(timeout);

                        timeout = setTimeout(() => {
                            if (isGenerating) return;

                            console.log('🔄 Theme config changed, regenerating Giscus CSS...');
                            try {
                                generate();
                                console.log('✅ Giscus CSS regenerated successfully');
                            } catch (error) {
                                console.error('❌ Error regenerating Giscus CSS:', error);
                            }
                        }, 300);
                    });

                    // Cleanup on server stop
                    const cleanup = () => {
                        unwatchFile(watchPath);
                    };
                    process.on('SIGINT', cleanup);
                    process.on('SIGTERM', cleanup);
                }
            },

            'astro:build:start': () => {
                // Regenerate CSS before build
                generate();
            }
        }
    };

    function generate() {
        if (isGenerating) return;
        isGenerating = true;

        try {
            const result = runGiscusGenerator(projectRoot);
            if (result.changed) {
                console.log('✅ Generated: giscus-custom.css (dark mode)');
                console.log('✅ Generated: giscus-custom-light.css (light mode)');
                if (result.primary && result.secondary) {
                    console.log(`   🎨 Theme: (Primary: ${result.primary}, Secondary: ${result.secondary})`);
                }
            } else {
                console.log('⏭️  Giscus CSS unchanged, skipping write');
            }
        } finally {
            isGenerating = false;
        }
    }
}
