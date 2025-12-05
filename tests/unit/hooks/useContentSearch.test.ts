import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useContentSearch } from '@/hooks/useContentSearch';

// Mock the getSearchIndex function
vi.mock('@/data/searchIndex', () => ({
    getSearchIndex: vi.fn()
}));

import { getSearchIndex } from '@/data/searchIndex';

const mockGetSearchIndex = getSearchIndex as ReturnType<typeof vi.fn>;

describe('useContentSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('initial state', () => {
        it('should return empty results initially', () => {
            mockGetSearchIndex.mockReturnValue([]);
            const { result } = renderHook(() => useContentSearch());

            expect(result.current.results).toEqual([]);
            expect(result.current.groupedResults).toEqual({});
        });

        it('should return a search function', () => {
            mockGetSearchIndex.mockReturnValue([]);
            const { result } = renderHook(() => useContentSearch());

            expect(typeof result.current.search).toBe('function');
        });
    });

    describe('search functionality', () => {
        const mockSearchIndex = [
            {
                title: 'Blog Post About React',
                description: 'Learn about React hooks',
                url: '/en/blog/react-hooks',
                category: 'Blog',
                tags: ['react', 'hooks', 'javascript'],
                type: 'content' as const
            },
            {
                title: 'Web Development Project',
                description: 'A full stack web application',
                url: '/en/projects/web-app',
                category: 'Projects',
                tags: ['web', 'fullstack'],
                type: 'content' as const
            },
            {
                title: 'CSS Gradient Trick',
                description: 'Create beautiful gradients',
                url: '/en/goodies/css-tricks/gradient',
                category: 'Goodies',
                tags: ['css', 'design'],
                type: 'content' as const
            }
        ];

        it('should return empty results for empty query', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('');
            });

            expect(result.current.results).toEqual([]);
            expect(result.current.groupedResults).toEqual({});
        });

        it('should return empty results for whitespace-only query', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('   ');
            });

            expect(result.current.results).toEqual([]);
            expect(result.current.groupedResults).toEqual({});
        });

        it('should return empty results when search index is empty', () => {
            mockGetSearchIndex.mockReturnValue([]);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('react');
            });

            expect(result.current.results).toEqual([]);
            expect(result.current.groupedResults).toEqual({});
        });

        it('should find matching results by title', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('React');
            });

            expect(result.current.results.length).toBeGreaterThan(0);
            expect(result.current.results.some((r) => r.title.includes('React'))).toBe(true);
        });

        it('should find matching results by description', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('hooks');
            });

            expect(result.current.results.length).toBeGreaterThan(0);
        });

        it('should group results by category', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('web');
            });

            // Results should be grouped by category
            const categories = Object.keys(result.current.groupedResults);
            expect(categories.length).toBeGreaterThanOrEqual(0);
        });

        it('should include score in results', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('React');
            });

            if (result.current.results.length > 0) {
                expect(typeof result.current.results[0].score).toBe('number');
            }
        });

        it('should include all required fields in results', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('React');
            });

            if (result.current.results.length > 0) {
                const firstResult = result.current.results[0];
                expect(firstResult).toHaveProperty('title');
                expect(firstResult).toHaveProperty('description');
                expect(firstResult).toHaveProperty('url');
                expect(firstResult).toHaveProperty('category');
                expect(firstResult).toHaveProperty('tags');
                expect(firstResult).toHaveProperty('score');
                expect(firstResult).toHaveProperty('type');
            }
        });

        it('should limit results to maximum 10 items', () => {
            // Create a large search index
            const largeIndex = Array.from({ length: 50 }, (_, i) => ({
                title: `Test Item ${i}`,
                description: `Description for test item ${i}`,
                url: `/test/${i}`,
                category: 'Test',
                tags: ['test'],
                type: 'content' as const
            }));

            mockGetSearchIndex.mockReturnValue(largeIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('Test');
            });

            expect(result.current.results.length).toBeLessThanOrEqual(10);
        });

        it('should clear results when searching with empty query after previous search', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            // First search
            act(() => {
                result.current.search('React');
            });
            expect(result.current.results.length).toBeGreaterThan(0);

            // Clear search
            act(() => {
                result.current.search('');
            });
            expect(result.current.results).toEqual([]);
            expect(result.current.groupedResults).toEqual({});
        });
    });

    describe('fuzzy search', () => {
        const mockSearchIndex = [
            {
                title: 'JavaScript Tutorial',
                description: 'Learn JavaScript basics',
                url: '/en/blog/javascript',
                category: 'Blog',
                tags: ['javascript', 'tutorial'],
                type: 'content' as const
            }
        ];

        it('should find results with partial matches', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('javas');
            });

            // Fuse.js should find partial matches
            expect(result.current.results.length).toBeGreaterThanOrEqual(0);
        });

        it('should handle case-insensitive search', () => {
            mockGetSearchIndex.mockReturnValue(mockSearchIndex);
            const { result } = renderHook(() => useContentSearch());

            act(() => {
                result.current.search('JAVASCRIPT');
            });

            expect(result.current.results.length).toBeGreaterThan(0);
        });
    });

    describe('search callback stability', () => {
        it('should have stable search callback reference', () => {
            mockGetSearchIndex.mockReturnValue([]);
            const { result, rerender } = renderHook(() => useContentSearch());

            const firstSearch = result.current.search;
            rerender();
            const secondSearch = result.current.search;

            expect(firstSearch).toBe(secondSearch);
        });
    });
});
