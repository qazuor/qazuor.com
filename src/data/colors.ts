/**
 * Color Palette for Website Sections
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
 * Dark mode colors (blue gradient palette - hue 210°)
 */
export const darkModeColors: SectionColors = {
    hero: '#0F1A2B', // Deep blue
    about: '#1A2A3D', // Dark blue (was #2A1F3D)
    skills: '#1E3552', // Medium dark blue (was #332952)
    projects: '#253853', // Blue (was #393053)
    servicesPreview: '#1A2A3D', // Dark blue (between projects and blog)
    blog: '#0F1A2B', // Deep blue (latest articles)
    services: '#1A2A3D', // Dark blue (complementing about)
    goodies: '#1A2A3D', // Dark blue (same as services)
    testimonials: '#253853', // Blue
    contact: '#1E3552', // Medium dark blue (was #332952)
    faqs: '#1A2A3D', // Dark blue (after contact, before footer)
    footer: '#0A1420' // Very dark blue matching bg-background dark mode
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
