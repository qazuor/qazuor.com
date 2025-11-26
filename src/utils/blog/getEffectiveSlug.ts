import type { CollectionEntry } from 'astro:content';

/**
 * Gets the effective slug for a blog post.
 * Uses the custom slug from frontmatter if available, otherwise falls back to the filename-based slug.
 *
 * @param post - The blog post collection entry
 * @returns The effective slug to use for URLs
 *
 * @example
 * // Post with custom slug in frontmatter: slug: "mi-post-custom"
 * getEffectiveSlug(post) // => "mi-post-custom"
 *
 * // Post without custom slug (filename: "my-long-filename-post.md")
 * getEffectiveSlug(post) // => "my-long-filename-post"
 */
export function getEffectiveSlug(post: CollectionEntry<'blog'>): string {
    return post.data.slug || post.slug;
}
