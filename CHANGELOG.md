# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.6] - 2025-12-08

### Added - New Testimonial

- **Joan Massana Pulido**: Added testimonial from Senior Engineering Manager at
  Avature

### Changed - Mobile Navigation UX Improvements

- **Mobile actions always visible**: Command palette, language selector, and
  theme toggle now visible outside hamburger menu on mobile (< 768px)
- **Responsive logo sizing**: Smaller logo/avatar on mobile for better space
  utilization
- **Improved LanguageSelector compact mode**: Now shows current language code
  with flag instead of globe icon, displays only alternate language in dropdown

### Fixed - Code Formatting

- **searchIndex.ts**: Fixed indentation to use 2 spaces consistently

---

## [1.5.5] - 2025-12-05

### Added - Blog Excerpt Markdown Support

- **Markdown in excerpts**: Blog post excerpts now render markdown formatting
  (bold, italic, code, links) instead of plain text
- **Consistent rendering**: Applied to all excerpt locations (hero sections,
  listing cards, related posts, homepage BlogPostCard)

### Fixed - Build Warnings Cleanup

- **Unused imports removed**: Cleaned up unused imports in Navigation.astro,
  BlogSection.astro, BaseLayout.astro
- **Unused variables removed**: Removed unused `lang` prop in FAQsSection,
  `totalDuration` in TrustBadgesMarquee
- **Deprecated icon replaced**: Replaced deprecated `Youtube` icon with `Play`
  from lucide-react (brand icons deprecated)
- **OG image z-index warnings**: Removed unsupported `z-index` properties from
  Satori OG image generator
- **JsonLd script directive**: Added explicit `is:inline` to silence Astro hint
- **Test file fixes**: Fixed unused variable destructuring in contact.spec.ts
- **Window type definitions**: Added global Window interface extensions for
  custom properties (`__SEARCH_INDEX__`, `__initToolCards`, etc.)

### Removed - Unused Integration

- **astro-subsites**: Removed unused subsites integration and configuration
  (domains.config.js) - was causing build warnings

### Changed - Visual Test Snapshots

- Updated visual regression test snapshots for multiple pages and viewports

### Technical

- Extended `src/types/auto-animate.d.ts` with Window interface for all custom
  global properties
- Added biome-ignore comment for intentional `execCommand` fallback in share.ts

---

### Added - Social Blog Data Integration

- **Social metadata schema**: New optional `social` field in blog post
  frontmatter for social network publishing customization
- **Platform configuration**: 10 social platforms supported (LinkedIn, Twitter,
  Facebook, Instagram, Bluesky, Mastodon, Threads, Reddit, HackerNews, Dev.to)
- **Social customization fields**: Optional alternative title, excerpt, image,
  hashtags, and publish date for social networks
- **Astro integration**: `social-blog-data` integration generates
  `socialNetworksBlogData.json` during build with all non-draft blog posts
- **Automation-ready output**: JSON file includes slug, title, excerpt, URL,
  publishDate, category, tags, readTime, author, series info, and social
  metadata

### Technical

- New schema in `src/content/config.ts`: `socialPlatformsSchema`, `socialSchema`
- New integration: `integrations/social-blog-data.ts`
- New dependency: `gray-matter` for frontmatter parsing
- Output file added to `.gitignore`
- Default platforms: LinkedIn, Twitter, Bluesky enabled; others disabled

---

## [1.5.4] - 2025-12-04

### Added - Vercel Analytics & Speed Insights

- **Vercel Analytics**: Web analytics integration via `@vercel/analytics`
  package for tracking page views and visitor data
- **Vercel Speed Insights**: Real User Monitoring (RUM) via
  `@vercel/speed-insights` package for Core Web Vitals tracking
- **Auto-injected scripts**: Analytics and Speed Insights components added to
  BaseLayout, automatically included in all pages

### Technical

- New dependencies: `@vercel/analytics@1.6.1`, `@vercel/speed-insights@1.3.1`
- Components imported from `/astro` subpath for Astro-specific integration
- Scripts injected before closing `</body>` tag for optimal performance

---

## [1.5.3] - 2025-12-04

