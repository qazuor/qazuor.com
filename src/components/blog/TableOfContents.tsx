import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { scrollTo as lenisScrollTo, startLenis, stopLenis } from '@/lib/lenis';

export interface TocHeading {
    depth: number;
    slug: string;
    text: string;
}

interface GroupedHeading {
    heading: TocHeading;
    children: TocHeading[];
}

interface TableOfContentsProps {
    headings: TocHeading[];
    title?: string;
}

/**
 * Table of Contents component with scroll spy and collapsible sections
 * - Desktop: Fixed sidebar with collapsible heading groups
 * - Mobile: Drawer opened via FloatingNav button (listens to 'openTocDrawer' event)
 */
export function TableOfContents({ headings, title = 'On this page' }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isStuck, setIsStuck] = useState(false);
    const [isHiddenByFooter, setIsHiddenByFooter] = useState(false);
    const [stickyLeft, setStickyLeft] = useState<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const asideRef = useRef<HTMLElement | null>(null);
    const initialTopRef = useRef<number | null>(null);

    // Headings to exclude from TOC
    const excludedHeadings = [
        'referencias',
        'references',
        'foot notes',
        'footnotes',
        'notas al pie',
        'further reading',
        'lecturas adicionales',
        'related articles',
        'artículos relacionados'
    ];

    // Filter to only h2 and h3 headings, excluding certain sections
    const tocHeadings = headings.filter((h) => {
        if (h.depth < 2 || h.depth > 3) return false;
        const lowerText = h.text.toLowerCase();
        return !excludedHeadings.some((excluded) => lowerText.includes(excluded));
    });

    // Group h3 headings under their parent h2
    const groupedHeadings = useMemo(() => {
        const groups: GroupedHeading[] = [];
        let currentGroup: GroupedHeading | null = null;

        for (const heading of tocHeadings) {
            if (heading.depth === 2) {
                currentGroup = { heading, children: [] };
                groups.push(currentGroup);
            } else if (heading.depth === 3 && currentGroup) {
                currentGroup.children.push(heading);
            }
        }

        return groups;
    }, [tocHeadings]);

    // Find which h2 group is currently active (either the h2 itself or one of its children)
    const activeGroupSlug = useMemo(() => {
        for (const group of groupedHeadings) {
            if (group.heading.slug === activeId) {
                return group.heading.slug;
            }
            for (const child of group.children) {
                if (child.slug === activeId) {
                    return group.heading.slug;
                }
            }
        }
        return groupedHeadings[0]?.heading.slug || '';
    }, [activeId, groupedHeadings]);

    // Setup Intersection Observer for scroll spy
    useEffect(() => {
        if (tocHeadings.length === 0) return;

        const handleIntersection: IntersectionObserverCallback = (entries) => {
            // Find the first visible heading
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                    break;
                }
            }
        };

        // Calculate root margin based on header height
        const navHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;
        const rootMargin = `-${navHeight + 32}px 0% -70%`;

        observerRef.current = new IntersectionObserver(handleIntersection, {
            rootMargin,
            threshold: 0
        });

        // Observe all heading elements
        tocHeadings.forEach((heading) => {
            const element = document.getElementById(heading.slug);
            if (element) {
                observerRef.current?.observe(element);
            }
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [tocHeadings]);

    // Handle click on TOC item
    // MF-008: Use Lenis scrollTo to avoid conflict with smooth scroll
    const handleClick = useCallback((slug: string) => {
        setActiveId(slug);
        setIsDrawerOpen(false);

        // Smooth scroll to the heading using Lenis
        const element = document.getElementById(slug);
        if (element) {
            const navHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;
            lenisScrollTo(element, {
                offset: -(navHeight + 24),
                duration: 0.8
            });
        }
    }, []);

    // Close drawer on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isDrawerOpen) {
                setIsDrawerOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isDrawerOpen]);

    // Prevent body scroll when drawer is open (including Lenis smooth scroll)
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
            stopLenis();
        } else {
            document.body.style.overflow = '';
            startLenis();
        }
        return () => {
            document.body.style.overflow = '';
            startLenis();
        };
    }, [isDrawerOpen]);

    // Listen for openTocDrawer event from FloatingNav
    useEffect(() => {
        const handleOpenTocDrawer = () => {
            setIsDrawerOpen(true);
        };

        window.addEventListener('openTocDrawer', handleOpenTocDrawer);
        return () => window.removeEventListener('openTocDrawer', handleOpenTocDrawer);
    }, []);

    // Track sticky state based on scroll position
    useEffect(() => {
        const HEADER_HEIGHT = 80; // Height of the header

        const updateStickyState = () => {
            if (!asideRef.current) return;

            // On first run, capture the initial position
            if (initialTopRef.current === null) {
                const rect = asideRef.current.getBoundingClientRect();
                initialTopRef.current = rect.top + window.scrollY;
                // Save left position for when it becomes sticky
                setStickyLeft(rect.left);
            }

            // Check if we've scrolled past the point where TOC should stick
            const scrollY = window.scrollY;
            const shouldStick = scrollY > initialTopRef.current - HEADER_HEIGHT;

            // Check if footer is visible - hide TOC when in footer zone
            const mainFooter = document.querySelectorAll('footer')[1]; // Main site footer
            const tocHeight = asideRef.current.offsetHeight;
            let shouldHide = false;

            if (mainFooter) {
                const footerTop = mainFooter.getBoundingClientRect().top;
                const tocBottom = HEADER_HEIGHT + tocHeight;
                // Hide TOC when footer is close to TOC bottom (within 50px)
                shouldHide = footerTop < tocBottom + 50;
            }

            if (shouldStick !== isStuck) {
                setIsStuck(shouldStick);
            }
            if (shouldHide !== isHiddenByFooter) {
                setIsHiddenByFooter(shouldHide);
            }
        };

        // Initial check
        updateStickyState();

        window.addEventListener('scroll', updateStickyState, { passive: true });

        const handleResize = () => {
            initialTopRef.current = null; // Reset on resize
            setStickyLeft(null);
            updateStickyState();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', updateStickyState);
            window.removeEventListener('resize', handleResize);
        };
    }, [isStuck, isHiddenByFooter]);

    if (tocHeadings.length === 0) {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar - Starts with content, becomes fixed when scrolled */}
            <aside
                ref={asideRef}
                className={`
                    toc-sidebar hidden xl:block max-h-[calc(100vh-5rem)] overflow-y-auto z-30
                    transition-opacity duration-base ease-in-out
                    ${isStuck ? 'fixed top-20 w-64' : ''}
                    ${isHiddenByFooter ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
                style={isStuck && stickyLeft !== null ? { left: `${stickyLeft}px` } : undefined}
            >
                <nav aria-label={title}>
                    <h2 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{title}</h2>
                    <ul className="space-y-1 border-l-2 border-foreground/10">
                        {groupedHeadings.map((group) => {
                            const isGroupActive = activeGroupSlug === group.heading.slug;
                            const isHeadingActive = activeId === group.heading.slug;

                            return (
                                <li key={group.heading.slug}>
                                    {/* Parent h2 heading */}
                                    <button
                                        type="button"
                                        onClick={() => handleClick(group.heading.slug)}
                                        className={`
                                            block w-full text-left text-xs py-1 pl-3 transition-all duration-fast
                                            border-l-2 -ml-[2px] hover:text-primary
                                            ${
                                                isHeadingActive
                                                    ? 'text-primary border-primary font-medium'
                                                    : isGroupActive
                                                      ? 'text-foreground border-primary/50 font-medium'
                                                      : 'text-foreground-secondary border-transparent hover:border-foreground/30'
                                            }
                                        `}
                                        aria-current={isHeadingActive ? 'true' : undefined}
                                        aria-expanded={isGroupActive && group.children.length > 0}
                                    >
                                        {group.heading.text}
                                    </button>

                                    {/* Child h3 headings - collapsible */}
                                    {group.children.length > 0 && (
                                        <ul
                                            className={`
                                                overflow-hidden transition-all duration-base ease-in-out
                                                ${isGroupActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                            `}
                                        >
                                            {group.children.map((child) => (
                                                <li key={child.slug}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleClick(child.slug)}
                                                        className={`
                                                            block w-full text-left text-xs py-1 pl-5 transition-all duration-fast
                                                            border-l-2 -ml-[2px] hover:text-primary
                                                            ${
                                                                activeId === child.slug
                                                                    ? 'text-primary border-primary font-medium'
                                                                    : 'text-foreground-secondary border-transparent hover:border-foreground/30'
                                                            }
                                                        `}
                                                        aria-current={activeId === child.slug ? 'true' : undefined}
                                                    >
                                                        {child.text}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Mobile Drawer Overlay */}
            {isDrawerOpen && (
                <button
                    type="button"
                    className="xl:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm cursor-default"
                    style={{ touchAction: 'none' }}
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Close table of contents"
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`
                    xl:hidden fixed bottom-0 left-0 right-0 z-50
                    bg-card rounded-t-3xl shadow-2xl
                    transform transition-transform duration-base ease-out
                    max-h-[70vh] overflow-hidden
                    ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}
                `}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                {/* Drawer Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-foreground/20 rounded-full" />
                </div>

                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 pb-4 border-b border-foreground/10">
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
                        aria-label="Close"
                    >
                        <svg
                            className="w-5 h-5 text-foreground-secondary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Drawer Content - Shows all headings (mobile has more space) */}
                <nav
                    className="overflow-y-auto px-6 py-4 max-h-[calc(70vh-80px)]"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain',
                        touchAction: 'pan-y'
                    }}
                >
                    <ul className="space-y-1">
                        {groupedHeadings.map((group) => {
                            const isGroupActive = activeGroupSlug === group.heading.slug;
                            const isHeadingActive = activeId === group.heading.slug;

                            return (
                                <li key={group.heading.slug}>
                                    <button
                                        type="button"
                                        onClick={() => handleClick(group.heading.slug)}
                                        className={`
                                            block w-full text-left py-3 px-4 rounded-lg
                                            transition-all duration-fast
                                            ${
                                                isHeadingActive
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'text-foreground-secondary hover:bg-foreground/5 hover:text-foreground'
                                            }
                                        `}
                                        aria-current={isHeadingActive ? 'true' : undefined}
                                    >
                                        {group.heading.text}
                                    </button>

                                    {/* Child h3 headings - collapsible in mobile too */}
                                    {group.children.length > 0 && (
                                        <ul
                                            className={`
                                                overflow-hidden transition-all duration-base ease-in-out
                                                ${isGroupActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                            `}
                                        >
                                            {group.children.map((child) => (
                                                <li key={child.slug}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleClick(child.slug)}
                                                        className={`
                                                            block w-full text-left py-2 px-4 ml-4 rounded-lg
                                                            transition-all duration-fast text-sm
                                                            ${
                                                                activeId === child.slug
                                                                    ? 'bg-primary/10 text-primary font-medium'
                                                                    : 'text-foreground-secondary hover:bg-foreground/5 hover:text-foreground'
                                                            }
                                                        `}
                                                        aria-current={activeId === child.slug ? 'true' : undefined}
                                                    >
                                                        {child.text}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
}
