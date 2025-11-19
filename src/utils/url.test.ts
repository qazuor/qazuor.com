import { describe, expect, it } from 'vitest';
import {
    buildUrl,
    changeLocale,
    getLocaleFromUrl,
    getPathSegments,
    getQueryParam,
    isExternalUrl,
    normalizeUrl,
    removeLocale,
    setQueryParam
} from './url';

describe('URL Utilities', () => {
    describe('normalizeUrl', () => {
        it('should remove duplicate slashes', () => {
            expect(normalizeUrl('/en//blog//post')).toBe('/en/blog/post');
            expect(normalizeUrl('///blog///post///')).toBe('/blog/post');
        });

        it('should ensure leading slash', () => {
            expect(normalizeUrl('blog/post')).toBe('/blog/post');
            expect(normalizeUrl('en/blog')).toBe('/en/blog');
        });

        it('should remove trailing slash except for root', () => {
            expect(normalizeUrl('/blog/')).toBe('/blog');
            expect(normalizeUrl('/en/blog/')).toBe('/en/blog');
            expect(normalizeUrl('/')).toBe('/');
            expect(normalizeUrl('//')).toBe('/');
        });

        it('should preserve query strings', () => {
            expect(normalizeUrl('/blog?page=2')).toBe('/blog?page=2');
            expect(normalizeUrl('/blog/?page=2')).toBe('/blog?page=2');
            expect(normalizeUrl('//blog//?page=2&tag=astro')).toBe('/blog?page=2&tag=astro');
        });

        it('should preserve hash fragments', () => {
            expect(normalizeUrl('/blog#section')).toBe('/blog#section');
            expect(normalizeUrl('/blog/#section')).toBe('/blog#section');
            expect(normalizeUrl('//blog//#section')).toBe('/blog#section');
        });

        it('should preserve both query and hash', () => {
            expect(normalizeUrl('/blog?page=2#comments')).toBe('/blog?page=2#comments');
            expect(normalizeUrl('//blog//?page=2#comments')).toBe('/blog?page=2#comments');
        });

        it('should handle empty string', () => {
            expect(normalizeUrl('')).toBe('/');
            expect(normalizeUrl('   ')).toBe('/');
        });

        it('should handle root path', () => {
            expect(normalizeUrl('/')).toBe('/');
            expect(normalizeUrl('//')).toBe('/');
            expect(normalizeUrl('///')).toBe('/');
        });
    });

    describe('buildUrl', () => {
        it('should build simple path', () => {
            expect(buildUrl({ path: '/blog' })).toBe('/blog');
            expect(buildUrl({ path: 'blog' })).toBe('/blog');
        });

        it('should add locale prefix', () => {
            expect(buildUrl({ path: '/blog', locale: 'es' })).toBe('/es/blog');
            expect(buildUrl({ path: '/blog', locale: 'en' })).toBe('/en/blog');
        });

        it('should handle root path with locale', () => {
            expect(buildUrl({ path: '/', locale: 'es' })).toBe('/es');
            expect(buildUrl({ path: '/', locale: 'en' })).toBe('/en');
        });

        it('should add query parameters', () => {
            expect(buildUrl({ path: '/blog', params: { page: 2 } })).toBe('/blog?page=2');
            expect(buildUrl({ path: '/blog', params: { page: 2, tag: 'astro' } })).toBe('/blog?page=2&tag=astro');
        });

        it('should skip null and undefined params', () => {
            expect(
                buildUrl({
                    path: '/blog',
                    params: { page: 2, tag: null, author: undefined }
                })
            ).toBe('/blog?page=2');
        });

        it('should handle boolean params', () => {
            expect(buildUrl({ path: '/blog', params: { draft: true } })).toBe('/blog?draft=true');
            expect(buildUrl({ path: '/blog', params: { published: false } })).toBe('/blog?published=false');
        });

        it('should add hash fragment', () => {
            expect(buildUrl({ path: '/blog', hash: 'comments' })).toBe('/blog#comments');
            expect(buildUrl({ path: '/blog', hash: 'section-2' })).toBe('/blog#section-2');
        });

        it('should combine all components', () => {
            expect(
                buildUrl({
                    path: '/blog',
                    locale: 'es',
                    params: { page: 2, tag: 'astro' },
                    hash: 'comments'
                })
            ).toBe('/es/blog?page=2&tag=astro#comments');
        });

        it('should add base URL', () => {
            expect(
                buildUrl({
                    path: '/blog',
                    baseUrl: 'https://example.com'
                })
            ).toBe('https://example.com/blog');

            expect(
                buildUrl({
                    path: '/blog',
                    baseUrl: 'https://example.com',
                    locale: 'es'
                })
            ).toBe('https://example.com/es/blog');
        });

        it('should handle empty params object', () => {
            expect(buildUrl({ path: '/blog', params: {} })).toBe('/blog');
        });

        it('should normalize path before building', () => {
            expect(buildUrl({ path: '//blog//post//' })).toBe('/blog/post');
            expect(buildUrl({ path: '//blog//post//', locale: 'en' })).toBe('/en/blog/post');
        });
    });

    describe('getPathSegments', () => {
        it('should extract path segments', () => {
            expect(getPathSegments('/en/blog/post')).toEqual(['en', 'blog', 'post']);
            expect(getPathSegments('/blog/post')).toEqual(['blog', 'post']);
        });

        it('should return empty array for root path', () => {
            expect(getPathSegments('/')).toEqual([]);
            expect(getPathSegments('//')).toEqual([]);
        });

        it('should handle trailing slashes', () => {
            expect(getPathSegments('/en/blog/')).toEqual(['en', 'blog']);
            expect(getPathSegments('/blog/post//')).toEqual(['blog', 'post']);
        });

        it('should ignore query strings', () => {
            expect(getPathSegments('/blog?page=2')).toEqual(['blog']);
            expect(getPathSegments('/en/blog?page=2&tag=astro')).toEqual(['en', 'blog']);
        });

        it('should ignore hash fragments', () => {
            expect(getPathSegments('/blog#section')).toEqual(['blog']);
            expect(getPathSegments('/en/blog#comments')).toEqual(['en', 'blog']);
        });

        it('should handle duplicate slashes', () => {
            expect(getPathSegments('//en//blog//post//')).toEqual(['en', 'blog', 'post']);
        });
    });

    describe('changeLocale', () => {
        it('should replace existing locale', () => {
            expect(changeLocale('/en/blog/post', 'es')).toBe('/es/blog/post');
            expect(changeLocale('/es/about', 'en')).toBe('/en/about');
        });

        it('should add locale if not present', () => {
            expect(changeLocale('/blog/post', 'es')).toBe('/es/blog/post');
            expect(changeLocale('/about', 'en')).toBe('/en/about');
        });

        it('should handle root path', () => {
            expect(changeLocale('/', 'es')).toBe('/es');
            expect(changeLocale('/en', 'es')).toBe('/es');
        });

        it('should preserve query strings', () => {
            expect(changeLocale('/en/blog?page=2', 'es')).toBe('/es/blog?page=2');
            expect(changeLocale('/blog?tag=astro', 'es')).toBe('/es/blog?tag=astro');
        });

        it('should preserve hash fragments', () => {
            expect(changeLocale('/en/blog#section', 'es')).toBe('/es/blog#section');
            expect(changeLocale('/blog#comments', 'es')).toBe('/es/blog#comments');
        });

        it('should remove invalid locale when changing', () => {
            expect(changeLocale('/fr/blog', 'es', ['en', 'es'])).toBe('/es/blog');
            expect(changeLocale('/de/about', 'en', ['en', 'es'])).toBe('/en/about');
        });

        it('should use custom valid locales', () => {
            expect(changeLocale('/en/blog', 'fr', ['en', 'fr', 'de'])).toBe('/fr/blog');
            expect(changeLocale('/blog', 'de', ['en', 'fr', 'de'])).toBe('/de/blog');
        });
    });

    describe('removeLocale', () => {
        it('should remove valid locale prefix', () => {
            expect(removeLocale('/en/blog/post')).toBe('/blog/post');
            expect(removeLocale('/es/about')).toBe('/about');
        });

        it('should keep path without locale unchanged', () => {
            expect(removeLocale('/blog/post')).toBe('/blog/post');
            expect(removeLocale('/about')).toBe('/about');
        });

        it('should handle root path with locale', () => {
            expect(removeLocale('/en')).toBe('/');
            expect(removeLocale('/es')).toBe('/');
        });

        it('should preserve query strings', () => {
            expect(removeLocale('/en/blog?page=2')).toBe('/blog?page=2');
            expect(removeLocale('/blog?tag=astro')).toBe('/blog?tag=astro');
        });

        it('should preserve hash fragments', () => {
            expect(removeLocale('/en/blog#section')).toBe('/blog#section');
            expect(removeLocale('/blog#comments')).toBe('/blog#comments');
        });

        it('should keep invalid locale in path', () => {
            expect(removeLocale('/fr/blog', ['en', 'es'])).toBe('/fr/blog');
            expect(removeLocale('/de/about', ['en', 'es'])).toBe('/de/about');
        });

        it('should use custom valid locales', () => {
            expect(removeLocale('/fr/blog', ['en', 'fr', 'de'])).toBe('/blog');
            expect(removeLocale('/de/about', ['en', 'fr', 'de'])).toBe('/about');
        });
    });

    describe('getLocaleFromUrl', () => {
        it('should extract valid locale from URL', () => {
            expect(getLocaleFromUrl('/en/blog')).toBe('en');
            expect(getLocaleFromUrl('/es/about')).toBe('es');
        });

        it('should return default locale if none found', () => {
            expect(getLocaleFromUrl('/blog')).toBe('en');
            expect(getLocaleFromUrl('/about')).toBe('en');
        });

        it('should return default for invalid locale', () => {
            expect(getLocaleFromUrl('/fr/blog', ['en', 'es'])).toBe('en');
            expect(getLocaleFromUrl('/de/about', ['en', 'es'])).toBe('en');
        });

        it('should use custom default locale', () => {
            expect(getLocaleFromUrl('/blog', ['en', 'es'], 'es')).toBe('es');
            expect(getLocaleFromUrl('/fr/blog', ['en', 'es'], 'es')).toBe('es');
        });

        it('should work with custom valid locales', () => {
            expect(getLocaleFromUrl('/fr/blog', ['en', 'fr', 'de'], 'en')).toBe('fr');
            expect(getLocaleFromUrl('/de/about', ['en', 'fr', 'de'], 'fr')).toBe('de');
        });

        it('should ignore query strings and hash', () => {
            expect(getLocaleFromUrl('/en/blog?page=2')).toBe('en');
            expect(getLocaleFromUrl('/es/blog#section')).toBe('es');
        });
    });

    describe('isExternalUrl', () => {
        it('should identify external URLs', () => {
            expect(isExternalUrl('https://google.com')).toBe(true);
            expect(isExternalUrl('http://example.com')).toBe(true);
        });

        it('should identify internal relative URLs', () => {
            expect(isExternalUrl('/blog')).toBe(false);
            expect(isExternalUrl('/en/about')).toBe(false);
            expect(isExternalUrl('blog/post')).toBe(false);
        });

        it('should compare with current origin', () => {
            expect(isExternalUrl('https://example.com/blog', 'https://example.com')).toBe(false);
            expect(isExternalUrl('https://other.com/blog', 'https://example.com')).toBe(true);
        });

        it('should consider protocol differences as external', () => {
            expect(isExternalUrl('http://example.com', 'https://example.com')).toBe(true);
            expect(isExternalUrl('https://example.com', 'http://example.com')).toBe(true);
        });

        it('should handle invalid URLs gracefully', () => {
            expect(isExternalUrl('not-a-url')).toBe(false);
            expect(isExternalUrl('://invalid')).toBe(false);
        });

        it('should handle URLs with paths', () => {
            expect(isExternalUrl('https://example.com/blog/post', 'https://example.com')).toBe(false);
            expect(isExternalUrl('https://other.com/blog/post', 'https://example.com')).toBe(true);
        });
    });

    describe('setQueryParam', () => {
        it('should add query parameter to path without params', () => {
            expect(setQueryParam('/blog', 'page', '2')).toBe('/blog?page=2');
            expect(setQueryParam('/blog', 'tag', 'astro')).toBe('/blog?tag=astro');
        });

        it('should update existing parameter', () => {
            expect(setQueryParam('/blog?page=1', 'page', '2')).toBe('/blog?page=2');
            expect(setQueryParam('/blog?tag=react', 'tag', 'astro')).toBe('/blog?tag=astro');
        });

        it('should add parameter alongside existing ones', () => {
            expect(setQueryParam('/blog?page=1', 'tag', 'astro')).toBe('/blog?page=1&tag=astro');
            expect(setQueryParam('/blog?tag=astro', 'page', '2')).toBe('/blog?tag=astro&page=2');
        });

        it('should remove parameter when value is null', () => {
            expect(setQueryParam('/blog?page=2', 'page', null)).toBe('/blog');
            expect(setQueryParam('/blog?page=2&tag=astro', 'page', null)).toBe('/blog?tag=astro');
        });

        it('should remove parameter when value is undefined', () => {
            expect(setQueryParam('/blog?page=2', 'page', undefined)).toBe('/blog');
            expect(setQueryParam('/blog?page=2&tag=astro', 'tag', undefined)).toBe('/blog?page=2');
        });

        it('should preserve hash fragments', () => {
            expect(setQueryParam('/blog#section', 'page', '2')).toBe('/blog?page=2#section');
            expect(setQueryParam('/blog?page=1#section', 'page', '2')).toBe('/blog?page=2#section');
        });

        it('should handle number values', () => {
            expect(setQueryParam('/blog', 'page', 2)).toBe('/blog?page=2');
            expect(setQueryParam('/blog', 'count', 42)).toBe('/blog?count=42');
        });

        it('should handle boolean values', () => {
            expect(setQueryParam('/blog', 'draft', true)).toBe('/blog?draft=true');
            expect(setQueryParam('/blog', 'published', false)).toBe('/blog?published=false');
        });
    });

    describe('getQueryParam', () => {
        it('should get existing parameter', () => {
            expect(getQueryParam('/blog?page=2', 'page')).toBe('2');
            expect(getQueryParam('/blog?tag=astro', 'tag')).toBe('astro');
        });

        it('should return null for missing parameter', () => {
            expect(getQueryParam('/blog', 'page')).toBeNull();
            expect(getQueryParam('/blog?page=2', 'tag')).toBeNull();
        });

        it('should get parameter from multiple params', () => {
            expect(getQueryParam('/blog?page=2&tag=astro', 'page')).toBe('2');
            expect(getQueryParam('/blog?page=2&tag=astro', 'tag')).toBe('astro');
        });

        it('should ignore hash fragments', () => {
            expect(getQueryParam('/blog?page=2#section', 'page')).toBe('2');
            expect(getQueryParam('/blog?tag=astro#comments', 'tag')).toBe('astro');
        });

        it('should handle URL encoded values', () => {
            expect(getQueryParam('/blog?title=Hello%20World', 'title')).toBe('Hello World');
            expect(getQueryParam('/blog?url=https%3A%2F%2Fexample.com', 'url')).toBe('https://example.com');
        });

        it('should return empty string for parameter with no value', () => {
            expect(getQueryParam('/blog?page', 'page')).toBe('');
            expect(getQueryParam('/blog?page=', 'page')).toBe('');
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete URL transformation workflow', () => {
            // Start with a basic URL
            let url = '/blog';

            // Add locale
            url = changeLocale(url, 'es');
            expect(url).toBe('/es/blog');

            // Add query parameters
            url = setQueryParam(url, 'page', '2');
            url = setQueryParam(url, 'tag', 'astro');
            expect(url).toBe('/es/blog?page=2&tag=astro');

            // Get locale
            expect(getLocaleFromUrl(url)).toBe('es');

            // Get query param
            expect(getQueryParam(url, 'page')).toBe('2');

            // Change locale
            url = changeLocale(url, 'en');
            expect(url).toBe('/en/blog?page=2&tag=astro');

            // Remove locale
            url = removeLocale(url);
            expect(url).toBe('/blog?page=2&tag=astro');
        });

        it('should build complex URLs from scratch', () => {
            const url = buildUrl({
                path: '/blog/post-title',
                locale: 'es',
                params: {
                    ref: 'twitter',
                    utm_source: 'social',
                    draft: false
                },
                hash: 'comments'
            });

            expect(url).toBe('/es/blog/post-title?ref=twitter&utm_source=social&draft=false#comments');

            // Extract locale
            expect(getLocaleFromUrl(url)).toBe('es');

            // Extract params
            expect(getQueryParam(url, 'ref')).toBe('twitter');
            expect(getQueryParam(url, 'utm_source')).toBe('social');
        });

        it('should normalize and rebuild messy URLs', () => {
            const messyUrl = '//en//blog//post//?page=2&tag=astro#section';

            // Normalize
            const normalized = normalizeUrl(messyUrl);
            expect(normalized).toBe('/en/blog/post?page=2&tag=astro#section');

            // Extract segments
            const segments = getPathSegments(normalized);
            expect(segments).toEqual(['en', 'blog', 'post']);

            // Rebuild cleanly
            const rebuilt = buildUrl({
                path: `/${segments.slice(1).join('/')}`,
                locale: segments[0],
                params: {
                    page: getQueryParam(normalized, 'page'),
                    tag: getQueryParam(normalized, 'tag')
                },
                hash: 'section'
            });

            expect(rebuilt).toBe('/en/blog/post?page=2&tag=astro#section');
        });
    });
});
