#!/usr/bin/env node

/**
 * Build-time script to generate search index from Astro collections
 * This script runs during the build process to create a static search index
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateSearchIndex() {
    try {
        const searchIndexPath = join(__dirname, '../src/data/searchIndex.ts');
        const searchDataDir = dirname(searchIndexPath);

        // Ensure directory exists
        if (!existsSync(searchDataDir)) {
            mkdirSync(searchDataDir, { recursive: true });
        }

        // Create file that works with the current BuildSearchIndex.astro approach
        // Format: 4 spaces, single quotes, semicolons (Biome compatible)
        const indexContent = `// This file is auto-generated during build/dev
// Do not edit manually

import type { SearchableItem } from '../types/search';

// Search index is populated by BuildSearchIndex.astro component
// and made available via window.__SEARCH_INDEX__

export function getSearchIndex(): SearchableItem[] {
    if (typeof window !== 'undefined' && window.__SEARCH_INDEX__) {
        return window.__SEARCH_INDEX__;
    }
    return [];
}

// For development: signal that index should be loaded from global variable
export const SEARCH_INDEX_SOURCE = 'window';
`;

        writeFileSync(searchIndexPath, indexContent, 'utf8');
    } catch (error) {
        console.error('❌ Error generating search index:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateSearchIndex();
}
