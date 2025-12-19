import { ArrowUp, List } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ScrollToTopProps {
    ariaLabel?: string;
    /** When true, shows TOC button instead of scroll-to-top */
    hasToc?: boolean;
    /** Aria label for TOC button */
    tocAriaLabel?: string;
}

// Nav widths measured with DevTools
const NAV_WIDTH_HOME = 383; // 8 icons (no hero)
const NAV_WIDTH_OTHER = 423; // 9 icons
const BUTTON_SIZE = 54;
const GAP = 8;

export function ScrollToTop({
    ariaLabel = 'Scroll to top',
    hasToc = false,
    tocAriaLabel = 'Table of contents'
}: ScrollToTopProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const [canFitOnSide, setCanFitOnSide] = useState(false);

    // Check if we're on the home page (affects alignment since home has fewer nav icons)
    useEffect(() => {
        const checkHomePage = () => {
            const path = window.location.pathname;
            setIsHomePage(/^\/(es|en)?\/?$/.test(path));
        };
        checkHomePage();
        window.addEventListener('popstate', checkHomePage);
        return () => window.removeEventListener('popstate', checkHomePage);
    }, []);

    // Check mobile viewport using matchMedia (avoids forced reflow from window.innerWidth)
    useEffect(() => {
        const mobileQuery = window.matchMedia('(max-width: 767px)');
        setIsMobile(mobileQuery.matches);

        const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mobileQuery.addEventListener('change', handleMobileChange);
        return () => mobileQuery.removeEventListener('change', handleMobileChange);
    }, []);

    // Check if button can fit on side using matchMedia (avoids forced reflow)
    // Breakpoint: navWidth + 2 * (BUTTON_SIZE + GAP) = navWidth + 124
    useEffect(() => {
        const navWidth = isHomePage ? NAV_WIDTH_HOME : NAV_WIDTH_OTHER;
        const breakpoint = navWidth + 2 * (BUTTON_SIZE + GAP);
        const fitQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
        setCanFitOnSide(fitQuery.matches);

        const handleFitChange = (e: MediaQueryListEvent) => setCanFitOnSide(e.matches);
        fitQuery.addEventListener('change', handleFitChange);
        return () => fitQuery.removeEventListener('change', handleFitChange);
    }, [isHomePage]);

    // Listen for scroll to toggle visibility
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Listen for popover open/close events
    useEffect(() => {
        const handlePopoverChange = (e: CustomEvent<{ isOpen: boolean }>) => {
            setIsPopoverOpen(e.detail.isOpen);
        };

        window.addEventListener('mobilePopoverChange', handlePopoverChange as EventListener);
        return () => window.removeEventListener('mobilePopoverChange', handlePopoverChange as EventListener);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const openTocDrawer = useCallback(() => {
        window.dispatchEvent(new CustomEvent('openTocDrawer'));
    }, []);

    // Don't render on desktop (FloatingNav has scroll-to-top)
    if (!isMobile) {
        return null;
    }

    // Calculate position based on whether button fits on side or needs to go above
    const navHalfWidth = isHomePage ? NAV_WIDTH_HOME / 2 : NAV_WIDTH_OTHER / 2;

    let positionStyle: React.CSSProperties;

    if (canFitOnSide) {
        // Button fits on the RIGHT SIDE of the nav
        // Position: to the right of nav's right edge + gap, same bottom as nav
        positionStyle = {
            bottom: '1rem', // 16px, same as nav
            right: `calc(50% - ${navHalfWidth}px - ${BUTTON_SIZE}px - ${GAP}px)`
        };
    } else {
        // Button goes ABOVE the nav (aligned with right edge)
        positionStyle = {
            bottom: isPopoverOpen ? 'calc(4.75rem + 180px)' : '4.75rem',
            right: `calc(50% - ${navHalfWidth}px)`
        };
    }

    return (
        <>
            {isVisible && (
                <button
                    type="button"
                    onClick={hasToc ? openTocDrawer : scrollToTop}
                    data-scroll-to-top="true"
                    style={positionStyle}
                    className="fixed z-[401] flex h-[54px] w-[54px] items-center justify-center rounded-full border border-border bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-base hover:scale-emphasis hover:bg-primary/10 hover:text-primary active:scale-95 text-muted-foreground dark:bg-card/95 dark:border-white/10 dark:shadow-black/20"
                    aria-label={hasToc ? tocAriaLabel : ariaLabel}
                >
                    {hasToc ? (
                        <List size={20} className="transition-transform group-hover:scale-emphasis" />
                    ) : (
                        <ArrowUp size={20} className="transition-transform group-hover:scale-emphasis" />
                    )}
                </button>
            )}
        </>
    );
}