### Added - Snippets Collection Overhaul

- **38 TypeScript snippets**: Comprehensive collection of utility functions
  organized in 11 categories (async, array, math, data, string, intl, date,
  browser, url, fp, types)
- **Category-based organization**: Snippets grouped by folder/category on
  listing page, similar to useful-links
- **MDX code blocks**: Code moved from frontmatter to MDX content body for
  proper syntax highlighting
- **Bilingual descriptions**: Each snippet has `description_en` and
  `description_es` for localized content

### Changed - Snippets UI Simplification

- **Removed language badge**: Since all snippets are TypeScript, removed
  redundant language badge from cards and detail pages
- **Removed featured badge**: Simplified UI by removing featured indicators
- **Category grouping**: Snippets listing now shows categories (Async &
  Promises, Array Utilities, TypeScript Types, etc.) instead of flat grid
- **Cleaner snippet page**: Detail page now shows only title, description, tags,
  and code block

### Fixed - Snippets

- **Snippet names in dropdown**: Fixed goodies menu showing snippet names
  correctly (was using `title` instead of `name`)
- **Snippet URLs**: Fixed 404 errors by implementing proper slug cleaning for
  numeric prefixes
- **Syntax highlighting**: Moved code from frontmatter to MDX body for proper
  highlighting

### Technical - Snippets

- Removed `code` field from snippets schema (now in MDX body)
- Updated schema to use `name` instead of `title`
- Added `cleanSlug` helper for numeric prefix handling in URLs
- Removed filter script (all snippets are TypeScript)

### Added - Useful Links Restructure & Expansion

- **Category-based organization**: Reorganized useful-links from flat structure
  to 10 categories (ai, animations, docs, icons, illustrations, inspiration,
  libraries, react-components, tools, youtube)
- **80 curated links**: Expanded from 24 to 80 useful resources across all
  categories
- **i18n descriptions**: Each link now has `description_en` and `description_es`
  for localized content
- **New categories**: AI & Machine Learning, Animations, Illustrations, Icons,
  React Components, YouTube channels
- **CategoryIcon component**: New icons for all useful-links categories
  (YouTube, Docs, Tools, AI, Animations, Icons, Illustrations, Libraries, React)

### Changed - Useful Links

- **Useful-links schema**: Updated Zod schema with `description_en`,
  `description_es`, removed `featured` and `order` fields
- **Goodies page**: Fixed to display localized descriptions for useful-links
  preview cards
- **Useful-links index**: Updated sorting to use filename prefix ordering
  instead of deprecated `order` field

### Changed - Hero Section Responsive Improvements

- **Mobile avatar breakpoints**: Extended responsive sizing with 8+ breakpoints
  for different screen sizes and heights (320px-767px width, 500-750px+ height)
- **Trust badges repositioned**: Moved between subtitle and CTA buttons for
  better visual hierarchy
- **Resume button shortened**: "Download Resume"/"Descargar CV" changed to
  "Resume"/"CV" for narrower button width
- **Hero layout reorder**: New order is Title → TypeIt → Subtitle → Trust Badges
  → CTA Buttons → Social Links → Scroll Indicator
- **Improved mobile spacing**: Updated padding values for better visual balance
  across viewport sizes

### Fixed

- **TrustBadgesMarquee TypeScript**: Added HTMLElement generic to
  querySelectorAll to fix dataset property type error

### Technical - Useful Links

- Content collection schema in `src/content/config.ts` updated for new
  useful-links structure
- `getLinkDescription()` helper function for i18n description retrieval
- Filename-based ordering using numeric prefixes (e.g., `01-resource.json`)

---

## [1.5.2] - 2025-12-03

### Added - PerformanceBadge Redesign

- **Two-column layout**: Shared scores (A11y, BP, SEO) on left, Performance by
  device on right with vertical separator
- **Web Vitals per device**: LCP, FCP, CLS metrics displayed for both Desktop
  and Mobile
- **Hover tooltips**: Each metric has a tooltip explaining what it measures
  (e.g., "Largest Contentful Paint", "Cumulative Layout Shift")
- **Auto-generated metrics**: Script to fetch real-time data from PageSpeed
  Insights API during build
