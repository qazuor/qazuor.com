/**
 * Service Colors Configuration
 *
 * SINGLE SOURCE OF TRUTH for all service colors across the site.
 * Used by:
 * - ServicesPreviewSection (home page)
 * - services/index.astro (services listing)
 * - services/[slug].astro (service detail)
 * - ComparisonSection (service comparison table)
 *
 * To change a service's color, update it here and it will reflect everywhere.
 */

/**
 * Tailwind classes for service UI elements
 * Used in comparison tables, cards, badges, etc.
 */
export interface ServiceTailwindClasses {
    /** Background with low opacity (e.g., bg-sky-500/10) */
    bgLight: string;
    /** Background with medium opacity (e.g., bg-sky-500/20) */
    bgMedium: string;
    /** Border color (e.g., border-sky-500/30) */
    border: string;
    /** Text color for dark mode (e.g., text-sky-400) */
    textDark: string;
    /** Text color for light mode (e.g., text-sky-600) */
    textLight: string;
}

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

export interface ServiceColorConfig {
    /** Pixel effect configuration for canvas animations */
    pixel: ServicePixelConfig;
    /** Tailwind classes for UI components */
    tailwind: ServiceTailwindClasses;
}

/**
 * Complete service color configuration
 * Key matches service ID from services.ts
 */
export const serviceColors: Record<string, ServiceColorConfig> = {
    'web-apps': {
        pixel: {
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9'], // Sky blue gradient
            colorsLight: ['#0369a1', '#0284c7', '#0ea5e9'],
            activeColor: '#0ea5e9',
            activeColorLight: '#0369a1',
            gap: 8,
            speed: 30
        },
        tailwind: {
            bgLight: 'bg-sky-500/10',
            bgMedium: 'bg-sky-500/20',
            border: 'border-sky-500/30',
            textDark: 'text-sky-400',
            textLight: 'text-sky-600'
        }
    },
    'landing-pages': {
        pixel: {
            colors: ['#d1fae5', '#6ee7b7', '#10b981'], // Emerald gradient
            colorsLight: ['#047857', '#059669', '#10b981'],
            activeColor: '#10b981',
            activeColorLight: '#047857',
            gap: 8,
            speed: 30
        },
        tailwind: {
            bgLight: 'bg-emerald-500/10',
            bgMedium: 'bg-emerald-500/20',
            border: 'border-emerald-500/30',
            textDark: 'text-emerald-400',
            textLight: 'text-emerald-600'
        }
    },
    'automation-integration': {
        pixel: {
            colors: ['#fef08a', '#fde047', '#eab308'], // Yellow gradient
            colorsLight: ['#a16207', '#ca8a04', '#eab308'],
            activeColor: '#eab308',
            activeColorLight: '#a16207',
            gap: 8,
            speed: 30
        },
        tailwind: {
            bgLight: 'bg-yellow-500/10',
            bgMedium: 'bg-yellow-500/20',
            border: 'border-yellow-500/30',
            textDark: 'text-yellow-400',
            textLight: 'text-yellow-600'
        }
    },
    'social-media-design': {
        pixel: {
            colors: ['#fecdd3', '#fda4af', '#e11d48'], // Rose gradient
            colorsLight: ['#be123c', '#e11d48', '#f43f5e'],
            activeColor: '#e11d48',
            activeColorLight: '#be123c',
            gap: 8,
            speed: 30
        },
        tailwind: {
            bgLight: 'bg-rose-500/10',
            bgMedium: 'bg-rose-500/20',
            border: 'border-rose-500/30',
            textDark: 'text-rose-400',
            textLight: 'text-rose-600'
        }
    },
    'web-optimization': {
        pixel: {
            colors: ['#c4b5fd', '#a78bfa', '#8b5cf6'], // Violet gradient
            colorsLight: ['#6d28d9', '#7c3aed', '#8b5cf6'],
            activeColor: '#8b5cf6',
            activeColorLight: '#6d28d9',
            gap: 8,
            speed: 30
        },
        tailwind: {
            bgLight: 'bg-violet-500/10',
            bgMedium: 'bg-violet-500/20',
            border: 'border-violet-500/30',
            textDark: 'text-violet-400',
            textLight: 'text-violet-600'
        }
    },
    wordpress: {
        pixel: {
            colors: ['#93c5fd', '#60a5fa', '#3b82f6'], // Blue gradient
            colorsLight: ['#1d4ed8', '#2563eb', '#3b82f6'],
            activeColor: '#3b82f6',
            activeColorLight: '#1d4ed8',
            gap: 8,
            speed: 30
        },
        tailwind: {
            bgLight: 'bg-blue-500/10',
            bgMedium: 'bg-blue-500/20',
            border: 'border-blue-500/30',
            textDark: 'text-blue-400',
            textLight: 'text-blue-600'
        }
    }
};

/**
 * Legacy export for backwards compatibility
 * @deprecated Use serviceColors[id].pixel instead
 */
export const servicePixelColors: Record<string, ServicePixelConfig> = Object.fromEntries(
    Object.entries(serviceColors).map(([key, value]) => [key, value.pixel])
);

/**
 * Get pixel config for a specific service
 */
export function getServicePixelConfig(serviceId: string): ServicePixelConfig | undefined {
    return serviceColors[serviceId]?.pixel;
}

/**
 * Get Tailwind classes for a specific service
 */
export function getServiceTailwindClasses(serviceId: string): ServiceTailwindClasses | undefined {
    return serviceColors[serviceId]?.tailwind;
}
