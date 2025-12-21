import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { getNextInSeries, getPrevInSeries, getSeriesPosts, isPartOfSeries } from '@/utils/blog/getSeriesPosts';

// Mock type for BlogPost
type MockBlogPost = {
    slug: string;
    data: {
        slug?: string;
        title: string;
        publishDate: Date;
        excerpt: string;
        tags: string[];
        category?: string;
        readTime: string;
        draft?: boolean;
        series?: {
            id: string;
            name: string;
            part: number;
        };
        image?: {
            src: string;
            width: number;
            height: number;
            format: string;
        };
    };
};

function createMockPost(
    slug: string,
    title: string,
    series?: { id: string; name: string; part: number },
    options: Partial<MockBlogPost['data']> = {}
): CollectionEntry<'blog'> {
    const post: MockBlogPost = {
        slug,
        data: {
            title,
            publishDate: new Date('2024-01-01'),
            excerpt: `Excerpt for ${title}`,
            tags: ['test'],
            readTime: '5 min',
            draft: false,
            series,
            ...options
        }
    };
    return post as unknown as CollectionEntry<'blog'>;
}

describe('getSeriesPosts', () => {
    describe('when post is not part of a series', () => {
        it('should return null', () => {
            const post = createMockPost('standalone', 'Standalone Post');
            const allPosts = [post];

            const result = getSeriesPosts(post, allPosts);

            expect(result).toBeNull();
        });
    });

    describe('when post is part of a series', () => {
        it('should return series data with all posts', () => {
            const series = { id: 'react-basics', name: 'React Basics', part: 1 };
            const posts = [
                createMockPost('part-1', 'Part 1: Introduction', {
                    ...series,
                    part: 1
                }),
                createMockPost('part-2', 'Part 2: Components', {
                    ...series,
                    part: 2
                }),
                createMockPost('part-3', 'Part 3: State', { ...series, part: 3 })
            ];

            const currentPost = posts[0];
            const result = getSeriesPosts(currentPost, posts);

            expect(result).not.toBeNull();
            expect(result?.id).toBe('react-basics');
            expect(result?.name).toBe('React Basics');
            expect(result?.posts.length).toBe(3);
            expect(result?.currentPart).toBe(1);
            expect(result?.totalParts).toBe(3);
        });

        it('should sort posts by part number', () => {
            const series = { id: 'series', name: 'Test Series', part: 1 };
            const posts = [
                createMockPost('part-3', 'Part 3', { ...series, part: 3 }),
                createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
                createMockPost('part-2', 'Part 2', { ...series, part: 2 })
            ];

            const currentPost = posts[1]; // Part 1
            const result = getSeriesPosts(currentPost, posts);

            expect(result?.posts[0].part).toBe(1);
            expect(result?.posts[1].part).toBe(2);
            expect(result?.posts[2].part).toBe(3);
        });

        it('should mark current post correctly', () => {
            const series = { id: 'series', name: 'Test Series', part: 1 };
            const posts = [
                createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
                createMockPost('part-2', 'Part 2', { ...series, part: 2 })
            ];

            const currentPost = posts[1]; // Part 2
            const result = getSeriesPosts(currentPost, posts);

            expect(result?.posts[0].isCurrent).toBe(false);
            expect(result?.posts[1].isCurrent).toBe(true);
        });

        it('should exclude draft posts from series', () => {
            const series = { id: 'series', name: 'Test Series', part: 1 };
            const posts = [
                createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
                createMockPost('part-2', 'Part 2 (Draft)', { ...series, part: 2 }, { draft: true }),
                createMockPost('part-3', 'Part 3', { ...series, part: 3 })
            ];

            const currentPost = posts[0];
            const result = getSeriesPosts(currentPost, posts);

            expect(result?.posts.length).toBe(2);
            expect(result?.totalParts).toBe(2);
        });

        it('should only include posts from the same series', () => {
            const series1 = { id: 'series-1', name: 'Series 1', part: 1 };
            const series2 = { id: 'series-2', name: 'Series 2', part: 1 };
            const posts = [
                createMockPost('s1-part-1', 'S1 Part 1', { ...series1, part: 1 }),
                createMockPost('s1-part-2', 'S1 Part 2', { ...series1, part: 2 }),
                createMockPost('s2-part-1', 'S2 Part 1', { ...series2, part: 1 })
            ];

            const currentPost = posts[0]; // Series 1 Part 1
            const result = getSeriesPosts(currentPost, posts);

            expect(result?.posts.length).toBe(2);
            expect(result?.posts.every((p) => p.title.startsWith('S1'))).toBe(true);
        });

        it('should use effective slug for posts', () => {
            const series = { id: 'series', name: 'Test Series', part: 1 };
            const posts = [createMockPost('file-slug', 'Part 1', { ...series, part: 1 }, { slug: 'custom-slug' })];

            const result = getSeriesPosts(posts[0], posts);

            expect(result?.posts[0].slug).toBe('custom-slug');
        });
    });

    describe('edge cases', () => {
        it('should return null when all other series posts are drafts', () => {
            const series = { id: 'series', name: 'Test Series', part: 1 };
            const posts = [
                createMockPost('part-1', 'Part 1', { ...series, part: 1 }, { draft: true }),
                createMockPost('part-2', 'Part 2', { ...series, part: 2 }, { draft: true })
            ];

            // The current post itself is a draft too
            const result = getSeriesPosts(posts[0], posts);

            expect(result).toBeNull();
        });

        it('should handle posts with missing part number', () => {
            const posts = [
                createMockPost('part-1', 'Part 1', { id: 'series', name: 'Series', part: 1 }),
                createMockPost('part-no-num', 'Part No Num', {
                    id: 'series',
                    name: 'Series',
                    part: 0
                })
            ];

            const result = getSeriesPosts(posts[0], posts);

            // Should handle gracefully, treating missing part as 0
            expect(result?.posts.length).toBe(2);
        });
    });
});

