import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { getRelatedPosts } from '@/utils/blog/getRelatedPosts';

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
    tags: string[],
    options: Partial<MockBlogPost['data']> = {}
): CollectionEntry<'blog'> {
    const post: MockBlogPost = {
        slug,
        data: {
            title,
            publishDate: options.publishDate || new Date('2024-01-01'),
            excerpt: `Excerpt for ${title}`,
            tags,
            readTime: '5 min',
            draft: false,
            ...options
        }
    };
    return post as unknown as CollectionEntry<'blog'>;
}

describe('getRelatedPosts', () => {
    describe('relevance scoring', () => {
        it('should score posts based on shared tags (2 points each)', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react', 'typescript']);
            const posts = [
                currentPost,
                createMockPost('related-1', 'Related 1', ['react']), // 2 points
                createMockPost('related-2', 'Related 2', ['react', 'typescript']), // 4 points
                createMockPost('unrelated', 'Unrelated', ['python'])
            ];

            const result = getRelatedPosts(currentPost, posts);

            // Should return posts sorted by score
            expect(result.length).toBe(2);
            expect(result[0].title).toBe('Related 2'); // 4 points
            expect(result[1].title).toBe('Related 1'); // 2 points
        });

        it('should add 3 points for same category', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react'], {
                category: 'tutorials'
            });
            const posts = [
                currentPost,
                createMockPost('same-cat', 'Same Category', ['vue'], { category: 'tutorials' }), // 3 points
                createMockPost('shared-tag', 'Shared Tag', ['react'], { category: 'news' }) // 2 points
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(2);
            expect(result[0].title).toBe('Same Category'); // 3 points
            expect(result[1].title).toBe('Shared Tag'); // 2 points
        });

        it('should combine tag and category scores', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react', 'typescript'], {
                category: 'tutorials'
            });
            const posts = [
                currentPost,
                createMockPost('best-match', 'Best Match', ['react', 'typescript'], {
                    category: 'tutorials'
                }), // 4 + 3 = 7 points
                createMockPost('only-tags', 'Only Tags', ['react', 'typescript']), // 4 points
                createMockPost('only-cat', 'Only Category', ['python'], { category: 'tutorials' }) // 3 points
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(3);
            expect(result[0].title).toBe('Best Match');
            expect(result[1].title).toBe('Only Tags');
            expect(result[2].title).toBe('Only Category');
        });
    });

    describe('filtering', () => {
        it('should exclude current post from results', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [currentPost, createMockPost('other', 'Other Post', ['react'])];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(1);
            expect(result[0].title).toBe('Other Post');
        });

        it('should exclude draft posts', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [
                currentPost,
                createMockPost('draft', 'Draft Post', ['react'], { draft: true }),
                createMockPost('published', 'Published Post', ['react'])
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(1);
            expect(result[0].title).toBe('Published Post');
        });

        it('should exclude posts below minimum score (default 2)', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react', 'typescript']);
            const posts = [
                currentPost,
                createMockPost('low-score', 'Low Score', ['vue']), // 0 points
                createMockPost('high-score', 'High Score', ['react']) // 2 points
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(1);
            expect(result[0].title).toBe('High Score');
        });

        it('should respect custom minScore option', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react', 'typescript']);
            const posts = [
                currentPost,
                createMockPost('score-2', 'Score 2', ['react']), // 2 points
                createMockPost('score-4', 'Score 4', ['react', 'typescript']) // 4 points
            ];

            const result = getRelatedPosts(currentPost, posts, { minScore: 4 });

            expect(result.length).toBe(1);
            expect(result[0].title).toBe('Score 4');
        });
    });

    describe('series handling', () => {
        it('should exclude posts from same series by default', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react'], {
                series: { id: 'react-series', name: 'React Series', part: 1 }
            });
            const posts = [
                currentPost,
                createMockPost('same-series', 'Same Series', ['react'], {
                    series: { id: 'react-series', name: 'React Series', part: 2 }
                }),
                createMockPost('different-series', 'Different Series', ['react'])
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(1);
            expect(result[0].title).toBe('Different Series');
        });

        it('should include posts from same series when excludeSameSeries is false', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react'], {
                series: { id: 'react-series', name: 'React Series', part: 1 }
            });
            const posts = [
                currentPost,
                createMockPost('same-series', 'Same Series', ['react'], {
                    series: { id: 'react-series', name: 'React Series', part: 2 }
                }),
                createMockPost('other', 'Other', ['react'])
            ];

            const result = getRelatedPosts(currentPost, posts, { excludeSameSeries: false });

            expect(result.length).toBe(2);
        });
    });

    describe('limit option', () => {
        it('should limit results to 3 by default', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [
                currentPost,
                createMockPost('post-1', 'Post 1', ['react']),
                createMockPost('post-2', 'Post 2', ['react']),
                createMockPost('post-3', 'Post 3', ['react']),
                createMockPost('post-4', 'Post 4', ['react']),
                createMockPost('post-5', 'Post 5', ['react'])
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(3);
        });

        it('should respect custom limit option', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [
                currentPost,
                createMockPost('post-1', 'Post 1', ['react']),
                createMockPost('post-2', 'Post 2', ['react']),
                createMockPost('post-3', 'Post 3', ['react']),
                createMockPost('post-4', 'Post 4', ['react'])
            ];

            const result = getRelatedPosts(currentPost, posts, { limit: 2 });

            expect(result.length).toBe(2);
        });
    });

    describe('sorting', () => {
        it('should sort by score descending', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react', 'typescript', 'node']);
            const posts = [
                currentPost,
                createMockPost('score-2', 'Score 2', ['react']), // 2 points
                createMockPost('score-6', 'Score 6', ['react', 'typescript', 'node']), // 6 points
                createMockPost('score-4', 'Score 4', ['react', 'typescript']) // 4 points
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result[0].title).toBe('Score 6');
            expect(result[1].title).toBe('Score 4');
            expect(result[2].title).toBe('Score 2');
        });

        it('should sort by date descending for same score', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [
                currentPost,
                createMockPost('older', 'Older Post', ['react'], {
                    publishDate: new Date('2024-01-01')
                }),
                createMockPost('newer', 'Newer Post', ['react'], {
                    publishDate: new Date('2024-02-01')
                })
            ];

            const result = getRelatedPosts(currentPost, posts);

            // Both have same score (2), so newer should come first
            expect(result[0].title).toBe('Newer Post');
            expect(result[1].title).toBe('Older Post');
        });
    });

    describe('PostSummary output', () => {
        it('should return PostSummary with all required fields', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [
                currentPost,
                createMockPost('related', 'Related Post', ['react'], {
                    excerpt: 'Custom excerpt',
                    category: 'tech',
                    readTime: '3 min',
                    publishDate: new Date('2024-06-15')
                })
            ];

            const result = getRelatedPosts(currentPost, posts);

            expect(result[0]).toMatchObject({
                slug: 'related',
                title: 'Related Post',
                excerpt: 'Custom excerpt',
                tags: ['react'],
                category: 'tech',
                readTime: '3 min'
            });
            expect(result[0].publishDate).toEqual(new Date('2024-06-15'));
        });
    });

    describe('edge cases', () => {
        it('should return empty array when no posts match', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [currentPost, createMockPost('unrelated', 'Unrelated', ['python', 'django'])];

            const result = getRelatedPosts(currentPost, posts);

            expect(result).toEqual([]);
        });

        it('should return empty array for empty posts list', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const result = getRelatedPosts(currentPost, []);

            expect(result).toEqual([]);
        });

        it('should handle post with no category', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [currentPost, createMockPost('no-cat', 'No Category', ['react'])];

            const result = getRelatedPosts(currentPost, posts);

            expect(result.length).toBe(1);
        });

        it('should handle current post with no category', () => {
            const currentPost = createMockPost('current', 'Current Post', ['react']);
            const posts = [currentPost, createMockPost('with-cat', 'With Category', ['react'], { category: 'tech' })];

            const result = getRelatedPosts(currentPost, posts);

            // Should still match on tags
            expect(result.length).toBe(1);
        });
    });
});