- **i18n tooltips**: Full EN/ES translations for all metric descriptions

### Fixed

- **Testimonial LinkedIn links**: Added missing LinkedIn profile link button to
  testimonial modal. The link element was referenced in JavaScript but never
  added to the HTML markup
- **Command palette icons**: Social/contact icons (GitHub, LinkedIn, WhatsApp,
  etc.) now display at correct 16x16px size instead of oversized 32x32px. Added
  explicit size constraints via Tailwind classes while preserving icon rendering
  in other components

### Added - WordPress Service & Services Grid Update

- **WordPress service**: New service for WordPress installation, configuration,
  theme and plugin development
- **WordPress translations**: Full EN/ES content including title, description,
  features, pricing, and FAQs
- **WordPress interest options**: 3 new contact form interests (Theme, Plugin,
  Migration) with service-to-interest mapping
- **6-service grid**: Home page now displays all 6 services in a responsive
  3x2/2x3/1x6 grid layout

### Changed - WordPress Service

- **Services grid layout**: Updated from 4 columns to 3 columns to accommodate 6
  services
- **Service description rendering**: Fixed markdown rendering on individual
  service pages (bold/italic now display correctly)
- **ServiceIcon**: Added Globe icon for WordPress service across React and Astro
  components

### Added - UnifiedButton Component System

- **UnifiedButton React component**: Single configurable button component for
  consistent styling across the site
- **UnifiedButton Astro wrapper**: Server-rendered version for use in Astro
  components
- **4 button variants**: primary, secondary, ghost, and outline with cohesive
  brand gradient theming
