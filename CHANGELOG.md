# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-12-01

### Changed

- **Timeline UX overhaul**: Click-based navigation instead of hover interaction
- **Timeline components renamed**: `Timeline.tsx` → `TimelineWrapper.tsx`,
  `TimelineDesktop.tsx` → `TimelineContent.tsx`
- **Timeline icons**: Grayscale when not selected, colored when selected
- **Play/Pause icons**: Improved with filled style for better visibility

### Added

- Navigation controls: Previous/Next buttons, Play/Pause toggle, progress dots
- Keyboard navigation: Arrow keys, Home, End, Space for timeline control
- Touch/swipe support for mobile timeline navigation
- `iconUseItemColor` field for configurable icon coloring per timeline item
- New timeline icons: flag, globe-alt, squares

### Removed

- `viewInDesktop` and `viewInMobile` fields from timeline data
- Dialup timeline item (1999)
- 12 unused timeline icons

### Fixed

- SVG sprite stroke inheritance for multi-color icons (avature, make,
  javascript)
- Scroll centering calculation with proper padding offset

## [1.0.0] - 2025-12-01

### Added

- Personal portfolio website with bilingual support (EN/ES)
- About section with interactive timeline
- Services section showcasing professional offerings
- Projects showcase with filtering capabilities
- Blog section with content collections
- Testimonials carousel
- Contact section with social links
- Command palette for quick navigation
- Theme toggle (light/dark mode)
- PWA support with offline capabilities
- SEO optimization with structured data

### Performance

- Astro Image optimization for all images
- SVG sprite system for timeline icons
- Critical CSS inlining for above-the-fold content
- Font preloading for Inter and JetBrains Mono
- Deferred loading for below-fold components
- View Transitions API integration

### Accessibility

- WCAG 2.1 Level AA compliance
- Translated alt texts for all images
- Keyboard navigation support
- Screen reader optimizations
- Focus management for modals and dialogs

### Mobile

- Responsive design across all breakpoints
- Visual viewport handling for iOS Safari
- Lenis smooth scrolling integration
- Touch-friendly navigation
- Mobile-optimized command palette
