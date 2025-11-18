import { useEffect, useMemo, useRef, useState } from 'react';
import { TimelineIcon } from '@/components/ui';

const TIMELINE_SPACING = 120;

interface TimelineItem {
    id: number;
    year: string;
    title: string;
    subtitle: string;
    content: string;
    color: string;
    colorHex: string;
    icon: string;
}

interface TimelineDesktopProps {
    lang: 'en' | 'es';
    timelineItems: TimelineItem[];
}

export default function TimelineDesktop({ timelineItems }: TimelineDesktopProps) {
    // Use all timeline items directly since we removed the intro and end items
    const mainTimelineItems = useMemo(() => timelineItems, [timelineItems]);

    const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [popoverPosition, setPopoverPosition] = useState<'center' | 'left' | 'right'>('center');
    const timelineRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTimelineHovered, setIsTimelineHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<number | null>(null);

    const calculatePopoverPosition = (index: number): 'center' | 'left' | 'right' => {
        const totalItems = mainTimelineItems.length;
        if (index < 2) return 'left';
        if (index > totalItems - 4) return 'right';
        return 'center';
    };

    const scrollToItem = (index: number) => {
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
            const popoverWidth = 500;
            scrollPosition += popoverWidth / 2;
            maxScroll += popoverWidth / 2;
        }

        // ensure we don't scroll beyond the boundaries
        const clampedScrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));

        container.scrollTo({
            left: clampedScrollPosition,
            behavior: 'smooth'
        });
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: Functions are stable and adding them as dependencies would cause infinite re-renders
    useEffect(() => {
        if (mainTimelineItems.length > 0) {
            setSelectedItem(mainTimelineItems[0]);
            setCurrentIndex(0);
            setPopoverPosition(calculatePopoverPosition(0));
            setTimeout(() => scrollToItem(0), 300);
        }
    }, [mainTimelineItems]); // Re-run when timeline items change

    // Block page scroll when timeline is hovered
    // biome-ignore lint/correctness/useExhaustiveDependencies: Functions are stable and adding them as dependencies would cause infinite re-renders
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (isTimelineHovered) {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    const scrollDown = e.deltaY > 0;
                    const newIndex = scrollDown
                        ? Math.min(currentIndex + 1, mainTimelineItems.length - 1)
                        : Math.max(currentIndex - 1, 0);

                    // Check if we can move to a new item
                    const canMoveToNewItem = newIndex !== currentIndex;

                    // check if we're at boundaries and trying to scroll beyond
                    const atFirstAndScrollingUp = currentIndex === 0 && !scrollDown;
                    const atLastAndScrollingDown = currentIndex === mainTimelineItems.length - 1 && scrollDown;

                    // only prevent scroll if we can move to a new item
                    // allow page scroll when at boundaries
                    if (canMoveToNewItem) {
                        e.preventDefault();
                        e.stopPropagation();

                        // set scrolling state to disable other functionalities
                        setIsScrolling(true);

                        if (scrollTimeoutRef.current) {
                            clearTimeout(scrollTimeoutRef.current);
                        }

                        // set timeout to re-enable functionalities after scrolling stops
                        scrollTimeoutRef.current = setTimeout(() => {
                            setIsScrolling(false);
                        }, 500) as unknown as number;

                        setCurrentIndex(newIndex);
                        setSelectedItem(mainTimelineItems[newIndex]);
                        setPopoverPosition(calculatePopoverPosition(newIndex));
                        scrollToItem(newIndex);

                        return false;
                    } else if (atFirstAndScrollingUp || atLastAndScrollingDown) {
                        // at boundaries - allow page scroll to continue naturally
                        // don't prevent default, let the page scroll normally
                        return true;
                    } else {
                        // same item but not at boundaries - block scroll
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }
            }
        };

        // only disable page overflow if we're NOT at boundaries
        const atBoundary = currentIndex === 0 || currentIndex === mainTimelineItems.length - 1;

        if (isTimelineHovered) {
            document.addEventListener('wheel', handleWheel, { passive: false, capture: true });

            // only block page scroll if not at boundaries
            if (!atBoundary) {
                document.documentElement.style.overflowY = 'hidden';
                document.body.style.overflowY = 'hidden';
            }

            return () => {
                document.removeEventListener('wheel', handleWheel, { capture: true });

                // re-enable page scroll
                document.documentElement.style.overflowY = 'auto';
                document.body.style.overflowY = 'auto';

                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, [isTimelineHovered, currentIndex, mainTimelineItems]); // Removed function dependencies

    // biome-ignore lint/correctness/useExhaustiveDependencies: Functions are stable and adding them as dependencies would cause infinite re-renders
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
    }, [isAutoPlaying, mainTimelineItems, isScrolling]); // Removed function dependencies

    const handleMouseOver = (item: TimelineItem, index: number) => {
        if (isScrolling) return;

        setIsAutoPlaying(false);
        setSelectedItem(item);
        setCurrentIndex(index);
        setPopoverPosition(calculatePopoverPosition(index));
        scrollToItem(index);
    };

    const handleTimelineMouseEnter = () => {
        setIsTimelineHovered(true);
    };

    const handleTimelineMouseLeave = () => {
        setIsTimelineHovered(false);
        setIsAutoPlaying(true);

        // reset scrolling state when leaving timeline
        setIsScrolling(false);
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        document.documentElement.style.overflowY = 'auto';
        document.body.style.overflowY = 'auto';
    };

    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center">
            <div className="w-full mx-auto">
                {/* horizontal scroll container - grows with content */}
                <div
                    id="timeline-scroll-container"
                    className="overflow-x-auto overflow-y-visible"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'hsl(var(--primary)) hsl(var(--bg-tertiary))'
                    }}
                >
                    {/* timeline container - flexbox autocontained */}
                    {/* biome-ignore lint/a11y/useSemanticElements: role="group" is semantically correct for  timeline navigation */}
                    <div
                        ref={timelineRef}
                        className="relative mb-16 flex items-start px-16"
                        onMouseEnter={handleTimelineMouseEnter}
                        onMouseLeave={handleTimelineMouseLeave}
                        role="group"
                        aria-label="Timeline navigation"
                        style={{
                            width: `${mainTimelineItems.length * TIMELINE_SPACING}px`,
                            minWidth: '100%',
                            paddingBottom: '200px'
                        }}
                    >
                        {/* horizontal base line with gradients */}
                        <div
                            className="absolute h-1"
                            style={{
                                top: '62px', // exact position to connect with dividing lines
                                left: '-100px',
                                right: '-300px',
                                background: `linear-gradient(
                  to right, 
                  transparent,
                  hsl(var(--muted) / 0.1) 5%, 
                  hsl(var(--muted) / 1) 10%,
                  hsl(var(--muted) / 1) 90%,
                  hsl(var(--muted) / 0.1) 95%, 
                  transparent
                )`
                            }}
                        ></div>

                        {/* timeline items - each one self-contained */}
                        {mainTimelineItems.map((item, index) => (
                            // biome-ignore lint/a11y/useSemanticElements: Using div instead of button to maintain complex flex layout and custom styling
                            <div
                                key={item.id}
                                className="flex flex-col items-center relative group cursor-pointer"
                                onMouseOver={() => handleMouseOver(item, index)}
                                onFocus={() => handleMouseOver(item, index)}
                                // Accessibility: role="button" and tabIndex for keyboard navigation
                                // since this div acts as an interactive element that users can select
                                role="button"
                                tabIndex={0}
                                style={{
                                    width: `${TIMELINE_SPACING}px`,
                                    flexShrink: 0,
                                    minHeight: '120px' // fixed minimum height to avoid jumps
                                }}
                            >
                                {/* year */}
                                <div
                                    className={`text-sm mb-4 font-mono tracking-wider font-semibold transition-all duration-300 ${
                                        selectedItem?.id === item.id
                                            ? 'opacity-100 scale-110'
                                            : 'opacity-50 hover:opacity-90'
                                    }`}
                                    style={{
                                        color:
                                            selectedItem?.id === item.id ? item.colorHex : 'hsl(var(--text-secondary))'
                                    }}
                                >
                                    {item.year}
                                </div>

                                {/* main dividing line - exactly below the year */}
                                <div
                                    className="w-0.5 h-6 relative z-10 translate-y-1/2 transition-opacity duration-300"
                                    style={{
                                        backgroundColor: 'hsl(var(--muted))',
                                        opacity: selectedItem?.id === item.id ? '0' : '0.8'
                                    }}
                                ></div>

                                {/* extended vertical line from timeline mark - animated with absolute positioning */}
                                <div
                                    className={`absolute w-0.5 transition-all duration-300 ease-out z-10 ${
                                        selectedItem?.id === item.id ? 'h-20 opacity-100' : 'h-0 opacity-0'
                                    }`}
                                    style={{
                                        top: '45px', // positioned just below the main divider line
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background:
                                            selectedItem?.id === item.id
                                                ? `linear-gradient(to bottom, ${item.colorHex}, ${item.colorHex}10)`
                                                : 'transparent'
                                    }}
                                ></div>

                                {/* timeline point - moves down with gap after the line */}
                                <div
                                    className={`w-10 h-10 flex items-center justify-center relative z-10 transition-all duration-300 ease-out ${
                                        selectedItem?.id === item.id ? 'transform translate-y-16' : 'translate-y-2'
                                    }`}
                                >
                                    {/* icon from data with larger sizes and enhanced effects */}
                                    <div
                                        className={`transition-all duration-300 ${
                                            selectedItem?.id === item.id
                                                ? 'grayscale-0 transform scale-150 drop-shadow-2xl brightness-110'
                                                : 'grayscale opacity-60 hover:opacity-80 hover:scale-110'
                                        }`}
                                        style={{
                                            color:
                                                selectedItem?.id === item.id ? item.colorHex : 'hsl(var(--text-muted))'
                                        }}
                                    >
                                        <TimelineIcon
                                            iconName={item.icon}
                                            className={selectedItem?.id === item.id ? 'w-7 h-7' : 'w-5 h-5'}
                                        />
                                    </div>
                                </div>

                                {/* intermediate lines - only for elements that are not the last */}
                                {index < mainTimelineItems.length - 1 && (
                                    <div
                                        className="absolute h-px"
                                        style={{
                                            top: '62px',
                                            left: `${TIMELINE_SPACING / 2}px`,
                                            width: `${TIMELINE_SPACING / 2}px`,
                                            backgroundColor: 'hsl(var(--muted) / 0.4)'
                                        }}
                                    >
                                        {/* 4 intermediate lines evenly distributed */}
                                        <div
                                            className="absolute w-0.5 h-3 -translate-y-1/2"
                                            style={{
                                                left: `${TIMELINE_SPACING / 5}px`,
                                                backgroundColor: 'hsl(var(--muted) / 0.6)'
                                            }}
                                        ></div>
                                        <div
                                            className="absolute w-0.5 h-3 -translate-y-1/2"
                                            style={{
                                                left: `${(TIMELINE_SPACING / 5) * 2}px`,
                                                backgroundColor: 'hsl(var(--muted) / 0.6)'
                                            }}
                                        ></div>
                                        <div
                                            className="absolute w-0.5 h-3 -translate-y-1/2"
                                            style={{
                                                left: `${(TIMELINE_SPACING / 5) * 3}px`,
                                                backgroundColor: 'hsl(var(--muted) / 0.6)'
                                            }}
                                        ></div>
                                        <div
                                            className="absolute w-0.5 h-3 -translate-y-1/2"
                                            style={{
                                                left: `${(TIMELINE_SPACING / 5) * 4}px`,
                                                backgroundColor: 'hsl(var(--muted) / 0.6)'
                                            }}
                                        ></div>
                                    </div>
                                )}

                                {/* popover content - positioned absolutely to avoid layout shifts */}
                                {selectedItem?.id === item.id && (
                                    <div
                                        className="absolute z-20 w-[500px] backdrop-blur-sm rounded-lg p-4 shadow-2xl opacity-100 transition-all duration-300 ease-out"
                                        style={{
                                            top: '190px',
                                            left:
                                                popoverPosition === 'left'
                                                    ? '0px'
                                                    : popoverPosition === 'right'
                                                      ? `${TIMELINE_SPACING - 500}px`
                                                      : `${(TIMELINE_SPACING - 500) / 2}px`,
                                            backgroundColor: 'hsl(var(--popover) / 0.95)',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                    >
                                        {/* content with dynamic text alignment */}
                                        <div
                                            className={`${
                                                popoverPosition === 'left'
                                                    ? 'text-left'
                                                    : popoverPosition === 'right'
                                                      ? 'text-right'
                                                      : 'text-center'
                                            }`}
                                        >
                                            <h3 className="text-sm font-semibold mb-2" style={{ color: item.colorHex }}>
                                                {item.title}
                                            </h3>
                                            <p
                                                className="text-xs leading-relaxed"
                                                style={{ color: 'hsl(var(--text-secondary))' }}
                                            >
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
