import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function searchIndexIntegration(): AstroIntegration {
    return {
        name: 'search-index',
        hooks: {
            'astro:config:setup': () => {
                // Search Index Integration initialized
            },

            'astro:server:start': async () => {
                await generateSearchIndexFile();
            },

            'astro:build:start': async () => {
                await generateSearchIndexFile();
            }
        }
    };
}

async function generateSearchIndexFile() {
    try {
        const searchIndexPath = join(__dirname, '../src/data/searchIndex.ts');
        const searchDataDir = dirname(searchIndexPath);

        // Ensure directory exists
        if (!existsSync(searchDataDir)) {
            mkdirSync(searchDataDir, { recursive: true });
        }

        // For now, create a placeholder that signals that the index should be loaded from window.__SEARCH_INDEX__
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
export const SEARCH_INDEX_TIMESTAMP = ${Date.now()};
`;

        writeFileSync(searchIndexPath, indexContent, 'utf8');
    } catch (error) {
        console.error('❌ Error generating search index file:', error);
    }
}
