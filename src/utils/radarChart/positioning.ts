/**
 * Radar Chart Positioning Utilities
 * Functions for intelligent positioning of labels, tooltips, and UI elements
 */

import type { Point } from './calculations';

export interface LabelOffset {
    x: number;
    y: number;
}

export type TextAnchor = 'start' | 'middle' | 'end';

/**
 * Sector configuration for label positioning
 * Each sector covers 22.5 degrees of the chart
 * Angle system: 0° = top (12 o'clock), increases clockwise
 */
export interface SectorConfig {
    /** Start angle in degrees (inclusive) */
    minAngle: number;
    /** End angle in degrees (exclusive) */
    maxAngle: number;
    /** Text anchor for labels in this sector */
    textAnchor: TextAnchor;
    /** Horizontal offset in pixels (positive = right, negative = left) */
    offsetX: number;
    /** Vertical offset in pixels (positive = down, negative = up) */
    offsetY: number;
}

/**
 * Configurable sector definitions for label positioning
 * 16 sectors of 22.5° each, starting from top (0°) and going clockwise
 *
 * Visual reference (clock positions):
 * - 0° = 12 o'clock (top)
 * - 90° = 3 o'clock (right)
 * - 180° = 6 o'clock (bottom)
 * - 270° = 9 o'clock (left)
 */
export const SECTOR_CONFIG: SectorConfig[] = [
    // === TOP (0°) - Centered ===
    { minAngle: 0, maxAngle: 11.25, textAnchor: 'middle', offsetX: 0, offsetY: -10 },

    // Top-right region
    { minAngle: 11.25, maxAngle: 33.75, textAnchor: 'start', offsetX: 0, offsetY: -10 },
    { minAngle: 33.75, maxAngle: 56.25, textAnchor: 'start', offsetX: 10, offsetY: -10 },

    // Right region (labels to the right of icons)
    { minAngle: 56.25, maxAngle: 78.75, textAnchor: 'start', offsetX: 10, offsetY: 0 },
    { minAngle: 78.75, maxAngle: 101.25, textAnchor: 'start', offsetX: 10, offsetY: 0 },
    { minAngle: 101.25, maxAngle: 123.75, textAnchor: 'start', offsetX: 10, offsetY: 10 },

    // Bottom-right region
    { minAngle: 123.75, maxAngle: 146.25, textAnchor: 'start', offsetX: 0, offsetY: 10 },
    { minAngle: 146.25, maxAngle: 168.75, textAnchor: 'start', offsetX: 0, offsetY: 10 },

    // === BOTTOM (180°) - Centered ===
    { minAngle: 168.75, maxAngle: 191.25, textAnchor: 'middle', offsetX: 0, offsetY: 10 },

    // Bottom-left region
    { minAngle: 191.25, maxAngle: 213.75, textAnchor: 'end', offsetX: 0, offsetY: 10 },
    { minAngle: 213.75, maxAngle: 236.25, textAnchor: 'end', offsetX: -10, offsetY: 10 },

    // Left region (labels to the left of icons)
    { minAngle: 236.25, maxAngle: 258.75, textAnchor: 'end', offsetX: -10, offsetY: 0 },
    { minAngle: 258.75, maxAngle: 281.25, textAnchor: 'end', offsetX: -10, offsetY: 0 },
    { minAngle: 281.25, maxAngle: 303.75, textAnchor: 'end', offsetX: -10, offsetY: -10 },

    // Top-left region
    { minAngle: 303.75, maxAngle: 326.25, textAnchor: 'end', offsetX: 0, offsetY: -10 },
    { minAngle: 326.25, maxAngle: 348.75, textAnchor: 'end', offsetX: 0, offsetY: -10 },

    // === TOP (360°/0°) - Centered (wraps to first sector) ===
    { minAngle: 348.75, maxAngle: 360, textAnchor: 'middle', offsetX: 0, offsetY: -10 }
];

/**
 * Convert angle from code's radian system to user's degree system
 * Code system: 0 rad = right, increases counter-clockwise, offset by -π/2
 * User system: 0° = top, increases clockwise
 */
export function angleToUserDegrees(angleRadians: number): number {
    // Add π/2 to shift from "right=0" to "top=0"
    // Then convert to degrees and normalize to 0-360
    const degrees = ((angleRadians + Math.PI / 2) * 180) / Math.PI;
    return ((degrees % 360) + 360) % 360;
}

/**
 * Get sector configuration for a given angle
 */
