import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { getEffectiveSlug } from '@/utils/blog/getEffectiveSlug';

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

function createMockPost(overrides: Partial<MockBlogPost> = {}): CollectionEntry<'blog'> {
    const base: MockBlogPost = {
        slug: 'default-file-slug',
        data: {
            title: 'Test Post',
            publishDate: new Date('2024-01-01'),
            excerpt: 'Test excerpt',
            tags: ['test'],
            readTime: '5 min',
            ...overrides.data
        },
        ...overrides
    };
    return base as unknown as CollectionEntry<'blog'>;
}

describe('getEffectiveSlug', () => {
    describe('when custom slug is defined in frontmatter', () => {
        it('should return the custom slug', () => {
            const post = createMockPost({
                slug: 'file-based-slug',
                data: {
                    slug: 'custom-slug',
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('custom-slug');
        });

        it('should prefer custom slug over filename slug', () => {
            const post = createMockPost({
                slug: 'my-very-long-filename-slug',
                data: {
                    slug: 'short-slug',
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('short-slug');
        });
    });

    describe('when custom slug is not defined', () => {
        it('should return the filename-based slug', () => {
            const post = createMockPost({
                slug: 'my-blog-post-filename',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('my-blog-post-filename');
        });

        it('should handle slug with special characters', () => {
            const post = createMockPost({
                slug: 'post-with-números-123',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('post-with-números-123');
        });
    });

    describe('when custom slug is empty string', () => {
        it('should return the filename-based slug', () => {
            const post = createMockPost({
                slug: 'filename-slug',
                data: {
                    slug: '',
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('filename-slug');
        });
    });

    describe('edge cases', () => {
        it('should handle very short slugs', () => {
            const post = createMockPost({
                slug: 'a',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('a');
        });

        it('should handle slug with hyphens', () => {
            const post = createMockPost({
                slug: 'my-post-with-many-hyphens',
                data: {
                    slug: 'custom-with-hyphens-too',
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('custom-with-hyphens-too');
        });
    });
});
