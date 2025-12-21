import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { getAdjacentPosts } from '@/utils/blog/getAdjacentPosts';

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
    publishDate: Date,
    options: Partial<MockBlogPost['data']> = {}
): CollectionEntry<'blog'> {
    const post: MockBlogPost = {
        slug,
        data: {
            title,
            publishDate,
            excerpt: `Excerpt for ${title}`,
            tags: ['test'],
            readTime: '5 min',
            draft: false,
            ...options
        }
    };
    return post as unknown as CollectionEntry<'blog'>;
}

describe('getAdjacentPosts', () => {
    describe('basic navigation', () => {
        it('should return prev and next posts for a middle post', () => {
            const posts = [
                createMockPost('post-1', 'First Post', new Date('2024-01-01')),
                createMockPost('post-2', 'Second Post', new Date('2024-01-15')),
                createMockPost('post-3', 'Third Post', new Date('2024-02-01'))
            ];

            const currentPost = posts[1]; // Second Post (middle)
            const result = getAdjacentPosts(currentPost, posts);

            // Posts are sorted newest first
            // Order: Third (newest), Second, First (oldest)
            // For Second: prev = First (older), next = Third (newer)
            expect(result.prev).not.toBeNull();
            expect(result.prev?.title).toBe('First Post');
            expect(result.next).not.toBeNull();
            expect(result.next?.title).toBe('Third Post');
        });

        it('should return null for prev when on oldest post', () => {
            const posts = [
                createMockPost('post-1', 'First Post', new Date('2024-01-01')),
                createMockPost('post-2', 'Second Post', new Date('2024-01-15')),
                createMockPost('post-3', 'Third Post', new Date('2024-02-01'))
            ];

            const currentPost = posts[0]; // First Post (oldest)
            const result = getAdjacentPosts(currentPost, posts);

            expect(result.prev).toBeNull();
            expect(result.next).not.toBeNull();
            expect(result.next?.title).toBe('Second Post');
        });

        it('should return null for next when on newest post', () => {
            const posts = [
                createMockPost('post-1', 'First Post', new Date('2024-01-01')),
                createMockPost('post-2', 'Second Post', new Date('2024-01-15')),
                createMockPost('post-3', 'Third Post', new Date('2024-02-01'))
            ];

            const currentPost = posts[2]; // Third Post (newest)
            const result = getAdjacentPosts(currentPost, posts);

            expect(result.prev).not.toBeNull();
            expect(result.prev?.title).toBe('Second Post');
            expect(result.next).toBeNull();
        });
    });

    describe('single post', () => {
        it('should return both null when only one post exists', () => {
            const posts = [createMockPost('only-post', 'Only Post', new Date('2024-01-01'))];

            const result = getAdjacentPosts(posts[0], posts);

            expect(result.prev).toBeNull();
            expect(result.next).toBeNull();
        });
    });

    describe('draft filtering', () => {
        it('should exclude draft posts from navigation', () => {
            const posts = [
                createMockPost('post-1', 'First Post', new Date('2024-01-01')),
                createMockPost('post-2', 'Second Post (Draft)', new Date('2024-01-15'), {
                    draft: true
                }),
                createMockPost('post-3', 'Third Post', new Date('2024-02-01'))
            ];

            const currentPost = posts[0]; // First Post
            const result = getAdjacentPosts(currentPost, posts);

            // Should skip the draft and go directly to Third Post
            expect(result.next).not.toBeNull();
            expect(result.next?.title).toBe('Third Post');
        });

        it('should return both null when only current post is not draft', () => {
            const posts = [
                createMockPost('draft-1', 'Draft 1', new Date('2024-01-01'), { draft: true }),
                createMockPost('post-1', 'Only Published', new Date('2024-01-15')),
                createMockPost('draft-2', 'Draft 2', new Date('2024-02-01'), { draft: true })
            ];

            const currentPost = posts[1]; // Only Published
            const result = getAdjacentPosts(currentPost, posts);

            expect(result.prev).toBeNull();
            expect(result.next).toBeNull();
        });
    });

    describe('post not found', () => {
        it('should return both null when current post is not in list', () => {
            const posts = [
                createMockPost('post-1', 'First Post', new Date('2024-01-01')),
                createMockPost('post-2', 'Second Post', new Date('2024-01-15'))
            ];

            const currentPost = createMockPost('not-in-list', 'Not Found', new Date('2024-01-10'));
            const result = getAdjacentPosts(currentPost, posts);

            expect(result.prev).toBeNull();
            expect(result.next).toBeNull();
        });
    });

    describe('date sorting', () => {
        it('should sort posts by date descending (newest first)', () => {
            // Posts in random order
            const posts = [
                createMockPost('post-2', 'Second Post', new Date('2024-01-15')),
                createMockPost('post-3', 'Third Post', new Date('2024-02-01')),
                createMockPost('post-1', 'First Post', new Date('2024-01-01'))
            ];

            const currentPost = posts[0]; // Second Post
            const result = getAdjacentPosts(currentPost, posts);

            // Order after sort: Third (newest), Second, First (oldest)
            // For Second: prev = First, next = Third
            expect(result.prev?.title).toBe('First Post');
            expect(result.next?.title).toBe('Third Post');
        });

        it('should handle same-day posts correctly', () => {
            const posts = [
                createMockPost('post-1', 'Post A', new Date('2024-01-01T10:00:00')),
                createMockPost('post-2', 'Post B', new Date('2024-01-01T12:00:00')),
                createMockPost('post-3', 'Post C', new Date('2024-01-01T14:00:00'))
            ];

            const currentPost = posts[1]; // Post B
            const result = getAdjacentPosts(currentPost, posts);

            // Order: Post C (newest), Post B, Post A (oldest)
            expect(result.prev?.title).toBe('Post A');
            expect(result.next?.title).toBe('Post C');
        });
    });

    describe('PostSummary output', () => {
        it('should return PostSummary with all required fields', () => {
            const posts = [
                createMockPost('post-1', 'First Post', new Date('2024-01-01'), {
                    excerpt: 'Custom excerpt',
                    tags: ['tag1', 'tag2'],
                    category: 'tech',
                    readTime: '3 min'
                }),
                createMockPost('post-2', 'Second Post', new Date('2024-01-15'))
            ];

            const result = getAdjacentPosts(posts[1], posts);

            expect(result.prev).not.toBeNull();
            expect(result.prev).toMatchObject({
                slug: 'post-1',
                title: 'First Post',
                excerpt: 'Custom excerpt',
                tags: ['tag1', 'tag2'],
                category: 'tech',
                readTime: '3 min'
            });
            expect(result.prev?.publishDate).toEqual(new Date('2024-01-01'));
        });

        it('should use effective slug (custom slug if available)', () => {
            const posts = [
                createMockPost('file-slug', 'First Post', new Date('2024-01-01'), {
                    slug: 'custom-slug'
                }),
                createMockPost('post-2', 'Second Post', new Date('2024-01-15'))
            ];

            const result = getAdjacentPosts(posts[1], posts);

            expect(result.prev?.slug).toBe('custom-slug');
        });
    });

    describe('empty array', () => {
        it('should return both null for empty posts array', () => {
            const currentPost = createMockPost('post-1', 'Test', new Date('2024-01-01'));
            const result = getAdjacentPosts(currentPost, []);

            expect(result.prev).toBeNull();
            expect(result.next).toBeNull();
        });
    });
});
