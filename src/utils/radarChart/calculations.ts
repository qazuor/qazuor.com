/**
 * Radar Chart Calculation Utilities
 * Mathematical functions for point calculations, grid generation, and polygon creation
 */

export interface Point {
    x: number;
    y: number;
}

export interface CalculationParams {
    center: number;
    radius: number;
    numSkills: number;
    maxValue: number;
}

/**
 * Round number to fixed decimal places to ensure SSR/client consistency
 * This prevents hydration mismatches between server and client
 */
export function roundTo(value: number, decimals: number = 2): number {
    const multiplier = 10 ** decimals;
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculate angle in radians for a skill at given index
 * Starts from top (-90 degrees) and goes clockwise
 */
export function calculateAngle(index: number, numSkills: number): number {
    return (Math.PI * 2 * index) / numSkills - Math.PI / 2;
}

/**
 * Calculate point position for a skill value on the radar
 */
export function calculatePoint(
    index: number,
    value: number,
    { center, radius, numSkills, maxValue }: CalculationParams
): Point {
    const angle = calculateAngle(index, numSkills);
    const distance = (value / maxValue) * radius;
    return {
        x: roundTo(center + distance * Math.cos(angle)),
        y: roundTo(center + distance * Math.sin(angle))
    };
}

/**
 * Calculate icon position at outer edge of radar
 * All icons are positioned at the same distance (118% of radius)
 */
export function calculateIconPoint(index: number, { center, radius, numSkills }: CalculationParams): Point {
    const angle = calculateAngle(index, numSkills);
    const distance = radius * 1.12; // Fixed distance - balanced position
    return {
        x: roundTo(center + distance * Math.cos(angle)),
        y: roundTo(center + distance * Math.sin(angle))
    };
}

/**
 * Generate grid level polygons (concentric circles)
 * Returns array of polygon point strings ready for SVG
 */
export function generateGridPolygons(gridLevels: number, params: CalculationParams): string[] {
    return Array.from({ length: gridLevels }, (_, i) => {
        const levelValue = ((i + 1) / gridLevels) * params.maxValue;
        const points = Array.from({ length: params.numSkills }, (_, j) => {
            return calculatePoint(j, levelValue, params);
        });
        return points.map((p) => `${p.x},${p.y}`).join(' ');
    });
}

/**
 * Generate skill data polygon points
 * Returns array of points and polygon string for SVG
 */
export function generateSkillPolygon(
    skillValues: number[],
    params: CalculationParams
): { points: Point[]; polygon: string } {
    const points = skillValues.map((value, i) => calculatePoint(i, value, params));
    const polygon = points.map((p) => `${p.x},${p.y}`).join(' ');
    return { points, polygon };
}

/**
 * Calculate angle in degrees (0-360) from radians
 * Used for quadrant-based positioning logic
 */
export function calculateAngleDegrees(angle: number): number {
    return ((angle + Math.PI / 2) * 180) / Math.PI;
}