describe('isPartOfSeries', () => {
    it('should return true for post with series data', () => {
        const post = createMockPost('post', 'Post', { id: 'series', name: 'Series', part: 1 });

        expect(isPartOfSeries(post)).toBe(true);
    });

    it('should return false for post without series data', () => {
        const post = createMockPost('post', 'Post');

        expect(isPartOfSeries(post)).toBe(false);
    });
});

describe('getNextInSeries', () => {
    it('should return next post in series', () => {
        const series = { id: 'series', name: 'Test Series', part: 1 };
        const posts = [
            createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
            createMockPost('part-2', 'Part 2', { ...series, part: 2 }),
            createMockPost('part-3', 'Part 3', { ...series, part: 3 })
        ];

        const currentPost = posts[0]; // Part 1
        const result = getNextInSeries(currentPost, posts);

        expect(result).not.toBeNull();
        expect(result?.data.title).toBe('Part 2');
    });

    it('should return null when on last part', () => {
        const series = { id: 'series', name: 'Test Series', part: 1 };
        const posts = [
            createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
            createMockPost('part-2', 'Part 2', { ...series, part: 2 })
        ];

        const currentPost = posts[1]; // Part 2 (last)
        const result = getNextInSeries(currentPost, posts);

        expect(result).toBeNull();
    });

    it('should return null when post is not in a series', () => {
        const posts = [createMockPost('standalone', 'Standalone')];

        const result = getNextInSeries(posts[0], posts);

        expect(result).toBeNull();
    });

    it('should skip draft posts', () => {
        const series = { id: 'series', name: 'Test Series', part: 1 };
        const posts = [
            createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
            createMockPost('part-2', 'Part 2 (Draft)', { ...series, part: 2 }, { draft: true }),
            createMockPost('part-3', 'Part 3', { ...series, part: 3 })
        ];

        const currentPost = posts[0]; // Part 1
        const result = getNextInSeries(currentPost, posts);

        // Should return null because part 2 is draft and we only look for part+1
        expect(result).toBeNull();
    });
});

describe('getPrevInSeries', () => {
    it('should return previous post in series', () => {
        const series = { id: 'series', name: 'Test Series', part: 1 };
        const posts = [
            createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
            createMockPost('part-2', 'Part 2', { ...series, part: 2 }),
            createMockPost('part-3', 'Part 3', { ...series, part: 3 })
        ];

        const currentPost = posts[2]; // Part 3
        const result = getPrevInSeries(currentPost, posts);

        expect(result).not.toBeNull();
        expect(result?.data.title).toBe('Part 2');
    });

    it('should return null when on first part', () => {
        const series = { id: 'series', name: 'Test Series', part: 1 };
        const posts = [
            createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
            createMockPost('part-2', 'Part 2', { ...series, part: 2 })
        ];

        const currentPost = posts[0]; // Part 1 (first)
        const result = getPrevInSeries(currentPost, posts);

        expect(result).toBeNull();
    });

    it('should return null when post is not in a series', () => {
        const posts = [createMockPost('standalone', 'Standalone')];

        const result = getPrevInSeries(posts[0], posts);

        expect(result).toBeNull();
    });

    it('should skip draft posts', () => {
        const series = { id: 'series', name: 'Test Series', part: 1 };
        const posts = [
            createMockPost('part-1', 'Part 1', { ...series, part: 1 }),
            createMockPost('part-2', 'Part 2 (Draft)', { ...series, part: 2 }, { draft: true }),
            createMockPost('part-3', 'Part 3', { ...series, part: 3 })
        ];

        const currentPost = posts[2]; // Part 3
        const result = getPrevInSeries(currentPost, posts);

        // Should return null because part 2 is draft
        expect(result).toBeNull();
    });
});
