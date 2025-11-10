/**
 * Components Barrel Export
 * Centralized export for all React and Astro components
 */

export * from './animations';
export * from './animations/SmoothScroll';
export * from './animations/TailwindAnimations';
export * from './cards';
export * from './cards/BlogCard';
export * from './cards/ProjectCard';
// Components by category
export * from './forms';
export * from './forms/Contact';
export * from './forms/FormField';
export * from './forms/StatusMessage';
export * from './forms/SubmitButton';
export * from './interactive';
// Legacy exports for backward compatibility
export * from './interactive/AnimatedHero';
export * from './interactive/CommandPalette';
export * from './interactive/LanguageSelector';
export * from './interactive/ScrollAnimatedSection';
export * from './interactive/ScrollToTop';
export * from './interactive/ThemeToggle';
export { default as Timeline } from './interactive/Timeline';
export * from './ui';

// Astro Components
// Note: Astro components must be imported directly with .astro extension
// They cannot be re-exported through barrel files
// Use: import Component from '../components/sections/Component.astro'
