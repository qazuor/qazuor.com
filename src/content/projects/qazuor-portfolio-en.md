---
title: qazuor.com
description:
  Personal portfolio and technical blog built with Astro and React. Optimized
  for exceptional performance, accessibility, and responsive design.
longDescription:
  A bilingual portfolio showcasing web development expertise with a focus on
  high performance standards, WCAG AA accessibility compliance, and modern web
  technologies.
lang: en
category: open-source
tags: [Portfolio, Blog, Astro, Performance]
technologies:
  [
    Astro,
    React 19,
    TypeScript,
    Tailwind CSS,
    Embla Carousel,
    Giscus,
    Fuse.js,
    Vitest,
    Playwright,
    Vercel,
  ]
images:
  - ./_images/qazuor.com/1.png
  - ./_images/qazuor.com/2.png
  - ./_images/qazuor.com/3.png
  - ./_images/qazuor.com/4.png
mainImage: ./_images/qazuor.com/1.png
githubUrl: https://github.com/qazuor/qazuor.com
demoUrl: https://qazuor.com
featured: true
publishDate: 2025-12-01
order: 3
status: production
metrics:
  commits: 750
  linesOfCode: 43731
  developmentTime: '3 months'
  startDate: 2025-09-24
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'SVG sprites vs icon components - Individual icon components added 393KB
      of JS'
    solution:
      'Migrated to inline SVG sprite (2.6KB), achieving 99.3% size reduction'
  - problem:
      'Lazy loading in SSG - import.meta.glob() pre-bundles everything at build
      time'
    solution:
      'Abandoned i18n lazy loading as it provided no benefit in SSG context'
  - problem: 'Integrated comment system - Needed comments without own backend'
    solution:
      'Giscus integration with GitHub Discussions and custom themes matching the
      design'
  - problem:
      'Cross-browser visual testing - Detecting visual regressions across
      multiple browsers'
    solution: 'Playwright with visual snapshots on Chromium, Firefox and WebKit'
highlights:
  - 'LCP ~184ms, CLS 0.00, TTFB ~48ms - Exceptional Core Web Vitals'
  - '38K+ lines of code with test coverage'
  - '15+ blog posts with series system and comments'
  - 'Command palette (Ctrl+K) with fuzzy search via Fuse.js'
  - 'Installable PWA with offline support'
  - 'Goodies section: CSS tricks, snippets, useful links and tools'
  - 'Project gallery with lightbox and carousel'
  - 'Working contact form with Resend'
  - 'WCAG 2.1 Level AA accessibility compliance'
futureImprovements:
  - 'Newsletter integration'
  - 'Privacy-focused analytics (Plausible or Fathom)'
  - 'More scroll reveal animations'
  - 'Post likes system'
stackRationale:
  Astro: 'Optimal performance with 0 JS by default, perfect for content sites'
  React 19:
    'Islands architecture for interactive components without penalizing the rest'
  Embla Carousel:
    'Lightweight and accessible carousels, better than heavy solutions'
  Giscus: 'Comments via GitHub Discussions, no own backend needed'
  Fuse.js: 'Lightweight fuzzy search for the command palette'
  Vitest + Playwright: 'Fast unit testing + cross-browser E2E'
---

## Project Overview

This portfolio represents my commitment to building fast, accessible, and
well-crafted web experiences. Every decision, from the tech stack to the
smallest interaction, was made with performance and user experience in mind.

The site serves as a showcase of my work, a technical blog where I share
insights about web development, and a section of useful resources for other
developers.

## Performance First

Built with aggressive performance optimization as a core principle:

### Core Web Vitals (December 2025)

- **LCP**: ~184ms (target: <2.5s) ✅
- **FCP**: ~271ms (target: <1.8s) ✅
- **CLS**: 0.00 (target: <0.1) ✅
- **TTFB**: ~48ms ✅
- **Lighthouse Performance**: 97/100 desktop, 87/100 mobile

### Optimization Techniques

- **Inline critical CSS**: Essential styles load immediately (~2KB)
- **Font preloading**: Only 3 critical variants (Inter 400/600/700)
- **Image optimization**: WebP/AVIF with lazy loading and priority hints
- **SVG sprite consolidation**: 99.3% reduction in icon assets
- **Compression**: Brotli and gzip on all assets

## Accessibility Standards

WCAG 2.1 Level AA compliance verified with Lighthouse and axe-core:

- Semantic HTML structure
- Keyboard navigation for all interactive elements
- Screen reader optimized content
- Sufficient color contrast ratios
- Visible focus indicators
- Skip links to main content
- Accessibility score: 97/100

## Key Features

### Technical Blog

15+ posts organized in thematic series:

- Series system with navigation between related posts
- Integrated comments via Giscus (GitHub Discussions)
- Syntax highlighting with Expressive Code
- Automatic table of contents
- Estimated reading time

### Command Palette

Quick navigation via `Ctrl+K` with fuzzy search:

- Instant search with Fuse.js
- Quick access to pages, posts and projects
- Keyboard shortcuts for common actions
- Design inspired by VS Code/Raycast

### Goodies Section

Useful resources for developers:

- **CSS Tricks**: Interesting CSS effects and techniques
- **Snippets**: Reusable code organized by category
- **Useful Links**: Curated web development resources
- **Tools**: Utilities and generators

### Project Gallery

Interactive project showcase:

- Carousel with Embla Carousel
- Lightbox for viewing images in detail
- Project metrics (commits, lines of code, time)
- Stack rationale explaining technical decisions

### Bilingual Support

Complete localization in English and Spanish:

- Seamless language switching without reload
- Localized URLs (`/es/...`, `/en/...`)
- Translated content (not auto-translated)

### Dark Mode

Optimized dark theme:

- Respects system preferences
- Persists user choice
- Smooth transition between themes
- Synchronized Giscus themes

### Progressive Web App

Installable as an application:

- Complete web manifest
- Service worker for basic offline
- Optimized icons for all platforms

## Technical Architecture

### Main Stack

- **Astro 5**: SSG with Islands Architecture
- **React 19**: Interactive components (carousels, forms, lightbox)
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first with custom theme
- **Vercel**: Edge deployment with global CDN

### Testing

Comprehensive testing suite:

- **Vitest**: Unit and component tests
- **Playwright**: E2E and visual regression tests
- **axe-core**: Automated accessibility tests
- **Lighthouse CI**: Performance budgets in CI

### Code Quality

- **Biome**: Fast linting and formatting
- **Husky + lint-staged**: Pre-commit hooks
- **Commitlint**: Conventional commits
- **TypeScript strict mode**: No implicit any

### Content Management

Astro Content Collections for type-safe content:

- Blog posts with validated frontmatter
- Projects with metrics and metadata
- Testimonials
- Snippets and CSS tricks
- Categorized useful links

## Responsive Design

Mobile-first with optimized breakpoints:

- Mobile: 320px+
- Tablets: 768px+
- Desktops: 1024px+
- Large screens: 1440px+

## SEO and Social

- Structured data (JSON-LD) for projects, posts and person
- Dynamic Open Graph and Twitter cards
- Automatic XML sitemap
- Canonical URLs
- Optimized robots.txt

## Open Source

All code is open source, serving as a reference implementation for modern Astro
portfolios with a focus on performance, accessibility and best practices.
