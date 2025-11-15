// This file is auto-generated during build/dev
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
export const SEARCH_INDEX_TIMESTAMP = 1763242975635;
