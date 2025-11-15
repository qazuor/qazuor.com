import Fuse from 'fuse.js';
import { useCallback, useState } from 'react';
import { getSearchIndex } from '../data/searchIndex';
import type { SearchableItem } from '../types/search';

interface ContentSearchResult {
    title: string;
    description: string;
    url: string;
    category: string;
    tags: string[];
    score: number;
    type: 'content' | 'command';
}

interface GroupedSearchResults {
    [category: string]: ContentSearchResult[];
}

export function useContentSearch() {
    const [results, setResults] = useState<ContentSearchResult[]>([]);
    const [groupedResults, setGroupedResults] = useState<GroupedSearchResults>({});

    const search = useCallback((query: string) => {
        if (!query.trim()) {
            setResults([]);
            setGroupedResults({});
            return;
        }

        const searchIndex = getSearchIndex();
        if (searchIndex.length === 0) {
            setResults([]);
            setGroupedResults({});
            return;
        }

        const fuse = new Fuse(searchIndex, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'description', weight: 0.2 },
                { name: 'tags', weight: 0.1 }
            ],
            threshold: 0.4, // More restrictive - was 0.6, now more precise matches
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 1, // Allow single character matches
            findAllMatches: true, // Find all possible matches
            location: 0, // Start searching at the beginning
            distance: 100, // How far from location to search
            ignoreLocation: true, // Don't consider location when scoring
            useExtendedSearch: true // Enable extended search syntax
        });

        const fuseResults = fuse.search(query);

        // Filter results by score (lower score is better in Fuse.js)
        const goodResults = fuseResults.filter((result) => (result.score ?? 0) < 0.6); // More restrictive - was 0.8

        // Limit results to top 10 for better UI performance
        const limitedResults = goodResults.slice(0, 10);

        // Group by category and map to our result format
        const groupedResults: Record<string, ContentSearchResult[]> = {};

        limitedResults.forEach((result) => {
            const item = result.item as SearchableItem;
            const category = item.category;
            if (!groupedResults[category]) {
                groupedResults[category] = [];
            }

            groupedResults[category].push({
                title: item.title,
                description: item.description,
                url: item.url,
                category: item.category,
                tags: item.tags,
                score: result.score || 0,
                type: item.type
            });
        });

        // Convert to flat array for rendering
        const finalResults = Object.values(groupedResults).flat();

        setResults(finalResults);
        setGroupedResults(groupedResults);
    }, []);

    return { search, results, groupedResults };
}

export type { ContentSearchResult, GroupedSearchResults };
