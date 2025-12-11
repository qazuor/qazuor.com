import { navigate } from 'astro:transitions/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp } from '@/components/animate-ui/icons/arrow-up';
import { BadgeCheck } from '@/components/animate-ui/icons/badge-check';
import { Blocks } from '@/components/animate-ui/icons/blocks';
// Import animate-ui icons
import { HouseWifi } from '@/components/animate-ui/icons/house-wifi';
import { List } from '@/components/animate-ui/icons/list';
import { MessageSquareQuote } from '@/components/animate-ui/icons/message-square-quote';
import { Moon } from '@/components/animate-ui/icons/moon';
import { PhoneCall } from '@/components/animate-ui/icons/phone-call';
import { Sparkles } from '@/components/animate-ui/icons/sparkles';
import { Star } from '@/components/animate-ui/icons/star';
import { SunMedium } from '@/components/animate-ui/icons/sun-medium';
import { Terminal } from '@/components/animate-ui/icons/terminal';
import { ThumbsUp } from '@/components/animate-ui/icons/thumbs-up';
import { UserRound } from '@/components/animate-ui/icons/user-round';
import { scrollTo } from '@/lib/lenis';
import { MobileUtilitiesPopover } from './MobileUtilitiesPopover';

type LabelKey = 'hero' | 'about' | 'skills' | 'projects' | 'services' | 'blog' | 'testimonials' | 'faqs' | 'contact';

// Hover/tap animation props
type IconBehaviorProps = {
    loop?: boolean;
    loopDelay?: number;
    animateOnTap?: boolean;
};

interface NavSection {
    id: string;
    hash: string; // Hash for home page (e.g., '#about')
    pageUrl?: string; // Optional page URL for non-home navigation (e.g., '/projects')
    icon: React.ComponentType<IconBehaviorProps & { size?: number; animateOnHover?: boolean; animate?: boolean }>;
    labelKey: LabelKey;
    iconProps?: IconBehaviorProps; // Optional animation behavior props for the icon
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

// Animation delay increment for sequential animations (ms)
const ANIMATION_DELAY_INCREMENT = 100;

// Base icon animation props for hover/tap behavior (no animateOnView - handled manually)
const createHoverTapProps = () => ({
    // Hover/tap animation: loop with 300ms between cycles
    animateOnTap: true as const,
    loop: true as const,
    loopDelay: 100
});

// Hook to trigger sequential entry animations once when nav enters viewport
function useSequentialEntryAnimation(totalIcons: number, delayIncrement: number = ANIMATION_DELAY_INCREMENT) {
    const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set());
    const hasAnimated = useRef(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const navElement = navRef.current;
        if (!navElement || hasAnimated.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    // Trigger sequential animations
                    for (let i = 0; i < totalIcons; i++) {
                        setTimeout(() => {
                            setAnimatingIndices((prev) => new Set(prev).add(i));

                            // Clear the animation trigger after animation completes (~500ms)
                            setTimeout(() => {
                                setAnimatingIndices((prev) => {
                                    const next = new Set(prev);
                                    next.delete(i);
                                    return next;
                                });
                            }, 500);
                        }, i * delayIncrement);
                    }

                    // Disconnect observer after triggering
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(navElement);

        return () => observer.disconnect();
    }, [totalIcons, delayIncrement]);

    return { navRef, animatingIndices };
}

// Shared hover/tap props for all icons
const hoverTapProps = createHoverTapProps();

const NAV_SECTIONS: NavSection[] = [
    { id: 'hero', hash: '#hero', icon: HouseWifi, labelKey: 'hero', iconProps: hoverTapProps },
    { id: 'about', hash: '#about', icon: UserRound, labelKey: 'about', iconProps: hoverTapProps },
    { id: 'skills', hash: '#skills', icon: Star, labelKey: 'skills', iconProps: hoverTapProps },
    {
        id: 'projects',
        hash: '#projects',
        pageUrl: '/projects',
        icon: Blocks,
        labelKey: 'projects',
        iconProps: hoverTapProps
    },
    {
        id: 'services-preview',
        hash: '#services-preview',
        pageUrl: '/services',
        icon: BadgeCheck,
        labelKey: 'services',
        iconProps: hoverTapProps
    },
    {
        id: 'blog',
        hash: '#blog',
        pageUrl: '/blog',
        icon: MessageSquareQuote,
        labelKey: 'blog',
        iconProps: hoverTapProps
    },
    { id: 'testimonials', hash: '#testimonials', icon: ThumbsUp, labelKey: 'testimonials', iconProps: hoverTapProps },
    { id: 'faqs', hash: '#faqs', icon: List, labelKey: 'faqs', iconProps: hoverTapProps },
    { id: 'contact', hash: '#contact', icon: PhoneCall, labelKey: 'contact', iconProps: hoverTapProps }
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
    };
}

