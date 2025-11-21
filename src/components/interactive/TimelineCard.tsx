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
            className="absolute z-20 backdrop-blur-sm rounded-lg p-4 shadow-2xl opacity-100 transition-all duration-300 ease-out"
            style={{
                width: `${popoverWidth}px`,
                top: isMobile ? '200px' : '190px',
                left: getLeftPosition(),
                backgroundColor: 'hsl(var(--popover) / 0.95)',
                borderColor: 'hsl(var(--border))'
            }}
        >
            <div className={getTextAlignment()}>
                <h3
                    className={`${isMobile ? 'text-sm' : 'text-sm'} font-semibold mb-2`}
                    style={{ color: item.colorHex }}
                >
                    {item.title}
                </h3>
                <p
                    className={`${isMobile ? 'text-xs' : 'text-xs'} leading-relaxed`}
                    style={{ color: 'hsl(var(--text-secondary))' }}
                >
                    {item.content}
                </p>
            </div>
        </div>
    );
}
