/**
 * URL Utilities
 *
 * Provides type-safe helpers for URL manipulation and validation.
 * Designed for use in both browser and server environments.
 *
 * @example
 * ```typescript
 * import { normalizeUrl, buildUrl, getPathSegments } from '@/utils/url';
 *
 * const url = normalizeUrl('/en//blog//post');  // '/en/blog/post'
 * const full = buildUrl({ path: '/blog', locale: 'es', params: { page: '2' } });
 * const segments = getPathSegments('/en/blog/post');  // ['en', 'blog', 'post']
 * ```
 */

/**
 * Normalizes a URL path by:
 * - Removing duplicate slashes
 * - Ensuring leading slash
 * - Removing trailing slash (except for root)
 * - Preserving query strings and hash fragments
 *
 * @param url - URL or path string to normalize
 * @returns Normalized path string
 *
 * @example
 * ```typescript
 * normalizeUrl('/en//blog/');           // '/en/blog'
 * normalizeUrl('blog/post//');          // '/blog/post'
 * normalizeUrl('/');                    // '/'
 * normalizeUrl('/blog?page=2');         // '/blog?page=2'
 * normalizeUrl('/blog#section');        // '/blog#section'
 * ```
 */
export function normalizeUrl(url: string): string {
    // Handle empty string
    if (!url || url.trim() === '') return '/';

    // Split URL into path, query, and hash
    const [pathPart, ...rest] = url.split(/([?#])/);
    const queryAndHash = rest.join('');

    // Normalize path
    let normalizedPath = pathPart
        // Replace multiple slashes with single slash
        .replace(/\/+/g, '/')
        // Ensure leading slash
        .replace(/^(?!\/)/, '/');

    // Remove trailing slash (except for root path)
    if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
    }

    return normalizedPath + queryAndHash;
}

/**
 * Options for building a URL
 */
export interface BuildUrlOptions {
    /** Base path (without locale prefix) */
    path: string;
    /** Locale/language code (e.g., 'en', 'es') */
    locale?: string;
    /** Query parameters as key-value pairs */
    params?: Record<string, string | number | boolean | null | undefined>;
    /** Hash fragment (without '#') */
    hash?: string;
    /** Base URL (defaults to empty for relative URLs) */
    baseUrl?: string;
}

/**
 * Builds a URL from components with proper formatting
 *
 * @param options - URL building options
 * @returns Complete URL string
 *
 * @example
 * ```typescript
 * buildUrl({ path: '/blog' });
 * // '/blog'
 *
 * buildUrl({ path: '/blog', locale: 'es' });
 * // '/es/blog'
 *
 * buildUrl({ path: '/blog', params: { page: 2, tag: 'astro' } });
 * // '/blog?page=2&tag=astro'
 *
 * buildUrl({ path: '/blog', locale: 'en', params: { page: 1 }, hash: 'comments' });
 * // '/en/blog?page=1#comments'
 *
 * buildUrl({ path: '/blog', baseUrl: 'https://example.com', locale: 'en' });
 * // 'https://example.com/en/blog'
 * ```
 */
export function buildUrl(options: BuildUrlOptions): string {
    const { path, locale, params, hash, baseUrl = '' } = options;

    // Start with base URL or empty string
    let url = baseUrl;

    // Add locale prefix if provided
    if (locale) {
        url += `/${locale}`;
    }

    // Add path (normalize it first)
    const normalizedPath = normalizeUrl(path);
    url += normalizedPath === '/' && locale ? '' : normalizedPath;

    // Add query parameters
    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            // Skip null/undefined values
            if (value !== null && value !== undefined) {
                searchParams.append(key, String(value));
            }
        }
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    // Add hash fragment
    if (hash) {
        url += `#${hash}`;
    }

    return url || '/';
}

/**
 * Extracts path segments from a URL, excluding empty segments
 *
 * @param url - URL or path string
 * @returns Array of path segments
 *
 * @example
 * ```typescript
 * getPathSegments('/en/blog/post');        // ['en', 'blog', 'post']
 * getPathSegments('/en/blog/');            // ['en', 'blog']
 * getPathSegments('/');                    // []
 * getPathSegments('/blog?page=2');         // ['blog']
 * getPathSegments('//en//blog//post//');   // ['en', 'blog', 'post']
 * ```
 */
export function getPathSegments(url: string): string[] {
    const normalized = normalizeUrl(url);
    const [pathPart] = normalized.split(/[?#]/);

    return pathPart.split('/').filter((segment) => segment.length > 0);
}

/**
 * Changes the locale in a URL path while preserving the rest of the path
 *
 * @param url - URL or path string
 * @param newLocale - New locale code to use
 * @param validLocales - List of valid locale codes (default: ['en', 'es'])
 * @returns URL with updated locale
 *
 * @example
 * ```typescript
 * changeLocale('/en/blog/post', 'es');           // '/es/blog/post'
 * changeLocale('/blog/post', 'es');              // '/es/blog/post'
 * changeLocale('/en/blog?page=2', 'es');         // '/es/blog?page=2'
 * changeLocale('/en/blog#section', 'es');        // '/es/blog#section'
 * changeLocale('/fr/blog', 'es', ['en', 'es']);  // '/es/blog' (removes invalid 'fr')
 * ```
 */
export function changeLocale(url: string, newLocale: string, _validLocales: string[] = ['en', 'es']): string {
    const [pathPart, ...rest] = url.split(/([?#])/);
    const queryAndHash = rest.join('');

    const segments = getPathSegments(pathPart);

    // Check if first segment exists
    if (segments.length > 0) {
        // If it's a valid locale OR looks like a locale (2-3 chars), replace it
        // This handles both valid locales and invalid ones like 'fr', 'de'
        if (segments[0].length <= 3 && segments[0].match(/^[a-z]{2,3}$/i)) {
            segments[0] = newLocale;
        } else {
            // Not a locale, add new locale at beginning
            segments.unshift(newLocale);
        }
    } else {
        // Empty path, just add locale
        segments.push(newLocale);
    }

    return `/${segments.join('/')}${queryAndHash}`;
}

/**
 * Removes locale prefix from a URL path
 *
 * @param url - URL or path string
 * @param validLocales - List of valid locale codes (default: ['en', 'es'])
 * @returns URL without locale prefix
 *
 * @example
 * ```typescript
 * removeLocale('/en/blog/post');                // '/blog/post'
 * removeLocale('/es/about');                    // '/about'
 * removeLocale('/blog/post');                   // '/blog/post'
 * removeLocale('/en/blog?page=2');              // '/blog?page=2'
 * removeLocale('/fr/blog', ['en', 'es']);       // '/fr/blog' (keeps invalid locale)
 * ```
 */
export function removeLocale(url: string, validLocales: string[] = ['en', 'es']): string {
    const [pathPart, ...rest] = url.split(/([?#])/);
    const queryAndHash = rest.join('');

    const segments = getPathSegments(pathPart);

    // Remove first segment if it's a valid locale
    if (segments.length > 0 && validLocales.includes(segments[0])) {
        segments.shift();
    }

    return `/${segments.join('/')}${queryAndHash}` || '/';
}

/**
 * Extracts the locale from a URL path
 *
 * @param url - URL or path string
 * @param validLocales - List of valid locale codes (default: ['en', 'es'])
 * @param defaultLocale - Default locale to return if none found (default: 'en')
 * @returns Locale code or default
 *
 * @example
 * ```typescript
 * getLocaleFromUrl('/en/blog');                 // 'en'
 * getLocaleFromUrl('/es/about');                // 'es'
 * getLocaleFromUrl('/blog');                    // 'en' (default)
 * getLocaleFromUrl('/fr/blog', ['en', 'es']);   // 'en' (default, 'fr' not valid)
 * ```
 */
export function getLocaleFromUrl(url: string, validLocales: string[] = ['en', 'es'], defaultLocale = 'en'): string {
    const segments = getPathSegments(url);

    if (segments.length > 0 && validLocales.includes(segments[0])) {
        return segments[0];
    }

    return defaultLocale;
}

/**
 * Checks if a URL is external (different origin)
 *
 * @param url - URL string to check
 * @param currentOrigin - Current origin (defaults to window.location.origin in browser)
 * @returns True if URL is external
 *
 * @example
 * ```typescript
 * isExternalUrl('https://google.com');              // true
 * isExternalUrl('/blog');                           // false
 * isExternalUrl('https://example.com/blog', 'https://example.com'); // false
 * isExternalUrl('http://example.com', 'https://example.com');  // true (different protocol)
 * ```
 */
export function isExternalUrl(url: string, currentOrigin?: string): boolean {
    // Relative URLs are not external
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
    }

    try {
        const urlObj = new URL(url);
        const origin = currentOrigin || (typeof window !== 'undefined' ? window.location.origin : '');

        return urlObj.origin !== origin;
    } catch {
        // Invalid URL format
        return false;
    }
}

/**
 * Adds or updates a query parameter in a URL
 *
 * @param url - URL or path string
 * @param key - Parameter key
 * @param value - Parameter value (null/undefined to remove)
 * @returns URL with updated parameter
 *
 * @example
 * ```typescript
 * setQueryParam('/blog', 'page', '2');           // '/blog?page=2'
 * setQueryParam('/blog?page=1', 'page', '2');    // '/blog?page=2'
 * setQueryParam('/blog?page=1', 'tag', 'astro'); // '/blog?page=1&tag=astro'
 * setQueryParam('/blog?page=1', 'page', null);   // '/blog' (removes param)
 * ```
 */
export function setQueryParam(url: string, key: string, value: string | number | boolean | null | undefined): string {
    // Split into path, query, and hash components
    let pathPart = url;
    let queryPart = '';
    let hashPart = '';

    // Extract hash first
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
        hashPart = url.substring(hashIndex + 1);
        pathPart = url.substring(0, hashIndex);
    }

    // Extract query
    const queryIndex = pathPart.indexOf('?');
    if (queryIndex !== -1) {
        queryPart = pathPart.substring(queryIndex + 1);
        pathPart = pathPart.substring(0, queryIndex);
    }

    const params = new URLSearchParams(queryPart);

    // Remove parameter if value is null/undefined
    if (value === null || value === undefined) {
        params.delete(key);
    } else {
        params.set(key, String(value));
    }

    const queryString = params.toString();
    let result = pathPart;

    if (queryString) {
        result += `?${queryString}`;
    }

    if (hashPart) {
        result += `#${hashPart}`;
    }

    return result;
}

/**
 * Gets a query parameter value from a URL
 *
 * @param url - URL or path string
 * @param key - Parameter key
 * @returns Parameter value or null if not found
 *
 * @example
 * ```typescript
 * getQueryParam('/blog?page=2', 'page');         // '2'
 * getQueryParam('/blog?page=2&tag=astro', 'tag'); // 'astro'
 * getQueryParam('/blog', 'page');                 // null
 * getQueryParam('/blog?page=2', 'tag');           // null
 * ```
 */
export function getQueryParam(url: string, key: string): string | null {
    const [, queryPart] = url.split('?');
    if (!queryPart) return null;

    const [queryWithoutHash] = queryPart.split('#');
    const params = new URLSearchParams(queryWithoutHash);

    return params.get(key);
}
