import { navigate } from 'astro:transitions/client';
import { ArrowUp, Home, Languages, List, type LucideIcon, Moon, SquareTerminal, Sun } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { resolveNavIcon } from '@/data/navIcons';
import { localizedNavPath, type NavItem, type NavLocale, primaryNav } from '@/data/navigation';
import { useTheme } from '@/hooks';
import { MobileUtilitiesPopover } from './MobileUtilitiesPopover';

/**
 * Keys used to look up translated labels for primary nav items.
 * Mirrors the `id` field of entries in `primaryNav` from
 * `src/data/navigation.ts`.
 */
export type LabelKey = 'services' | 'work' | 'projects' | 'blog' | 'about' | 'hire' | 'contact';

export interface TocHeading {
    depth: number;
    slug: string;
    text: string;
}

interface NavSection {
    /** Stable identifier from the navigation data. */
    id: string;
    /** Hash for in-page anchor (only used when on home and the item has no dedicated page). */
    hash: string;
    /** Locale-aware URL for the item (e.g. `/en/services`). */
    pageUrl: string;
    /** Resolved icon component. */
    icon: LucideIcon;
    /** Key used to look up the translated label. */
    labelKey: LabelKey;
}

const defaultLabels: Record<LabelKey, string> = {
    services: 'Services',
    work: 'Work',
    projects: 'Projects',
    blog: 'Blog',
    about: 'About',
    hire: 'Hire',
    contact: 'Contact'
};

/**
 * Build the primary nav list from the central navigation data, pre-resolving
 * icons and pre-computing locale-aware paths. Computed once per module load —
 * the data is static.
 */
function buildNavSections(locale: NavLocale): NavSection[] {
    return primaryNav.map((item: NavItem) => {
        const icon = resolveNavIcon(item.icon);
        return {
            id: item.id,
            hash: '#hero',
            pageUrl: localizedNavPath(item, locale),
            icon,
            labelKey: item.id as LabelKey
        };
    });
}

interface FloatingNavProps {
    labels?: Partial<Record<LabelKey, string>>;
    currentLocale?: string;
    utilityLabels?: {
        home: string;
        command: string;
        theme: string;
        language: string;
        scrollToTop: string;
        toc?: string;
    };
    /** TOC headings - when provided, shows TOC button instead of scroll-to-top */
    tocHeadings?: TocHeading[];
    /** TOC title for accessibility */
    tocTitle?: string;
}

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

function useScrollThresholds(thresholds: { nav: number; scrollToTop: number }) {
    const [state, setState] = useState({ isNavVisible: false, showScrollToTop: false });

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setState({
                isNavVisible: scrollY > thresholds.nav,
                showScrollToTop: scrollY > thresholds.scrollToTop
            });
        };

        handleScroll(); // Check initial state
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [thresholds.nav, thresholds.scrollToTop]);

    return state;
}

const defaultUtilityLabels = {
    home: 'Home',
    command: 'Command',
    theme: 'Theme',
    language: 'Language',
    scrollToTop: 'Scroll to top',
    toc: 'Table of contents'
};

// Memoized thresholds to prevent unnecessary re-renders
const SCROLL_THRESHOLDS = { nav: 100, scrollToTop: 300 };

