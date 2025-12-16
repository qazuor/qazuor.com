#!/usr/bin/env npx tsx
/**
 * Script: Generate Theme CSS
 *
 * Generates src/styles/generated-theme.css from src/config/themeConfig.ts
 * Called by the theme-generator Astro integration.
 *
 * Usage: npx tsx scripts/generate-theme-css.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { generateFullThemeCSS } from '../src/config/themeConfig';

const OUTPUT_FILE = 'src/styles/generated-theme.css';

function main() {
    const projectRoot = process.cwd();
    const outputPath = join(projectRoot, OUTPUT_FILE);

    // Ensure output directory exists
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    // Generate CSS content
    const cssContent = generateFullThemeCSS();

    // Check if content actually changed (comparing without timestamp header)
    let shouldWrite = true;
    if (existsSync(outputPath)) {
        const existingContent = readFileSync(outputPath, 'utf-8');

        // Extract CSS without the header comment (which contains timestamp)
        const stripHeader = (content: string) => content.replace(/\/\*\*[\s\S]*?\*\/\n*/m, '').trim();

        const existingCSS = stripHeader(existingContent);
        const newCSS = stripHeader(cssContent);

        shouldWrite = existingCSS !== newCSS;
    }

    // Only write if content changed
    if (shouldWrite) {
        writeFileSync(outputPath, cssContent, 'utf-8');
        console.log('CHANGED');
    } else {
        console.log('UNCHANGED');
    }
}

main();
