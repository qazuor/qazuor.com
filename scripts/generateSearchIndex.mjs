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
        const indexContent = `// This file is auto-generated during build/dev
// Do not edit manually - Content is loaded from BuildSearchIndex.astro

import type { SearchableItem } from '../types/search';

/**
 * Search index data - populated at runtime by BuildSearchIndex.astro
 * The data is available in window.__SEARCH_INDEX__ on the client
 */

/**
 * Get search index from global window variable
 * The actual data is populated by BuildSearchIndex.astro component
 */
export function getSearchIndex(): SearchableItem[] {
  if (typeof window !== 'undefined' && window.__SEARCH_INDEX__) {
    return window.__SEARCH_INDEX__;
  }

  return [];
}

// Export placeholder for compatibility - real data comes from window.__SEARCH_INDEX__
export const searchIndex: SearchableItem[] = [];

// Metadata
export const SEARCH_INDEX_GENERATED = '${new Date().toISOString()}';
export const SEARCH_INDEX_MODE = 'runtime-hybrid';
export const SEARCH_INDEX_SOURCE = 'BuildSearchIndex.astro -> window.__SEARCH_INDEX__';
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
