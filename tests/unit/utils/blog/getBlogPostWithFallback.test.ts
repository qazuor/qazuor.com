import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import {
    getAllUniqueSlugs,
    getBlogPostBySlugWithFallback,
    getBlogPostsForLang,
    getBlogPostsForLangWithFallback,
    type SupportedLang
} from '@/utils/blog/getBlogPostWithFallback';

// Mock type for BlogPost with lang field
type MockBlogPost = {
    id: string;
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
        lang: SupportedLang;
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
    overrides: Partial<MockBlogPost> & { data: Partial<MockBlogPost['data']> & { lang: SupportedLang } }
): CollectionEntry<'blog'> {
    const defaultData = {
        title: 'Test Post',
        publishDate: new Date('2024-01-01'),
        excerpt: 'Test excerpt',
        tags: ['test'] as string[],
        readTime: '5 min',
        draft: false
    };
    const base: MockBlogPost = {
        id: overrides.id || 'test-post',
        slug: overrides.slug || 'default-file-slug',
        data: {
            ...defaultData,
            ...overrides.data
        }
    };
    return base as unknown as CollectionEntry<'blog'>;
}

// Helper to create multiple posts for testing
function createTestPosts(): CollectionEntry<'blog'>[] {
    return [
        // Post with both ES and EN versions
        createMockPost({
            id: 'bienvenido-es',
            slug: 'bienvenido-a-mi-blog-es',
            data: {
                slug: 'bienvenido',
                title: 'Bienvenido a mi blog',
                lang: 'es',
                publishDate: new Date('2024-01-01'),
                excerpt: 'Excerpt ES',
                tags: ['intro'],
                readTime: '5 min'
            }
        }),
        createMockPost({
            id: 'bienvenido-en',
            slug: 'bienvenido-a-mi-blog-en',
            data: {
                slug: 'bienvenido',
                title: 'Welcome to my blog',
                lang: 'en',
                publishDate: new Date('2024-01-01'),
                excerpt: 'Excerpt EN',
                tags: ['intro'],
                readTime: '5 min'
            }
        }),
        // Post only in Spanish (should fallback)
        createMockPost({
            id: 'solo-espanol-es',
            slug: 'solo-espanol-es',
            data: {
                slug: 'solo-espanol',
                title: 'Solo en español',
                lang: 'es',
                publishDate: new Date('2024-01-02'),
                excerpt: 'Only Spanish',
                tags: ['test'],
                readTime: '3 min'
            }
        }),
        // Post only in English (no fallback needed for EN, no ES version)
        createMockPost({
            id: 'only-english-en',
            slug: 'only-english-en',
            data: {
                slug: 'only-english',
                title: 'Only in English',
                lang: 'en',
                publishDate: new Date('2024-01-03'),
                excerpt: 'Only English',
                tags: ['test'],
                readTime: '4 min'
            }
        }),
        // Draft post (should be filtered out)
        createMockPost({
            id: 'draft-post-es',
            slug: 'draft-post-es',
            data: {
                slug: 'draft-post',
                title: 'Draft Post',
                lang: 'es',
                publishDate: new Date('2024-01-04'),
                excerpt: 'Draft',
                tags: ['draft'],
                readTime: '2 min',
                draft: true
            }
        })
    ];
}

