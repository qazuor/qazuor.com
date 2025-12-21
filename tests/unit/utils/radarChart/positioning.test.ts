import { describe, expect, it } from 'vitest';
import {
    angleToUserDegrees,
    calculateBadgeDimensions,
    calculateBadgePosition,
    calculateFontSize,
    calculateLabelPosition,
    calculateLineHeight,
    calculateMultiLineStartY,
    calculateTextAnchor,
    calculateTooltipPosition,
    getSectorConfig,
    SECTOR_CONFIG
} from '@/utils/radarChart/positioning';

describe('angleToUserDegrees', () => {
    it('should convert top position (-π/2) to 0°', () => {
        expect(angleToUserDegrees(-Math.PI / 2)).toBeCloseTo(0);
    });

    it('should convert right position (0) to 90°', () => {
        expect(angleToUserDegrees(0)).toBeCloseTo(90);
    });

    it('should convert bottom position (π/2) to 180°', () => {
        expect(angleToUserDegrees(Math.PI / 2)).toBeCloseTo(180);
    });

    it('should convert left position (π) to 270°', () => {
        expect(angleToUserDegrees(Math.PI)).toBeCloseTo(270);
    });

    it('should normalize angles to 0-360 range', () => {
        // Full rotation should wrap
        const result = angleToUserDegrees(2 * Math.PI - Math.PI / 2);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(360);
    });

    it('should handle negative angles', () => {
        const result = angleToUserDegrees(-Math.PI);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(360);
    });
});

describe('SECTOR_CONFIG', () => {
    it('should have 17 sectors covering full 360°', () => {
        expect(SECTOR_CONFIG).toHaveLength(17);
    });

    it('should start at 0° and end at 360°', () => {
        expect(SECTOR_CONFIG[0].minAngle).toBe(0);
        expect(SECTOR_CONFIG[SECTOR_CONFIG.length - 1].maxAngle).toBe(360);
    });

    it('should have no gaps between sectors', () => {
        for (let i = 1; i < SECTOR_CONFIG.length; i++) {
            expect(SECTOR_CONFIG[i].minAngle).toBe(SECTOR_CONFIG[i - 1].maxAngle);
        }
    });

    it('should have valid textAnchor values', () => {
        const validAnchors = ['start', 'middle', 'end'];
        for (const sector of SECTOR_CONFIG) {
            expect(validAnchors).toContain(sector.textAnchor);
        }
    });
});

describe('getSectorConfig', () => {
    it('should return first sector for 0°', () => {
        const sector = getSectorConfig(0);
        expect(sector.textAnchor).toBe('middle');
        expect(sector.offsetY).toBe(-10);
    });

    it('should return correct sector for 90° (right)', () => {
        const sector = getSectorConfig(90);
        expect(sector.textAnchor).toBe('start');
    });

    it('should return correct sector for 180° (bottom)', () => {
        const sector = getSectorConfig(180);
        expect(sector.textAnchor).toBe('middle');
        expect(sector.offsetY).toBe(10);
    });

    it('should return correct sector for 270° (left)', () => {
        const sector = getSectorConfig(270);
        expect(sector.textAnchor).toBe('end');
    });

    it('should handle angles >= 360° by normalizing', () => {
        const sector360 = getSectorConfig(360);
        const sector0 = getSectorConfig(0);
        expect(sector360.textAnchor).toBe(sector0.textAnchor);
    });

    it('should handle negative angles by normalizing', () => {
        const sectorNeg90 = getSectorConfig(-90);
        const sector270 = getSectorConfig(270);
        expect(sectorNeg90.textAnchor).toBe(sector270.textAnchor);
    });
});

describe('calculateTextAnchor', () => {
    it('should return middle for top position', () => {
        expect(calculateTextAnchor(-Math.PI / 2)).toBe('middle');
    });

    it('should return start for right region', () => {
        expect(calculateTextAnchor(0)).toBe('start');
    });

    it('should return middle for bottom position', () => {
        expect(calculateTextAnchor(Math.PI / 2)).toBe('middle');
    });

    it('should return end for left region', () => {
        expect(calculateTextAnchor(Math.PI)).toBe('end');
    });
});

