# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-12-02

### Added - LLM-First Optimization Phase 4 (JSON-LD & Content)

- **Blog Post JSON-LD**: BlogPosting schema with author, dates, and
  BreadcrumbList for all blog posts (`BlogPostJsonLd.astro`)
- **Project Pages JSON-LD**: Dynamic schema types based on project category -
  SoftwareApplication (open-source), WebApplication (commercial/client),
  CreativeWork (fallback) (`ProjectJsonLd.astro`)
- **Goodies Pages JSON-LD**: HowTo schema for code snippets and CSS tricks with
  BreadcrumbList (`GoodiesJsonLd.astro`)
- **New blog post**: "Freelancer vs Agencia: cuándo tiene sentido cada opción" -
  honest analysis of when to work with freelancers vs agencies

### Technical

- Complete JSON-LD infrastructure for SEO and LLM discoverability
- Verified all schemas render correctly in production build
- TypeScript types for all JSON-LD schemas (`src/types/jsonld.ts`)

---

## [1.1.0] - 2025-12-02

### Added - LLM-First Optimization (Phase 1 & 2 Complete)

- **FAQs Section**: New homepage section with 8 FAQs (5 for clients, 3 for
  employers) in a two-column layout with FAQ schema for rich snippets
- **AboutSummaryCard component**: Quick-reference card with key profile
  highlights (location, experience, specialty, languages, availability,
  timezone) for LLM and human scanning
- **Enhanced llms.txt**: Updated with production performance metrics (LCP:
  184ms, CLS: 0.00, TTFB: 48ms), AI citation guidelines, and comprehensive
  professional profile
- **Social share buttons for Goodies**: Extended share functionality to
  CSS-tricks and Snippets pages (same 8 platforms as blog)
- **Comments for Goodies**: Giscus comments integration for CSS-tricks and
  Snippets pages

### Changed

- **About section restructuring**: Added summary card with translations for
  EN/ES, improved visual hierarchy for LLM parsing

### Fixed

- **Hydration errors**: Resolved React hydration mismatches in hero and footer
  components
- **Biome lint**: Fixed formatting issues across codebase

### Technical

- Trust badges in hero section (fast delivery, global reach, performance,
  satisfaction)
- Stats counter with scroll-triggered animation and contextual descriptions
- Performance badge in footer with Desktop/Mobile metrics tabs
- JSON-LD infrastructure (JsonLd.astro, BreadcrumbJsonLd.astro, comprehensive
  type definitions)
- Breadcrumb generation utilities for all page types
- Section colors configuration for servicesPreview and faqs
- Sitemap with i18n alternates and custom priorities

---

## [1.0.6] - 2025-12-02

### Added

- **Giscus comments system**: GitHub Discussions-based comments on blog posts
  with automatic theme synchronization (dark/light mode)
- **Custom Giscus theme**: Purple-themed CSS matching site design for both light
  and dark modes (`giscus-custom.css`, `giscus-custom-light.css`)
- **Social share buttons**: Share blog posts to 8 platforms (X, LinkedIn,
  WhatsApp, Reddit, Telegram, Discord, Mastodon, Hacker News)
- **Web Share API integration**: Native share dialog on mobile devices with
  fallback to platform buttons on desktop
- **Copy link button**: One-click URL copying with visual feedback
- **Centralized share config**: `src/data/shareButtons.ts` for easy platform
  management (add/remove platforms, configure visibility)

### Changed

- **Share buttons layout**: Moved share buttons below tags in blog post header
  (was beside tags)
- **Comments input position**: Comment box now appears at bottom (after existing
  comments) instead of top

### Technical

- Share button component with compact/full variants
- MutationObserver for dynamic Giscus theme switching
- Environment-aware theme URLs (localhost vs production)

## [1.0.5] - 2025-12-02

### Changed

- **Timeline navigation redesign**: Moved progress dots and controls above the
  timeline for better UX
- **Mobile timeline optimizations**: Reduced card positioning (140px vs 200px),
  smaller padding (32px vs 64px), compact text sizes for better fit
- **Hidden horizontal scrollbar**: Timeline scrollbar hidden while maintaining
  scroll functionality via swipe/buttons

### Fixed

- **Mobile vertical overflow**: Reduced paddingBottom (120px vs 200px) to
  prevent unnecessary vertical scrollbar on mobile devices

## [1.0.4] - 2025-12-02

### Added

- **Resend email integration**: Production email sending for contact form via
  Resend API with verified custom domain (contact@qazuor.com)
- **DNS email records**: DKIM, SPF, and DMARC records configured for email
  deliverability

### Technical

- Resend API integration with environment variables (RESEND_API_KEY,
  RESEND_FROM_EMAIL, CONTACT_EMAIL)
- Email verification for qazuor.com domain with proper DNS records

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
