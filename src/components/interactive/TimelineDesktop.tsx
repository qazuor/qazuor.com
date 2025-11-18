import { TimelineIcon } from '@/components/ui';
import { type TimelineItem, useTimelineAnimation } from './hooks/useTimelineAnimation';
import { TimelineCard } from './TimelineCard';

/**
 * TimelineDesktop component props
 */
interface TimelineDesktopProps {
    /**
     * Current language
     */
    lang: 'en' | 'es';

    /**
     * Array of timeline items to display
     */
    timelineItems: TimelineItem[];
}

/**
 * Desktop timeline component with horizontal scroll and interactive navigation
 *
 * @description Displays timeline items in a horizontal scrollable layout with
 * automatic navigation, mouse wheel control, and touch gestures support
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <TimelineDesktop
 *   lang="en"
 *   timelineItems={items}
 * />
 * ```
 */
export default function TimelineDesktop({ timelineItems }: TimelineDesktopProps) {
    const timeline = useTimelineAnimation({ items: timelineItems });

    return (
        <div ref={timeline.containerRef} className="flex flex-col items-center justify-center">
            <div className="w-full mx-auto">
                {/* Horizontal scroll container - grows with content */}
                <div
                    id="timeline-scroll-container"
                    className="overflow-x-auto overflow-y-visible"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'hsl(var(--primary)) hsl(var(--bg-tertiary))'
                    }}
                >
                    {/* Timeline container - flexbox autocontained */}
                    {/* biome-ignore lint/a11y/useSemanticElements: role="group" is semantically correct for timeline navigation */}
                    <div
                        ref={timeline.timelineRef}
                        className="relative mb-16 flex items-start px-16"
                        onMouseEnter={timeline.handleTimelineMouseEnter}
                        onMouseLeave={timeline.handleTimelineMouseLeave}
                        onTouchStart={timeline.handleTouchStart}
                        onTouchMove={timeline.handleTouchMove}
                        onTouchEnd={timeline.handleTouchEnd}
                        role="group"
                        aria-label="Timeline navigation"
                        style={{
                            width: `${timelineItems.length * timeline.TIMELINE_SPACING}px`,
                            minWidth: '100%',
                            paddingBottom: '200px'
                        }}
                    >
                        {/* Horizontal base line with gradients */}
                        <div
                            className="absolute h-1"
                            style={{
                                top: '62px',
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
                        />

                        {/* Timeline items - each one self-contained */}
                        {timelineItems.map((item, index) => (
                            // biome-ignore lint/a11y/useSemanticElements: Using div instead of button to maintain complex flex layout and custom styling
                            <div
                                key={item.id}
                                className="flex flex-col items-center relative group cursor-pointer"
                                onMouseOver={() => timeline.handleMouseOver(item, index)}
                                onFocus={() => timeline.handleMouseOver(item, index)}
                                role="button"
                                tabIndex={0}
                                style={{
                                    width: `${timeline.TIMELINE_SPACING}px`,
                                    flexShrink: 0,
                                    minHeight: '120px'
                                }}
                            >
                                {/* Year */}
                                <div
                                    className={`text-sm mb-4 font-mono tracking-wider font-semibold transition-all duration-300 ${
                                        timeline.selectedItem?.id === item.id
                                            ? 'opacity-100 scale-110'
                                            : 'opacity-50 hover:opacity-90'
                                    }`}
                                    style={{
                                        color:
                                            timeline.selectedItem?.id === item.id
                                                ? item.colorHex
                                                : 'hsl(var(--text-secondary))'
                                    }}
                                >
                                    {item.year}
                                </div>

                                {/* Main dividing line - exactly below the year */}
                                <div
                                    className="w-0.5 h-6 relative z-10 translate-y-1/2 transition-opacity duration-300"
                                    style={{
                                        backgroundColor: 'hsl(var(--muted))',
                                        opacity: timeline.selectedItem?.id === item.id ? '0' : '0.8'
                                    }}
                                />

                                {/* Extended vertical line from timeline mark - animated with absolute positioning */}
                                <div
                                    className={`absolute w-0.5 transition-all duration-300 ease-out z-10 ${
                                        timeline.selectedItem?.id === item.id ? 'h-20 opacity-100' : 'h-0 opacity-0'
                                    }`}
                                    style={{
                                        top: '45px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background:
                                            timeline.selectedItem?.id === item.id
                                                ? `linear-gradient(to bottom, ${item.colorHex}, ${item.colorHex}10)`
                                                : 'transparent'
                                    }}
                                />

                                {/* Timeline point - moves down with gap after the line */}
                                <div
                                    className={`w-10 h-10 flex items-center justify-center relative z-10 transition-all duration-300 ease-out ${
                                        timeline.selectedItem?.id === item.id
                                            ? 'transform translate-y-16'
                                            : 'translate-y-2'
                                    }`}
                                >
                                    {/* Icon from data with larger sizes and enhanced effects */}
                                    <div
                                        className={`transition-all duration-300 ${
                                            timeline.selectedItem?.id === item.id
                                                ? 'grayscale-0 transform scale-150 drop-shadow-2xl brightness-110'
                                                : 'grayscale opacity-60 hover:opacity-80 hover:scale-110'
                                        }`}
                                        style={{
                                            color:
                                                timeline.selectedItem?.id === item.id
                                                    ? item.colorHex
                                                    : 'hsl(var(--text-muted))'
                                        }}
                                    >
                                        <TimelineIcon
                                            iconName={item.icon}
                                            className={timeline.selectedItem?.id === item.id ? 'w-7 h-7' : 'w-5 h-5'}
                                        />
                                    </div>
                                </div>

                                {/* Intermediate lines - only for elements that are not the last */}
                                {index < timelineItems.length - 1 && (
                                    <div
                                        className="absolute h-px"
                                        style={{
                                            top: '62px',
                                            left: `${timeline.TIMELINE_SPACING / 2}px`,
                                            width: `${timeline.TIMELINE_SPACING / 2}px`,
                                            backgroundColor: 'hsl(var(--muted) / 0.4)'
                                        }}
                                    >
                                        {/* 4 intermediate lines evenly distributed */}
                                        {[1, 2, 3, 4].map((num) => (
                                            <div
                                                key={num}
                                                className="absolute w-0.5 h-3 -translate-y-1/2"
                                                style={{
                                                    left: `${(timeline.TIMELINE_SPACING / 5) * num}px`,
                                                    backgroundColor: 'hsl(var(--muted) / 0.6)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Popover content - positioned absolutely to avoid layout shifts */}
                                {timeline.selectedItem?.id === item.id && (
                                    <TimelineCard
                                        item={item}
                                        popoverPosition={timeline.popoverPosition}
                                        popoverWidth={timeline.POPOVER_WIDTH}
                                        timelineSpacing={timeline.TIMELINE_SPACING}
                                        isMobile={timeline.isMobile}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
