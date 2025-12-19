/**
 * Blog Category Colors
 * Centralized color definitions for blog categories
 * Using OKLCH format from the site's color palette
 */

export interface CategoryColorConfig {
    bg: string;
    shadow: string;
}

/**
 * Category colors mapped by category name
 * Colors use OKLCH format for consistency with Tailwind config
 */
export const categoryColors: Record<string, CategoryColorConfig> = {
    // Primary categories - darker for better contrast with dark text
    Frontend: {
        bg: 'oklch(0.50 0.20 188)',
        shadow: 'oklch(0.50 0.20 188 / 0.3)'
    },
    Programming: {
        bg: 'oklch(0.55 0.16 200)',
        shadow: 'oklch(0.55 0.16 200 / 0.3)'
    },
    'Web Development': {
        bg: 'oklch(0.55 0.16 150)',
        shadow: 'oklch(0.55 0.16 150 / 0.3)'
    },
    Tutorial: {
        bg: 'oklch(0.52 0.18 280)',
        shadow: 'oklch(0.52 0.18 280 / 0.3)'
    },
    Guide: {
        bg: 'oklch(0.52 0.20 40)',
        shadow: 'oklch(0.52 0.20 40 / 0.3)'
    },
    Article: {
        bg: 'oklch(0.50 0.16 220)',
        shadow: 'oklch(0.50 0.16 220 / 0.3)'
    },
    // Tech-specific categories
    JavaScript: {
        bg: 'oklch(0.58 0.16 85)',
        shadow: 'oklch(0.58 0.16 85 / 0.3)'
    },
    TypeScript: {
        bg: 'oklch(0.50 0.18 230)',
        shadow: 'oklch(0.50 0.18 230 / 0.3)'
    },
    React: {
        bg: 'oklch(0.52 0.16 200)',
        shadow: 'oklch(0.52 0.16 200 / 0.3)'
    },
    Astro: {
        bg: 'oklch(0.52 0.20 15)',
        shadow: 'oklch(0.52 0.20 15 / 0.3)'
    },
    CSS: {
        bg: 'oklch(0.50 0.20 260)',
        shadow: 'oklch(0.50 0.20 260 / 0.3)'
    },
    'Node.js': {
        bg: 'oklch(0.52 0.18 140)',
        shadow: 'oklch(0.52 0.18 140 / 0.3)'
    },
    API: {
        bg: 'oklch(0.50 0.16 170)',
        shadow: 'oklch(0.50 0.16 170 / 0.3)'
    },
    Database: {
        bg: 'oklch(0.48 0.14 250)',
        shadow: 'oklch(0.48 0.14 250 / 0.3)'
    },
    DevOps: {
        bg: 'oklch(0.45 0.16 220)',
        shadow: 'oklch(0.45 0.16 220 / 0.3)'
    },
    Testing: {
        bg: 'oklch(0.52 0.16 160)',
        shadow: 'oklch(0.52 0.16 160 / 0.3)'
    },
    Performance: {
        bg: 'oklch(0.55 0.18 60)',
        shadow: 'oklch(0.55 0.18 60 / 0.3)'
    },
    Security: {
        bg: 'oklch(0.50 0.20 0)',
        shadow: 'oklch(0.50 0.20 0 / 0.3)'
    },
    Accessibility: {
        bg: 'oklch(0.52 0.16 180)',
        shadow: 'oklch(0.52 0.16 180 / 0.3)'
    },
    SEO: {
        bg: 'oklch(0.52 0.14 130)',
        shadow: 'oklch(0.52 0.14 130 / 0.3)'
    },
    Design: {
        bg: 'oklch(0.52 0.20 320)',
        shadow: 'oklch(0.52 0.20 320 / 0.3)'
    },
    'UI/UX': {
        bg: 'oklch(0.52 0.18 300)',
        shadow: 'oklch(0.52 0.18 300 / 0.3)'
    }
};

/**
 * Default color for unknown categories
 */
export const defaultCategoryColor: CategoryColorConfig = {
    bg: 'oklch(0.50 0.16 220)',
    shadow: 'oklch(0.50 0.16 220 / 0.3)'
};

/**
 * Get color config for a category
 */
export function getCategoryColor(category: string): CategoryColorConfig {
    return categoryColors[category] || defaultCategoryColor;
}

/**
 * Get just the background color for a category
 */
export function getCategoryBgColor(category: string): string {
    return (categoryColors[category] || defaultCategoryColor).bg;
}

/**
 * Rotating colors for lists (home section)
 * Returns colors in a cycle for indexed items
 */
export const rotatingColors: CategoryColorConfig[] = [
    categoryColors.Frontend,
    categoryColors.Programming,
    categoryColors['Web Development']
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
 * Distinguishable but within the brand color family
 */
export const secondaryCardColors: string[] = [
    'oklch(0.52 0.16 187)', // Cyan (primary tone) - darker
    'oklch(0.50 0.14 172)', // Teal (secondary tone) - darker
    'oklch(0.52 0.16 155)', // Sea Green - darker
    'oklch(0.48 0.12 210)', // Deep Blue - darker
    'oklch(0.50 0.14 142)' // Emerald (tertiary tone) - darker
];

/**
 * Get a secondary card color by index
 */
export function getSecondaryCardColor(index: number): string {
    return secondaryCardColors[index % secondaryCardColors.length];
}
