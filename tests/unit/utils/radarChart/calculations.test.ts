import { describe, expect, it } from 'vitest';
import {
    type CalculationParams,
    calculateAngle,
    calculateAngleDegrees,
    calculateIconPoint,
    calculatePoint,
    generateGridPolygons,
    generateSkillPolygon,
    roundTo
} from '@/utils/radarChart/calculations';

describe('roundTo', () => {
    it('should round to 2 decimal places by default', () => {
        expect(roundTo(3.24567)).toBe(3.25);
        expect(roundTo(2.999)).toBe(3);
        expect(roundTo(1.126)).toBe(1.13);
        expect(roundTo(2.344)).toBe(2.34);
    });

    it('should round to specified decimal places', () => {
        expect(roundTo(3.24567, 3)).toBe(3.246);
        expect(roundTo(3.24567, 4)).toBe(3.2457);
        expect(roundTo(3.24567, 0)).toBe(3);
        expect(roundTo(3.24567, 1)).toBe(3.2);
    });

    it('should handle negative numbers', () => {
        expect(roundTo(-3.24567, 2)).toBe(-3.25);
        expect(roundTo(-2.999, 2)).toBe(-3);
    });

    it('should handle zero', () => {
        expect(roundTo(0)).toBe(0);
        expect(roundTo(0, 5)).toBe(0);
    });

    it('should handle whole numbers', () => {
        expect(roundTo(5)).toBe(5);
        expect(roundTo(100, 3)).toBe(100);
    });
});

describe('calculateAngle', () => {
    it('should return -π/2 for first skill (top position)', () => {
        const angle = calculateAngle(0, 6);
        expect(angle).toBeCloseTo(-Math.PI / 2);
    });

    it('should distribute angles evenly around the circle', () => {
        const numSkills = 4;
        const angles = [0, 1, 2, 3].map((i) => calculateAngle(i, numSkills));

        // First at top (-π/2), then at 0, π/2, π
        expect(angles[0]).toBeCloseTo(-Math.PI / 2); // top
        expect(angles[1]).toBeCloseTo(0); // right
        expect(angles[2]).toBeCloseTo(Math.PI / 2); // bottom
        expect(angles[3]).toBeCloseTo(Math.PI); // left
    });

    it('should handle different skill counts', () => {
        // With 3 skills, angles should be 120° apart
        const angle1 = calculateAngle(1, 3);
        const angle0 = calculateAngle(0, 3);
        const diff = angle1 - angle0;
        expect(diff).toBeCloseTo((2 * Math.PI) / 3);
    });

    it('should handle single skill', () => {
        const angle = calculateAngle(0, 1);
        expect(angle).toBeCloseTo(-Math.PI / 2);
    });
});

describe('calculatePoint', () => {
    const params: CalculationParams = {
        center: 200,
        radius: 100,
        numSkills: 4,
        maxValue: 100
    };

    it('should place point at top for first skill with max value', () => {
        const point = calculatePoint(0, 100, params);
        expect(point.x).toBeCloseTo(200); // center x
        expect(point.y).toBeCloseTo(100); // center - radius (top)
    });

    it('should place point at center for zero value', () => {
        const point = calculatePoint(0, 0, params);
        expect(point.x).toBe(200);
        expect(point.y).toBe(200);
    });

    it('should scale point based on value', () => {
        const halfPoint = calculatePoint(0, 50, params);
        expect(halfPoint.x).toBeCloseTo(200);
        expect(halfPoint.y).toBeCloseTo(150); // center - (radius * 0.5)
    });

    it('should place points at correct positions around the circle', () => {
        // Right position (index 1 of 4)
        const rightPoint = calculatePoint(1, 100, params);
        expect(rightPoint.x).toBeCloseTo(300); // center + radius
        expect(rightPoint.y).toBeCloseTo(200); // center

        // Bottom position (index 2 of 4)
        const bottomPoint = calculatePoint(2, 100, params);
        expect(bottomPoint.x).toBeCloseTo(200);
        expect(bottomPoint.y).toBeCloseTo(300);

        // Left position (index 3 of 4)
        const leftPoint = calculatePoint(3, 100, params);
        expect(leftPoint.x).toBeCloseTo(100);
        expect(leftPoint.y).toBeCloseTo(200);
    });
});

