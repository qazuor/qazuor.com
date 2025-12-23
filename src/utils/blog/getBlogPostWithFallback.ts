import type { CollectionEntry } from 'astro:content';
import { getEffectiveSlug } from './getEffectiveSlug';

/** Default language to fallback to when requested language version doesn't exist */
const DEFAULT_LANG = 'es';

/** Supported languages */
export type SupportedLang = 'en' | 'es';

/** Result of getting a post with potential fallback */
export interface BlogPostWithFallback {
    post: CollectionEntry<'blog'>;
    /** Whether the post is using fallback language */
    isFallback: boolean;
    /** The actual language of the content */
    actualLang: SupportedLang;
}

/**
 * Gets a blog post by slug and language, with fallback to default language.
 * If the post doesn't exist in the requested language, returns the Spanish version.
 *
 * @param allPosts - All blog posts from the collection
 * @param slug - The slug to search for
 * @param requestedLang - The requested language
 * @returns The post with fallback info, or null if not found in any language
 *
 * @example
 * const result = getBlogPostBySlugWithFallback(allPosts, 'my-post', 'en');
 * if (result) {
 *   console.log(result.isFallback); // true if English version doesn't exist
 *   console.log(result.actualLang); // 'es' if fallback was used
 * }
 */
export function getBlogPostBySlugWithFallback(
    allPosts: CollectionEntry<'blog'>[],
    slug: string,
    requestedLang: SupportedLang
): BlogPostWithFallback | null {
    // Filter out drafts
    const publishedPosts = allPosts.filter((p) => !p.data.draft);

    // First, try to find the post in the requested language
    const postInRequestedLang = publishedPosts.find(
        (p) => getEffectiveSlug(p) === slug && p.data.lang === requestedLang
    );

    if (postInRequestedLang) {
        return {
            post: postInRequestedLang,
            isFallback: false,
            actualLang: requestedLang
        };
    }

    // If not found in requested language, try fallback to default
    if (requestedLang !== DEFAULT_LANG) {
        const postInDefaultLang = publishedPosts.find(
            (p) => getEffectiveSlug(p) === slug && p.data.lang === DEFAULT_LANG
        );

        if (postInDefaultLang) {
            return {
                post: postInDefaultLang,
                isFallback: true,
                actualLang: DEFAULT_LANG
            };
        }
    }

    // Post not found in any language
    return null;
}

/**
 * Gets all published blog posts for a specific language.
 * Does NOT include fallbacks - only returns posts that exist in the requested language.
 *
 * @param allPosts - All blog posts from the collection
 * @param lang - The language to filter by
 * @returns Array of posts in the specified language
 */
export function getBlogPostsForLang(
    allPosts: CollectionEntry<'blog'>[],
    lang: SupportedLang
): CollectionEntry<'blog'>[] {
    return allPosts.filter((p) => !p.data.draft && p.data.lang === lang);
}

/**
 * Gets all unique slugs from published posts (regardless of language).
 * Used for generating static paths.
 *
 * @param allPosts - All blog posts from the collection
 * @returns Array of unique slugs
 */
export function getAllUniqueSlugs(allPosts: CollectionEntry<'blog'>[]): string[] {
    const publishedPosts = allPosts.filter((p) => !p.data.draft);
    const slugs = publishedPosts.map((p) => getEffectiveSlug(p));
    return [...new Set(slugs)];
}

/**
 * Gets all published blog posts for a specific language WITH fallback.
 * For each unique slug, returns the post in the requested language if available,
 * otherwise falls back to the default language (Spanish).
 *
 * @param allPosts - All blog posts from the collection
 * @param lang - The language to filter by
 * @returns Array of posts with fallback applied
 */
export function getBlogPostsForLangWithFallback(
    allPosts: CollectionEntry<'blog'>[],
    lang: SupportedLang
): BlogPostWithFallback[] {
    const uniqueSlugs = getAllUniqueSlugs(allPosts);
    const results: BlogPostWithFallback[] = [];

    for (const slug of uniqueSlugs) {
        const postResult = getBlogPostBySlugWithFallback(allPosts, slug, lang);
        if (postResult) {
            results.push(postResult);
        }
    }

    return results;
}
