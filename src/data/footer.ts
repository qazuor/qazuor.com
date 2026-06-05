/**
 * Centralized footer data for SPEC-001.
 *
 * This module is the single source of truth for the footer link groups
 * (commercial, discovery, resources, legal) and the social/contact list.
 * The `Footer.astro` component will be migrated to consume it in Phase 2.
 *
 * The current `Footer.astro` hard-codes its `exploreItems` array inline and
 * reads its labels from `common.json` via the i18n runtime. That is
 * preserved in Phase 1 — only the data layer is being added now. The order
 * here matches the planned final footer composition.
 *
 * Phase 1 contributes the data shape. Do not introduce a parallel footer
 * data module.
 */

import { contact } from './contact';

/**
 * Allowed footer item locales.
 */
export type FooterLocale = 'en' | 'es';

/**
 * Footer link group identifiers.
 *
 * - `commercial` — primary commercial routes (mirrors `primaryNav`).
 * - `discovery` — secondary discovery links (mirrors `secondaryNav`).
 * - `resources` — goodies sub-resources for power users.
 * - `legal` — license, repository, and other utility/legal links.
 */
export type FooterGroupId = 'commercial' | 'discovery' | 'resources' | 'legal';

/**
 * Shape of a single footer link item.
 *
 * @remarks
 * `external` links render with `target="_blank"` and `rel="noopener"`. They
 * do not receive the `/{lang}` prefix.
 */
export interface FooterItem {
    /** Stable identifier used as React key and in tests. */
    readonly id: string;
    /** Human-readable English fallback. */
    readonly label: string;
    /** Dot-notation i18n key in `common.json` (e.g. `footer.explore.blog`). */
    readonly i18nKey: string;
    /** Route path WITHOUT the leading `/{lang}` prefix, or absolute URL. */
    readonly path: string;
    /** If true, link is rendered as `target="_blank"`. */
    readonly external?: boolean;
}

/**
 * Shape of a footer link group.
 */
export interface FooterGroup {
    /** Stable group identifier. */
    readonly id: FooterGroupId;
    /** i18n key for the group title (e.g. `footer.explore.title`). */
    readonly titleKey: string;
    /** Items in display order. */
    readonly items: readonly FooterItem[];
}

/**
 * Commercial group — mirrors the primary commercial nav order.
 */
export const commercialFooter: FooterGroup = {
    id: 'commercial',
    titleKey: 'footer.explore.title',
    items: [
        { id: 'footer-services', label: 'Services', i18nKey: 'footer.explore.services', path: '/services' },
        { id: 'footer-work', label: 'Work', i18nKey: 'footer.commercial.work', path: '/work' },
        { id: 'footer-projects', label: 'Projects', i18nKey: 'footer.explore.projects', path: '/projects' },
        { id: 'footer-blog', label: 'Blog', i18nKey: 'footer.explore.blog', path: '/blog' },
        { id: 'footer-about', label: 'About', i18nKey: 'footer.commercial.about', path: '/about' },
        { id: 'footer-hire', label: 'Hire', i18nKey: 'footer.commercial.hire', path: '/hire' },
        { id: 'footer-contact', label: 'Contact', i18nKey: 'footer.commercial.contact', path: '/contact' }
    ]
};

/**
 * Discovery group — secondary / utility routes.
 */
export const discoveryFooter: FooterGroup = {
    id: 'discovery',
    titleKey: 'footer.discovery.title',
    items: [{ id: 'footer-goodies', label: 'Goodies', i18nKey: 'footer.explore.goodies', path: '/goodies' }]
};

/**
 * Resources group — goodies sub-resources (Requirement 3.2 secondary links).
 */
export const resourcesFooter: FooterGroup = {
    id: 'resources',
    titleKey: 'footer.resources.title',
    items: [
        { id: 'footer-tools', label: 'Tools', i18nKey: 'footer.resources.tools', path: '/goodies/tools' },
        { id: 'footer-snippets', label: 'Snippets', i18nKey: 'footer.resources.snippets', path: '/goodies/snippets' },
        {
            id: 'footer-useful-links',
            label: 'Useful Links',
            i18nKey: 'footer.resources.usefulLinks',
            path: '/goodies/useful-links'
        },
        {
            id: 'footer-css-tricks',
            label: 'CSS Tricks',
            i18nKey: 'footer.resources.cssTricks',
            path: '/goodies/css-tricks'
        }
    ]
};

/**
 * Legal group — license, source, and other meta links.
 */
export const legalFooter: FooterGroup = {
    id: 'legal',
    titleKey: 'footer.legal.title',
    items: [
        {
            id: 'footer-license',
            label: 'MIT License',
            i18nKey: 'footer.openSource.license',
            path: 'https://github.com/qazuor/qazuor.com/blob/main/LICENSE',
            external: true
        },
        {
            id: 'footer-source',
            label: 'Source on GitHub',
            i18nKey: 'footer.openSource.source',
            path: 'https://github.com/qazuor/qazuor.com',
            external: true
        }
    ]
};

/**
 * All footer groups in display order.
 */
export const footerGroups: readonly FooterGroup[] = [commercialFooter, discoveryFooter, resourcesFooter, legalFooter];

/**
 * Social and contact surface for the footer.
 *
 * Sourced from `src/data/contact.ts` so all contact info lives in one place.
 */
export const footerContact = {
    email: contact.email,
    phone: contact.phone,
    social: contact.social
} as const;

/**
 * Resolve a locale-prefixed path for a footer item.
 *
 * External URLs (with `external: true`) are returned unchanged.
 *
 * @param item - Footer item to localize.
 * @param locale - Target locale.
 * @returns Path such as `/en/services` or the original external URL.
 */
export function localizedFooterPath(item: FooterItem, locale: FooterLocale): string {
    if (item.external) {
        return item.path;
    }
    const cleanPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
    if (cleanPath === '/') {
        return `/${locale}`;
    }
    return `/${locale}${cleanPath}`;
}
