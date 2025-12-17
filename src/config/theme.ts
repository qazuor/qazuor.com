/**
 * Centralized theme configuration for spacing, typography, and design tokens
 *
 * This file provides type-safe access to design system tokens used throughout
 * the application. Values are kept in sync with tailwind.config.js.
 *
 * @example
 * ```tsx
 * import { spacing, typography, borderRadius } from '@/config/theme';
 *
 * // Use in inline styles or programmatic styling
 * <div style={{ padding: spacing[4], fontSize: typography.fontSize.base }}>
 *   Content
 * </div>
 * ```
 */

/**
 * Spacing scale based on rem units
 * Synced with tailwind.config.js spacing configuration
 */
export const spacing = {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem' // 128px
} as const;

/**
 * Font size scale with responsive clamp values and line heights
 * Synced with tailwind.config.js fontSize configuration
 */
export const typography = {
    fontSize: {
        xs: {
            size: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
            lineHeight: '1.5'
        },
        sm: {
            size: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
            lineHeight: '1.5'
        },
        base: {
            size: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: '1.5'
        },
        lg: {
            size: 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
            lineHeight: '1.5'
        },
        xl: {
            size: 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
            lineHeight: '1.2'
        },
        '2xl': {
            size: 'clamp(2rem, 1.6rem + 2vw, 3rem)',
            lineHeight: '1.2'
        },
        '3xl': {
            size: 'clamp(2.5rem, 2rem + 2.5vw, 4rem)',
            lineHeight: '1.2'
        },
        '4xl': {
            size: 'clamp(3rem, 2.5rem + 2.5vw, 5rem)',
            lineHeight: '1.2'
        }
    },
    fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'].join(', '),
        mono: ['JetBrains Mono', 'Courier New', 'monospace'].join(', ')
    },
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
    }
} as const;

/**
 * Border radius scale
 * Synced with tailwind.config.js borderRadius configuration
 */
export const borderRadius = {
    xs: '0.25rem', // 4px - small badges, pills
    sm: '0.375rem', // 6px - inputs, small buttons
    DEFAULT: '0.5rem', // 8px - default
    md: '0.5rem', // 8px - buttons, small elements
    lg: '0.75rem', // 12px - cards (standard)
    xl: '1rem', // 16px - hero sections, featured cards
    '2xl': '1.5rem', // 24px - large containers
    full: '9999px' // circles
} as const;

/**
 * Scale values for hover effects
 * Synced with tailwind.config.js scale configuration
 */
export const scale = {
    subtle: '1.02', // cards, previews (standard hover)
    medium: '1.05', // buttons, interactive elements
    emphasis: '1.1' // icons, CTAs
} as const;

/**
 * Box shadow scale with glow effects
 * Synced with tailwind.config.js boxShadow configuration
 */
export const boxShadow = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgb(16 185 129 / 0.3)',
    'glow-primary': '0 0 20px oklch(0.55 0.22 160 / 0.3)',
    'glow-secondary': '0 0 20px oklch(0.70 0.18 160 / 0.3)',
    none: 'none'
} as const;

/**
 * Transition duration scale
 * Synced with tailwind.config.js transitionDuration configuration
 */
export const transition = {
    duration: {
        fast: '150ms',
        base: '300ms',
        DEFAULT: '300ms',
        slow: '500ms',
        slower: '700ms'
    },
    timing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)', // elements leaving
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)', // elements entering
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // standard (default)
        spring: 'cubic-bezier(0.27, 0.22, 0.44, 1.03)', // bouncy animations
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // emphasis, success states
    }
} as const;

/**
 * Z-index scale for consistent layering
 */
export const zIndex = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
} as const;

/**
 * Breakpoints for responsive design
 * Synced with Tailwind's default breakpoints
 */
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
} as const;

/**
 * Type definitions for theme values
 */
export type SpacingKey = keyof typeof spacing;
export type FontSizeKey = keyof typeof typography.fontSize;
export type FontFamilyKey = keyof typeof typography.fontFamily;
export type FontWeightKey = keyof typeof typography.fontWeight;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ScaleKey = keyof typeof scale;
export type BoxShadowKey = keyof typeof boxShadow;
export type TransitionDurationKey = keyof typeof transition.duration;
export type TransitionTimingKey = keyof typeof transition.timing;
export type ZIndexKey = keyof typeof zIndex;
export type BreakpointKey = keyof typeof breakpoints;

/**
 * Utility function to get spacing value
 */
export function getSpacing(key: SpacingKey): string {
    return spacing[key];
}

/**
 * Utility function to get font size with line height
 */
export function getFontSize(key: FontSizeKey): { size: string; lineHeight: string } {
    return typography.fontSize[key];
}

/**
 * Utility function to create CSS custom property
 */
export function cssVar(name: string): string {
    return `var(--${name})`;
}

/**
 * Utility function to build transition string
 */
export function buildTransition(
    property: string | string[],
    duration: TransitionDurationKey = 'base',
    timing: TransitionTimingKey = 'easeInOut'
): string {
    const props = Array.isArray(property) ? property.join(', ') : property;
    return `${props} ${transition.duration[duration]} ${transition.timing[timing]}`;
}

/**
 * Export all theme configuration as a single object
 */
export const theme = {
    spacing,
    typography,
    borderRadius,
    scale,
    boxShadow,
    transition,
    zIndex,
    breakpoints
} as const;

export default theme;
