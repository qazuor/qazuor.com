/**
 * Color Helper Functions
 *
 * This file provides color conversion utilities and derived color objects
 * for components that need RGBColor format (OG images, Giscus, etc.).
 *
 * All source colors come from src/config/themeConfig.ts (the single source of truth).
 *
 * Used by:
 * - src/components/layout/SEO.astro (theme-color meta tag)
 * - src/utils/og-image/generate.ts (OG image colors)
 * - scripts/generate-giscus-css.ts (Giscus comment widget themes)
 *
 * NOTE: To change theme colors, edit src/config/themeConfig.ts
 */

import { darkTheme, lightTheme } from './themeConfig';

// Re-export TextColors for backwards compatibility
export type { TextColors } from './themeConfig';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * RGB color values (0-255)
 */
export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

/**
 * Theme color palette with RGBColor objects
 */
export interface ThemeColorPalette {
    /** Primary brand color */
    primary: RGBColor;
    /** Darker version of primary */
    primaryDark: RGBColor;
    /** Secondary accent color */
    secondary: RGBColor;
    /** Tertiary accent color */
    tertiary: RGBColor;
}

// ============================================
// COLOR CONVERSION HELPERS
// ============================================

/**
 * Parse RGB string "r, g, b" to RGBColor object
 */
export function parseRGBString(rgbString: string): RGBColor {
    const parts = rgbString.split(',').map((s) => parseInt(s.trim(), 10));
    return { r: parts[0], g: parts[1], b: parts[2] };
}

/**
 * Convert RGBColor to CSS rgb() comma-separated string (for rgba() usage)
 * @example rgbToString({ r: 59, g: 130, b: 246 }) => "59, 130, 246"
 */
export function rgbToString(color: RGBColor): string {
    return `${color.r}, ${color.g}, ${color.b}`;
}

/**
 * Convert RGBColor to CSS rgb() full notation
 * @example rgbToFull({ r: 59, g: 130, b: 246 }) => "rgb(59, 130, 246)"
 */
export function rgbToFull(color: RGBColor): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Convert RGBColor to hex string
 * @example rgbToHex({ r: 59, g: 130, b: 246 }) => "#3b82f6"
 */
export function rgbToHex(color: RGBColor): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Convert RGBColor to rgba() string with alpha
 * @example rgbToRgba({ r: 59, g: 130, b: 246 }, 0.5) => "rgba(59, 130, 246, 0.5)"
 */
export function rgbToRgba(color: RGBColor, alpha: number): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

// ============================================
// DERIVED COLOR PALETTES
// ============================================

/**
 * Light theme color palette (Ocean Depths)
 * Derived from lightTheme in themeConfig.ts
 */
export const lightThemeColors: ThemeColorPalette = {
    primary: parseRGBString(lightTheme.colors.colorPrimary),
    primaryDark: parseRGBString(lightTheme.colors.colorPrimaryDark),
    secondary: parseRGBString(lightTheme.colors.colorSecondary),
    tertiary: parseRGBString(lightTheme.colors.colorTertiary)
};

/**
 * Dark theme color palette (Slate Steel)
 * Derived from darkTheme in themeConfig.ts
 */
export const darkThemeColors: ThemeColorPalette = {
    primary: parseRGBString(darkTheme.colors.colorPrimary),
    primaryDark: parseRGBString(darkTheme.colors.colorPrimaryDark),
    secondary: parseRGBString(darkTheme.colors.colorSecondary),
    tertiary: parseRGBString(darkTheme.colors.colorTertiary)
};

// ============================================
// EXPORTS FOR BACKWARDS COMPATIBILITY
// ============================================

/**
 * Default theme colors (uses light theme for Giscus compatibility)
 * @deprecated Use lightThemeColors or darkThemeColors instead
 */
export const oceanDepthsColors = lightThemeColors;

/**
 * Current active theme colors
 * Uses light theme as default (same as oceanDepthsColors)
 */
export const themeColors = lightThemeColors;
