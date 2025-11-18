/**
 * Radar Chart Positioning Utilities
 * Functions for intelligent positioning of labels, tooltips, and UI elements
 */

import type { Point } from './calculations';
import { calculateAngleDegrees } from './calculations';

export interface LabelOffset {
    x: number;
    y: number;
}

/**
 * Calculate intelligent label offset based on quadrant
 * Adjusts position to avoid icon overlap and improve readability
 */
export function calculateLabelOffset(angleDegrees: number): LabelOffset {
    const offset: LabelOffset = { x: 0, y: 0 };

    // Top quadrant (315-45 deg) - push up more
    if (angleDegrees >= 315 || angleDegrees < 45) {
        offset.y = -10;
    }
    // Right quadrant (45-135 deg) - push right more
    else if (angleDegrees >= 45 && angleDegrees < 135) {
        offset.x = 10;
    }
    // Bottom quadrant (135-225 deg) - push down more
    else if (angleDegrees >= 135 && angleDegrees < 225) {
        offset.y = 10;
    }
    // Left quadrant (225-315 deg) - push left more
    else {
        offset.x = -10;
    }

    return offset;
}

/**
 * Calculate label position with intelligent offset
 */
export function calculateLabelPosition(
    angle: number,
    radius: number,
    center: number,
    labelDistance: number = radius + 55
): Point {
    const angleDeg = calculateAngleDegrees(angle);
    const extraOffset = calculateLabelOffset(angleDeg);

    return {
        x: center + labelDistance * Math.cos(angle) + extraOffset.x,
        y: center + labelDistance * Math.sin(angle) + extraOffset.y
    };
}

/**
 * Calculate line height for multi-line text
 */
export function calculateLineHeight(isHighlighted: boolean, isMobile: boolean): number {
    if (isHighlighted) {
        return isMobile ? 22 : 16;
    }
    return isMobile ? 20 : 14;
}

/**
 * Calculate start Y position for centered multi-line text
 */
export function calculateMultiLineStartY(baseY: number, numLines: number, lineHeight: number): number {
    return baseY - ((numLines - 1) * lineHeight) / 2 - 6;
}

/**
 * Calculate smart tooltip position to avoid overflow
 * Adjusts horizontal position based on label location and viewport bounds
 */
export function calculateTooltipPosition(
    labelX: number,
    labelY: number,
    center: number,
    svgSize: number,
    tooltipWidth: number = 220
): Point {
    const padding = 10;
    let tooltipX = labelX - tooltipWidth / 2; // Default: centered
    const tooltipY = labelY + 25; // Below label

    // Adjust horizontal position based on label side
    if (labelX < center - 50) {
        // Label on left side - align tooltip to the left
        tooltipX = labelX - 40;
    } else if (labelX > center + 50) {
        // Label on right side - align tooltip to the right
        tooltipX = labelX - tooltipWidth + 40;
    }

    // Ensure tooltip stays within SVG bounds
    if (tooltipX < padding) {
        tooltipX = padding;
    } else if (tooltipX + tooltipWidth > svgSize - padding) {
        tooltipX = svgSize - tooltipWidth - padding;
    }

    return { x: tooltipX, y: tooltipY };
}

/**
 * Calculate font size based on highlight state and device
 */
export function calculateFontSize(
    isHighlighted: boolean,
    isMobile: boolean,
    sizes: { highlightedMobile: number; highlightedDesktop: number; normalMobile: number; normalDesktop: number }
): number {
    if (isHighlighted) {
        return isMobile ? sizes.highlightedMobile : sizes.highlightedDesktop;
    }
    return isMobile ? sizes.normalMobile : sizes.normalDesktop;
}

/**
 * Calculate badge dimensions for percentage display
 */
export function calculateBadgeDimensions(isMobile: boolean): { width: number; height: number; rx: number } {
    return {
        width: isMobile ? 48 : 36,
        height: isMobile ? 22 : 16,
        rx: isMobile ? 11 : 8
    };
}

/**
 * Calculate badge position for percentage display
 */
export function calculateBadgePosition(
    labelX: number,
    labelY: number,
    numLines: number,
    lineHeight: number,
    isMobile: boolean
): Point {
    const dimensions = calculateBadgeDimensions(isMobile);
    return {
        x: labelX - dimensions.width / 2,
        y: labelY + ((numLines - 1) * lineHeight) / 2 + (isMobile ? 8 : 2)
    };
}
