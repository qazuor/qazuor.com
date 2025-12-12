import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Timeline item interface
 */
export interface TimelineItem {
    id: number;
    year: string;
    title: string;
    subtitle: string;
    content: string;
    color: string;
    colorHex: string;
    icon: string;
    iconUseItemColor: boolean;
}

/**
 * Popover position type
 */
export type PopoverPosition = 'center' | 'left' | 'right';

/**
 * Configuration constants
 */
const TIMELINE_SPACING_DESKTOP = 120;
const TIMELINE_SPACING_MOBILE = 100;
const POPOVER_WIDTH_DESKTOP = 500;
const POPOVER_WIDTH_MOBILE = 280;
const AUTO_PLAY_INTERVAL_MS = 4000;
const SNAP_DELAY_MS = 500;
const DESKTOP_PADDING = 64;

/**
 * Hook parameters
 */
interface UseTimelineAnimationParams {
    /**
     * Array of timeline items to display
     */
    items: TimelineItem[];
}

/**
 * Hook return type
 */
interface UseTimelineAnimationReturn {
    // State
    selectedItem: TimelineItem | null;
    currentIndex: number;
    isAutoPlaying: boolean;
    popoverPosition: PopoverPosition;
    isMobile: boolean;
    totalItems: number;
    isUserScrolling: boolean;

    // Refs
    timelineRef: React.RefObject<HTMLDivElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;

    // Constants
    TIMELINE_SPACING: number;
    POPOVER_WIDTH: number;
    DESKTOP_PADDING: number;

    // Handlers
    handleItemClick: (item: TimelineItem, index: number) => void;
    goToNext: () => void;
    goToPrev: () => void;
    goToIndex: (index: number) => void;
    toggleAutoPlay: () => void;
}

/**
 * Custom hook for timeline animation and navigation logic
 *
 * @description Manages timeline navigation, touch gestures, keyboard navigation, and auto-play
 * @param params - Hook configuration parameters
 * @returns Timeline state and handlers
 *
 * @example
 * ```tsx
 * const timeline = useTimelineAnimation({ items: timelineData });
 *
 * return (
 *   <div ref={timeline.timelineRef}>
 *     {timeline.selectedItem && (
 *       <TimelineCard item={timeline.selectedItem} />
 *     )}
 *   </div>
 * );
 * ```
 */
