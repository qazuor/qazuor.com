/**
 * Font Detection and Path Resolution for @fontsource packages
 *
 * This module provides utilities to:
 * - Detect @fontsource imports in source files
 * - Parse font configuration from imports
 * - Resolve physical paths to .woff2 font files
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { glob } from 'glob';

/**
 * Represents a detected font with its configuration
 */
export interface DetectedFont {
    /** Font family name (e.g., 'inter', 'jetbrains-mono') */
    family: string;
    /** Font weight (e.g., 400, 600, 700) */
    weight: number;
    /** Font style (e.g., 'normal', 'italic') */
    style: 'normal' | 'italic';
    /** Character subset (e.g., 'latin', 'cyrillic') */
    subset: string;
}

/**
 * Represents a resolved font file with source and destination paths
 */
export interface ResolvedFontFile {
    /** Font configuration */
    font: DetectedFont;
    /** Source path in node_modules */
    sourcePath: string;
    /** Destination filename for public/fonts/ */
    destFilename: string;
}

/**
 * Configuration options for font detection
 */
export interface FontDetectorOptions {
    /** Root directory of the project */
    root: string;
    /** Subsets to include (default: ['latin']) */
    subsets?: string[];
    /** Whether to include italic variants (default: false) */
    includeItalic?: boolean;
    /** Enable verbose logging */
    verbose?: boolean;
}

/**
 * Regex pattern to match @fontsource imports
 * Matches: @fontsource/[font-name]/[weight].css or @fontsource/[font-name]/[weight]-[style].css
 */
const FONTSOURCE_IMPORT_REGEX = /@fontsource\/([\w-]+)\/(\d+)(?:-(italic|normal))?\.css/g;

/**
 * Scans source files for @fontsource imports and extracts font configurations
 *
 * @param options - Detection configuration options
 * @returns Array of detected fonts with their configurations
 */
export async function detectFonts(options: FontDetectorOptions): Promise<DetectedFont[]> {
    const { root, subsets = ['latin'], includeItalic = false, verbose = false } = options;

    if (verbose) {
        console.log('🔍 Scanning for @fontsource imports...');
    }

    // Find all source files that could contain font imports
    const sourceFiles = await glob('src/**/*.{astro,ts,tsx,css}', {
        cwd: root,
        absolute: true
    });

    if (verbose) {
        console.log(`   Found ${sourceFiles.length} files to scan`);
    }

    const detectedFonts = new Map<string, DetectedFont>();

    // Scan each file for @fontsource imports
    for (const filePath of sourceFiles) {
        try {
            const content = await readFile(filePath, 'utf-8');
            const matches = content.matchAll(FONTSOURCE_IMPORT_REGEX);

            for (const match of matches) {
                const [, family, weightStr, styleStr] = match;
                const weight = parseInt(weightStr, 10);
                const style = (styleStr || 'normal') as 'normal' | 'italic';

                // Skip italic if not requested
                if (style === 'italic' && !includeItalic) {
                    continue;
                }

                // Create font entries for each requested subset
                for (const subset of subsets) {
                    const key = `${family}-${subset}-${weight}-${style}`;

                    if (!detectedFonts.has(key)) {
                        detectedFonts.set(key, {
                            family,
                            weight,
                            style,
                            subset
                        });
                    }
                }
            }
        } catch (error) {
            if (verbose) {
                console.warn(`   ⚠️  Could not read file: ${filePath}`);
            }
        }
    }

    const fonts = Array.from(detectedFonts.values());

    if (verbose) {
        console.log(`   ✅ Detected ${fonts.length} font variants\n`);
    }

    return fonts;
}

/**
 * Resolves physical paths for detected fonts
 *
 * @param fonts - Array of detected fonts
 * @param root - Project root directory
 * @param verbose - Enable verbose logging
 * @returns Array of resolved font files with source and destination paths
 */
export async function resolveFontPaths(
    fonts: DetectedFont[],
    root: string,
    verbose = false
): Promise<ResolvedFontFile[]> {
    const resolvedFiles: ResolvedFontFile[] = [];

    if (verbose) {
        console.log('📁 Resolving font file paths...');
    }

    for (const font of fonts) {
        const { family, weight, style, subset } = font;

        // Construct expected filename in @fontsource package
        const filename = `${family}-${subset}-${weight}-${style}.woff2`;

        // Construct source path
        const sourcePath = join(root, 'node_modules', `@fontsource/${family}`, 'files', filename);

        // Destination filename (keep original naming for clarity)
        const destFilename = filename;

        resolvedFiles.push({
            font,
            sourcePath,
            destFilename
        });

        if (verbose) {
            console.log(`   ✓ ${family} ${weight} ${style} (${subset})`);
        }
    }

    if (verbose) {
        console.log(`   ✅ Resolved ${resolvedFiles.length} font files\n`);
    }

    return resolvedFiles;
}

/**
 * Manually specify fonts instead of auto-detection
 *
 * @param fonts - Manual font configuration
 * @param root - Project root directory
 * @param verbose - Enable verbose logging
 * @returns Array of resolved font files
 */
export async function manualFontConfig(
    fonts: Array<{
        family: string;
        weights: number[];
        subsets: string[];
        styles?: Array<'normal' | 'italic'>;
    }>,
    root: string,
    verbose = false
): Promise<ResolvedFontFile[]> {
    const detectedFonts: DetectedFont[] = [];

    for (const config of fonts) {
        const { family, weights, subsets, styles = ['normal'] } = config;

        for (const weight of weights) {
            for (const style of styles) {
                for (const subset of subsets) {
                    detectedFonts.push({
                        family,
                        weight,
                        style,
                        subset
                    });
                }
            }
        }
    }

    return resolveFontPaths(detectedFonts, root, verbose);
}
