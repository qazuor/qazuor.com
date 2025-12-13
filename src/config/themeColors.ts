/**
 * Centralized theme color configuration
 *
 * This file is the SINGLE SOURCE OF TRUTH for all theme colors.
 * Colors defined here are used to generate:
 * - CSS custom properties in global.css
 * - Giscus theme files (public/styles/giscus-custom*.css)
 * - Any other generated CSS that needs theme colors
 *
 * IMPORTANT: After changing colors, run `npm run generate-theme-css` to regenerate all files.
 */

/**
 * RGB color values (0-255)
 */
export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

/**
 * Theme color palette
 */
export interface ThemeColorPalette {
    /** Primary brand color - Ocean Blue */
    primary: RGBColor;
    /** Darker version of primary */
    primaryDark: RGBColor;
    /** Secondary accent color - Cyan */
    secondary: RGBColor;
    /** Tertiary accent color - Coral */
    tertiary: RGBColor;
}

/**
 * Ocean Depths Theme - Primary color palette
 * This is the main theme used throughout the site
 */
export const oceanDepthsColors: ThemeColorPalette = {
    primary: { r: 0, g: 119, b: 182 }, // #0077B6
    primaryDark: { r: 0, g: 95, b: 146 }, // #005F92
    secondary: { r: 0, g: 180, b: 216 }, // #00B4D8
    tertiary: { r: 255, g: 107, b: 107 } // #FF6B6B
};

/**
 * Text colors for different modes
 */
export interface TextColors {
    default: string;
    muted: string;
    subtle: string;
}

export const darkModeTextColors: TextColors = {
    default: '#e2e8f0',
    muted: '#94a3b8',
    subtle: '#64748b'
};

export const lightModeTextColors: TextColors = {
    default: '#1e293b',
    muted: '#475569',
    subtle: '#64748b'
};

/**
 * Helper function to convert RGB to CSS rgb() string
 */
export function rgbToString(color: RGBColor): string {
    return `${color.r}, ${color.g}, ${color.b}`;
}

/**
 * Helper function to convert RGB to CSS rgb() full notation
 */
export function rgbToFull(color: RGBColor): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Helper function to convert RGB to hex string
 */
export function rgbToHex(color: RGBColor): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Helper function to convert RGB to rgba() string with alpha
 */
export function rgbToRgba(color: RGBColor, alpha: number): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

// Export the current active theme colors
export const themeColors = oceanDepthsColors;
export default themeColors;
