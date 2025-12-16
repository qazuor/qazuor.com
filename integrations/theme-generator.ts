/**
 * Astro Integration: Theme Generator
 *
 * Generates CSS from src/config/themeConfig.ts
 * Outputs to src/styles/generated-theme.css
 *
 * This ensures a single source of truth for theme variables.
 * The same config is used for:
 * - Critical CSS inline in BaseLayout.astro
 * - Generated theme CSS file (this integration)
 */

import { execSync } from 'node:child_process';
import { unwatchFile, watchFile } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

interface ThemeGeneratorOptions {
    /** Path to theme config file (relative to project root) */
    configFile?: string;
    /** Output CSS file path (relative to project root) */
    outputFile?: string;
    /** Enable watch mode in development */
    watch?: boolean;
}

/**
 * Executes the theme generation script using tsx
 * This is more reliable than dynamic imports in Vite context
 */
function runThemeGenerator(projectRoot: string): { changed: boolean } {
    try {
        const scriptPath = join(projectRoot, 'scripts/generate-theme-css.ts');
        const result = execSync(`npx tsx "${scriptPath}"`, {
            cwd: projectRoot,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });

        return { changed: result.trim() === 'CHANGED' };
    } catch (error) {
        console.error('❌ Error generating theme CSS:', error);
        throw error;
    }
}

/**
 * Main theme generator integration
 */
export default function themeGenerator(options: ThemeGeneratorOptions = {}): AstroIntegration {
    const {
        configFile = 'src/config/themeConfig.ts',
        outputFile = 'src/styles/generated-theme.css',
        watch = true
    } = options;

    let projectRoot: string;
    let isGenerating = false;

    return {
        name: 'theme-generator',
        hooks: {
            'astro:config:setup': ({ config, command }) => {
                projectRoot = fileURLToPath(config.root);
                const configPath = join(projectRoot, configFile);

                // Initial generation
                generate();

                console.log('🎨 Theme generator integration initialized');
                console.log(`   📁 Config: ${configFile}`);
                console.log(`   📄 Output: ${outputFile}`);

                // Watch for changes in development
                if (command === 'dev' && watch) {
                    let timeout: NodeJS.Timeout | null = null;

                    watchFile(configPath, { interval: 500 }, () => {
                        // Debounce rapid file changes
                        if (timeout) clearTimeout(timeout);

                        timeout = setTimeout(() => {
                            if (isGenerating) return;

                            console.log('🔄 Theme config changed, regenerating...');
                            try {
                                generate();
                                console.log('✅ Theme CSS regenerated successfully');
                            } catch (error) {
                                console.error('❌ Error regenerating theme CSS:', error);
                            }
                        }, 300);
                    });

                    // Cleanup on server stop
                    const cleanup = () => {
                        unwatchFile(configPath);
                    };
                    process.on('SIGINT', cleanup);
                    process.on('SIGTERM', cleanup);
                }
            },

            'astro:build:start': () => {
                // Regenerate before build
                generate();
            }
        }
    };

    function generate() {
        if (isGenerating) return;
        isGenerating = true;

        try {
            const result = runThemeGenerator(projectRoot);
            if (result.changed) {
                console.log('✅ Generated theme CSS (content changed)');
            } else {
                console.log('⏭️  Theme CSS unchanged, skipping write');
            }
        } finally {
            isGenerating = false;
        }
    }
}
