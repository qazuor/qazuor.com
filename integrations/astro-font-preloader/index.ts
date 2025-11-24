/**
 * Astro Font Preloader Integration
 *
 * Automatically detects @fontsource fonts used in the project and copies
 * .woff2 files to public/fonts/ directory for static preload hints.
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import fontPreloader from './src/integrations/astro-font-preloader';
 *
 * export default defineConfig({
 *   integrations: [
 *     fontPreloader({
 *       autoDetect: true,
 *       subsets: ['latin'],
 *       verbose: true
 *     })
 *   ]
 * });
 * ```
 */

import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { AstroIntegration } from 'astro';
import { detectFonts, manualFontConfig, resolveFontPaths } from './font-detector.js';

/**
 * Configuration options for the font preloader integration
 */
export interface FontPreloaderOptions {
    /**
     * Enable automatic font detection from @fontsource imports
     * @default true
     */
    autoDetect?: boolean;

    /**
     * Manually specify fonts to copy (used if autoDetect is false)
     */
    fonts?: Array<{
        /** Font family name (e.g., 'inter', 'jetbrains-mono') */
        family: string;
        /** Font weights to include (e.g., [400, 600, 700]) */
        weights: number[];
        /** Character subsets to include (e.g., ['latin', 'cyrillic']) */
        subsets: string[];
        /** Font styles to include (default: ['normal']) */
        styles?: Array<'normal' | 'italic'>;
    }>;

    /**
     * Character subsets to include when auto-detecting
     * @default ['latin']
     */
    subsets?: string[];

    /**
     * Include italic font variants
     * @default false
     */
    includeItalic?: boolean;

    /**
     * Output directory relative to project root
     * @default 'public/fonts'
     */
    outputDir?: string;

    /**
     * Enable verbose logging
     * @default false
     */
    verbose?: boolean;
}

/**
 * Creates the Astro Font Preloader integration
 *
 * @param options - Integration configuration options
 * @returns Astro integration object
 */
export default function fontPreloader(options: FontPreloaderOptions = {}): AstroIntegration {
    const {
        autoDetect = true,
        fonts = [],
        subsets = ['latin'],
        includeItalic = false,
        outputDir = 'public/fonts',
        verbose = false
    } = options;

    let projectRoot = '';

    return {
        name: 'astro-font-preloader',
        hooks: {
            'astro:config:setup': async ({ config }) => {
                // Store project root for later use
                projectRoot = config.root.pathname;

                if (verbose) {
                    console.log('\n⚡ Font Preloader: Initializing...');
                    console.log(`   Project root: ${projectRoot}`);
                    console.log(`   Output dir: ${outputDir}\n`);
                }
            },

            'astro:config:done': async () => {
                await copyFonts();
            },

            'astro:server:start': async () => {
                if (verbose) {
                    console.log('\n🔥 Font Preloader: Dev server started, fonts copied\n');
                }
            }
        }
    };

    /**
     * Copies font files from node_modules to public directory
     */
    async function copyFonts(): Promise<void> {
        try {
            // Determine which fonts to copy
            const resolvedFonts = autoDetect
                ? await resolveFontPaths(
                      await detectFonts({
                          root: projectRoot,
                          subsets,
                          includeItalic,
                          verbose
                      }),
                      projectRoot,
                      verbose
                  )
                : await manualFontConfig(fonts, projectRoot, verbose);

            if (resolvedFonts.length === 0) {
                if (verbose) {
                    console.warn('⚠️  Font Preloader: No fonts detected or configured');
                }
                return;
            }

            // Ensure output directory exists
            const destDir = join(projectRoot, outputDir);
            await mkdir(destDir, { recursive: true });

            if (verbose) {
                console.log('📦 Copying font files...');
            }

            let copiedCount = 0;
            let skippedCount = 0;

            // Copy each font file
            for (const { sourcePath, destFilename, font } of resolvedFonts) {
                const destPath = join(destDir, destFilename);

                try {
                    // Ensure subdirectories exist
                    await mkdir(dirname(destPath), { recursive: true });

                    // Copy font file
                    await copyFile(sourcePath, destPath);

                    copiedCount++;

                    if (verbose) {
                        console.log(`   ✓ ${font.family}-${font.subset}-${font.weight}-${font.style}.woff2`);
                    }
                } catch (error) {
                    skippedCount++;

                    if (verbose) {
                        console.warn(
                            `   ⚠️  Could not copy ${font.family}-${font.subset}-${font.weight}-${font.style}.woff2`
                        );
                        console.warn(`      Source: ${sourcePath}`);
                        console.warn(`      Error: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
            }

            if (verbose) {
                console.log(`\n✅ Font Preloader: Copied ${copiedCount} fonts`);
                if (skippedCount > 0) {
                    console.log(`⚠️  Font Preloader: Skipped ${skippedCount} fonts (not found)\n`);
                } else {
                    console.log('');
                }
            }
        } catch (error) {
            console.error('❌ Font Preloader: Fatal error during font copying');
            console.error(error);
            throw error;
        }
    }
}
