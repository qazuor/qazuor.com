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

    // Refs
    timelineRef: React.RefObject<HTMLDivElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    touchStartX: React.RefObject<number>;
    touchEndX: React.RefObject<number>;

    // Constants
    TIMELINE_SPACING: number;
    POPOVER_WIDTH: number;

    // Handlers
    handleItemClick: (item: TimelineItem, index: number) => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;
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
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>('center');
    const [isMobile, setIsMobile] = useState(false);

    // Refs
    const timelineRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

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
     * Scroll to specific timeline item
     */
    const scrollToItem = useCallback(
        (index: number) => {
            const container = document.getElementById('timeline-scroll-container');
            if (!container) return;

            const itemWidth = TIMELINE_SPACING;
            const containerWidth = container.clientWidth;
            // Timeline has px-16 padding (64px on each side)
            const timelinePadding = 64;

            // Calculate the center position of the item
            // Item center = padding + (index * itemWidth) + (itemWidth / 2)
            const itemCenter = timelinePadding + index * itemWidth + itemWidth / 2;

            // Scroll position to center the item in the viewport
            const scrollPosition = itemCenter - containerWidth / 2;

            // Ensure we don't scroll beyond the boundaries
            const totalWidth = timelinePadding * 2 + totalItems * itemWidth;
            const maxScroll = Math.max(0, totalWidth - containerWidth);
            const clampedScrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));

            container.scrollTo({
                left: clampedScrollPosition,
                behavior: 'smooth'
            });
        },
        [TIMELINE_SPACING, totalItems]
    );

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

    // Initialize with first item
    useEffect(() => {
        if (mainTimelineItems.length > 0) {
            setSelectedItem(mainTimelineItems[0]);
            setCurrentIndex(0);
            setPopoverPosition(calculatePopoverPosition(0));
            setTimeout(() => scrollToItem(0), 300);
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
                setTimeout(() => scrollToItem(nextIndex), 100);
                return nextIndex;
            });
        }, AUTO_PLAY_INTERVAL_MS) as unknown as number;

        return () => {
            clearInterval(interval);
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
     * Handle touch start (mobile swipe)
     */
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    }, []);

    /**
     * Handle touch move (mobile swipe)
     */
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    }, []);

    /**
     * Handle touch end (mobile swipe)
     */
    const handleTouchEnd = useCallback(() => {
        const swipeDistance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            setIsAutoPlaying(false);
            if (swipeDistance > 0) {
                // Swipe left - next item
                goToNext();
            } else {
                // Swipe right - previous item
                goToPrev();
            }
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [goToNext, goToPrev]);

    return {
        // State
        selectedItem,
        currentIndex,
        isAutoPlaying,
        popoverPosition,
        isMobile,
        totalItems,

        // Refs
        timelineRef,
        containerRef,
        touchStartX,
        touchEndX,

        // Constants
        TIMELINE_SPACING,
        POPOVER_WIDTH,

        // Handlers
        handleItemClick,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        goToNext,
        goToPrev,
        goToIndex,
        toggleAutoPlay
    };
}
