# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-12-02

### Added

- **Dynamic OG image generation**: Auto-generated Open Graph images at build
  time using Satori + Resvg for social media previews (WhatsApp, Twitter, etc.)
- **OG endpoints for all pages**: Home, blog posts, projects, services, and all
  goodies sections (css-tricks, snippets, tools, useful-links)
- **Branded OG design**: Consistent layout with photo, bottom bar branding, type
  badges, and tag pills
- **Word-boundary truncation**: Text truncation respects word boundaries to
  avoid mid-word cuts

### Changed

- **SEO component**: Dynamic OG image path generation based on current URL
  pattern (`/[lang]/path/og.png`)
- **Site URL**: Updated from example.com to qazuor.com in Astro config

### Technical

- Satori library for JSX-to-SVG conversion with Google Fonts (Inter woff)
- @resvg/resvg-js for SVG-to-PNG conversion
- Base64 photo embedding for Satori compatibility
- Static generation via Astro endpoints with `getStaticPaths()`

## [1.0.2] - 2025-12-01

### Added

- **Center tooltip for radar charts**: Skill descriptions now appear in the
  center of the radar when hovering over skills that have descriptions
- **New icons**: Make.com logo for automation, palette icon for branding, bolt
  and lightbulb icons for UI
- **socialMediaAndFlyers translations**: Added EN/ES translations for new skill

### Changed

- **Tooltip design**: Translucent background (75% opacity) with dark/light mode
  support, no backdrop-filter (not supported in SVG foreignObject)
- **Radar axis lines**: Extended to 1.60x radius to reach past icons to labels
- **Radar icon positions**: Adjusted to 1.12x radius for balanced placement
- **Radar card styling**: Removed hover effects, reduced gap between title and
  chart
- **Skill icons**: Branding now uses palette icon, Automation uses Make logo

### Fixed

- **Tooltip rendering**: Moved from per-skill positioning to center to avoid
  overlap with icons and labels

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
