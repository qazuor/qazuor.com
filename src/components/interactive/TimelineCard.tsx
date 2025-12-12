import { memo, useMemo } from 'react';
import type { PopoverPosition, TimelineItem } from './hooks/useTimelineAnimation';

// Static style constants
const POPOVER_BASE_COLORS = {
    backgroundColor: 'hsl(var(--popover) / 0.95)',
    borderColor: 'hsl(var(--border))'
};

const CONTENT_COLOR_STYLE: React.CSSProperties = {
    color: 'hsl(var(--text-secondary))'
};

/**
 * TimelineCard component props
 */
interface TimelineCardProps {
    /**
     * Timeline item to display
     */
    item: TimelineItem;

    /**
     * Popover position alignment
     */
    popoverPosition: PopoverPosition;

    /**
     * Popover width in pixels
     */
    popoverWidth: number;

    /**
     * Timeline spacing in pixels
     */
    timelineSpacing: number;

    /**
     * Whether the device is mobile
     */
    isMobile: boolean;
}

/**
 * Timeline card component that displays item details in a popover
 *
 * @description Renders a positioned card with timeline item information
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <TimelineCard
 *   item={selectedItem}
 *   popoverPosition="center"
 *   popoverWidth={500}
 *   timelineSpacing={120}
 *   isMobile={false}
 * />
 * ```
 */
export const TimelineCard = memo(function TimelineCard({
    item,
    popoverPosition,
    popoverWidth,
    timelineSpacing,
    isMobile
}: TimelineCardProps) {
    // Calculate left position based on popover position
    const leftPosition = useMemo(() => {
        if (popoverPosition === 'left') return '0px';
        if (popoverPosition === 'right') return `${timelineSpacing - popoverWidth}px`;
        return `${(timelineSpacing - popoverWidth) / 2}px`;
    }, [popoverPosition, timelineSpacing, popoverWidth]);

    // Calculate text alignment based on popover position
    const textAlignment = useMemo(() => {
        if (popoverPosition === 'left') return 'text-left';
        if (popoverPosition === 'right') return 'text-right';
        return 'text-center';
    }, [popoverPosition]);

    // Memoized popover style to avoid object recreation
    const popoverStyle = useMemo<React.CSSProperties>(
        () => ({
            ...POPOVER_BASE_COLORS,
            width: `${popoverWidth}px`,
            top: isMobile ? '200px' : '190px',
            left: leftPosition,
            padding: isMobile ? '12px 14px' : '16px',
            maxHeight: isMobile ? '120px' : 'none',
            overflow: isMobile ? 'hidden' : 'visible'
        }),
        [popoverWidth, isMobile, leftPosition]
    );

    // Memoized title style
    const titleStyle = useMemo<React.CSSProperties>(() => ({ color: item.colorHex }), [item.colorHex]);

    return (
        <div
            className="absolute z-20 backdrop-blur-sm rounded-lg shadow-2xl opacity-100 transition-all duration-300 ease-out"
            style={popoverStyle}
        >
            <div className={textAlignment}>
                <h3
                    className={`${isMobile ? 'text-[11px]' : 'text-sm'} font-semibold mb-1 leading-tight`}
                    style={titleStyle}
                >
                    {item.title}
                </h3>
                <p
                    className={`${isMobile ? 'text-[10px] line-clamp-3' : 'text-xs'} leading-relaxed`}
                    style={CONTENT_COLOR_STYLE}
                >
                    {item.content}
                </p>
            </div>
        </div>
    );
});
