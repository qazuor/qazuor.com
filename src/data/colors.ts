/**
 * Color Palette for Website Sections
 */

export interface SectionColors {
  hero: string;
  about: string;
  skills: string;
  projects: string;
  blog: string;
  testimonials: string;
  contact: string;
  footer: string;
}

/**
 * Dark mode colors (original colors from design)
 */
export const darkModeColors: SectionColors = {
  hero: '#473472',
  about: '#53629E',
  skills: '#9D4EDD', // ← CAMBIO: de verde neón a púrpura vibrante
  projects: '#87BAC3',
  blog: '#473472',
  testimonials: '#53629E',
  contact: '#87BAC3',
  footer: '#000000',
};

/**
 * Light mode colors (lighter variants for light theme)
 */
export const lightModeColors: SectionColors = {
  hero: '#E6E0F0', // Light purple
  about: '#E1E7F5', // Light blue-purple
  skills: '#E6E0F0', // Light purple (same as hero)
  projects: '#F0F8FA', // Very light cyan
  blog: '#E6E0F0', // Light purple (same as hero)
  testimonials: '#E1E7F5', // Light blue-purple (same as about)
  contact: '#F0F8FA', // Very light cyan (same as projects)
  footer: '#F5F5F5', // Light gray
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
  testimonials: 'var(--section-testimonials-bg)',
  contact: 'var(--section-contact-bg)',
  footer: 'var(--section-footer-bg)',
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