describe('calculateIconPoint', () => {
    const params: CalculationParams = {
        center: 200,
        radius: 100,
        numSkills: 4,
        maxValue: 100
    };

    it('should place icons at 112% of radius', () => {
        const point = calculateIconPoint(0, params);
        // At top: x = center, y = center - radius * 1.12
        expect(point.x).toBeCloseTo(200);
        expect(point.y).toBeCloseTo(200 - 100 * 1.12);
    });

    it('should position icons evenly around the chart', () => {
        const topIcon = calculateIconPoint(0, params);
        const rightIcon = calculateIconPoint(1, params);
        const bottomIcon = calculateIconPoint(2, params);
        const leftIcon = calculateIconPoint(3, params);

        // Top
        expect(topIcon.y).toBeLessThan(params.center);
        expect(topIcon.x).toBeCloseTo(params.center);

        // Right
        expect(rightIcon.x).toBeGreaterThan(params.center);
        expect(rightIcon.y).toBeCloseTo(params.center);

        // Bottom
        expect(bottomIcon.y).toBeGreaterThan(params.center);
        expect(bottomIcon.x).toBeCloseTo(params.center);

        // Left
        expect(leftIcon.x).toBeLessThan(params.center);
        expect(leftIcon.y).toBeCloseTo(params.center);
    });
});

describe('generateGridPolygons', () => {
    const params: CalculationParams = {
        center: 200,
        radius: 100,
        numSkills: 4,
        maxValue: 100
    };

    it('should generate correct number of grid levels', () => {
        const grids = generateGridPolygons(5, params);
        expect(grids).toHaveLength(5);
    });

    it('should generate valid SVG polygon strings', () => {
        const grids = generateGridPolygons(3, params);

        for (const grid of grids) {
            // Should be a string of "x,y x,y x,y x,y" format
            expect(typeof grid).toBe('string');
            const points = grid.split(' ');
            expect(points).toHaveLength(4); // 4 skills = 4 points
            for (const point of points) {
                const [x, y] = point.split(',');
                expect(Number(x)).not.toBeNaN();
                expect(Number(y)).not.toBeNaN();
            }
        }
    });

    it('should generate progressively larger polygons', () => {
        const grids = generateGridPolygons(3, params);

        // Extract first point y-coordinate from each grid (top point)
        const getTopY = (grid: string) => {
            const firstPoint = grid.split(' ')[0];
            return Number(firstPoint.split(',')[1]);
        };

        const topYs = grids.map(getTopY);

        // Each subsequent grid should have a smaller y (further from center, toward top)
        for (let i = 1; i < topYs.length; i++) {
            expect(topYs[i]).toBeLessThan(topYs[i - 1]);
        }
    });

    it('should handle single grid level', () => {
        const grids = generateGridPolygons(1, params);
        expect(grids).toHaveLength(1);
    });
});

describe('generateSkillPolygon', () => {
    const params: CalculationParams = {
        center: 200,
        radius: 100,
        numSkills: 4,
        maxValue: 100
    };

    it('should return points array and polygon string', () => {
        const result = generateSkillPolygon([80, 60, 90, 70], params);

        expect(result.points).toHaveLength(4);
        expect(typeof result.polygon).toBe('string');
    });

    it('should generate valid SVG polygon string', () => {
        const result = generateSkillPolygon([100, 100, 100, 100], params);

        const pointStrings = result.polygon.split(' ');
        expect(pointStrings).toHaveLength(4);

        for (const pointStr of pointStrings) {
            const [x, y] = pointStr.split(',');
            expect(Number(x)).not.toBeNaN();
            expect(Number(y)).not.toBeNaN();
        }
    });

    it('should scale points based on skill values', () => {
        const fullResult = generateSkillPolygon([100, 100, 100, 100], params);
        const halfResult = generateSkillPolygon([50, 50, 50, 50], params);

        // Full values should be further from center
        const fullTopY = fullResult.points[0].y;
        const halfTopY = halfResult.points[0].y;

        expect(fullTopY).toBeLessThan(halfTopY); // Full is higher (smaller y)
    });

    it('should handle all zero values', () => {
        const result = generateSkillPolygon([0, 0, 0, 0], params);

        // All points should be at center
        for (const point of result.points) {
            expect(point.x).toBe(params.center);
            expect(point.y).toBe(params.center);
        }
    });

    it('should handle mixed values', () => {
        const result = generateSkillPolygon([100, 0, 50, 75], params);

        expect(result.points).toHaveLength(4);
        // First point (value 100) should be at max distance
        expect(result.points[0].y).toBeCloseTo(params.center - params.radius);
        // Second point (value 0) should be at center
        expect(result.points[1].x).toBeCloseTo(params.center);
        expect(result.points[1].y).toBeCloseTo(params.center);
    });
});

describe('calculateAngleDegrees', () => {
    it('should convert radians to degrees with 90° offset', () => {
        // Input is in code system where 0 = right
        // Output should be in visual system where 0 = top
        expect(calculateAngleDegrees(-Math.PI / 2)).toBeCloseTo(0); // top
        expect(calculateAngleDegrees(0)).toBeCloseTo(90); // right
        expect(calculateAngleDegrees(Math.PI / 2)).toBeCloseTo(180); // bottom
        expect(calculateAngleDegrees(Math.PI)).toBeCloseTo(270); // left
    });

    it('should handle negative angles', () => {
        const result = calculateAngleDegrees(-Math.PI);
        expect(result).toBeCloseTo(-90);
    });
});
