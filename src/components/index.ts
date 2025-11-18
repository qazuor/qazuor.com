/**
 * Components Barrel Export
 * Centralized export for all React and Astro components
 */

export * from '@/components/animations';
export * from '@/components/animations/SmoothScroll';
export * from '@/components/cards';
export * from '@/components/cards/ProjectCard';
// Components by category
export * from '@/components/forms';
export * from '@/components/forms/Contact';
export * from '@/components/forms/FormField';
export * from '@/components/forms/StatusMessage';
export * from '@/components/forms/SubmitButton';
export * from '@/components/interactive';
// Legacy exports for backward compatibility
export * from '@/components/interactive/CommandPalette';
export * from '@/components/interactive/LanguageSelector';
export * from '@/components/interactive/ScrollAnimatedSection';
export * from '@/components/interactive/ScrollToTop';
export * from '@/components/interactive/ThemeToggle';
export { default as Timeline } from '@/components/interactive/Timeline';
export * from '@/components/ui';

// Astro Components
// Note: Astro components must be imported directly with .astro extension
// They cannot be re-exported through barrel files
// Use: import Component from '../components/sections/Component.astro'