export function FloatingNav({
    labels = {},
    currentLocale = 'en',
    utilityLabels = defaultUtilityLabels,
    tocHeadings,
    tocTitle
}: FloatingNavProps) {
    const hasToc = tocHeadings && tocHeadings.length > 0;
    const mergedLabels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels]);
    const mergedUtilityLabels = useMemo(() => ({ ...defaultUtilityLabels, ...utilityLabels }), [utilityLabels]);
    const locale = currentLocale as NavLocale;
    const navSections = useMemo(() => buildNavSections(locale), [locale]);
    const isMobile = useMediaQuery('(max-width: 767px)');
    // Hide TOC button in FloatingNav when sidebar TOC is visible (xl+ screens)
    const isTocSidebarVisible = useMediaQuery('(min-width: 1280px)');
    const { isNavVisible: isScrolled, showScrollToTop } = useScrollThresholds(SCROLL_THRESHOLDS);
    const { isDark, toggleTheme } = useTheme();
    const [isHomePage, setIsHomePage] = useState(true);
    const [currentPath, setCurrentPath] = useState<string>('/');
    const prevPathRef = useRef<string | null>(null);

    // Track current path so the active nav item is URL-based (not section
    // observer-based). Updates on popstate and on Astro's view-transitions
    // navigation events.
    useEffect(() => {
        const updatePath = () => {
            const path = window.location.pathname;
            setCurrentPath(path);
            setIsHomePage(path === `/${locale}` || path === `/${locale}/` || path === '/');
        };
        updatePath();
        window.addEventListener('popstate', updatePath);
        // Astro view transitions: re-check after content swap
        document.addEventListener('astro:after-swap', updatePath);
        return () => {
            window.removeEventListener('popstate', updatePath);
            document.removeEventListener('astro:after-swap', updatePath);
        };
    }, [locale]);

    // Helper: is the given nav section the active one?
    const isSectionActive = useCallback(
        (section: NavSection): boolean => {
            if (prevPathRef.current !== currentPath) {
                prevPathRef.current = currentPath;
            }
            // For /en vs /es (when currentLocale is 'en'), normalize trailing slash
            const normalized = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
            const target = section.pageUrl.endsWith('/') ? section.pageUrl : `${section.pageUrl}/`;
            return normalized === target;
        },
        [currentPath]
    );

    const openCommandPalette = useCallback(() => {
        window.dispatchEvent(new CustomEvent('openCommandPalette'));
    }, []);

    const handleScrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const openTocDrawer = useCallback(() => {
        window.dispatchEvent(new CustomEvent('openTocDrawer'));
    }, []);

    const switchLanguage = useCallback(() => {
        const newLocale = currentLocale === 'es' ? 'en' : 'es';
        const currentPath_ = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        const newPath = currentPath_.replace(new RegExp(`^/${currentLocale}`), `/${newLocale}`);
        // Use View Transitions for language switch (preserve query params and hash)
        navigate(`${newPath || `/${newLocale}`}${currentSearch}${currentHash}`);
    }, [currentLocale]);

    const navigateToSection = useCallback(
        (section: NavSection) => {
            // If we are on the home page and the section has an in-page hash
            // (none in the new commercial nav, but kept for safety), scroll to it.
            // Otherwise navigate to the dedicated page.
            if (isHomePage && section.hash && section.hash !== '#hero') {
                const element = document.getElementById(section.hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                }
            }
            navigate(section.pageUrl);
        },
        [isHomePage]
    );

    const handleSectionClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, section: NavSection) => {
            // Allow ctrl/cmd+click to open in new tab
            if (e.ctrlKey || e.metaKey) {
                return;
            }
            e.preventDefault();
            navigateToSection(section);
        },
        [navigateToSection]
    );

    if (isMobile) {
        return (
            <nav
                aria-label="Quick navigation"
                className={`fixed bottom-4 left-1/2 z-[400] flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/95 px-2 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_0_40px_rgba(var(--color-primary),0.15)] backdrop-blur-md transition-all duration-base md:hidden dark:bg-card dark:border-primary/30 dark:shadow-[0_4px_25px_rgba(0,0,0,0.6),0_0_60px_rgba(var(--color-primary),0.4)] dark:ring-1 dark:ring-primary/20 ${
                    isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
                }`}
            >
                {navSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = isSectionActive(section);
                    const label = mergedLabels[section.labelKey];

                    return (
                        <a
                            key={section.id}
                            href={section.pageUrl}
                            onClick={(e) => handleSectionClick(e, section)}
                            aria-label={label}
                            aria-current={isActive ? 'page' : undefined}
                            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-fast ${
                                isActive
                                    ? 'bg-primary/20 text-primary scale-emphasis'
                                    : 'text-muted-foreground active:bg-primary/10 hover:scale-medium'
                            }`}
                        >
                            <Icon size={16} />
                        </a>
                    );
                })}
                {/* Separator */}
                <div className="mx-0.5 h-6 w-px bg-border" />
                {/* Utilities Popover */}
                <MobileUtilitiesPopover currentLocale={currentLocale} translations={mergedUtilityLabels} />
            </nav>
        );
    }

    return (
        <div className="fixed right-4 top-1/2 z-[400] hidden -translate-y-1/2 flex-col gap-3 md:flex">
            {/* Main Navigation */}
            <nav
                aria-label="Quick navigation"
                className="flex flex-col gap-2 rounded-full border border-border bg-card/90 p-2 shadow-lg backdrop-blur-md dark:bg-card dark:border-white/20 dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] dark:ring-1 dark:ring-white/10"
            >
                {navSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = isSectionActive(section);
                    const label = mergedLabels[section.labelKey];

                    return (
                        <a
                            key={section.id}
                            href={section.pageUrl}
                            onClick={(e) => handleSectionClick(e, section)}
                            aria-label={label}
                            aria-current={isActive ? 'page' : undefined}
                            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-base ${
                                isActive
                                    ? 'bg-primary/20 text-primary ring-2 ring-primary/50 scale-emphasis'
                                    : 'text-muted-foreground hover:scale-emphasis hover:bg-primary/10 hover:text-primary'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                                {label}
                            </span>
                        </a>
                    );
                })}
            </nav>

            {/* Utilities */}
            <div className="flex flex-col gap-2 rounded-full border border-border bg-card/90 p-2 shadow-lg backdrop-blur-md dark:bg-card dark:border-white/20 dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] dark:ring-1 dark:ring-white/10">
                {/* Home link (hidden when already on home) */}
                {!isHomePage && (
                    <a
                        href={`/${currentLocale}`}
                        aria-label={mergedUtilityLabels.home}
                        className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary"
                    >
                        <Home size={20} />
                        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                            {mergedUtilityLabels.home}
                        </span>
                    </a>
                )}

                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={mergedUtilityLabels.theme}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.theme}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={switchLanguage}
                    aria-label={mergedUtilityLabels.language}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary"
                >
                    <Languages size={20} />
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.language}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={openCommandPalette}
                    aria-label={mergedUtilityLabels.command}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary"
                >
                    <SquareTerminal size={20} />
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.command}
                    </span>
                </button>
            </div>

            {/* TOC Button (when available and sidebar not visible) OR Scroll to Top - with smooth fade, slide, and height animation */}
            <div
                className={`flex flex-col items-center justify-center overflow-hidden rounded-full border bg-card/90 shadow-lg backdrop-blur-md transition-all duration-base ease-out dark:bg-card dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] ${
                    showScrollToTop
                        ? 'h-14 w-14 p-2 opacity-100 border-border dark:border-white/20 dark:ring-1 dark:ring-white/10'
                        : 'h-0 w-14 p-0 opacity-0 border-transparent pointer-events-none'
                }`}
            >
                {/* Show TOC button only when TOC exists AND sidebar is not visible (not xl+ screens) */}
                {hasToc && !isTocSidebarVisible ? (
                    <button
                        type="button"
                        onClick={openTocDrawer}
                        aria-label={mergedUtilityLabels.toc || tocTitle || 'Table of contents'}
                        tabIndex={showScrollToTop ? 0 : -1}
                        className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary"
                    >
                        <List size={20} />
                        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                            {mergedUtilityLabels.toc || tocTitle || 'Table of contents'}
                        </span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleScrollToTop}
                        aria-label={mergedUtilityLabels.scrollToTop}
                        tabIndex={showScrollToTop ? 0 : -1}
                        className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary"
                    >
                        <ArrowUp size={20} />
                        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                            {mergedUtilityLabels.scrollToTop}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
