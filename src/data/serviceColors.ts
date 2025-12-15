/**
 * Service Colors Configuration
 *
 * Centralized color definitions for all services.
 * Used by ServicesPreviewSection and services/index.astro for pixel effects.
 *
 * Colors are defined as hex values because they're used in:
 * - JavaScript canvas operations (PixelCanvas)
 * - Inline styles
 *
 * Corresponding CSS variables are defined in global.css for CSS usage.
 */

export interface ServicePixelConfig {
    /** Gradient colors for dark mode */
    colors: string[];
    /** Gradient colors for light mode */
    colorsLight: string[];
    /** Active/accent color for dark mode */
    activeColor: string;
    /** Active/accent color for light mode */
    activeColorLight: string;
    /** Pixel gap */
    gap: number;
    /** Animation speed */
    speed: number;
}

/**
 * Pixel effect colors for each service
 * Key matches service ID from services.ts
 */
export const servicePixelColors: Record<string, ServicePixelConfig> = {
    'web-apps': {
        colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9'], // Sky blue gradient
        colorsLight: ['#0369a1', '#0284c7', '#0ea5e9'],
        activeColor: '#0ea5e9',
        activeColorLight: '#0369a1',
        gap: 8,
        speed: 30
    },
    'landing-pages': {
        colors: ['#d1fae5', '#6ee7b7', '#10b981'], // Emerald gradient
        colorsLight: ['#047857', '#059669', '#10b981'],
        activeColor: '#10b981',
        activeColorLight: '#047857',
        gap: 8,
        speed: 30
    },
    'automation-integration': {
        colors: ['#fef08a', '#fde047', '#eab308'], // Yellow gradient
        colorsLight: ['#a16207', '#ca8a04', '#eab308'],
        activeColor: '#eab308',
        activeColorLight: '#a16207',
        gap: 8,
        speed: 30
    },
    'social-media-design': {
        colors: ['#fecdd3', '#fda4af', '#e11d48'], // Rose gradient
        colorsLight: ['#be123c', '#e11d48', '#f43f5e'],
        activeColor: '#e11d48',
        activeColorLight: '#be123c',
        gap: 8,
        speed: 30
    },
    'web-optimization': {
        colors: ['#c4b5fd', '#a78bfa', '#8b5cf6'], // Violet gradient
        colorsLight: ['#6d28d9', '#7c3aed', '#8b5cf6'],
        activeColor: '#8b5cf6',
        activeColorLight: '#6d28d9',
        gap: 8,
        speed: 30
    },
    wordpress: {
        colors: ['#93c5fd', '#60a5fa', '#3b82f6'], // Blue gradient
        colorsLight: ['#1d4ed8', '#2563eb', '#3b82f6'],
        activeColor: '#3b82f6',
        activeColorLight: '#1d4ed8',
        gap: 8,
        speed: 30
    }
};

/**
 * Get pixel config for a specific service
 */
export function getServicePixelConfig(serviceId: string): ServicePixelConfig | undefined {
    return servicePixelColors[serviceId];
}
