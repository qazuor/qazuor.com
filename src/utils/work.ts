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

/** Default language to fallback to when requested language version doesn't exist. */
export const DEFAULT_LANG = 'en' as const;

/** Supported languages. */
export type SupportedLang = 'en' | 'es';

/** Result of resolving a work entry with potential locale fallback. */
export interface WorkWithFallback {
    entry: CollectionEntry<'work'>;
    /** Whether the entry is being served in a fallback language. */
    isFallback: boolean;
    /** The language actually used (may differ from the requested one). */
    actualLang: SupportedLang;
}

/**
 * Resolves a work entry by slug and requested language, falling back to the
 * default language (English) if the entry is not available in the requested
 * language. Returns `null` only if the entry does not exist in any language.
 *
 * @param allWork - All entries from the work collection
 * @param slug - URL slug (already stripped of language suffix)
 * @param requestedLang - The locale the user requested
 * @returns The resolved entry with fallback metadata, or `null`
 *
 * @example
 * const result = getWorkBySlugWithFallback(allWork, 'markview', 'es');
 * if (result?.isFallback) {
 *     // Serving the English version to an es route
 * }
 */
export function getWorkBySlugWithFallback(
    allWork: CollectionEntry<'work'>[],
    slug: string,
    requestedLang: SupportedLang
): WorkWithFallback | null {
    const inRequestedLang = allWork.find((w) => getWorkSlug(w) === slug && w.data.lang === requestedLang);
    if (inRequestedLang) {
        return { entry: inRequestedLang, isFallback: false, actualLang: requestedLang };
    }

    if (requestedLang !== DEFAULT_LANG) {
        const inDefaultLang = allWork.find((w) => getWorkSlug(w) === slug && w.data.lang === DEFAULT_LANG);
        if (inDefaultLang) {
            return { entry: inDefaultLang, isFallback: true, actualLang: DEFAULT_LANG };
        }
    }

    return null;
}

/**
 * Returns the set of unique slugs across all work entries, regardless of
 * language. Used to generate static paths for the detail route.
 *
 * @param allWork - All entries from the work collection
 * @returns Array of unique URL slugs
 */
export function getAllWorkSlugs(allWork: CollectionEntry<'work'>[]): string[] {
    const slugs = allWork.map((w) => getWorkSlug(w));
    return [...new Set(slugs)];
}
