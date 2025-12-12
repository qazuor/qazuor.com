import { memo, useMemo } from 'react';
import type { TimelineItem } from './hooks/useTimelineAnimation';

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
     * Popover width in pixels
     */
    popoverWidth: number;

    /**
     * Whether the device is mobile
     */
    isMobile: boolean;
}

/**
 * Timeline card component that displays item details in a centered popover
 *
 * @description Renders a fixed, centered card with timeline item information.
 * The card stays in place while the timeline scrolls to center the selected year.
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <TimelineCard
 *   item={selectedItem}
 *   popoverWidth={500}
 *   isMobile={false}
 * />
 * ```
 */
export const TimelineCard = memo(function TimelineCard({ item, popoverWidth, isMobile }: TimelineCardProps) {
    // Memoized popover style - always centered horizontally
    // Fixed height prevents layout shifts between items with different text lengths
    const popoverStyle = useMemo<React.CSSProperties>(
        () => ({
            ...POPOVER_BASE_COLORS,
            width: `${popoverWidth}px`,
            padding: isMobile ? '12px 16px' : '16px 20px',
            height: isMobile ? '100px' : '95px',
            overflow: 'hidden'
        }),
        [popoverWidth, isMobile]
    );

    // Memoized title style
    const titleStyle = useMemo<React.CSSProperties>(() => ({ color: item.colorHex }), [item.colorHex]);

    return (
        <div className="z-20 backdrop-blur-sm rounded-lg shadow-2xl" style={popoverStyle}>
            <div className="text-center">
                <h3
                    className={`${isMobile ? 'text-[11px]' : 'text-sm'} font-semibold mb-1 leading-tight`}
                    style={titleStyle}
                >
                    {item.title}
                </h3>
                <p
                    className={`${isMobile ? 'text-[10px] line-clamp-3' : 'text-xs line-clamp-2'} leading-relaxed`}
                    style={CONTENT_COLOR_STYLE}
                >
                    {item.content}
                </p>
            </div>
        </div>
    );
});
