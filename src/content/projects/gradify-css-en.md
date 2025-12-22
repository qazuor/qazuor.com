---
title: Gradify CSS
description:
  Modern CSS gradient generator with real-time preview. Create beautiful linear,
  radial, and conic gradients through an intuitive visual interface.
longDescription:
  A contemporary gradient generator built with React and TypeScript. Design
  stunning CSS gradients with unlimited color stops, visual angle control, and
  instant code export. Features over 15 curated presets and glassmorphic UI.
lang: en
category: open-source
tags: [Dev Tool, CSS Generator, Design Tool, Gradients]
technologies:
  [React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, Zod, i18next]
images:
  - ./_images/gradify-css/1.png
  - ./_images/gradify-css/2.png
  - ./_images/gradify-css/3.png
mainImage: ./_images/gradify-css/1.png
githubUrl: https://github.com/qazuor/gradify-css
demoUrl: https://qazuor-gradify-css.vercel.app/
featured: true
publishDate: 2025-11-25
order: 2
status: production
metrics:
  commits: 24
  linesOfCode: 6087
  developmentTime: '5 days'
  startDate: 2025-11-25
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Complex gradient rendering - Conic gradients with many color stops caused
      visual artifacts'
    solution:
      'Limited color stops and normalized positions for consistent rendering'
  - problem:
      'Inconsistent color picker - Different browsers rendered colors
      differently'
    solution: 'Normalized all colors to hex and added canvas preview'
  - problem:
      'Touch-friendly angle selector - The circular selector was difficult to
      use on mobile'
    solution: 'Expanded touch area and added debounce to updates'
highlights:
  - '3 gradient types: Linear, Radial, and Conic'
  - 'Visual 360° angle selector for linear gradients'
  - 'Unlimited color stops with precise positioning'
  - '15+ curated presets in 4 categories'
  - 'Gradient history with auto-save'
  - 'Dark/light theme with system preference detection'
futureImprovements:
  - 'Gradient animation generator'
  - 'CSS-in-JS output formats (styled-components, emotion)'
  - 'Gradient palette collections'
  - 'Shareable gradient URLs'
  - 'Browser extension for quick access'
stackRationale:
  Zod: 'Type-safe validation for gradient configurations'
  shadcn/ui: 'Accessible sliders and color pickers'
  Zustand: 'Simple persistence with middleware'
---

## Project Description

Every time I needed a CSS gradient, I found myself googling online tools,
dealing with ads, and fighting cluttered interfaces. Gradify CSS was born from
the simple desire to have my own custom tool that I can use instantly whenever I
need it.

Beyond solving a personal need, building Gradify was also a learning exercise in
creating polished and interactive UI tools with modern React patterns.

## Key Features

### Gradient Types

Support for all CSS gradient functions:

- **Linear Gradients**: With 360° visual angle selector
- **Radial Gradients**: Circular and elliptical with position control
- **Conic Gradients**: Angular gradients from a central point

### Color Stop Editor

- **Unlimited color stops**: Add as many colors as you need
- **Position control**: Adjust each stop's percentage precisely
- **Visual editing**: Drag and adjust directly on the gradient bar
- **Color picker**: Full color selection with hexadecimal input

### Instant Code Export

- **One-click copy**: Get the CSS instantly
- **Clean output**: Production-ready code
- **Real-time preview**: See changes as you make them

### Curated Presets

Over 15 hand-picked gradient presets organized by category:

- **Sunset**: Warm orange and pink tones
- **Ocean**: Cool blues and turquoises
- **Nature**: Greens and earth tones
- **Neon**: Vibrant high-contrast colors

### User Experience

- **Dark/Light theme**: Persistent preference
- **Bilingual**: English and Spanish support
- **Responsive**: Works on any device
- **History**: Auto-save to localStorage
- **Accessibility**: Full keyboard navigation

## Visual Design

The interface features a glassmorphic card design with animated SVG icons and
dynamic accent colors that match the current gradient. This creates a cohesive
experience where the tool itself showcases what it can produce.

## Technical Architecture

### Stack

- **React 19** with modern hooks patterns
- **TypeScript** for type safety
- **Vite 7** for fast development
- **Tailwind CSS v4** for styling
- **shadcn/ui** for accessible components
- **Zustand** for state management
- **Zod** for validation
- **react-i18next** for internationalization

### Project Structure

```
src/
├── components/
│   ├── animate-ui/     # Animated icons
│   ├── gradient/       # Gradient-specific components
│   └── layout/         # App structure
├── config/             # App configuration
├── i18n/               # Translations
├── stores/             # Zustand stores
└── utils/              # Helper functions
```

## How It Works

1. **Select gradient type**: Linear, radial, or conic
2. **Adjust parameters**: Angle for linear, position for radial/conic
3. **Edit color stops**: Add colors and adjust positions
4. **Real-time preview**: See the gradient update instantly
5. **Copy the CSS**: One click to clipboard
