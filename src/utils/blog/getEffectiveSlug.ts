import type { CollectionEntry } from 'astro:content';

/**
 * Removes language suffix (-es or -en) from a slug.
 * This allows posts in different languages to share the same base slug.
 *
 * @param slug - The slug to process
 * @returns The slug without language suffix
 *
 * @example
 * removeLanguageSuffix('my-post-es') // => 'my-post'
 * removeLanguageSuffix('my-post-en') // => 'my-post'
 * removeLanguageSuffix('my-post') // => 'my-post'
 */
function removeLanguageSuffix(slug: string): string {
    return slug.replace(/-(es|en)$/, '');
}

/**
 * Gets the effective slug for a blog post.
 * Uses the custom slug from frontmatter if available, otherwise falls back to the filename-based slug.
 * Language suffixes (-es, -en) are removed to allow posts in different languages to share the same URL slug.
 *
 * @param post - The blog post collection entry
 * @returns The effective slug to use for URLs (without language suffix)
 *
 * @example
 * // Post with custom slug in frontmatter: slug: "mi-post-custom"
 * getEffectiveSlug(post) // => "mi-post-custom"
 *
 * // Post without custom slug (filename: "my-long-filename-post-es.md")
 * getEffectiveSlug(post) // => "my-long-filename-post"
 *
 * // Post without custom slug (filename: "my-long-filename-post-en.md")
 * getEffectiveSlug(post) // => "my-long-filename-post"
 */
export function getEffectiveSlug(post: CollectionEntry<'blog'>): string {
    // If custom slug is defined in frontmatter, use it (it shouldn't have language suffix)
    if (post.data.slug) {
        return post.data.slug;
    }
    // Otherwise, use filename-based slug and remove language suffix
    return removeLanguageSuffix(post.slug);
}