describe('calculateLabelPosition', () => {
    const center = 200;
    const radius = 100;

    it('should position label beyond the icon', () => {
        const position = calculateLabelPosition(-Math.PI / 2, radius, center);
        // Top position: y should be less than center - radius
        expect(position.y).toBeLessThan(center - radius);
    });

    it('should apply sector-based offsets', () => {
        // Top position should have negative y offset
        const topPos = calculateLabelPosition(-Math.PI / 2, radius, center);
        // Right position should have positive x offset
        const rightPos = calculateLabelPosition(0, radius, center);

        expect(topPos.x).toBeCloseTo(center);
        expect(rightPos.x).toBeGreaterThan(center + radius);
    });

    it('should use custom base distance', () => {
        const closePos = calculateLabelPosition(-Math.PI / 2, radius, center, 30);
        const farPos = calculateLabelPosition(-Math.PI / 2, radius, center, 80);

        expect(farPos.y).toBeLessThan(closePos.y); // farther from center = smaller y at top
    });

    it('should round positions to avoid hydration issues', () => {
        const position = calculateLabelPosition(Math.PI / 6, radius, center);
        // Check that values are rounded (max 2 decimal places)
        expect(position.x.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        expect(position.y.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
});

describe('calculateLineHeight', () => {
    it('should return 22 for mobile', () => {
        expect(calculateLineHeight(false, true)).toBe(22);
        expect(calculateLineHeight(true, true)).toBe(22);
    });

    it('should return 16 for desktop', () => {
        expect(calculateLineHeight(false, false)).toBe(16);
        expect(calculateLineHeight(true, false)).toBe(16);
    });

    it('should ignore isHighlighted parameter (constant values)', () => {
        expect(calculateLineHeight(true, true)).toBe(calculateLineHeight(false, true));
        expect(calculateLineHeight(true, false)).toBe(calculateLineHeight(false, false));
    });
});

describe('calculateMultiLineStartY', () => {
    it('should return adjusted y for single line', () => {
        const result = calculateMultiLineStartY(100, 1, 16);
        expect(result).toBe(100 - 6); // baseY - 6
    });

    it('should center multi-line text vertically', () => {
        const lineHeight = 16;
        const baseY = 100;

        const twoLines = calculateMultiLineStartY(baseY, 2, lineHeight);
        const threeLines = calculateMultiLineStartY(baseY, 3, lineHeight);

        // More lines should start higher (smaller y)
        expect(threeLines).toBeLessThan(twoLines);
    });

    it('should account for line height', () => {
        const baseY = 100;
        const numLines = 3;

        const smallHeight = calculateMultiLineStartY(baseY, numLines, 10);
        const largeHeight = calculateMultiLineStartY(baseY, numLines, 20);

        expect(largeHeight).toBeLessThan(smallHeight);
    });
});

describe('calculateTooltipPosition', () => {
    const center = 200;
    const svgSize = 400;
    const tooltipWidth = 220;
    const tooltipHeight = 100;

    it('should position tooltip above for top region', () => {
        // Top region: 315° to 45°
        const angleTop = -Math.PI / 2; // 0° in user degrees
        const position = calculateTooltipPosition(200, 50, angleTop, center, svgSize, tooltipWidth, tooltipHeight);

        expect(position.y).toBeLessThan(50); // Above the label
    });

    it('should position tooltip to right for right region', () => {
        // Right region: 45° to 135°
        const angleRight = 0; // 90° in user degrees
        const position = calculateTooltipPosition(350, 200, angleRight, center, svgSize, tooltipWidth, tooltipHeight);

        // Should try to go right, but constrained by bounds
        expect(position.x).toBeGreaterThanOrEqual(15); // padding
    });

    it('should position tooltip below for bottom region', () => {
        // Bottom region: 135° to 225°
        const angleBottom = Math.PI / 2; // 180° in user degrees
        const position = calculateTooltipPosition(200, 350, angleBottom, center, svgSize, tooltipWidth, tooltipHeight);

        // Constrained by bottom edge
        expect(position.y + tooltipHeight).toBeLessThanOrEqual(svgSize - 15);
    });

    it('should position tooltip to left for left region', () => {
        // Left region: 225° to 315°
        const angleLeft = Math.PI; // 270° in user degrees
        const position = calculateTooltipPosition(50, 200, angleLeft, center, svgSize, tooltipWidth, tooltipHeight);

        expect(position.x).toBeGreaterThanOrEqual(15); // Constrained by left edge
    });

    it('should keep tooltip within SVG bounds', () => {
        // Try to place tooltip at extreme positions
        const positions = [
            calculateTooltipPosition(10, 10, -Math.PI / 2, center, svgSize, tooltipWidth, tooltipHeight),
            calculateTooltipPosition(390, 390, Math.PI / 2, center, svgSize, tooltipWidth, tooltipHeight),
            calculateTooltipPosition(10, 390, Math.PI, center, svgSize, tooltipWidth, tooltipHeight),
            calculateTooltipPosition(390, 10, 0, center, svgSize, tooltipWidth, tooltipHeight)
        ];

        for (const pos of positions) {
            expect(pos.x).toBeGreaterThanOrEqual(15);
            expect(pos.y).toBeGreaterThanOrEqual(15);
            expect(pos.x + tooltipWidth).toBeLessThanOrEqual(svgSize - 15);
            expect(pos.y + tooltipHeight).toBeLessThanOrEqual(svgSize - 15);
        }
    });
});

describe('calculateFontSize', () => {
    const sizes = {
        highlightedMobile: 20,
        highlightedDesktop: 13,
        normalMobile: 18,
        normalDesktop: 13
    };

    it('should return highlighted mobile size', () => {
        expect(calculateFontSize(true, true, sizes)).toBe(20);
    });

    it('should return highlighted desktop size', () => {
        expect(calculateFontSize(true, false, sizes)).toBe(13);
    });

    it('should return normal mobile size', () => {
        expect(calculateFontSize(false, true, sizes)).toBe(18);
    });

    it('should return normal desktop size', () => {
        expect(calculateFontSize(false, false, sizes)).toBe(13);
    });
});

describe('calculateBadgeDimensions', () => {
    it('should return larger dimensions for mobile', () => {
        const mobile = calculateBadgeDimensions(true);
        const desktop = calculateBadgeDimensions(false);

        expect(mobile.width).toBeGreaterThan(desktop.width);
        expect(mobile.height).toBeGreaterThan(desktop.height);
        expect(mobile.rx).toBeGreaterThan(desktop.rx);
    });

    it('should return correct mobile dimensions', () => {
        const mobile = calculateBadgeDimensions(true);
        expect(mobile.width).toBe(48);
        expect(mobile.height).toBe(22);
        expect(mobile.rx).toBe(11);
    });

    it('should return correct desktop dimensions', () => {
        const desktop = calculateBadgeDimensions(false);
        expect(desktop.width).toBe(36);
        expect(desktop.height).toBe(16);
        expect(desktop.rx).toBe(8);
    });
});

describe('calculateBadgePosition', () => {
    it('should center badge horizontally on label', () => {
        const labelX = 200;
        const position = calculateBadgePosition(labelX, 100, 1, 16, false);

        const dimensions = calculateBadgeDimensions(false);
        expect(position.x).toBe(labelX - dimensions.width / 2);
    });

    it('should position badge below text lines', () => {
        const labelY = 100;
        const lineHeight = 16;

        const singleLine = calculateBadgePosition(200, labelY, 1, lineHeight, false);
        const multiLine = calculateBadgePosition(200, labelY, 3, lineHeight, false);

        expect(multiLine.y).toBeGreaterThan(singleLine.y);
    });

    it('should have different vertical offset for mobile', () => {
        const mobilePos = calculateBadgePosition(200, 100, 1, 16, true);
        const desktopPos = calculateBadgePosition(200, 100, 1, 16, false);

        expect(mobilePos.y).not.toBe(desktopPos.y);
    });
});
