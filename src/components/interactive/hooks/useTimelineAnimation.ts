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
}

/**
 * Popover position type
 */
export type PopoverPosition = 'center' | 'left' | 'right';

/**
 * Configuration constants
 */
const TIMELINE_SPACING_DESKTOP = 150;
const TIMELINE_SPACING_MOBILE = 100;
const POPOVER_WIDTH_DESKTOP = 500;
const POPOVER_WIDTH_MOBILE = 280;
const HOVER_DEBOUNCE_MS = 100;

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
    isTimelineHovered: boolean;
    isScrolling: boolean;
    isMobile: boolean;

    // Refs
    timelineRef: React.RefObject<HTMLDivElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    touchStartX: React.RefObject<number>;
    touchEndX: React.RefObject<number>;

    // Constants
    TIMELINE_SPACING: number;
    POPOVER_WIDTH: number;

    // Handlers
    handleMouseOver: (item: TimelineItem, index: number) => void;
    handleTimelineMouseEnter: () => void;
    handleTimelineMouseLeave: () => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;
}

/**
 * Custom hook for timeline animation and navigation logic
 *
 * @description Manages timeline navigation, scroll behavior, touch gestures, and auto-play
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
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>('center');
    const [isTimelineHovered, setIsTimelineHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Refs
    const timelineRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<number | null>(null);
    const hoverTimeoutRef = useRef<number | null>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    // Responsive values
    const TIMELINE_SPACING = isMobile ? TIMELINE_SPACING_MOBILE : TIMELINE_SPACING_DESKTOP;
    const POPOVER_WIDTH = isMobile ? POPOVER_WIDTH_MOBILE : POPOVER_WIDTH_DESKTOP;

    // Memoized items
    const mainTimelineItems = useMemo(() => items, [items]);

    /**
     * Calculate popover position based on item index
     */
    const calculatePopoverPosition = useCallback(
        (index: number): PopoverPosition => {
            // Always center on mobile
            if (isMobile) return 'center';

            const totalItems = mainTimelineItems.length;
            if (index < 2) return 'left';
            if (index > totalItems - 4) return 'right';
            return 'center';
        },
        [isMobile, mainTimelineItems.length]
    );

    /**
     * Scroll to specific timeline item
     */
    const scrollToItem = useCallback(
        (index: number) => {
            const container = document.getElementById('timeline-scroll-container');
            if (!container) return;

            const itemWidth = TIMELINE_SPACING;
            const containerWidth = container.clientWidth;
            const totalWidth = mainTimelineItems.length * itemWidth;

            const itemPosition = index * itemWidth;
            let scrollPosition = itemPosition - containerWidth / 2 + itemWidth / 2;

            const popoverPosition = calculatePopoverPosition(index);
            let maxScroll = totalWidth - containerWidth;

            if (popoverPosition === 'right') {
                scrollPosition += POPOVER_WIDTH / 2;
                maxScroll += POPOVER_WIDTH / 2;
            }

            // Ensure we don't scroll beyond the boundaries
            const clampedScrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));

            container.scrollTo({
                left: clampedScrollPosition,
                behavior: 'smooth'
            });
        },
        [TIMELINE_SPACING, POPOVER_WIDTH, mainTimelineItems.length, calculatePopoverPosition]
    );

    /**
     * Navigate to specific item
     */
    const navigateToItem = useCallback(
        (index: number) => {
            setCurrentIndex(index);
            setSelectedItem(mainTimelineItems[index]);
            setPopoverPosition(calculatePopoverPosition(index));
            scrollToItem(index);
        },
        [mainTimelineItems, calculatePopoverPosition, scrollToItem]
    );

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize with first item
    useEffect(() => {
        if (mainTimelineItems.length > 0) {
            setSelectedItem(mainTimelineItems[0]);
            setCurrentIndex(0);
            setPopoverPosition(calculatePopoverPosition(0));
            setTimeout(() => scrollToItem(0), 300);
        }
    }, [mainTimelineItems, calculatePopoverPosition, scrollToItem]);

    // Wheel navigation (desktop only)
    useEffect(() => {
        // Skip wheel navigation on mobile - use touch instead
        if (isMobile) return;

        const handleWheel = (e: WheelEvent) => {
            if (isTimelineHovered) {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    const scrollDown = e.deltaY > 0;
                    const newIndex = scrollDown
                        ? Math.min(currentIndex + 1, mainTimelineItems.length - 1)
                        : Math.max(currentIndex - 1, 0);

                    // Check if we can move to a new item
                    const canMoveToNewItem = newIndex !== currentIndex;

                    // Check if we're at boundaries and trying to scroll beyond
                    const atFirstAndScrollingUp = currentIndex === 0 && !scrollDown;
                    const atLastAndScrollingDown = currentIndex === mainTimelineItems.length - 1 && scrollDown;

                    // Only prevent scroll if we can move to a new item
                    // Allow page scroll when at boundaries
                    if (canMoveToNewItem) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Set scrolling state to disable other functionalities
                        setIsScrolling(true);

                        if (scrollTimeoutRef.current) {
                            clearTimeout(scrollTimeoutRef.current);
                        }

                        // Set timeout to re-enable functionalities after scrolling stops
                        scrollTimeoutRef.current = setTimeout(() => {
                            setIsScrolling(false);
                        }, 500) as unknown as number;

                        navigateToItem(newIndex);

                        return false;
                    }
                    if (atFirstAndScrollingUp || atLastAndScrollingDown) {
                        // At boundaries - allow page scroll to continue naturally
                        return true;
                    }
                    // Same item but not at boundaries - block scroll
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        };

        // Only disable page overflow if we're NOT at boundaries
        const atBoundary = currentIndex === 0 || currentIndex === mainTimelineItems.length - 1;

        if (isTimelineHovered) {
            document.addEventListener('wheel', handleWheel, { passive: false, capture: true });

            // Only block page scroll if not at boundaries
            if (!atBoundary) {
                document.documentElement.style.overflowY = 'hidden';
                document.body.style.overflowY = 'hidden';
            }

            return () => {
                document.removeEventListener('wheel', handleWheel, { capture: true });

                // Re-enable page scroll
                document.documentElement.style.overflowY = 'auto';
                document.body.style.overflowY = 'auto';

                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, [isTimelineHovered, currentIndex, mainTimelineItems.length, isMobile, navigateToItem]);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying || mainTimelineItems.length === 0 || isScrolling) return;

        const interval: number = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % mainTimelineItems.length;
                setSelectedItem(mainTimelineItems[nextIndex]);
                setPopoverPosition(calculatePopoverPosition(nextIndex));
                setTimeout(() => scrollToItem(nextIndex), 100);
                return nextIndex;
            });
        }, 3000) as unknown as number;

        return () => {
            clearInterval(interval);
        };
    }, [isAutoPlaying, mainTimelineItems, isScrolling, calculatePopoverPosition, scrollToItem]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    /**
     * Handle mouse over timeline item with debounce
     */
    const handleMouseOver = useCallback(
        (_item: TimelineItem, index: number) => {
            if (isScrolling) return;

            // Clear any pending hover timeout
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }

            // Debounce the navigation to prevent accidental switches
            hoverTimeoutRef.current = setTimeout(() => {
                setIsAutoPlaying(false);
                navigateToItem(index);
            }, HOVER_DEBOUNCE_MS) as unknown as number;
        },
        [isScrolling, navigateToItem]
    );

    /**
     * Handle timeline hover enter
     */
    const handleTimelineMouseEnter = useCallback(() => {
        setIsTimelineHovered(true);
    }, []);

    /**
     * Handle timeline hover leave
     */
    const handleTimelineMouseLeave = useCallback(() => {
        setIsTimelineHovered(false);
        setIsAutoPlaying(true);

        // Reset scrolling state when leaving timeline
        setIsScrolling(false);
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Cancel any pending hover navigation
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        document.documentElement.style.overflowY = 'auto';
        document.body.style.overflowY = 'auto';
    }, []);

    /**
     * Handle touch start (mobile swipe)
     */
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (!isMobile) return;
            touchStartX.current = e.targetTouches[0].clientX;
        },
        [isMobile]
    );

    /**
     * Handle touch move (mobile swipe)
     */
    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (!isMobile) return;
            touchEndX.current = e.targetTouches[0].clientX;
        },
        [isMobile]
    );

    /**
     * Handle touch end (mobile swipe)
     */
    const handleTouchEnd = useCallback(() => {
        if (!isMobile) return;

        const swipeDistance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe left - next item
                const nextIndex = Math.min(currentIndex + 1, mainTimelineItems.length - 1);
                if (nextIndex !== currentIndex) {
                    navigateToItem(nextIndex);
                    setIsAutoPlaying(false);
                }
            } else {
                // Swipe right - previous item
                const prevIndex = Math.max(currentIndex - 1, 0);
                if (prevIndex !== currentIndex) {
                    navigateToItem(prevIndex);
                    setIsAutoPlaying(false);
                }
            }
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [isMobile, currentIndex, mainTimelineItems.length, navigateToItem]);

    return {
        // State
        selectedItem,
        currentIndex,
        isAutoPlaying,
        popoverPosition,
        isTimelineHovered,
        isScrolling,
        isMobile,

        // Refs
        timelineRef,
        containerRef,
        touchStartX,
        touchEndX,

        // Constants
        TIMELINE_SPACING,
        POPOVER_WIDTH,

        // Handlers
        handleMouseOver,
        handleTimelineMouseEnter,
        handleTimelineMouseLeave,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
}