function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        for (const id of sectionIds) {
            const element = document.getElementById(id);
            if (!element) continue;

            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    }
                },
                {
                    rootMargin: '-20% 0px -60% 0px',
                    threshold: 0
                }
            );

            observer.observe(element);
            observers.push(observer);
        }

        return () => {
            for (const observer of observers) {
                observer.disconnect();
            }
        };
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

function useScrollVisibility(threshold = 300) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > threshold);
        };

        // Check initial state
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isVisible;
}

const defaultUtilityLabels = {
    goodies: 'Goodies',
    command: 'Command',
    theme: 'Theme',
    language: 'Language',
    scrollToTop: 'Scroll to top'
};

export function FloatingNav({
    labels = {},
    currentLocale = 'en',
    utilityLabels = defaultUtilityLabels
}: FloatingNavProps) {
    const mergedLabels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels]);
    const mergedUtilityLabels = useMemo(() => ({ ...defaultUtilityLabels, ...utilityLabels }), [utilityLabels]);
    const sectionIds = useMemo(() => NAV_SECTIONS.map((s) => s.id), []);
    const activeSection = useActiveSection(sectionIds);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isScrolled = useScrollVisibility(100);
    const [isDark, setIsDark] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [isHomePage, setIsHomePage] = useState(true);

    // Total icons: nav icons (9) + utility icons (4: theme, goodies, command, scroll-to-top)
    const totalIcons = NAV_SECTIONS.length + 4;
    const { navRef: desktopNavRef, animatingIndices: desktopAnimating } = useSequentialEntryAnimation(totalIcons);
    const { navRef: mobileNavRef, animatingIndices: mobileAnimating } = useSequentialEntryAnimation(totalIcons);

    // Track active section changes to trigger animation
    const [activeSectionAnimating, setActiveSectionAnimating] = useState<string | null>(null);
    const prevActiveSection = useRef<string | null>(null);

    useEffect(() => {
        // When active section changes, animate the new active icon once
        if (activeSection && activeSection !== prevActiveSection.current) {
            setActiveSectionAnimating(activeSection);

            // Clear animation after it completes (~500ms)
            const timer = setTimeout(() => {
                setActiveSectionAnimating(null);
            }, 500);

            // Update URL hash when scrolling (only on home page)
            const path = window.location.pathname;
            const onHomePage = /^\/(es|en)?\/?$/.test(path);
            if (onHomePage && window.history?.replaceState) {
                const section = NAV_SECTIONS.find((s) => s.id === activeSection);
                if (section) {
                    const newUrl = `${window.location.pathname}${section.hash}`;
                    window.history.replaceState(null, '', newUrl);
                }
            }

            prevActiveSection.current = activeSection;
            return () => clearTimeout(timer);
        }
    }, [activeSection]);

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

    // Filter sections: hide home icon when on home page
    const visibleSections = useMemo(() => {
        return isHomePage ? NAV_SECTIONS.filter((s) => s.id !== 'hero') : NAV_SECTIONS;
    }, [isHomePage]);

    // Track scroll position for scroll-to-top visibility (all pages)
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.pageYOffset > 300);
        };
        handleScroll(); // Check initial state
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initialize theme state from document
    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        updateTheme();

        // Listen for theme changes
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

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

    const toggleTheme = useCallback(() => {
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
        setIsDark(!isDark);
    }, [isDark]);

    const openCommandPalette = useCallback(() => {
        window.dispatchEvent(new CustomEvent('openCommandPalette'));
    }, []);

    const handleScrollToTop = useCallback(() => {
        scrollTo(0, { duration: 1.2 });
    }, []);

    const switchLanguage = useCallback(() => {
        const newLocale = currentLocale === 'es' ? 'en' : 'es';
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const newPath = currentPath.replace(new RegExp(`^/${currentLocale}`), `/${newLocale}`);
        // Use View Transitions for language switch
        navigate(`${newPath || `/${newLocale}`}${currentHash}`);
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

            // Check if we're on the home page
            const path = window.location.pathname;
            const isHomePage = path === '/' || path === '/en' || path === '/es' || path === '/en/' || path === '/es/';

            if (isHomePage) {
                // On home page - always smooth scroll to section
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Execute smooth scroll FIRST, then update URL when complete
                    smoothScrollTo(offsetPosition, 800, () => {
                        // Update URL without triggering scroll (after animation completes)
                        if (window.history?.replaceState) {
                            const newUrl = `${window.location.pathname}${section.hash}`;
                            window.history.replaceState(null, '', newUrl);
                        }
                    });
                }
            } else {
                // Not on home page
                if (section.pageUrl) {
                    // Has dedicated page - navigate to it
                    navigate(`/${currentLocale}${section.pageUrl}`);
                } else {
                    // No dedicated page - navigate to home with hash
                    navigate(`/${currentLocale}/${section.hash}`);
                }
            }
        },
        [currentLocale, smoothScrollTo]
    );

    if (isMobile) {
        return (
            <nav
                ref={mobileNavRef as React.RefObject<HTMLElement>}
                aria-label="Quick navigation"
                className={`fixed bottom-4 left-1/2 z-[400] flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 md:hidden dark:bg-card/95 dark:border-white/10 dark:shadow-black/20 ${
                    isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
                }`}
            >
                {visibleSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const label = mergedLabels[section.labelKey];
                    // Get the original index in NAV_SECTIONS for animation timing
                    const originalIndex = NAV_SECTIONS.findIndex((s) => s.id === section.id);
                    // Animate on entry OR when section becomes active
                    const shouldAnimate = mobileAnimating.has(originalIndex) || activeSectionAnimating === section.id;

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={(e) => handleClick(e, section)}
                            aria-label={label}
                            aria-current={isActive ? 'true' : undefined}
                            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                                isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground active:bg-primary/10'
                            }`}
                        >
                            <Icon size={16} animateOnHover animate={shouldAnimate} {...section.iconProps} />
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

    // Calculate utility icon indices (after nav icons)
    const themeIconIndex = NAV_SECTIONS.length;
    const goodiesIconIndex = NAV_SECTIONS.length + 1;
    const commandIconIndex = NAV_SECTIONS.length + 2;
    const scrollTopIconIndex = NAV_SECTIONS.length + 3;

    return (
        <div
            ref={desktopNavRef as React.RefObject<HTMLDivElement>}
            className="fixed right-4 top-1/2 z-[400] hidden -translate-y-1/2 flex-col gap-3 md:flex"
        >
            {/* Main Navigation */}
            <nav
                aria-label="Quick navigation"
                className="flex flex-col gap-2 rounded-full border border-border bg-card/80 p-2 shadow-lg backdrop-blur-sm dark:bg-card/95 dark:border-white/10 dark:shadow-black/20"
            >
                {visibleSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const label = mergedLabels[section.labelKey];
                    // Get the original index in NAV_SECTIONS for animation timing
                    const originalIndex = NAV_SECTIONS.findIndex((s) => s.id === section.id);
                    // Animate on entry OR when section becomes active
                    const shouldAnimate = desktopAnimating.has(originalIndex) || activeSectionAnimating === section.id;

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={(e) => handleClick(e, section)}
                            aria-label={label}
                            aria-current={isActive ? 'true' : undefined}
                            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'bg-primary/20 text-primary ring-2 ring-primary/50'
                                    : 'text-muted-foreground hover:scale-110 hover:bg-primary/10 hover:text-primary'
                            }`}
                        >
                            <Icon size={20} animateOnHover animate={shouldAnimate} {...section.iconProps} />
                            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
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
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                >
                    {isDark ? (
                        <SunMedium
                            size={20}
                            animateOnHover
                            animate={desktopAnimating.has(themeIconIndex)}
                            {...hoverTapProps}
                        />
                    ) : (
                        <Moon
                            size={20}
                            animateOnHover
                            animate={desktopAnimating.has(themeIconIndex)}
                            {...hoverTapProps}
                        />
                    )}
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.theme}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={switchLanguage}
                    aria-label={mergedUtilityLabels.language}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                >
                    <span className="text-lg">{currentLocale === 'es' ? '🇪🇸' : '🇺🇸'}</span>
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.language}
                    </span>
                </button>

                <a
                    href={`/${currentLocale}/goodies`}
                    aria-label={mergedUtilityLabels.goodies}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                >
                    <Sparkles
                        size={20}
                        animateOnHover
                        animate={desktopAnimating.has(goodiesIconIndex)}
                        {...hoverTapProps}
                    />
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.goodies}
                    </span>
                </a>

                <button
                    type="button"
                    onClick={openCommandPalette}
                    aria-label={mergedUtilityLabels.command}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                >
                    <Terminal
                        size={20}
                        animateOnHover
                        animate={desktopAnimating.has(commandIconIndex)}
                        {...hoverTapProps}
                    />
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.command}
                    </span>
                </button>
            </div>

            {/* Scroll to Top - with smooth fade, slide, and height animation */}
            <div
                className={`flex flex-col items-center justify-center overflow-hidden rounded-full border bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out dark:bg-card/95 dark:shadow-black/20 ${
                    showScrollToTop
                        ? 'h-14 w-14 p-2 opacity-100 border-border dark:border-white/10'
                        : 'h-0 w-14 p-0 opacity-0 border-transparent pointer-events-none'
                }`}
            >
                <button
                    type="button"
                    onClick={handleScrollToTop}
                    aria-label={mergedUtilityLabels.scrollToTop}
                    tabIndex={showScrollToTop ? 0 : -1}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                >
                    <ArrowUp
                        size={20}
                        animateOnHover
                        animate={desktopAnimating.has(scrollTopIconIndex)}
                        {...hoverTapProps}
                    />
                    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium opacity-0 shadow-md ring-1 ring-border transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                        {mergedUtilityLabels.scrollToTop}
                    </span>
                </button>
            </div>
        </div>
    );
}
