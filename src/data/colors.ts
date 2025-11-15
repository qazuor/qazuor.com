/**
 * Color Palette for Website Sections
 */

export interface SectionColors {
    hero: string;
    about: string;
    skills: string;
    projects: string;
    blog: string;
    services: string;
    testimonials: string;
    contact: string;
    footer: string;
}

/**
 * Dark mode colors (purple-blue gradient palette)
 */
export const darkModeColors: SectionColors = {
    hero: '#18122B', // Deep purple
    about: '#2A1F3D', // Darker purple-blue (was #393053)
    skills: '#332952', // Darker medium purple-blue (was #443C68)
    projects: '#393053', // Purple-blue (unchanged)
    blog: '#18122B', // Deep purple (latest articles)
    services: '#2A1F3D', // Darker purple-blue (complementing about)
    testimonials: '#393053', // Purple-blue
    contact: '#332952', // Darker medium purple-blue (was #443C68)
    footer: '#140A1F' // Very dark purple matching bg-background dark mode
};

/**
 * Light mode colors (blue-gray palette)
 */
export const lightModeColors: SectionColors = {
    hero: '#9AA6B2', // Blue-gray
    about: '#BCCCDC', // Light blue-gray
    skills: '#96B6C5', // Muted blue (more contrast from about)
    projects: '#ADC4CE', // Soft blue-gray
    blog: '#9AA6B2', // Blue-gray (repeating pattern)
    services: '#BCCCDC', // Light blue-gray (complementing about)
    testimonials: '#BCCCDC', // Light blue-gray
    contact: '#ADC4CE', // Soft blue-gray
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
    blog: 'var(--section-blog-bg)',
    services: 'var(--section-services-bg)',
    testimonials: 'var(--section-testimonials-bg)',
    contact: 'var(--section-contact-bg)',
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
