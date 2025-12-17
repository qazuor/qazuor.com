import { navigate } from 'astro:transitions/client';
import {
    ArrowUp,
    BadgeCheck,
    BriefcaseBusiness,
    CircleHelp,
    FileText,
    FolderGit2,
    Gift,
    Home,
    Languages,
    List,
    type LucideIcon,
    Mail,
    MessageSquareQuote,
    Moon,
    SquareTerminal,
    Sun,
    UserRound
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@/hooks';
import { scrollTo } from '@/lib/lenis';
import { MobileUtilitiesPopover } from './MobileUtilitiesPopover';

type LabelKey = 'hero' | 'about' | 'skills' | 'projects' | 'services' | 'blog' | 'testimonials' | 'faqs' | 'contact';

export interface TocHeading {
    depth: number;
    slug: string;
    text: string;
}

interface NavSection {
    id: string;
    hash: string; // Hash for home page (e.g., '#about')
    pageUrl?: string; // Optional page URL for non-home navigation (e.g., '/projects')
    icon: LucideIcon;
    labelKey: LabelKey;
}

const defaultLabels: Record<LabelKey, string> = {
    hero: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    services: 'Services',
    blog: 'Blog',
    testimonials: 'Testimonials',
    faqs: 'FAQ',
    contact: 'Contact'
};

const NAV_SECTIONS: NavSection[] = [
    { id: 'hero', hash: '#hero', icon: Home, labelKey: 'hero' },
    { id: 'about', hash: '#about', icon: UserRound, labelKey: 'about' },
    { id: 'skills', hash: '#skills', icon: BadgeCheck, labelKey: 'skills' },
    { id: 'projects', hash: '#projects', pageUrl: '/projects', icon: FolderGit2, labelKey: 'projects' },
    {
        id: 'services-preview',
        hash: '#services-preview',
        pageUrl: '/services',
        icon: BriefcaseBusiness,
        labelKey: 'services'
    },
    { id: 'blog', hash: '#blog', pageUrl: '/blog', icon: FileText, labelKey: 'blog' },
    { id: 'testimonials', hash: '#testimonials', icon: MessageSquareQuote, labelKey: 'testimonials' },
    { id: 'faqs', hash: '#faqs', icon: CircleHelp, labelKey: 'faqs' },
    { id: 'contact', hash: '#contact', icon: Mail, labelKey: 'contact' }
];

interface FloatingNavProps {
    labels?: Partial<Record<LabelKey, string>>;
    currentLocale?: string;
    utilityLabels?: {
        goodies: string;
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

function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        // Single IntersectionObserver for all sections (more efficient than N observers)
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                }
            },
            {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            }
        );

        // Observe all section elements
        for (const id of sectionIds) {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        }

        return () => observer.disconnect();
    }, [sectionIds]);

    return activeSection;
}

