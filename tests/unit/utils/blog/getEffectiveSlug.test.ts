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

    describe('language suffix removal', () => {
        it('should remove -es suffix from filename slug', () => {
            const post = createMockPost({
                slug: 'my-blog-post-es',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('my-blog-post');
        });

        it('should remove -en suffix from filename slug', () => {
            const post = createMockPost({
                slug: 'my-blog-post-en',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('my-blog-post');
        });

        it('should NOT remove language suffix from custom slug in frontmatter', () => {
            const post = createMockPost({
                slug: 'my-blog-post-en',
                data: {
                    slug: 'custom-slug-en',
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            // Custom slug should be returned as-is
            expect(getEffectiveSlug(post)).toBe('custom-slug-en');
        });

        it('should handle long filename with language suffix', () => {
            const post = createMockPost({
                slug: 'bienvenido-a-mi-blog-quien-soy-y-de-que-va-esto-es',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('bienvenido-a-mi-blog-quien-soy-y-de-que-va-esto');
        });

        it('should not affect slugs without language suffix', () => {
            const post = createMockPost({
                slug: 'my-blog-post-2024',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            expect(getEffectiveSlug(post)).toBe('my-blog-post-2024');
        });

        it('should only remove suffix at the end, not in the middle', () => {
            const post = createMockPost({
                slug: 'en-espanol-post-es',
                data: {
                    title: 'Test Post',
                    publishDate: new Date('2024-01-01'),
                    excerpt: 'Test excerpt',
                    tags: ['test'],
                    readTime: '5 min'
                }
            });

            // Should only remove the trailing -es, not the "en-" at the start
            expect(getEffectiveSlug(post)).toBe('en-espanol-post');
        });
    });
});
