/**
 * Blog Category Colors
 * Centralized color definitions for blog categories
 * Using OKLCH format - colors chosen to be distinct within Deep Ocean theme
 *
 * OKLCH format: oklch(lightness chroma hue)
 * - Lightness: 0.42-0.50 for good contrast with white text
 * - Chroma: 0.14-0.20 for vibrant but not garish colors
 * - Hue: Spread across the color wheel, favoring blues/cyans/greens
 */

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
 * Category colors mapped by category name
 * Includes both Spanish and English variants
 *
 * Color palette designed for:
 * - Clear visual distinction between categories
 * - Harmony with Deep Ocean theme (blues, cyans, teals, greens)
 * - Good contrast with white text
 */
export const categoryColors: Record<string, CategoryColorConfig> = {
    // ==========================================
    // PRIMARY BLOG CATEGORIES (actively used)
    // ==========================================

    // Frontend - Cyan (theme primary color)
    Frontend: createColor(0.48, 0.16, 195),

    // Productivity / Productividad - Teal-green
    Productivity: createColor(0.45, 0.14, 168),
    Productividad: createColor(0.45, 0.14, 168),

    // Development - Deep blue
    Development: createColor(0.45, 0.18, 240),

    // Architecture / Arquitectura - Blue-violet
    Architecture: createColor(0.42, 0.18, 270),
    Arquitectura: createColor(0.42, 0.18, 270),

    // Performance - Amber/Orange (accent, stands out)
    Performance: createColor(0.52, 0.16, 55),

    // Product / Producto - Emerald green
    Product: createColor(0.45, 0.15, 150),
    Producto: createColor(0.45, 0.15, 150),

    // Business / Negocio - Purple-magenta
    Business: createColor(0.45, 0.16, 310),
    Negocio: createColor(0.45, 0.16, 310),

    // General - Slate blue (neutral)
    General: createColor(0.48, 0.12, 220),

    // ==========================================
    // TECH-SPECIFIC CATEGORIES
    // ==========================================

    // JavaScript - Yellow (brand color)
    JavaScript: createColor(0.55, 0.15, 85),

    // TypeScript - Blue (brand color)
    TypeScript: createColor(0.45, 0.16, 230),

    // React - Cyan (brand color)
    React: createColor(0.5, 0.16, 195),

    // Astro - Orange-red (brand color)
    Astro: createColor(0.5, 0.18, 25),

    // CSS - Purple (brand association)
    CSS: createColor(0.48, 0.18, 280),

    // Node.js - Green (brand color)
    'Node.js': createColor(0.48, 0.16, 140),

    // ==========================================
    // SECONDARY CATEGORIES
    // ==========================================

    // Programming - Blue
    Programming: createColor(0.48, 0.14, 225),

    // Web Development - Teal
    'Web Development': createColor(0.48, 0.14, 175),

    // Tutorial - Purple
    Tutorial: createColor(0.48, 0.16, 290),

    // Guide - Orange
    Guide: createColor(0.5, 0.16, 45),

    // Article - Steel blue
    Article: createColor(0.48, 0.12, 215),

    // API - Deep teal
    API: createColor(0.45, 0.14, 180),

    // Database - Indigo
    Database: createColor(0.42, 0.14, 260),

    // DevOps - Dark blue
    DevOps: createColor(0.4, 0.14, 235),

    // Testing - Green-teal
    Testing: createColor(0.48, 0.14, 160),

    // Security - Red (warning association)
    Security: createColor(0.45, 0.18, 15),

    // Accessibility - Blue-green
    Accessibility: createColor(0.48, 0.14, 185),

    // SEO - Green
    SEO: createColor(0.48, 0.12, 145),

    // Design - Pink-magenta
    Design: createColor(0.48, 0.18, 330),

    // UI/UX - Purple
    'UI/UX': createColor(0.48, 0.16, 305)
};

/**
 * Default color for unknown categories
 * Uses a neutral slate blue that fits the theme
 */
export const defaultCategoryColor: CategoryColorConfig = createColor(0.48, 0.12, 220);

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
    categoryColors.Productivity,
    categoryColors.Development
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
    'oklch(0.48 0.16 195)', // Cyan (primary tone)
    'oklch(0.45 0.14 168)', // Teal (secondary tone)
    'oklch(0.45 0.15 150)', // Emerald
    'oklch(0.45 0.18 240)', // Deep Blue
    'oklch(0.42 0.18 270)' // Blue-violet
];

/**
 * Get a secondary card color by index
 */
export function getSecondaryCardColor(index: number): string {
    return secondaryCardColors[index % secondaryCardColors.length];
}
