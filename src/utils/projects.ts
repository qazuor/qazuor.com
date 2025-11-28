import type { CollectionEntry } from 'astro:content';

/**
 * Extracts the clean slug from a project entry.
 * Projects are stored as {slug}-{lang}.md (e.g., hospeda-en.md, hospeda-es.md)
 * This function removes the language suffix and file extension to get the URL-friendly slug.
 *
 * @param project - The project collection entry
 * @returns The clean slug without language suffix (e.g., "hospeda")
 */
export function getProjectSlug(project: CollectionEntry<'projects'>): string {
    // Remove the .md extension and -en or -es suffix from the file ID
    return project.id.replace(/\.md$/, '').replace(/-(en|es)$/, '');
}