export function useTimelineAnimation({ items }: UseTimelineAnimationParams): UseTimelineAnimationReturn {
    // State
    const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>('center');
    const [isMobile, setIsMobile] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    // Refs
    const timelineRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoplayScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isScrollingRef = useRef(false);
    // Track programmatic scroll with a timestamp to handle overlapping scrolls
    const programmaticScrollUntilRef = useRef<number>(0);

    // Responsive values
    const TIMELINE_SPACING = isMobile ? TIMELINE_SPACING_MOBILE : TIMELINE_SPACING_DESKTOP;
    const POPOVER_WIDTH = isMobile ? POPOVER_WIDTH_MOBILE : POPOVER_WIDTH_DESKTOP;

    // Memoized items
    const mainTimelineItems = useMemo(() => items, [items]);
    const totalItems = mainTimelineItems.length;

    /**
     * Calculate popover position based on item index
     */
    const calculatePopoverPosition = useCallback(
        (index: number): PopoverPosition => {
            // Always center on mobile
            if (isMobile) return 'center';

            if (index < 2) return 'left';
            if (index > totalItems - 4) return 'right';
            return 'center';
        },
        [isMobile, totalItems]
    );

    /**
     * Get the horizontal padding for the timeline
     * Mobile: 50vw - half item width so items can center
     * Desktop: Fixed padding from constant
     */
    const getTimelinePadding = useCallback(() => {
        if (isMobile) {
            if (!scrollContainerRef.current) return 32;
            // Use half the viewport width so first/last items can center
            return scrollContainerRef.current.clientWidth / 2 - TIMELINE_SPACING / 2;
        }
        // Desktop uses fixed padding
        return DESKTOP_PADDING;
    }, [isMobile, TIMELINE_SPACING]);

    /**
     * Scroll to specific timeline item
     */
    const scrollToItem = useCallback(
        (index: number, smooth = true) => {
            const container = scrollContainerRef.current;
            if (!container) return;

            // Mark as programmatic scroll - use timestamp to ignore scroll events
            // until well after the smooth animation completes (smooth scroll can take 300-800ms)
            const scrollDuration = smooth ? 1000 : 100;
            programmaticScrollUntilRef.current = Date.now() + scrollDuration;

            const itemWidth = TIMELINE_SPACING;
            const containerWidth = container.clientWidth;
            const timelinePadding = getTimelinePadding();

            // Calculate the center position of the item relative to timeline start
            const itemCenter = timelinePadding + index * itemWidth + itemWidth / 2;

            // Scroll position to center the item in the viewport
            const scrollPosition = itemCenter - containerWidth / 2;

            // For mobile with dynamic padding, we can scroll to any position
            // For desktop, clamp to prevent empty space
            if (isMobile) {
                container.scrollTo({
                    left: Math.max(0, scrollPosition),
                    behavior: smooth ? 'smooth' : 'instant'
                });
            } else {
                // Desktop: calculate max scroll based on content width
                const totalContentWidth = timelinePadding * 2 + totalItems * itemWidth;
                const maxScroll = Math.max(0, totalContentWidth - containerWidth);
                const clampedScrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));

                container.scrollTo({
                    left: clampedScrollPosition,
                    behavior: smooth ? 'smooth' : 'instant'
                });
            }
        },
        [TIMELINE_SPACING, totalItems, getTimelinePadding, isMobile]
    );

    /**
     * Find the closest item to the center of the viewport
     */
    const findClosestItemToCenter = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return 0;

        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const timelinePadding = getTimelinePadding();

        // Center of viewport in scroll coordinates
        const viewportCenter = scrollLeft + containerWidth / 2;

        // Find which item is closest to center
        let closestIndex = 0;
        let closestDistance = Infinity;

        for (let i = 0; i < totalItems; i++) {
            const itemCenter = timelinePadding + i * TIMELINE_SPACING + TIMELINE_SPACING / 2;
            const distance = Math.abs(itemCenter - viewportCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        }

        return closestIndex;
    }, [totalItems, TIMELINE_SPACING, getTimelinePadding]);

    /**
     * Navigate to specific item
     */
    const navigateToItem = useCallback(
        (index: number) => {
            if (index < 0 || index >= totalItems) return;
            setCurrentIndex(index);
            setSelectedItem(mainTimelineItems[index]);
            setPopoverPosition(calculatePopoverPosition(index));
            scrollToItem(index);
        },
        [mainTimelineItems, totalItems, calculatePopoverPosition, scrollToItem]
    );

    /**
     * Go to next item
     */
    const goToNext = useCallback(() => {
        const nextIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        navigateToItem(nextIndex);
    }, [currentIndex, totalItems, navigateToItem]);

    /**
     * Go to previous item
     */
    const goToPrev = useCallback(() => {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        navigateToItem(prevIndex);
    }, [currentIndex, totalItems, navigateToItem]);

    /**
     * Go to specific index
     */
    const goToIndex = useCallback(
        (index: number) => {
            setIsAutoPlaying(false);
            navigateToItem(index);
        },
        [navigateToItem]
    );

    /**
     * Toggle auto-play
     */
    const toggleAutoPlay = useCallback(() => {
        setIsAutoPlaying((prev) => !prev);
    }, []);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Start autoplay when timeline enters viewport (only first time)
    useEffect(() => {
        const container = containerRef.current;
        if (!container || hasBeenVisible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && !hasBeenVisible) {
                    setHasBeenVisible(true);
                    setIsAutoPlaying(true);
                }
            },
            {
                threshold: 0.3, // Trigger when 30% visible
                rootMargin: '0px'
            }
        );

        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, [hasBeenVisible]);

    // Initialize with first item
    useEffect(() => {
        if (mainTimelineItems.length > 0) {
            setSelectedItem(mainTimelineItems[0]);
            setCurrentIndex(0);
            setPopoverPosition(calculatePopoverPosition(0));
            const timer = setTimeout(() => scrollToItem(0), 300);
            return () => clearTimeout(timer);
        }
    }, [mainTimelineItems, calculatePopoverPosition, scrollToItem]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle if timeline container is focused or contains focus
            if (
                !containerRef.current?.contains(document.activeElement) &&
                document.activeElement !== containerRef.current
            )
                return;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    setIsAutoPlaying(false);
                    goToNext();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    setIsAutoPlaying(false);
                    goToPrev();
                    break;
                case 'Home':
                    e.preventDefault();
                    setIsAutoPlaying(false);
                    navigateToItem(0);
                    break;
                case 'End':
                    e.preventDefault();
                    setIsAutoPlaying(false);
                    navigateToItem(totalItems - 1);
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAutoPlay();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev, navigateToItem, totalItems, toggleAutoPlay]);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying || mainTimelineItems.length === 0) return;

        const interval: number = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % mainTimelineItems.length;
                setSelectedItem(mainTimelineItems[nextIndex]);
                setPopoverPosition(calculatePopoverPosition(nextIndex));
                // Clear previous scroll timeout before setting new one
                if (autoplayScrollTimeoutRef.current) {
                    clearTimeout(autoplayScrollTimeoutRef.current);
                }
                autoplayScrollTimeoutRef.current = setTimeout(() => scrollToItem(nextIndex), 100);
                return nextIndex;
            });
        }, AUTO_PLAY_INTERVAL_MS) as unknown as number;

        return () => {
            clearInterval(interval);
            // Clean up any pending scroll timeout
            if (autoplayScrollTimeoutRef.current) {
                clearTimeout(autoplayScrollTimeoutRef.current);
            }
        };
    }, [isAutoPlaying, mainTimelineItems, calculatePopoverPosition, scrollToItem]);

    /**
     * Handle click on timeline item
     */
    const handleItemClick = useCallback(
        (_item: TimelineItem, index: number) => {
            setIsAutoPlaying(false);
            navigateToItem(index);
        },
        [navigateToItem]
    );

    /**
     * Snap to nearest item after scroll stops
     */
    const snapToNearestItem = useCallback(() => {
        if (isScrollingRef.current) return;

        const closestIndex = findClosestItemToCenter();
        setIsUserScrolling(false);

        // Update state without triggering smooth scroll if already close
        setCurrentIndex(closestIndex);
        setSelectedItem(mainTimelineItems[closestIndex]);
        setPopoverPosition(calculatePopoverPosition(closestIndex));

        // Smooth scroll to exactly center the item
        scrollToItem(closestIndex, true);
    }, [findClosestItemToCenter, mainTimelineItems, calculatePopoverPosition, scrollToItem]);

    /**
     * Handle scroll events - detect user scrolling and schedule snap
     * Ignores programmatic scrolls to prevent autoplay interruption
     */
    const handleScroll = useCallback(() => {
        // Ignore programmatic scrolls (from autoplay or navigation)
        // Check if we're still within the programmatic scroll window
        if (Date.now() < programmaticScrollUntilRef.current) {
            return;
        }

        // Mark as user scrolling
        if (!isScrollingRef.current) {
            isScrollingRef.current = true;
            setIsUserScrolling(true);
            setIsAutoPlaying(false);
        }

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Schedule snap after scroll stops
        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
            snapToNearestItem();
        }, SNAP_DELAY_MS);
    }, [snapToNearestItem]);

    // Attach scroll listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !isMobile) return;

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [handleScroll, isMobile]);

    return {
        // State
        selectedItem,
        currentIndex,
        isAutoPlaying,
        popoverPosition,
        isMobile,
        totalItems,
        isUserScrolling,

        // Refs
        timelineRef,
        containerRef,
        scrollContainerRef,

        // Constants
        TIMELINE_SPACING,
        POPOVER_WIDTH,
        DESKTOP_PADDING,

        // Handlers
        handleItemClick,
        goToNext,
        goToPrev,
        goToIndex,
        toggleAutoPlay
    };
}
