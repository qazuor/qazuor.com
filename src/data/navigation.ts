/**
 * Centralized navigation data for SPEC-001.
 *
 * This module is the single source of truth for the primary (top-level
 * commercial) navigation and the secondary (utility / discovery) navigation
 * that the floating nav, footer, and any future primary nav component will
 * consume. The order in `primaryNav` and `secondaryNav` is the rendered order
 * — preserve the commercial-first sequence defined in Requirement 3.1.
 *
 * Labels are NOT hard-coded here: each item carries an `i18nKey` that points
 * to a translation in `src/locales/{en,es}/common.json`. A safe English
 * fallback is also provided so the data is usable in non-i18n contexts
 * (tests, scripts, etc.).
 *
 * Phase 1 contributes the data shape. Phase 2 will rewire `FloatingNav.tsx`
 * and `Footer.astro` to consume it. Do not introduce a parallel nav data
 * module.
 *
 * Icons are referenced by stable kebab-case identifiers (e.g. `briefcase`).
 * UI components are responsible for resolving identifiers to actual icon
 * components (see `src/components/navigation/navIcons.tsx`). This keeps the
 * data layer free of UI-library coupling.
 */

/**
 * Allowed navigation item locales.
 */
export type NavLocale = 'en' | 'es';

/**
 * Where a nav item is intended to render.
 *
 * - `primary` — top-level commercial-first nav (Requirement 3.1)
 * - `secondary` — footer / discovery nav (Requirement 3.2)
 * - `utility` — quick-access popover utilities (theme, language, etc.)
 * - `floating` — legacy side-floating nav anchors. Kept for compatibility
 *   with the existing `FloatingNav` until Phase 2 migrates it.
 */
export type NavGroup = 'primary' | 'secondary' | 'utility' | 'floating';

/**
 * Stable icon identifiers. Consumers resolve these to actual icon components
 * via `src/components/navigation/navIcons.tsx`. Adding a new icon means:
 *  1. Append the identifier to this union.
 *  2. Map it in `navIcons.tsx`.
 */
export type NavIconId =
    | 'home'
    | 'user'
    | 'badge-check'
    | 'folder-git'
    | 'briefcase'
    | 'file-text'
    | 'message-quote'
    | 'help-circle'
    | 'mail'
    | 'gift';

/**
 * Shape of a single navigation item.
 */
export interface NavItem {
    /** Stable identifier used as React key and in tests. */
    readonly id: string;
    /** Human-readable English fallback (safe to ship if i18n is missing). */
    readonly label: string;
    /** Dot-notation i18n key in `common.json` (e.g. `nav.services`). */
    readonly i18nKey: string;
    /** Locale-aware path WITHOUT the leading `/{lang}` prefix. */
    readonly path: string;
    /** Group this item belongs to. */
    readonly group: NavGroup;
    /** Optional icon identifier. Consumers resolve it to an icon component. */
    readonly icon?: NavIconId;
    /** If true, this item is shown only in footer/secondary contexts. */
    readonly secondaryOnly?: boolean;
}

/**
 * Primary commercial nav order — Requirement 3.1.
 *
 * Order MUST be: Services, Work, Projects, Blog, About, Hire, Contact.
 */
export const primaryNav: readonly NavItem[] = [
    {
        id: 'services',
        label: 'Services',
        i18nKey: 'nav.services',
        path: '/services',
        group: 'primary',
        icon: 'briefcase'
    },
    {
        id: 'work',
        label: 'Work',
        i18nKey: 'nav.work',
        path: '/work',
        group: 'primary',
        icon: 'badge-check'
    },
    {
        id: 'projects',
        label: 'Projects',
        i18nKey: 'nav.projects',
        path: '/projects',
        group: 'primary',
        icon: 'folder-git'
    },
    {
        id: 'blog',
        label: 'Blog',
        i18nKey: 'nav.blog',
        path: '/blog',
        group: 'primary',
        icon: 'file-text'
    },
    {
        id: 'about',
        label: 'About',
        i18nKey: 'nav.about',
        path: '/about',
        group: 'primary',
        icon: 'user'
    },
    {
        id: 'hire',
        label: 'Hire',
        i18nKey: 'nav.hire',
        path: '/hire',
        group: 'primary',
        icon: 'badge-check'
    },
    {
        id: 'contact',
        label: 'Contact',
        i18nKey: 'nav.contact',
        path: '/contact',
        group: 'primary',
        icon: 'mail'
    }
] as const;

