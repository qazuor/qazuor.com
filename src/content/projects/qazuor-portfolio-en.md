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
technologies: [Astro, React, TypeScript, Tailwind CSS, GSAP, Lenis, Vercel]
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
---

## Project Overview

This portfolio represents my commitment to building fast, accessible, and
well-crafted web experiences. Every decision, from the tech stack to the
smallest interaction, was made with performance and user experience in mind.

The site serves as both a showcase of my work and a technical blog where I share
insights about web development.

## Performance First

Built with aggressive performance optimization as a core principle:

### Core Web Vitals

- **LCP**: ~271ms (target: <2.5s)
- **FCP**: ~271ms (target: <1.8s)
- **CLS**: 0.00 (target: <0.1)
- **JS Bundle**: 308KB gzipped (38% under 500KB budget)
- **CSS Bundle**: 40KB gzipped (60% under 100KB budget)

### Optimization Techniques

- **Inline critical CSS**: Essential styles load immediately
- **Font preloading**: Web fonts with swap strategy for fast text rendering
- **Image optimization**: Modern formats with fetch priority hints
- **SVG sprite consolidation**: 99.3% reduction in icon assets
- **Strategic lazy loading**: Below-fold components defer hydration

## Accessibility Standards

WCAG 2.1 Level AA compliance throughout the site:

- Semantic HTML structure
- Keyboard navigation for all interactive elements
- Screen reader optimized content
- Sufficient color contrast ratios
- Focus indicators on all focusable elements
- Skip links to main content

## Key Features

### Bilingual Support

Complete localization in English and Spanish with seamless language switching.

### Dark Mode

Dark theme by default with switching capability. Respects system preferences and
persists user choice.

### View Transitions API

Smooth page transitions for a native app-like navigation experience.

### Command Palette

Quick navigation via `Ctrl+K` keyboard shortcut, allowing fast access to any
page or action.

### Progressive Web App

Installable as PWA with web manifest and offline support.

### SEO Optimization

- Structured data markup (JSON-LD)
- Open Graph and Twitter cards
- Automatic sitemap generation
- Canonical URLs

## Technical Architecture

### Stack

- **Astro**: Static Site Generation for optimal performance
- **React 19**: Islands Architecture for interactive components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **GSAP + Lenis**: Animations and smooth scrolling
- **Vercel**: Edge deployment with global CDN

### Content Management

Astro Content Collections for type-safe content:

- Blog posts with series support
- Project showcases
- Testimonials
- Code snippets and CSS tricks
- Curated useful links

### Responsive Design

Mobile-first approach with optimized breakpoints for:

- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

## Design Philosophy

The design balances minimalism with personality:

- Clean typography with Inter font family
- Consistent spacing scale
- Subtle animations that enhance rather than distract
- Dark theme optimized to reduce eye strain
- Visual hierarchy that guides the user

## Open Source

All code is open source, serving as a reference implementation for modern Astro
sites with a focus on performance and accessibility.
