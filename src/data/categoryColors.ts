/**
 * Blog Category Colors
 * Centralized color definitions for blog categories
 * Using OKLCH format - colors chosen to be distinct within Deep Ocean theme
 *
 * OKLCH format: oklch(lightness chroma hue)
 * - Lightness: 0.42-0.50 for good contrast with white text
 * - Chroma: 0.14-0.20 for vibrant but not garish colors
 * - Hue: Blues/cyans/greens from Deep Ocean palette
 */

import type { BlogCategoryKey } from './blogCategories';

export interface CategoryColorConfig {
    bg: string;
    shadow: string;
}

/**
 * Helper to create consistent color config
 */
function createColor(lightness: number, chroma: number, hue: number): CategoryColorConfig {
    return {
        bg: `oklch(${lightness} ${chroma} ${hue})`,
        shadow: `oklch(${lightness} ${chroma} ${hue} / 0.3)`
    };
}

/**
 * Category colors mapped by category key
 * All colors within Deep Ocean palette (blues, cyans, teals, greens)
 */
export const categoryColors: Record<BlogCategoryKey, CategoryColorConfig> = {
    // Frontend - Cyan (theme primary color)
    frontend: createColor(0.48, 0.16, 195),

    // Productivity - Teal-green
    productivity: createColor(0.45, 0.14, 168),

    // Development - Deep blue
    development: createColor(0.45, 0.18, 240),

    // Architecture - Blue-violet
    architecture: createColor(0.42, 0.18, 270),

    // Performance - Sky blue (lighter cyan)
    performance: createColor(0.5, 0.14, 205),

    // Product - Emerald green
    product: createColor(0.45, 0.15, 150),

    // Business - Indigo-purple
    business: createColor(0.45, 0.16, 280),

    // General - Slate blue (neutral)
    general: createColor(0.48, 0.12, 220)
};

/**
 * Default color for unknown categories
 * Uses a neutral slate blue that fits the theme
 */
export const defaultCategoryColor: CategoryColorConfig = createColor(0.48, 0.12, 220);

/**
 * Get color config for a category key
 */
export function getCategoryColor(categoryKey: string): CategoryColorConfig {
    return categoryColors[categoryKey as BlogCategoryKey] || defaultCategoryColor;
}

/**
 * Get just the background color for a category key
 */
export function getCategoryBgColor(categoryKey: string): string {
    return (categoryColors[categoryKey as BlogCategoryKey] || defaultCategoryColor).bg;
}

/**
 * Rotating colors for lists (home section)
 * Returns colors in a cycle for indexed items
 */
export const rotatingColors: CategoryColorConfig[] = [
    categoryColors.frontend,
    categoryColors.productivity,
    categoryColors.development
];

/**
 * Get a rotating color by index
 */
export function getRotatingColor(index: number): CategoryColorConfig {
    return rotatingColors[index % rotatingColors.length];
}

/**
 * Colors for secondary blog cards (CSS-Tricks style)
 * Aligned with site's Deep Ocean palette (cyan/teal/green tones)
 */
export const secondaryCardColors: string[] = [
    categoryColors.frontend.bg,
    categoryColors.productivity.bg,
    categoryColors.product.bg,
    categoryColors.development.bg,
    categoryColors.architecture.bg
];

/**
 * Get a secondary card color by index
 */
export function getSecondaryCardColor(index: number): string {
    return secondaryCardColors[index % secondaryCardColors.length];
}
