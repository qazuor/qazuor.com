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
 * FIXED: These colors form the site's base dark blue theme
 * Source: Extracted from qazuor.com production on 2025-12-13
 */
export const darkModeColors: SectionColors = {
    hero: '#0F1A2B', // rgb(15, 26, 43) - Deep dark blue
    about: '#1A2A3D', // rgb(26, 42, 61) - Dark blue
    skills: '#1E3552', // rgb(30, 53, 82) - Medium dark blue
    projects: '#253853', // rgb(37, 56, 83) - Blue
    servicesPreview: '#1A2A3D', // Same as about
    blog: '#0F1A2B', // Same as hero
    services: '#1A2A3D', // Same as about
    goodies: '#1A2A3D', // Same as about
    testimonials: '#253853', // Same as projects
    contact: '#1E3552', // Same as skills
    faqs: '#1A2A3D', // Same as about
    footer: '#0A1420' // rgb(10, 20, 32) - Darkest blue
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
