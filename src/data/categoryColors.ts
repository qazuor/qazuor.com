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
    // Primary categories
    Frontend: {
        bg: 'oklch(0.55 0.22 188)',
        shadow: 'oklch(0.55 0.22 188 / 0.3)'
    },
    Programming: {
        bg: 'oklch(0.70 0.18 200)',
        shadow: 'oklch(0.70 0.18 200 / 0.3)'
    },
    'Web Development': {
        bg: 'oklch(0.70 0.18 150)',
        shadow: 'oklch(0.70 0.18 150 / 0.3)'
    },
    Tutorial: {
        bg: 'oklch(0.65 0.20 280)',
        shadow: 'oklch(0.65 0.20 280 / 0.3)'
    },
    Guide: {
        bg: 'oklch(0.60 0.22 40)',
        shadow: 'oklch(0.60 0.22 40 / 0.3)'
    },
    Article: {
        bg: 'oklch(0.55 0.18 220)',
        shadow: 'oklch(0.55 0.18 220 / 0.3)'
    },
    // Tech-specific categories
    JavaScript: {
        bg: 'oklch(0.75 0.18 85)',
        shadow: 'oklch(0.75 0.18 85 / 0.3)'
    },
    TypeScript: {
        bg: 'oklch(0.55 0.20 230)',
        shadow: 'oklch(0.55 0.20 230 / 0.3)'
    },
    React: {
        bg: 'oklch(0.65 0.18 200)',
        shadow: 'oklch(0.65 0.18 200 / 0.3)'
    },
    Astro: {
        bg: 'oklch(0.60 0.22 15)',
        shadow: 'oklch(0.60 0.22 15 / 0.3)'
    },
    CSS: {
        bg: 'oklch(0.55 0.22 260)',
        shadow: 'oklch(0.55 0.22 260 / 0.3)'
    },
    'Node.js': {
        bg: 'oklch(0.60 0.20 140)',
        shadow: 'oklch(0.60 0.20 140 / 0.3)'
    },
    API: {
        bg: 'oklch(0.58 0.18 170)',
        shadow: 'oklch(0.58 0.18 170 / 0.3)'
    },
    Database: {
        bg: 'oklch(0.55 0.15 250)',
        shadow: 'oklch(0.55 0.15 250 / 0.3)'
    },
    DevOps: {
        bg: 'oklch(0.50 0.18 220)',
        shadow: 'oklch(0.50 0.18 220 / 0.3)'
    },
    Testing: {
        bg: 'oklch(0.65 0.18 160)',
        shadow: 'oklch(0.65 0.18 160 / 0.3)'
    },
    Performance: {
        bg: 'oklch(0.70 0.20 60)',
        shadow: 'oklch(0.70 0.20 60 / 0.3)'
    },
    Security: {
        bg: 'oklch(0.55 0.22 0)',
        shadow: 'oklch(0.55 0.22 0 / 0.3)'
    },
    Accessibility: {
        bg: 'oklch(0.60 0.18 180)',
        shadow: 'oklch(0.60 0.18 180 / 0.3)'
    },
    SEO: {
        bg: 'oklch(0.65 0.15 130)',
        shadow: 'oklch(0.65 0.15 130 / 0.3)'
    },
    Design: {
        bg: 'oklch(0.60 0.22 320)',
        shadow: 'oklch(0.60 0.22 320 / 0.3)'
    },
    'UI/UX': {
        bg: 'oklch(0.65 0.20 300)',
        shadow: 'oklch(0.65 0.20 300 / 0.3)'
    }
};

/**
 * Default color for unknown categories
 */
export const defaultCategoryColor: CategoryColorConfig = {
    bg: 'oklch(0.55 0.18 220)',
    shadow: 'oklch(0.55 0.18 220 / 0.3)'
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
