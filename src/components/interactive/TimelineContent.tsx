import { TimelineIcon } from '@/components/ui';
import { type TimelineItem, useTimelineAnimation } from './hooks/useTimelineAnimation';
import { TimelineCard } from './TimelineCard';

/**
 * TimelineContent component props
 */
interface TimelineContentProps {
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
 * Timeline content component with horizontal scroll and interactive navigation
 *
 * @description Displays timeline items in a horizontal scrollable layout with
 * click navigation, keyboard support, auto-play, and touch gestures
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <TimelineContent
 *   lang="en"
 *   timelineItems={items}
 * />
 * ```
 */
export default function TimelineContent({ lang, timelineItems }: TimelineContentProps) {
    const timeline = useTimelineAnimation({ items: timelineItems });

    const translations = {
        en: {
            play: 'Play',
            pause: 'Pause',
            previous: 'Previous',
            next: 'Next',
            swipeHint: 'Swipe to navigate',
            goToItem: 'Go to item'
        },
        es: {
            play: 'Reproducir',
            pause: 'Pausar',
            previous: 'Anterior',
            next: 'Siguiente',
            swipeHint: 'Desliza para navegar',
            goToItem: 'Ir al elemento'
        }
    };

    const t = translations[lang];

    return (
        <section
            ref={timeline.containerRef}
            className="flex flex-col items-center justify-center focus:outline-none"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: tabIndex needed for keyboard navigation within timeline
            tabIndex={0}
            aria-label="Timeline"
        >
            {/* Navigation Controls - Top */}
            <div className="flex items-center justify-center gap-4 mb-6 w-full">
                {/* Previous Button */}
                <button
                    type="button"
                    onClick={timeline.goToPrev}
                    className="p-2 rounded-full bg-bg-secondary/80 hover:bg-bg-tertiary transition-colors duration-200 text-text-secondary hover:text-text-primary"
                    aria-label={t.previous}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Play/Pause Button */}
                <button
                    type="button"
                    onClick={timeline.toggleAutoPlay}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                        timeline.isAutoPlaying
                            ? 'bg-primary/20 text-primary hover:bg-primary/30'
                            : 'bg-bg-secondary/80 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                    }`}
                    aria-label={timeline.isAutoPlaying ? t.pause : t.play}
                    aria-pressed={timeline.isAutoPlaying}
                >
                    {timeline.isAutoPlaying ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7L8 5z" />
                        </svg>
                    )}
                </button>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={timeline.goToNext}
                    className="p-2 rounded-full bg-bg-secondary/80 hover:bg-bg-tertiary transition-colors duration-200 text-text-secondary hover:text-text-primary"
                    aria-label={t.next}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Item Counter */}
                <span className="text-sm text-text-muted font-mono ml-2">
                    {timeline.currentIndex + 1} / {timeline.totalItems}
                </span>
            </div>

            {/* Mobile Swipe Hint */}
            {timeline.isMobile && (
                <div className="flex items-center justify-center gap-2 mb-4 text-text-muted text-sm animate-pulse">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m-12 6h12m-12 6h12M4 7h.01M4 13h.01M4 19h.01"
                        />
                    </svg>
                    <span>{t.swipeHint}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </div>
            )}

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
                        className="relative mb-8 flex items-start px-16"
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
                        {timelineItems.map((item, index) => {
                            const isSelected = timeline.selectedItem?.id === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-center relative group"
                                    style={{
                                        width: `${timeline.TIMELINE_SPACING}px`,
                                        flexShrink: 0,
                                        minHeight: '120px'
                                    }}
                                >
                                    {/* Interactive click area */}
                                    <button
                                        type="button"
                                        className="flex flex-col items-center cursor-pointer px-2 bg-transparent border-none"
                                        onClick={() => timeline.handleItemClick(item, index)}
                                        aria-label={`${item.year}: ${item.title}`}
                                        aria-current={isSelected ? 'true' : undefined}
                                    >
                                        {/* Year */}
                                        <div
                                            className={`text-sm mb-4 font-mono tracking-wider font-semibold transition-all duration-300 ${
                                                isSelected ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-90'
                                            }`}
                                            style={{
                                                color: isSelected ? item.colorHex : 'hsl(var(--text-secondary))'
                                            }}
                                        >
                                            {item.year}
                                        </div>

                                        {/* Main dividing line - exactly below the year */}
                                        <div
                                            className="w-0.5 h-6 relative z-10 translate-y-1/2 transition-opacity duration-300"
                                            style={{
                                                backgroundColor: 'hsl(var(--muted))',
                                                opacity: isSelected ? '0' : '0.8'
                                            }}
                                        />

                                        {/* Timeline point - moves down with gap after the line */}
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center relative z-10 transition-all duration-300 ease-out ${
                                                isSelected ? 'transform translate-y-16' : 'translate-y-2'
                                            }`}
                                        >
                                            {/* Icon from data - grayscale when not selected, colored when selected */}
                                            <div
                                                className={`transition-all duration-300 ${
                                                    isSelected
                                                        ? `transform scale-150 ${item.iconUseItemColor ? 'drop-shadow-lg' : ''}`
                                                        : 'opacity-70 hover:opacity-100 hover:scale-110 grayscale'
                                                }`}
                                                style={{
                                                    color: item.iconUseItemColor
                                                        ? isSelected
                                                            ? item.colorHex
                                                            : 'hsl(var(--text-secondary))'
                                                        : undefined
                                                }}
                                            >
                                                <TimelineIcon iconName={item.icon} className="w-7 h-7" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Extended vertical line from timeline mark - animated with absolute positioning */}
                                    <div
                                        className={`absolute w-0.5 transition-all duration-300 ease-out z-10 ${
                                            isSelected ? 'h-20 opacity-100' : 'h-0 opacity-0'
                                        }`}
                                        style={{
                                            top: '45px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: isSelected
                                                ? `linear-gradient(to bottom, ${item.colorHex}, ${item.colorHex}10)`
                                                : 'transparent'
                                        }}
                                    />

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
                                    {isSelected && (
                                        <TimelineCard
                                            item={item}
                                            popoverPosition={timeline.popoverPosition}
                                            popoverWidth={timeline.POPOVER_WIDTH}
                                            timelineSpacing={timeline.TIMELINE_SPACING}
                                            isMobile={timeline.isMobile}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Progress Dots */}
            <div
                className="flex items-center justify-center gap-1.5 mt-4 flex-wrap max-w-md px-4"
                role="tablist"
                aria-label="Timeline progress"
            >
                {timelineItems.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => timeline.goToIndex(index)}
                        className={`transition-all duration-300 rounded-full ${
                            timeline.currentIndex === index
                                ? 'w-3 h-3 scale-125'
                                : 'w-2 h-2 bg-muted/40 hover:bg-muted/60'
                        }`}
                        style={{
                            backgroundColor: timeline.currentIndex === index ? item.colorHex : undefined
                        }}
                        role="tab"
                        aria-selected={timeline.currentIndex === index}
                        aria-label={`${t.goToItem} ${index + 1}: ${item.year}`}
                        tabIndex={timeline.currentIndex === index ? 0 : -1}
                    />
                ))}
            </div>
        </section>
    );
}
