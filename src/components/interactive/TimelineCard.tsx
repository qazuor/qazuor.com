import type { PopoverPosition, TimelineItem } from './hooks/useTimelineAnimation';

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
export function TimelineCard({ item, popoverPosition, popoverWidth, timelineSpacing, isMobile }: TimelineCardProps) {
    // Calculate left position based on popover position
    const getLeftPosition = () => {
        if (popoverPosition === 'left') return '0px';
        if (popoverPosition === 'right') return `${timelineSpacing - popoverWidth}px`;
        return `${(timelineSpacing - popoverWidth) / 2}px`;
    };

    // Calculate text alignment based on popover position
    const getTextAlignment = () => {
        if (popoverPosition === 'left') return 'text-left';
        if (popoverPosition === 'right') return 'text-right';
        return 'text-center';
    };

    return (
        <div
            className="absolute z-20 backdrop-blur-sm rounded-lg shadow-2xl opacity-100 transition-all duration-300 ease-out"
            style={{
                width: `${popoverWidth}px`,
                // Push card below the icon with margin
                // Icon when selected goes to ~130px + 60px (scaled size) = ~190px
                // Adding margin for mobile
                top: isMobile ? '200px' : '190px',
                left: getLeftPosition(),
                backgroundColor: 'hsl(var(--popover) / 0.95)',
                borderColor: 'hsl(var(--border))',
                padding: isMobile ? '12px 14px' : '16px',
                // Let content determine height, with max for very long text
                maxHeight: isMobile ? '120px' : 'none',
                overflow: isMobile ? 'hidden' : 'visible'
            }}
        >
            <div className={getTextAlignment()}>
                <h3
                    className={`${isMobile ? 'text-[11px]' : 'text-sm'} font-semibold mb-1 leading-tight`}
                    style={{ color: item.colorHex }}
                >
                    {item.title}
                </h3>
                <p
                    className={`${isMobile ? 'text-[10px] line-clamp-3' : 'text-xs'} leading-relaxed`}
                    style={{ color: 'hsl(var(--text-secondary))' }}
                >
                    {item.content}
                </p>
            </div>
        </div>
    );
}
