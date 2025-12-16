/**
 * Section Background Colors
 *
 * Defines background colors for each major section of the website.
 * Used by color-interpolation integration to generate smooth transitions.
 *
 * NOTE: These are layout colors, not theme accent colors.
 * For theme colors (primary, secondary, etc.), see src/config/themeConfig.ts
 */

export interface SectionColors {
    hero: string;
    about: string;
    skills: string;
    projects: string;
    servicesPreview: string;
    blog: string;
    services: string;
    goodies: string;
    testimonials: string;
    contact: string;
    faqs: string;
    footer: string;
}

/**
 * Dark mode colors - SLATE STEEL PALETTE
 * Neutral grays with steel blue undertones
 * Inspired by GitHub/VS Code dark themes
 */
export const darkModeColors: SectionColors = {
    hero: '#0d1117', // GitHub dark bg - deepest
    about: '#161b22', // Slightly lighter
    skills: '#1c2128', // Medium dark
    projects: '#21262d', // Lighter accent
    servicesPreview: '#161b22', // Same as about
    blog: '#0d1117', // Same as hero
    services: '#161b22', // Same as about
    goodies: '#161b22', // Same as about
    testimonials: '#21262d', // Same as projects
    contact: '#1c2128', // Same as skills
    faqs: '#161b22', // Same as about
    footer: '#010409' // Near black
};

/**
 * Light mode colors (blue-gray palette)
 */
export const lightModeColors: SectionColors = {
    hero: '#9AA6B2', // Blue-gray
    about: '#BCCCDC', // Light blue-gray
    skills: '#96B6C5', // Muted blue (more contrast from about)
    projects: '#ADC4CE', // Soft blue-gray
    servicesPreview: '#BCCCDC', // Light blue-gray (between projects and blog)
    blog: '#9AA6B2', // Blue-gray (repeating pattern)
    services: '#BCCCDC', // Light blue-gray (complementing about)
    goodies: '#BCCCDC', // Light blue-gray (same as services)
    testimonials: '#BCCCDC', // Light blue-gray
    contact: '#ADC4CE', // Soft blue-gray
    faqs: '#BCCCDC', // Light blue-gray (after contact, before footer)
    footer: '#E8EBF0' // Light blue-gray matching bg-background light mode
};

/**
 * CSS Custom Properties for dynamic theme switching
 * These will be defined in global.css and change with theme
 */
export const sectionsColorsCSSProps: SectionColors = {
    hero: 'var(--section-hero-bg)',
    about: 'var(--section-about-bg)',
    skills: 'var(--section-skills-bg)',
    projects: 'var(--section-projects-bg)',
    servicesPreview: 'var(--section-services-preview-bg)',
    blog: 'var(--section-blog-bg)',
    services: 'var(--section-services-bg)',
    goodies: 'var(--section-goodies-bg)',
    testimonials: 'var(--section-testimonials-bg)',
    contact: 'var(--section-contact-bg)',
    faqs: 'var(--section-faqs-bg)',
    footer: 'var(--section-footer-bg)'
};

/**
 * Function to get actual colors based on theme for dividers that need interpolation
 */
export function getSectionColors(isDarkMode: boolean): SectionColors {
    return isDarkMode ? darkModeColors : lightModeColors;
}

/**
 * Export the CSS custom properties version for dynamic theming
 */
export const sectionsColors = sectionsColorsCSSProps;