describe('getBlogPostWithFallback', () => {
    describe('getBlogPostBySlugWithFallback', () => {
        const allPosts = createTestPosts();

        describe('when post exists in requested language', () => {
            it('should return the post in Spanish when requested', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'bienvenido', 'es');

                expect(result).not.toBeNull();
                expect(result?.post.data.lang).toBe('es');
                expect(result?.post.data.title).toBe('Bienvenido a mi blog');
                expect(result?.isFallback).toBe(false);
                expect(result?.actualLang).toBe('es');
            });

            it('should return the post in English when requested', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'bienvenido', 'en');

                expect(result).not.toBeNull();
                expect(result?.post.data.lang).toBe('en');
                expect(result?.post.data.title).toBe('Welcome to my blog');
                expect(result?.isFallback).toBe(false);
                expect(result?.actualLang).toBe('en');
            });
        });

        describe('when post does not exist in requested language', () => {
            it('should fallback to Spanish when English version does not exist', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'solo-espanol', 'en');

                expect(result).not.toBeNull();
                expect(result?.post.data.lang).toBe('es');
                expect(result?.post.data.title).toBe('Solo en español');
                expect(result?.isFallback).toBe(true);
                expect(result?.actualLang).toBe('es');
            });

            it('should return null when Spanish version does not exist (no fallback for ES)', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'only-english', 'es');

                // Spanish is the default, so if it doesn't exist, return null
                expect(result).toBeNull();
            });
        });

        describe('when post does not exist at all', () => {
            it('should return null for non-existent slug', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'non-existent', 'es');
                expect(result).toBeNull();
            });

            it('should return null for non-existent slug in English', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'non-existent', 'en');
                expect(result).toBeNull();
            });
        });

        describe('draft posts', () => {
            it('should not return draft posts', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'draft-post', 'es');
                expect(result).toBeNull();
            });

            it('should not fallback to draft posts', () => {
                const result = getBlogPostBySlugWithFallback(allPosts, 'draft-post', 'en');
                expect(result).toBeNull();
            });
        });
    });

    describe('getBlogPostsForLang', () => {
        const allPosts = createTestPosts();

        it('should return only Spanish posts', () => {
            const result = getBlogPostsForLang(allPosts, 'es');

            // Should have: bienvenido-es, solo-espanol-es (not draft)
            expect(result).toHaveLength(2);
            expect(result.every((p) => p.data.lang === 'es')).toBe(true);
            expect(result.every((p) => !p.data.draft)).toBe(true);
        });

        it('should return only English posts', () => {
            const result = getBlogPostsForLang(allPosts, 'en');

            // Should have: bienvenido-en, only-english-en
            expect(result).toHaveLength(2);
            expect(result.every((p) => p.data.lang === 'en')).toBe(true);
        });

        it('should not include draft posts', () => {
            const result = getBlogPostsForLang(allPosts, 'es');

            const hasDraft = result.some((p) => p.data.draft);
            expect(hasDraft).toBe(false);
        });
    });

    describe('getAllUniqueSlugs', () => {
        const allPosts = createTestPosts();

        it('should return unique slugs from all posts', () => {
            const result = getAllUniqueSlugs(allPosts);

            // Should have: bienvenido, solo-espanol, only-english (not draft-post)
            expect(result).toHaveLength(3);
            expect(result).toContain('bienvenido');
            expect(result).toContain('solo-espanol');
            expect(result).toContain('only-english');
        });

        it('should not duplicate slugs that exist in multiple languages', () => {
            const result = getAllUniqueSlugs(allPosts);

            // bienvenido exists in both ES and EN, should only appear once
            const bienvenidoCount = result.filter((s) => s === 'bienvenido').length;
            expect(bienvenidoCount).toBe(1);
        });

        it('should not include slugs from draft posts', () => {
            const result = getAllUniqueSlugs(allPosts);

            expect(result).not.toContain('draft-post');
        });
    });

    describe('getBlogPostsForLangWithFallback', () => {
        const allPosts = createTestPosts();

        describe('for Spanish language', () => {
            it('should return all Spanish posts without fallback', () => {
                const result = getBlogPostsForLangWithFallback(allPosts, 'es');

                // Should have: bienvenido (ES), solo-espanol (ES)
                // NOT only-english (no Spanish version, no fallback FOR Spanish)
                expect(result).toHaveLength(2);
                expect(result.every((r) => r.actualLang === 'es')).toBe(true);
                expect(result.every((r) => r.isFallback === false)).toBe(true);
            });
        });

        describe('for English language', () => {
            it('should return English posts and fallback to Spanish when needed', () => {
                const result = getBlogPostsForLangWithFallback(allPosts, 'en');

                // Should have:
                // - bienvenido (EN version exists, no fallback)
                // - solo-espanol (fallback to ES)
                // - only-english (EN version exists, no fallback)
                expect(result).toHaveLength(3);
            });

            it('should mark fallback posts correctly', () => {
                const result = getBlogPostsForLangWithFallback(allPosts, 'en');

                const bienvenido = result.find((r) => r.post.data.slug === 'bienvenido');
                const soloEspanol = result.find((r) => r.post.data.slug === 'solo-espanol');
                const onlyEnglish = result.find((r) => r.post.data.slug === 'only-english');

                // bienvenido has EN version
                expect(bienvenido?.isFallback).toBe(false);
                expect(bienvenido?.actualLang).toBe('en');

                // solo-espanol only has ES, so fallback
                expect(soloEspanol?.isFallback).toBe(true);
                expect(soloEspanol?.actualLang).toBe('es');

                // only-english has EN version
                expect(onlyEnglish?.isFallback).toBe(false);
                expect(onlyEnglish?.actualLang).toBe('en');
            });
        });

        describe('draft posts', () => {
            it('should not include draft posts in results', () => {
                const resultES = getBlogPostsForLangWithFallback(allPosts, 'es');
                const resultEN = getBlogPostsForLangWithFallback(allPosts, 'en');

                const hasDraftES = resultES.some((r) => r.post.data.slug === 'draft-post');
                const hasDraftEN = resultEN.some((r) => r.post.data.slug === 'draft-post');

                expect(hasDraftES).toBe(false);
                expect(hasDraftEN).toBe(false);
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty posts array', () => {
            const emptyPosts: CollectionEntry<'blog'>[] = [];

            expect(getBlogPostBySlugWithFallback(emptyPosts, 'any', 'es')).toBeNull();
            expect(getBlogPostsForLang(emptyPosts, 'es')).toHaveLength(0);
            expect(getAllUniqueSlugs(emptyPosts)).toHaveLength(0);
            expect(getBlogPostsForLangWithFallback(emptyPosts, 'es')).toHaveLength(0);
        });

        it('should handle posts without custom slug (using filename slug)', () => {
            const postsWithoutCustomSlug = [
                createMockPost({
                    id: 'filename-based-es',
                    slug: 'my-filename-slug',
                    data: {
                        // No custom slug defined
                        title: 'Post without custom slug',
                        lang: 'es',
                        publishDate: new Date('2024-01-01'),
                        excerpt: 'Test',
                        tags: ['test'],
                        readTime: '3 min'
                    }
                })
            ];

            const result = getBlogPostBySlugWithFallback(postsWithoutCustomSlug, 'my-filename-slug', 'es');
            expect(result).not.toBeNull();
            expect(result?.post.slug).toBe('my-filename-slug');
        });
    });
});
