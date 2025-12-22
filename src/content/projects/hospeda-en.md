---
title: Hospeda
description:
  Modern tourism platform for discovering accommodations in Argentina's Litoral
  region. AI-powered tools for guests and hosts with exceptional UX.
longDescription:
  A comprehensive web platform for tourist accommodations featuring AI
  integration, management tools for hosts, and a hyper-modern design focused on
  performance and accessibility.
lang: en
category: commercial
tags: [Portal, Tourism, Full-Stack, Monorepo, AI Integration]
technologies:
  [
    Astro,
    React,
    TanStack Router,
    Hono,
    PostgreSQL,
    Drizzle ORM,
    Tailwind CSS,
    Zod,
    TurboRepo,
    Vercel,
  ]
images:
  - ./_images/hospeda/placeholder.jpg
mainImage: ./_images/hospeda/placeholder.jpg
githubUrl: https://github.com/qazuor/hospeda
demoUrl: https://hospeda-web.vercel.app
featured: true
publishDate: 2025-12-01
order: 5
status: development
metrics:
  commits: 1967
  linesOfCode: 570085
  developmentTime: '8 months'
  startDate: 2025-05-08
  contributors: 3
  openIssues: 53
challenges:
  - problem:
      'Type synchronization between apps - Changes in schemas broke other apps'
    solution: 'Shared @hospeda/types package with CI validation'
  - problem: 'Production DB migrations - Drizzle push vs migrate conflicts'
    solution: 'Migration scripts with automatic rollback'
  - problem:
      'Performance with large listings - Thousands of accommodations without
      pagination'
    solution: 'Cursor-based pagination with infinite scroll'
  - problem: 'AI integration costs - LLM calls quickly accumulated costs'
    solution: 'Aggressive caching and per-user rate limiting'
highlights:
  - '1,967 commits demonstrating active development'
  - 'Monorepo architecture with TurboRepo for optimized builds'
  - 'AI integration for recommendations and semantic search'
  - 'Host management tools: calendar, analytics, communication'
  - 'Regional focus with local knowledge built-in'
  - 'WCAG compliant and mobile-first design'
futureImprovements:
  - 'Mobile app (React Native)'
  - 'Payment gateway integration'
  - 'Multi-property dashboard for hosts'
  - 'OTA integration (Booking, Airbnb)'
  - 'Review system with NLP analysis'
stackRationale:
  Monorepo: 'Shared code between apps, coordinated releases'
  TurboRepo: 'Build caching, intelligent parallelization'
  Hono: 'Lightweight, edge-compatible, excellent DX'
  Drizzle: 'Type-safe queries, better than Prisma for edge'
  TanStack Router: 'File-based routing with types, loaders'
---

## Project Overview

Hospeda was born from conversations with accommodation owners in Concepcion del
Uruguay and the broader Litoral region of Argentina. The existing platforms
don't serve small and medium hosts well, they're designed for massive scale
rather than regional needs.

This is a personal venture to create something different: a tourism platform
tailored for the region, with AI-powered tools that genuinely help both guests
and hosts, wrapped in a modern, accessible, and blazingly fast interface.

## What Makes Hospeda Different

### Regional Focus

Unlike global platforms that treat every location the same, Hospeda is built
specifically for Argentina's Litoral region. Local knowledge is baked into the
platform, from understanding seasonal patterns to highlighting hidden gems that
bigger platforms miss.

### AI Integration

AI isn't just a buzzword here. It's integrated throughout to provide real value:

- **For Guests**: Smart recommendations based on preferences, natural language
  search, trip planning assistance
- **For Hosts**: Pricing suggestions, demand forecasting, automated guest
  communication, review response drafts

### Host Management Tools

Beyond just listing accommodations, Hospeda provides satellite tools to help
hosts run their business:

- Calendar and availability management
- Multi-platform synchronization
- Performance analytics
- Guest communication hub

### Design Excellence

- **Extremely modern**: Contemporary UI that feels fresh and professional
- **Accessible**: WCAG compliant, usable by everyone
- **Super performant**: Optimized for fast loading even on slower connections
- **User-friendly**: Intuitive navigation that doesn't require learning

## Core Features

### For Guests

- **Accommodation Discovery**: Browse and filter properties with rich details
- **Destination Exploration**: Learn about places to visit in the region
- **Reviews & Ratings**: Authentic feedback from verified stays
- **Events**: Discover local happenings during your visit
- **AI Assistant**: Natural language help for planning your trip

### For Hosts

- **Property Management**: Complete control over listings
- **Booking Management**: Handle reservations efficiently
- **Analytics Dashboard**: Understand your performance
- **AI Tools**: Automated assistance for common tasks
- **Communication Center**: Manage guest interactions

### Admin Features

- Content management for destinations and events
- User role and permission management
- Platform-wide analytics
- Moderation tools

## Technical Architecture

### Monorepo Structure

Built with TurboRepo for efficient development across multiple packages:

```
hospeda/
├── apps/
│   ├── web/          # Guest-facing Astro site
│   ├── admin/        # Admin dashboard (React)
│   └── api/          # Hono API server
└── packages/
    ├── db/           # Drizzle ORM + PostgreSQL
    ├── schemas/      # Shared Zod schemas
    ├── types/        # TypeScript types
    ├── logger/       # Logging utilities
    └── utils/        # Shared utilities
```

### Tech Stack

- **Frontend**: Astro for static pages, React for interactive features
- **Routing**: TanStack Router for type-safe navigation
- **API**: Hono for fast, lightweight endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod for runtime type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Build**: TurboRepo for monorepo management
- **Deployment**: Vercel for edge performance

## Current Status

Hospeda is in active development with over 1,900 commits. The core platform
functionality is in place, with ongoing work on AI features and host tools.

## Business Model

The platform will be monetized through a model that aligns with hosts' success,
different from the high commission rates of major platforms. Details will be
announced closer to launch.

## Vision

Create the go-to platform for tourism in Argentina's Litoral region, one that
actually serves the community rather than extracting from it.