- **4 button sizes**: xs, sm, md, lg with appropriate padding and typography
- **Animated gradient hover effects**: Pseudo-element technique for smooth 500ms
  gradient transitions (CSS gradients can't be directly animated)
- **Icon support**: Left/right icon positioning with hover micro-animations
- **Loading state**: Built-in spinner for async actions
- **Accessibility**: Proper aria-hidden on decorative SVGs, disabled states

### Changed

- **DownloadLink**: Migrated to use UnifiedButton internally
- **GetInTouchLink**: Migrated to use UnifiedButton internally
- **ViewProjectsLink**: Migrated to use UnifiedButton internally
- **SubmitButton**: Migrated to use UnifiedButton with loading state
- **BlogSection**: Updated "View all posts" link to use UnifiedButton
- **ProjectsFeaturedSection**: Updated "View all projects" link to use
  UnifiedButton
- **Blog pagination**: Updated navigation buttons to use UnifiedButton

### Technical

- Brand gradient: `linear-gradient(135deg, #667eea 0%, #814ba2 100%)`
- Hover gradient: `linear-gradient(135deg, #8b7ec8 0%, #5a4fcf 100%)`
- Pseudo-element overlay with opacity transition for smooth hover effects
- Content wrapped in `relative z-10` span to stay above pseudo-element
- All variants use themed colors (#667eea, #814ba2) for visual consistency

---

## [1.5.1] - 2025-12-03

### Fixed - Timeline Viewport Autoplay

- **Viewport-triggered autoplay**: Timeline now starts autoplay only when it
  enters the viewport, not on page load
- **IntersectionObserver integration**: Added observer with 30% visibility
  threshold to detect when timeline becomes visible
- **State management**: New `hasBeenVisible` state prevents autoplay restart on
  subsequent scroll-ins after user pause

### Technical

- useTimelineAnimation: Changed initial `isAutoPlaying` from `true` to `false`
- useTimelineAnimation: Added `hasBeenVisible` state tracking
- useTimelineAnimation: New `useEffect` with IntersectionObserver for viewport
  detection

---

## [1.5.0] - 2025-12-03

### Added - Web Optimization Service

- **New service: Web Optimization** (`/services/web-optimization`): Complete
  service offering for SEO, performance, and accessibility optimization
- **SEO for search engines and LLMs**: Optimization for traditional search
  (Google, Bing) and AI models (ChatGPT, Perplexity, Claude)
- **Performance optimization**: Page speed, Core Web Vitals, and runtime
  performance improvements
- **Accessibility optimization**: WCAG 2.1 compliance audits and implementation
- **Full i18n support**: Complete translations for EN and ES
- **Service page content**: 6 features, 6-step process, 6 FAQs, pricing from
  $400
- **Contact form integration**: New interest options for SEO and Performance
  optimization
- **Navigation integration**: Service appears in dropdown menu and comparison
  table

### Technical

- ServiceIcon: Added Gauge icon from Lucide for web-optimization
- services.ts: New service definition with violet theme (#8b5cf6)
- interests.ts: Mapping for seoOptimization and performanceOptimization
- ComparisonSection: Added webOptimization column with styling
- ServicesDropdown: Extended translations interface
- Contact form: Updated interests interface and translations

---

## [1.4.1] - 2025-12-03

### Fixed - Timeline Mobile Autoplay

- **Mobile autoplay interruption**: Fixed autoplay pausing after each item
  change on mobile devices
- **Programmatic scroll detection**: Replaced boolean flag with timestamp-based
  approach to reliably distinguish programmatic scrolls from user scrolls
- **Desktop item centering**: Fixed selected items going off-screen on desktop
  by adding consistent `DESKTOP_PADDING` constant
- **Mobile card overlap**: Adjusted TimelineCard positioning to prevent text
  overlapping with icon on mobile (200px top offset)

### Technical

- `useTimelineAnimation` hook now uses `programmaticScrollUntilRef` timestamp
  instead of boolean flag for scroll origin detection
- Scroll events within 1000ms of programmatic scroll start are ignored
- Desktop uses fixed 64px padding, mobile uses dynamic 50vw-based padding

---

## [1.4.0] - 2025-12-03

### Added - Custom 404 Page

- **Custom 404 page**: Replaced Astro's default 404 with a branded error page
- **Animated gradient background**: Three floating gradient orbs with smooth
  animation (same style as hero section)
- **i18n support**: Full EN/ES translations for all 404 page content
- **Quick navigation links**: Direct links to Home, Blog, Projects, Services,
  and Contact
- **Command palette hint**: Reminds users they can use Ctrl+K to search
- **Theme support**: Works correctly in both light and dark modes

### Fixed - View Transitions Compatibility

- **PixelCanvas Web Component**: Fixed custom element not working after View
  Transitions navigation from pages without the component
- **Global PixelCanvas registration**: Moved custom element definition to
  BaseLayout with `is:inline` script for persistent registration
- **Lifecycle event handling**: Updated all components to use centralized
  `qazuor:content-ready` event for View Transitions compatibility

### Changed

- **Script architecture**: Converted TypeScript inline scripts to JavaScript for
  `data-astro-rerun` compatibility
- **Component cleanup**: Removed duplicate script from PixelCanvas.astro,
  deleted unused `src/lib/pixel-canvas.ts`

### Technical

- PixelCanvas custom element now registers globally on every page load
- Event listener for `qazuor:content-ready` re-initializes pixel-canvas elements
  after View Transitions
- All interactive components (AutoAnimate, CalloutEnhancer, MermaidRenderer,
  SkillsRadarGrid, Navigation, ProjectsSection, TestimonialsSection,
  PerformanceBadge, RotatingRoles, typeIt) updated to use lifecycle events

---

## [1.3.0] - 2025-12-02

### Added - LLM-First Optimization Phase 3 (Services Page Enhancements)

- **ProcessSection component**: 6-step process timeline (Discovery → Planning →
  Design → Development → Testing → Launch) with horizontal desktop and vertical
  mobile layouts
- **ComparisonSection component**: Service comparison table showing timeline,
  investment, maintenance, complexity, and best-use for all 4 services
- **FreelancerVsAgencySection component**: Two-column comparison highlighting
  freelancer benefits vs agency trade-offs
- **Enhanced Service FAQs**: Added 3 new FAQs per service (12 total) covering
  security, metrics, tools, and scope expansion topics in both EN and ES

### Technical

- All 3 sections integrated into `/services` page with full i18n support
- Process data structure in `src/data/process.ts`
- Complete translations in `src/locales/{en,es}/services.json`
- Each service now has 8 comprehensive FAQs (up from 5)

---

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
