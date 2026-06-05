import type { CollectionEntry } from 'astro:content';

/**
 * Extracts the clean slug from a work collection entry.
 * Work entries are stored as {slug}-{lang}.md (e.g., markview-en.md, markview-es.md)
 * mirroring the project collection convention. This function removes the
 * language suffix and file extension to get the URL-friendly slug.
 *
 * @param work - The work collection entry
 * @returns The clean slug without language suffix (e.g., "markview")
 *
 * @example
 * // File: src/content/work/markview-en.md
 * getWorkSlug(entry); // => "markview"
 */
export function getWorkSlug(work: CollectionEntry<'work'>): string {
    return work.id.replace(/\.md$/, '').replace(/-(en|es)$/, '');
}