function useMediaQuery(query: string) {
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
    goodies: 'Goodies',
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
    const sectionIds = useMemo(() => NAV_SECTIONS.map((s) => s.id), []);
    const activeSection = useActiveSection(sectionIds);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const { isNavVisible: isScrolled, showScrollToTop } = useScrollThresholds(SCROLL_THRESHOLDS);
    const { isDark, toggleTheme } = useTheme();
    const [isHomePage, setIsHomePage] = useState(true);
    const prevActiveSection = useRef<string | null>(null);

    // Check if we're on home page
    useEffect(() => {
        const checkHomePage = () => {
            const path = window.location.pathname;
            setIsHomePage(/^\/(es|en)?\/?$/.test(path));
        };
        checkHomePage();
        window.addEventListener('popstate', checkHomePage);
        return () => window.removeEventListener('popstate', checkHomePage);
    }, []);

    // Update URL hash when active section changes (only on home page)
    useEffect(() => {
        if (activeSection && activeSection !== prevActiveSection.current && isHomePage) {
            const section = NAV_SECTIONS.find((s) => s.id === activeSection);
            if (section && window.history?.replaceState) {
                // Preserve query params when updating hash
                const newUrl = `${window.location.pathname}${window.location.search}${section.hash}`;
                window.history.replaceState(null, '', newUrl);
            }
            prevActiveSection.current = activeSection;
        }
    }, [activeSection, isHomePage]);

    // Filter sections: hide home icon when on home page
    const visibleSections = useMemo(() => {
        return isHomePage ? NAV_SECTIONS.filter((s) => s.id !== 'hero') : NAV_SECTIONS;
    }, [isHomePage]);

    // Handle browser back/forward navigation (popstate) and initial hash on load
    useEffect(() => {
        const scrollToHash = (hash: string) => {
            if (hash) {
                const targetId = hash.replace('#', '');
                const element = document.getElementById(targetId);
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                // No hash - scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        };

        const handlePopState = () => {
            scrollToHash(window.location.hash);
        };

        // Handle initial hash on page load (with small delay to ensure DOM is ready)
        if (window.location.hash) {
            setTimeout(() => scrollToHash(window.location.hash), 100);
        }

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const openCommandPalette = useCallback(() => {
        window.dispatchEvent(new CustomEvent('openCommandPalette'));
    }, []);

    const handleScrollToTop = useCallback(() => {
        scrollTo(0, { duration: 1.2 });
    }, []);

    const openTocDrawer = useCallback(() => {
        window.dispatchEvent(new CustomEvent('openTocDrawer'));
    }, []);

    const switchLanguage = useCallback(() => {
        const newLocale = currentLocale === 'es' ? 'en' : 'es';
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        const newPath = currentPath.replace(new RegExp(`^/${currentLocale}`), `/${newLocale}`);
        // Use View Transitions for language switch (preserve query params and hash)
        navigate(`${newPath || `/${newLocale}`}${currentSearch}${currentHash}`);
    }, [currentLocale]);

    // Custom smooth scroll function with callback support
    const smoothScrollTo = useCallback((targetY: number, duration = 800, onComplete?: () => void) => {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime: number | null = null;

        function animation(currentTime: number): void {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Ease in-out cubic
            const ease =
                progress < 0.5
                    ? 4 * progress * progress * progress
                    : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

            window.scrollTo(0, startY + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else if (onComplete) {
                onComplete();
            }
        }
        requestAnimationFrame(animation);
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>, section: NavSection) => {
            e.preventDefault();
            const targetId = section.hash.replace('#', '');
            const element = document.getElementById(targetId);

            if (isHomePage) {
                // On home page - always smooth scroll to section
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Execute smooth scroll FIRST, then update URL when complete
                    smoothScrollTo(offsetPosition, 800, () => {
                        // Update URL without triggering scroll (after animation completes)
                        // Preserve query params when updating hash
                        if (window.history?.replaceState) {
                            const newUrl = `${window.location.pathname}${window.location.search}${section.hash}`;
                            window.history.replaceState(null, '', newUrl);
                        }
                    });
                }
            } else {
                // Not on home page - navigate to dedicated page or home with hash
                const targetUrl = section.pageUrl
                    ? `/${currentLocale}${section.pageUrl}`
                    : `/${currentLocale}/${section.hash}`;
                navigate(targetUrl);
            }
        },
        [currentLocale, isHomePage, smoothScrollTo]
    );

    if (isMobile) {
        return (
            <nav
                aria-label="Quick navigation"
                className={`fixed bottom-4 left-1/2 z-[400] flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-2 shadow-lg backdrop-blur-sm transition-all duration-base md:hidden dark:bg-card/95 dark:border-white/10 dark:shadow-black/20 ${
                    isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
                }`}
            >
                {visibleSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const label = mergedLabels[section.labelKey];

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={(e) => handleClick(e, section)}
                            aria-label={label}
                            aria-current={isActive ? 'true' : undefined}
                            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-fast ${
                                isActive
                                    ? 'bg-primary/20 text-primary scale-emphasis'
                                    : 'text-muted-foreground active:bg-primary/10 hover:scale-medium'
                            }`}
                        >
                            <Icon size={16} />
                        </button>
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
                className="flex flex-col gap-2 rounded-full border border-border bg-card/80 p-2 shadow-lg backdrop-blur-sm dark:bg-card/95 dark:border-white/10 dark:shadow-black/20"
            >
                {visibleSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const label = mergedLabels[section.labelKey];

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={(e) => handleClick(e, section)}
                            aria-label={label}
                            aria-current={isActive ? 'true' : undefined}
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
                        </button>
                    );
                })}
            </nav>

            {/* Utilities */}
            <div className="flex flex-col gap-2 rounded-full border border-border bg-card/80 p-2 shadow-lg backdrop-blur-sm dark:bg-card/95 dark:border-white/10 dark:shadow-black/20">
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

                <a
                    href={`/${currentLocale}/goodies`}
                    aria-label={mergedUtilityLabels.goodies}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary"
                >
                    <Gift size={20} />
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-fast group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.goodies}
                    </span>
                </a>

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

            {/* TOC Button (when available) OR Scroll to Top - with smooth fade, slide, and height animation */}
            <div
                className={`flex flex-col items-center justify-center overflow-hidden rounded-full border bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-base ease-out dark:bg-card/95 dark:shadow-black/20 ${
                    showScrollToTop
                        ? 'h-14 w-14 p-2 opacity-100 border-border dark:border-white/10'
                        : 'h-0 w-14 p-0 opacity-0 border-transparent pointer-events-none'
                }`}
            >
                {hasToc ? (
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