export function getSectorConfig(userDegrees: number): SectorConfig {
    const normalized = ((userDegrees % 360) + 360) % 360;

    for (const sector of SECTOR_CONFIG) {
        if (normalized >= sector.minAngle && normalized < sector.maxAngle) {
            return sector;
        }
    }

    // Fallback to first sector (should never happen with proper config)
    return SECTOR_CONFIG[0];
}

/**
 * Get text anchor for a given angle (in code's radian system)
 */
export function calculateTextAnchor(angleRadians: number): TextAnchor {
    const userDegrees = angleToUserDegrees(angleRadians);
    return getSectorConfig(userDegrees).textAnchor;
}

/**
 * Get directional offset for a given angle (in code's radian system)
 */
function calculateDirectionalOffset(angleRadians: number): LabelOffset {
    const userDegrees = angleToUserDegrees(angleRadians);
    const sector = getSectorConfig(userDegrees);
    return { x: sector.offsetX, y: sector.offsetY };
}

/**
 * Calculate label position with sector-based directional offset
 * Labels are placed at a consistent radial distance from icons,
 * then offset based on the sector configuration
 *
 * @param angle - Angle in radians (code's system: 0 = right, -π/2 = top)
 * @param radius - Radius of the radar chart
 * @param center - Center coordinate of the chart
 * @param baseDistance - Base distance from icon to label anchor
 */
export function calculateLabelPosition(
    angle: number,
    radius: number,
    center: number,
    baseDistance: number = 55
): Point {
    const offset = calculateDirectionalOffset(angle);

    // Base radial position (along the axis line, beyond the icon)
    const labelDistance = radius + baseDistance;
    const baseX = center + labelDistance * Math.cos(angle);
    const baseY = center + labelDistance * Math.sin(angle);

    // Add sector-based directional offset
    // Round to 2 decimal places to prevent hydration mismatches from floating point precision differences
    return {
        x: Math.round((baseX + offset.x) * 100) / 100,
        y: Math.round((baseY + offset.y) * 100) / 100
    };
}

/**
 * Calculate line height for multi-line text
 * Uses constant values to prevent layout shift on hover
 */
export function calculateLineHeight(_isHighlighted: boolean, isMobile: boolean): number {
    return isMobile ? 22 : 16;
}

/**
 * Calculate start Y position for centered multi-line text
 */
export function calculateMultiLineStartY(baseY: number, numLines: number, lineHeight: number): number {
    return baseY - ((numLines - 1) * lineHeight) / 2 - 6;
}

/**
 * Calculate smart tooltip position based on angle
 * Positions tooltip away from both the icon and label to avoid overlap
 *
 * @param labelX - X position of the label
 * @param labelY - Y position of the label
 * @param angleRadians - Angle in radians (code system)
 * @param center - Center coordinate of the chart
 * @param svgSize - Size of the SVG
 * @param tooltipWidth - Width of the tooltip
 * @param tooltipHeight - Height of the tooltip
 */
export function calculateTooltipPosition(
    labelX: number,
    labelY: number,
    angleRadians: number,
    _center: number,
    svgSize: number,
    tooltipWidth: number = 220,
    tooltipHeight: number = 100
): Point {
    const padding = 15;
    const userDegrees = angleToUserDegrees(angleRadians);

    let tooltipX: number;
    let tooltipY: number;

    // Determine tooltip position based on which sector the label is in
    // Goal: place tooltip away from both icon (toward center) and label text

    if (userDegrees >= 315 || userDegrees < 45) {
        // Top region: tooltip appears above the label
        tooltipX = labelX - tooltipWidth / 2;
        tooltipY = labelY - tooltipHeight - 20;
    } else if (userDegrees >= 45 && userDegrees < 135) {
        // Right region: tooltip appears to the right of the label
        tooltipX = labelX + 20;
        tooltipY = labelY - tooltipHeight / 2;
    } else if (userDegrees >= 135 && userDegrees < 225) {
        // Bottom region: tooltip appears below the label
        tooltipX = labelX - tooltipWidth / 2;
        tooltipY = labelY + 30;
    } else {
        // Left region: tooltip appears to the left of the label
        tooltipX = labelX - tooltipWidth - 20;
        tooltipY = labelY - tooltipHeight / 2;
    }

    // Ensure tooltip stays within SVG bounds
    if (tooltipX < padding) {
        tooltipX = padding;
    } else if (tooltipX + tooltipWidth > svgSize - padding) {
        tooltipX = svgSize - tooltipWidth - padding;
    }

    if (tooltipY < padding) {
        tooltipY = padding;
    } else if (tooltipY + tooltipHeight > svgSize - padding) {
        tooltipY = svgSize - tooltipHeight - padding;
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
