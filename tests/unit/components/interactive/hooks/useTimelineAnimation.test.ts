import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type TimelineItem, useTimelineAnimation } from '@/components/interactive/hooks/useTimelineAnimation';

describe('useTimelineAnimation', () => {
    const mockItems: TimelineItem[] = [
        {
            id: 1,
            year: '2020',
            title: 'First Event',
            subtitle: 'Category 1',
            content: 'Description of first event',
            color: 'from-blue-500 to-blue-600',
            colorHex: '#3b82f6',
            icon: 'briefcase',
            iconUseItemColor: true
        },
        {
            id: 2,
            year: '2021',
            title: 'Second Event',
            subtitle: 'Category 2',
            content: 'Description of second event',
            color: 'from-green-500 to-green-600',
            colorHex: '#22c55e',
            icon: 'code',
            iconUseItemColor: false
        },
        {
            id: 3,
            year: '2022',
            title: 'Third Event',
            subtitle: 'Category 3',
            content: 'Description of third event',
            color: 'from-purple-500 to-purple-600',
            colorHex: '#a855f7',
            icon: 'rocket',
            iconUseItemColor: true
        }
    ];

    let _observerCallback: IntersectionObserverCallback | null = null;
    let observeTargets: Element[] = [];
    let originalIntersectionObserver: typeof IntersectionObserver;

    beforeEach(() => {
        // Store original
        originalIntersectionObserver = window.IntersectionObserver;

        // Mock IntersectionObserver as a class
        observeTargets = [];

        class MockIntersectionObserver {
            constructor(callback: IntersectionObserverCallback) {
                _observerCallback = callback;
            }
            observe(target: Element) {
                observeTargets.push(target);
            }
            unobserve = vi.fn();
            disconnect = vi.fn();
            root = null;
            rootMargin = '';
            thresholds = [];
            takeRecords = vi.fn().mockReturnValue([]);
        }

        window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

        // Mock window.innerWidth for desktop by default
        Object.defineProperty(window, 'innerWidth', {
            value: 1024,
            writable: true,
            configurable: true
        });

        // Mock timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
        vi.clearAllMocks();
        vi.useRealTimers();
        _observerCallback = null;
        observeTargets = [];
    });

    describe('initialization', () => {
        it('should initialize with first item selected', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            // Wait for initialization
            act(() => {
                vi.advanceTimersByTime(400);
            });

            expect(result.current.currentIndex).toBe(0);
            expect(result.current.selectedItem?.id).toBe(1);
        });

        it('should return total items count', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.totalItems).toBe(3);
        });

        it('should not be auto-playing by default', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.isAutoPlaying).toBe(false);
        });

        it('should detect desktop mode on large screens', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1024 });

            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.isMobile).toBe(false);
        });

        it('should detect mobile mode on small screens', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600 });

            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                window.dispatchEvent(new Event('resize'));
            });

            expect(result.current.isMobile).toBe(true);
        });
    });

    describe('responsive values', () => {
        it('should use desktop spacing on large screens', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1024 });

            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.TIMELINE_SPACING).toBe(120); // Desktop spacing
            expect(result.current.POPOVER_WIDTH).toBe(500); // Desktop popover width
        });

        it('should use mobile spacing on small screens', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600 });

            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                window.dispatchEvent(new Event('resize'));
            });

            expect(result.current.TIMELINE_SPACING).toBe(100); // Mobile spacing
            expect(result.current.POPOVER_WIDTH).toBe(280); // Mobile popover width
        });
    });

    describe('navigation', () => {
        it('should go to next item', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            act(() => {
                result.current.goToNext();
            });

            expect(result.current.currentIndex).toBe(1);
            expect(result.current.selectedItem?.id).toBe(2);
        });

        it('should wrap to first item when going next from last', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            // Go to last item
            act(() => {
                result.current.goToIndex(2);
            });

            expect(result.current.currentIndex).toBe(2);

            // Go next should wrap to first
            act(() => {
                result.current.goToNext();
            });

            expect(result.current.currentIndex).toBe(0);
        });

        it('should go to previous item', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            // Go to second item first
            act(() => {
                result.current.goToIndex(1);
            });

            act(() => {
                result.current.goToPrev();
            });

            expect(result.current.currentIndex).toBe(0);
        });

        it('should wrap to last item when going previous from first', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            expect(result.current.currentIndex).toBe(0);

            // Go previous should wrap to last
            act(() => {
                result.current.goToPrev();
            });

            expect(result.current.currentIndex).toBe(2);
        });

        it('should go to specific index', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            act(() => {
                result.current.goToIndex(2);
            });

            expect(result.current.currentIndex).toBe(2);
            expect(result.current.selectedItem?.id).toBe(3);
        });

        it('should ignore invalid index (negative)', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            act(() => {
                result.current.goToIndex(-1);
            });

            expect(result.current.currentIndex).toBe(0);
        });

        it('should ignore invalid index (too large)', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            act(() => {
                result.current.goToIndex(10);
            });

            expect(result.current.currentIndex).toBe(0);
        });

        it('should stop autoplay when going to index manually', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            // Start autoplay
            act(() => {
                result.current.toggleAutoPlay();
            });

            expect(result.current.isAutoPlaying).toBe(true);

            // Manual navigation should stop autoplay
            act(() => {
                result.current.goToIndex(2);
            });

            expect(result.current.isAutoPlaying).toBe(false);
        });
    });

    describe('item click handler', () => {
        it('should navigate to clicked item', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            act(() => {
                result.current.handleItemClick(mockItems[1], 1);
            });

            expect(result.current.currentIndex).toBe(1);
        });
    });

    describe('autoplay', () => {
        it('should toggle autoplay', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.isAutoPlaying).toBe(false);

            act(() => {
                result.current.toggleAutoPlay();
            });

            expect(result.current.isAutoPlaying).toBe(true);

            act(() => {
                result.current.toggleAutoPlay();
            });

            expect(result.current.isAutoPlaying).toBe(false);
        });

        it('should auto-advance when autoplay is enabled', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            // Start autoplay
            act(() => {
                result.current.toggleAutoPlay();
            });

            expect(result.current.currentIndex).toBe(0);

            // Advance by autoplay interval (4000ms)
            act(() => {
                vi.advanceTimersByTime(4100);
            });

            expect(result.current.currentIndex).toBe(1);

            // Advance again
            act(() => {
                vi.advanceTimersByTime(4100);
            });

            expect(result.current.currentIndex).toBe(2);
        });

        it('should wrap around during autoplay', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                vi.advanceTimersByTime(400);
            });

            // Go to last item
            act(() => {
                result.current.goToIndex(2);
            });

            // Start autoplay (reset since goToIndex stops it)
            act(() => {
                result.current.toggleAutoPlay();
            });

            // Advance by autoplay interval
            act(() => {
                vi.advanceTimersByTime(4100);
            });

            expect(result.current.currentIndex).toBe(0); // Wrapped to first
        });
    });

    describe('autoplay state', () => {
        it('should allow setting autoplay programmatically via toggleAutoPlay', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.isAutoPlaying).toBe(false);

            // Manually toggle autoplay
            act(() => {
                result.current.toggleAutoPlay();
            });

            expect(result.current.isAutoPlaying).toBe(true);
        });
    });

    describe('refs', () => {
        it('should provide timeline ref', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.timelineRef).toBeDefined();
            expect(result.current.timelineRef.current).toBeNull(); // Not attached yet
        });

        it('should provide container ref', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.containerRef).toBeDefined();
        });

        it('should provide scroll container ref', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.scrollContainerRef).toBeDefined();
        });
    });

    describe('constants', () => {
        it('should expose DESKTOP_PADDING constant', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.DESKTOP_PADDING).toBe(64);
        });

        it('should expose CONTAINER_MAX_WIDTH constant', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.CONTAINER_MAX_WIDTH).toBe(1152);
        });
    });

    describe('getContainerWidth', () => {
        it('should return container max width on desktop', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1400 });

            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            // Without ref attached, falls back to max width
            expect(result.current.getContainerWidth()).toBe(1152);
        });

        it('should return viewport width on mobile', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600 });

            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            act(() => {
                window.dispatchEvent(new Event('resize'));
            });

            expect(result.current.getContainerWidth()).toBe(600);
        });
    });

    describe('user scrolling state', () => {
        it('should initialize with isUserScrolling as false', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: mockItems }));

            expect(result.current.isUserScrolling).toBe(false);
        });
    });

    describe('cleanup', () => {
        it('should remove resize listener on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

            const { unmount } = renderHook(() => useTimelineAnimation({ items: mockItems }));
            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

            removeEventListenerSpy.mockRestore();
        });

        it('should remove keydown listener on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

            const { unmount } = renderHook(() => useTimelineAnimation({ items: mockItems }));
            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

            removeEventListenerSpy.mockRestore();
        });
    });

    describe('empty items', () => {
        it('should handle empty items array', () => {
            const { result } = renderHook(() => useTimelineAnimation({ items: [] }));

            expect(result.current.totalItems).toBe(0);
            expect(result.current.selectedItem).toBeNull();
        });
    });
});
