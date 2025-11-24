import type React from 'react';

interface TimelineIconProps {
    /**
     * The name of the icon to render (without the .svg extension)
     */
    iconName: string;
    /**
     * Optional CSS classes for styling the SVG element
     * @default 'w-6 h-6'
     */
    className?: string;
}

/**
 * Timeline Icon Component
 *
 * Renders an icon from the timeline SVG sprite using SVG <use> element.
 * This component references pre-loaded symbols from TimelineIconSprite.astro,
 * significantly reducing bundle size compared to static imports.
 *
 * @example
 * ```tsx
 * <TimelineIcon iconName="briefcase" className="w-8 h-8" />
 * <TimelineIcon iconName="rocket" />
 * ```
 */
export const TimelineIcon: React.FC<TimelineIconProps> = ({ iconName, className = 'w-6 h-6' }) => {
    return (
        <svg className={className} aria-hidden="true" focusable="false" role="img">
            <use href={`#timeline-${iconName}`} />
        </svg>
    );
};
