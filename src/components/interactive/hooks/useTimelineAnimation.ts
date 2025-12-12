import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';

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
 * Timeline navigation state (managed by reducer)
 */
interface TimelineNavState {
    currentIndex: number;
    selectedItem: TimelineItem | null;
    isAutoPlaying: boolean;
}

/**
 * Timeline navigation actions
 */
type TimelineNavAction =
    | { type: 'NAVIGATE_TO'; index: number; item: TimelineItem }
    | { type: 'NAVIGATE_TO_STOP_AUTOPLAY'; index: number; item: TimelineItem }
    | { type: 'TOGGLE_AUTOPLAY' }
    | { type: 'SET_AUTOPLAY'; value: boolean }
    | { type: 'INIT'; item: TimelineItem };

/**
 * Initial state for navigation reducer
 */
const initialNavState: TimelineNavState = {
    currentIndex: 0,
    selectedItem: null,
    isAutoPlaying: false
};

/**
 * Reducer for timeline navigation state
 */
function timelineNavReducer(state: TimelineNavState, action: TimelineNavAction): TimelineNavState {
    switch (action.type) {
        case 'NAVIGATE_TO':
            return {
                ...state,
                currentIndex: action.index,
                selectedItem: action.item
            };
        case 'NAVIGATE_TO_STOP_AUTOPLAY':
            return {
                ...state,
                currentIndex: action.index,
                selectedItem: action.item,
                isAutoPlaying: false
            };
        case 'TOGGLE_AUTOPLAY':
            return {
                ...state,
                isAutoPlaying: !state.isAutoPlaying
            };
        case 'SET_AUTOPLAY':
            return {
                ...state,
                isAutoPlaying: action.value
            };
        case 'INIT':
            return {
                ...state,
                currentIndex: 0,
                selectedItem: action.item
            };
        default:
            return state;
    }
}

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
const CONTAINER_MAX_WIDTH = 1152; // max-w-6xl in pixels

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
    CONTAINER_MAX_WIDTH: number;

    // Computed
    getContainerWidth: () => number;

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
    // Navigation state (consolidated via reducer)
    const [navState, dispatch] = useReducer(timelineNavReducer, initialNavState);
    const { currentIndex, selectedItem, isAutoPlaying } = navState;

    // Independent state (not part of navigation flow)
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
    // Keep current index in ref for interval callbacks (avoids stale closure)
    const currentIndexRef = useRef(currentIndex);
    currentIndexRef.current = currentIndex;

    // Responsive values
    const TIMELINE_SPACING = isMobile ? TIMELINE_SPACING_MOBILE : TIMELINE_SPACING_DESKTOP;
    const POPOVER_WIDTH = isMobile ? POPOVER_WIDTH_MOBILE : POPOVER_WIDTH_DESKTOP;

    // Memoized items
    const mainTimelineItems = useMemo(() => items, [items]);
    const totalItems = mainTimelineItems.length;

    /**
     * Get the container width (constrained to max-width or viewport on mobile)
     */
    const getContainerWidth = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            return container.clientWidth;
        }
        // Fallback: use max-width on desktop, viewport on mobile
        if (typeof window !== 'undefined') {
            return isMobile ? window.innerWidth : Math.min(window.innerWidth, CONTAINER_MAX_WIDTH);
        }
        return CONTAINER_MAX_WIDTH;
    }, [isMobile]);

    /**
     * Get the horizontal padding for the timeline
     * Uses container width so items can center within the constrained area
     */
    const getTimelinePadding = useCallback(() => {
        const containerWidth = getContainerWidth();
        return containerWidth / 2 - TIMELINE_SPACING / 2;
    }, [TIMELINE_SPACING, getContainerWidth]);

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
            const timelinePadding = getTimelinePadding();
            const containerWidth = getContainerWidth();
            const containerHalfWidth = containerWidth / 2;

            // Calculate the center position of the item relative to timeline start
            const itemCenter = timelinePadding + index * itemWidth + itemWidth / 2;

            // Scroll position to center the item in the container
            const scrollPosition = itemCenter - containerHalfWidth;

            // Scroll within the constrained container
            container.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: smooth ? 'smooth' : 'instant'
            });
        },
        [TIMELINE_SPACING, getTimelinePadding, getContainerWidth]
    );

    /**
     * Find the closest item to the center of the container
     */
    const findClosestItemToCenter = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return 0;

        const scrollLeft = container.scrollLeft;
        const timelinePadding = getTimelinePadding();
        const containerWidth = getContainerWidth();
        const containerHalfWidth = containerWidth / 2;

        // Center of container in scroll coordinates
        const containerCenter = scrollLeft + containerHalfWidth;

        // Find which item is closest to center
        let closestIndex = 0;
        let closestDistance = Infinity;

        for (let i = 0; i < totalItems; i++) {
            const itemCenter = timelinePadding + i * TIMELINE_SPACING + TIMELINE_SPACING / 2;
            const distance = Math.abs(itemCenter - containerCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        }

        return closestIndex;
    }, [totalItems, TIMELINE_SPACING, getTimelinePadding, getContainerWidth]);

    /**
     * Navigate to specific item
     */
    const navigateToItem = useCallback(
        (index: number) => {
            if (index < 0 || index >= totalItems) return;
            dispatch({
                type: 'NAVIGATE_TO',
                index,
                item: mainTimelineItems[index]
            });
            scrollToItem(index);
        },
        [mainTimelineItems, totalItems, scrollToItem]
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
     * Go to specific index (also stops autoplay)
     */
    const goToIndex = useCallback(
        (index: number) => {
            if (index < 0 || index >= totalItems) return;
            dispatch({
                type: 'NAVIGATE_TO_STOP_AUTOPLAY',
                index,
                item: mainTimelineItems[index]
            });
            scrollToItem(index);
        },
        [mainTimelineItems, totalItems, scrollToItem]
    );

    /**
     * Toggle auto-play
     */
    const toggleAutoPlay = useCallback(() => {
        dispatch({ type: 'TOGGLE_AUTOPLAY' });
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
                    dispatch({ type: 'SET_AUTOPLAY', value: true });
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
            dispatch({
                type: 'INIT',
                item: mainTimelineItems[0]
            });
            const timer = setTimeout(() => scrollToItem(0), 300);
            return () => clearTimeout(timer);
        }
    }, [mainTimelineItems, scrollToItem]);

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
                    dispatch({ type: 'SET_AUTOPLAY', value: false });
                    goToNext();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    dispatch({ type: 'SET_AUTOPLAY', value: false });
                    goToPrev();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToIndex(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToIndex(totalItems - 1);
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAutoPlay();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev, goToIndex, totalItems, toggleAutoPlay]);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying || mainTimelineItems.length === 0) return;

        const interval: number = setInterval(() => {
            const nextIndex = (currentIndexRef.current + 1) % mainTimelineItems.length;
            dispatch({
                type: 'NAVIGATE_TO',
                index: nextIndex,
                item: mainTimelineItems[nextIndex]
            });
            // Clear previous scroll timeout before setting new one
            if (autoplayScrollTimeoutRef.current) {
                clearTimeout(autoplayScrollTimeoutRef.current);
            }
            autoplayScrollTimeoutRef.current = setTimeout(() => scrollToItem(nextIndex), 100);
        }, AUTO_PLAY_INTERVAL_MS) as unknown as number;

        return () => {
            clearInterval(interval);
            // Clean up any pending scroll timeout
            if (autoplayScrollTimeoutRef.current) {
                clearTimeout(autoplayScrollTimeoutRef.current);
            }
        };
    }, [isAutoPlaying, mainTimelineItems, scrollToItem]);

    /**
     * Handle click on timeline item
     */
    const handleItemClick = useCallback(
        (_item: TimelineItem, index: number) => {
            goToIndex(index);
        },
        [goToIndex]
    );

    /**
     * Snap to nearest item after scroll stops
     */
    const snapToNearestItem = useCallback(() => {
        if (isScrollingRef.current) return;

        const closestIndex = findClosestItemToCenter();
        setIsUserScrolling(false);

        // Update state without triggering smooth scroll if already close
        dispatch({
            type: 'NAVIGATE_TO',
            index: closestIndex,
            item: mainTimelineItems[closestIndex]
        });

        // Smooth scroll to exactly center the item
        scrollToItem(closestIndex, true);
    }, [findClosestItemToCenter, mainTimelineItems, scrollToItem]);

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
            dispatch({ type: 'SET_AUTOPLAY', value: false });
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
        CONTAINER_MAX_WIDTH,

        // Computed
        getContainerWidth,

        // Handlers
        handleItemClick,
        goToNext,
        goToPrev,
        goToIndex,
        toggleAutoPlay
    };
}