/**
 * Secondary / discovery nav — Requirement 3.2.
 *
 * Goodies and its sub-resources live here only. They MUST NOT be promoted to
 * the primary nav.
 */
export const secondaryNav: readonly NavItem[] = [
    {
        id: 'goodies',
        label: 'Goodies',
        i18nKey: 'nav.tools',
        path: '/goodies',
        group: 'secondary',
        icon: 'gift',
        secondaryOnly: true
    },
    {
        id: 'goodies-tools',
        label: 'Tools',
        i18nKey: 'nav.tools',
        path: '/goodies/tools',
        group: 'secondary'
    },
    {
        id: 'goodies-snippets',
        label: 'Snippets',
        i18nKey: 'nav.snippets',
        path: '/goodies/snippets',
        group: 'secondary'
    },
    {
        id: 'goodies-css-tricks',
        label: 'CSS Tricks',
        i18nKey: 'nav.cssTricks',
        path: '/goodies/css-tricks',
        group: 'secondary'
    },
    {
        id: 'goodies-useful-links',
        label: 'Useful Links',
        i18nKey: 'nav.usefulLinks',
        path: '/goodies/useful-links',
        group: 'secondary'
    }
] as const;

/**
 * Utility items — theme toggle, language switch, command palette, scroll-to-top.
 *
 * These are not part of the primary or secondary nav proper; they live in the
 * floating utilities cluster today and will be moved to the new top-bar in
 * Phase 2.
 */
export const utilityNav: readonly NavItem[] = [
    {
        id: 'utility-goodies',
        label: 'Goodies',
        i18nKey: 'nav.tools',
        path: '/goodies',
        group: 'utility',
        icon: 'gift'
    }
] as const;

/**
 * Legacy floating-nav anchor list. Kept verbatim so `FloatingNav.tsx` can be
 * migrated item-by-item in Phase 2 without losing its current behavior. Each
 * entry corresponds to a section anchor on the homepage, with an optional
 * off-home path for non-home navigation.
 */
export const floatingNavAnchors: readonly NavItem[] = [
    { id: 'hero', label: 'Home', i18nKey: 'nav.home', path: '/', group: 'floating', icon: 'home' },
    { id: 'about', label: 'About', i18nKey: 'nav.about', path: '/about', group: 'floating', icon: 'user' },
    { id: 'skills', label: 'Skills', i18nKey: 'nav.skills', path: '/', group: 'floating', icon: 'badge-check' },
    {
        id: 'projects',
        label: 'Projects',
        i18nKey: 'nav.projects',
        path: '/projects',
        group: 'floating',
        icon: 'folder-git'
    },
    {
        id: 'services-preview',
        label: 'Services',
        i18nKey: 'nav.services',
        path: '/services',
        group: 'floating',
        icon: 'briefcase'
    },
    { id: 'blog', label: 'Blog', i18nKey: 'nav.blog', path: '/blog', group: 'floating', icon: 'file-text' },
    {
        id: 'testimonials',
        label: 'Testimonials',
        i18nKey: 'nav.testimonials',
        path: '/',
        group: 'floating',
        icon: 'message-quote'
    },
    { id: 'faqs', label: 'FAQ', i18nKey: 'nav.faqs', path: '/', group: 'floating', icon: 'help-circle' },
    { id: 'contact', label: 'Contact', i18nKey: 'nav.contact', path: '/contact', group: 'floating', icon: 'mail' }
] as const;

/**
 * Resolve a locale-prefixed path for any nav item.
 *
 * Top-level paths stay in English (Requirement 2.1) — only the locale prefix
 * varies.
 *
 * @param item - Nav item to localize.
 * @param locale - Target locale.
 * @returns Path such as `/en/services` or `/es/work`.
 */
export function localizedNavPath(item: NavItem, locale: NavLocale): string {
    const cleanPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
    if (cleanPath === '/') {
        return `/${locale}`;
    }
    return `/${locale}${cleanPath}`;
}

/**
 * Lookup helper: find a nav item by its stable `id`.
 *
 * @param id - The nav item id to look up.
 * @returns The matching `NavItem`, or `undefined` if not found.
 */
export function findNavItem(id: string): NavItem | undefined {
    return [...primaryNav, ...secondaryNav, ...utilityNav, ...floatingNavAnchors].find((item) => item.id === id);
}
