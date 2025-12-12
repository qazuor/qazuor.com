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
            className="relative flex flex-col items-center justify-center focus:outline-none"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: tabIndex needed for keyboard navigation within timeline
            tabIndex={0}
            aria-label="Timeline"
        >
            {/* Navigation Controls + Progress Dots - Top */}
            <div className="flex flex-col items-center gap-3 mb-6 w-full">
                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-4">
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={timeline.goToPrev}
                        className="p-2 rounded-full bg-bg-secondary/80 hover:bg-bg-tertiary transition-colors duration-200 text-text-secondary hover:text-text-primary"
                        aria-label={t.previous}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
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
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Item Counter */}
                    <span className="text-sm text-text-muted font-mono ml-2">
                        {timeline.currentIndex + 1} / {timeline.totalItems}
                    </span>
                </div>

                {/* Progress Dots - Fixed height container to prevent layout shifts */}
                <div
                    className="flex items-center justify-center gap-1.5 flex-wrap max-w-md px-4 h-5"
                    role="tablist"
                    aria-label="Timeline progress"
                >
                    {timelineItems.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => timeline.goToIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-transform duration-300 ${
                                timeline.currentIndex === index
                                    ? 'scale-125'
                                    : 'scale-100 bg-muted/40 hover:bg-muted/60 hover:scale-110'
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
            </div>

            {/* Timeline wrapper with relative positioning for card placement */}
            <div className="w-full mx-auto relative">
                {/* Horizontal scroll container - constrained to content width */}
                <div
                    ref={timeline.scrollContainerRef}
                    className="overflow-x-auto overflow-y-visible scrollbar-hide mx-auto"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                        // Constrain to content max-width (mobile uses full width)
                        maxWidth: timeline.isMobile ? '100%' : `${timeline.CONTAINER_MAX_WIDTH}px`
                    }}
                >
                    {/* Timeline container - flexbox autocontained */}
                    {/* biome-ignore lint/a11y/useSemanticElements: role="group" is semantically correct for timeline navigation */}
                    <div
                        ref={timeline.timelineRef}
                        className="relative mb-8 flex items-start"
                        role="group"
                        aria-label="Timeline navigation"
                        style={{
                            // Width = padding-left + items + padding-right
                            // Mobile: uses viewport width for padding
                            // Desktop: uses constrained container width for padding
                            width: timeline.isMobile
                                ? `calc(100vw + ${(timelineItems.length - 1) * timeline.TIMELINE_SPACING}px)`
                                : `${timeline.CONTAINER_MAX_WIDTH + (timelineItems.length - 1) * timeline.TIMELINE_SPACING}px`,
                            paddingLeft: timeline.isMobile
                                ? `calc(50vw - ${timeline.TIMELINE_SPACING / 2}px)`
                                : `${timeline.CONTAINER_MAX_WIDTH / 2 - timeline.TIMELINE_SPACING / 2}px`,
                            paddingRight: timeline.isMobile
                                ? `calc(50vw - ${timeline.TIMELINE_SPACING / 2}px)`
                                : `${timeline.CONTAINER_MAX_WIDTH / 2 - timeline.TIMELINE_SPACING / 2}px`,
                            paddingBottom: timeline.isMobile ? '120px' : '140px'
                        }}
                    >
                        {/* Horizontal base line with gradients - fades at visual edges */}
                        <div
                            className="absolute h-0.5"
                            style={{
                                top: '62px',
                                left: '0',
                                right: '0',
                                background: `linear-gradient(
                                    to right,
                                    transparent 0%,
                                    hsl(var(--muted) / 0.4) 5%,
                                    hsl(var(--muted) / 0.8) 15%,
                                    hsl(var(--muted) / 0.8) 85%,
                                    hsl(var(--muted) / 0.4) 95%,
                                    transparent 100%
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
                                        {/* Year - smooth color and scale transition */}
                                        <div
                                            className={`text-sm mb-4 font-mono tracking-wider font-semibold ${
                                                isSelected ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-90'
                                            }`}
                                            style={{
                                                color: isSelected ? item.colorHex : 'hsl(var(--text-secondary))',
                                                transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                                            }}
                                        >
                                            {item.year}
                                        </div>

                                        {/* Main dividing line - exactly below the year */}
                                        <div
                                            className="w-0.5 h-6 relative z-10 translate-y-1/2"
                                            style={{
                                                backgroundColor: 'hsl(var(--muted))',
                                                opacity: isSelected ? '0' : '0.8',
                                                transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        />

                                        {/* Timeline point - moves down with smooth spring-like motion */}
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center relative z-10 ${
                                                isSelected ? 'transform translate-y-16' : 'translate-y-2'
                                            }`}
                                            style={{
                                                transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                                            }}
                                        >
                                            {/* Icon from data - grayscale when not selected, colored when selected */}
                                            <div
                                                className={`${
                                                    isSelected
                                                        ? `transform scale-150 ${item.iconUseItemColor ? 'drop-shadow-lg' : ''}`
                                                        : 'opacity-70 hover:opacity-100 hover:scale-110 grayscale'
                                                }`}
                                                style={{
                                                    color: item.iconUseItemColor
                                                        ? isSelected
                                                            ? item.colorHex
                                                            : 'hsl(var(--text-secondary))'
                                                        : undefined,
                                                    transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                                                }}
                                            >
                                                <TimelineIcon iconName={item.icon} className="w-7 h-7" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Extended vertical line from timeline mark - animated with absolute positioning */}
                                    {/* Uses scaleY instead of height to avoid layout reflow */}
                                    <div
                                        className="absolute w-0.5 h-20 z-10 origin-top"
                                        style={{
                                            top: '45px',
                                            left: '50%',
                                            transform: `translateX(-50%) scaleY(${isSelected ? 1 : 0})`,
                                            opacity: isSelected ? 1 : 0,
                                            background: `linear-gradient(to bottom, ${item.colorHex}, ${item.colorHex}10)`,
                                            transition:
                                                'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* TimelineCard - Positioned with CSS containment to isolate from scroll-induced layout changes */}
            {/* Uses absolute positioning within the section and CSS transition to smooth any micro-movements */}
            {timeline.selectedItem && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-30 transition-[top] duration-200 ease-out"
                    style={{
                        top: timeline.isMobile ? '280px' : '300px',
                        willChange: 'transform',
                        contain: 'layout style'
                    }}
                >
                    <TimelineCard
                        item={timeline.selectedItem}
                        popoverWidth={timeline.POPOVER_WIDTH}
                        isMobile={timeline.isMobile}
                    />
                </div>
            )}

            {/* Mobile Scroll Hint - Below Timeline - show briefly then fade */}
            {timeline.isMobile && !timeline.isUserScrolling && (
                <div className="flex items-center justify-center gap-2 text-text-muted text-xs opacity-60">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16l-4-4m0 0l4-4m-4 4h18"
                        />
                    </svg>
                    <span>{t.swipeHint}</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </div>
            )}
        </section>
    );
}
