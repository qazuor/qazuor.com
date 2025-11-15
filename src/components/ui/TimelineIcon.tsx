import type React from 'react';

// Import all SVG icons statically
import academicCapIcon from '../../icons/timeline/academic-cap.svg?raw';
import accessIcon from '../../icons/timeline/access.svg?raw';
import arrowTrendingUpIcon from '../../icons/timeline/arrow-trending-up.svg?raw';
import avatureIcon from '../../icons/timeline/avature.svg?raw';
import boltIcon from '../../icons/timeline/bolt.svg?raw';
import briefcaseIcon from '../../icons/timeline/briefcase.svg?raw';
import broadbandIcon from '../../icons/timeline/broadband.svg?raw';
import cogIcon from '../../icons/timeline/cog.svg?raw';
import computerDesktopIcon from '../../icons/timeline/computer-desktop.svg?raw';
import deviceDesktopIcon from '../../icons/timeline/device-desktop.svg?raw';
import dialupIcon from '../../icons/timeline/dialup.svg?raw';
import eyeIcon from '../../icons/timeline/eye.svg?raw';
import globeIcon from '../../icons/timeline/globe.svg?raw';
import heartIcon from '../../icons/timeline/heart.svg?raw';
import html5Icon from '../../icons/timeline/html5.svg?raw';
import javascriptIcon from '../../icons/timeline/javascript.svg?raw';
import makeIcon from '../../icons/timeline/make.svg?raw';
import paintBrushIcon from '../../icons/timeline/paint-brush.svg?raw';
import paperAirplaneIcon from '../../icons/timeline/paper-airplane.svg?raw';
import phpIcon from '../../icons/timeline/php.svg?raw';
import rocketIcon from '../../icons/timeline/rocket.svg?raw';
import sparklesIcon from '../../icons/timeline/sparkles.svg?raw';
import starIcon from '../../icons/timeline/star.svg?raw';
import userCircleIcon from '../../icons/timeline/user-circle.svg?raw';
import userGroupIcon from '../../icons/timeline/user-group.svg?raw';
import visualBasicIcon from '../../icons/timeline/visual-basic.svg?raw';

interface TimelineIconProps {
    iconName: string;
    className?: string;
}

// Map icon names to imported SVGs
const iconMap: { [key: string]: string } = {
    'academic-cap': academicCapIcon,
    access: accessIcon,
    'arrow-trending-up': arrowTrendingUpIcon,
    avature: avatureIcon,
    bolt: boltIcon,
    briefcase: briefcaseIcon,
    broadband: broadbandIcon,
    cog: cogIcon,
    'computer-desktop': computerDesktopIcon,
    'device-desktop': deviceDesktopIcon,
    dialup: dialupIcon,
    eye: eyeIcon,
    globe: globeIcon,
    heart: heartIcon,
    html5: html5Icon,
    javascript: javascriptIcon,
    make: makeIcon,
    'paint-brush': paintBrushIcon,
    'paper-airplane': paperAirplaneIcon,
    php: phpIcon,
    rocket: rocketIcon,
    sparkles: sparklesIcon,
    star: starIcon,
    'user-circle': userCircleIcon,
    'user-group': userGroupIcon,
    'visual-basic': visualBasicIcon
};

export const TimelineIcon: React.FC<TimelineIconProps> = ({ iconName, className = 'w-6 h-6' }) => {
    // Get the SVG content for the icon
    const svgContent = iconMap[iconName];

    if (!svgContent) {
        // Fallback icon if not found
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
                <title>Timeline Icon</title>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
            </svg>
        );
    }

    // Return the SVG content as dangerouslySetInnerHTML with proper className
    return (
        <div
            className={className}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG content comes from trusted static imports in the icons directory
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ color: 'currentColor' }}
        />
    );
};
