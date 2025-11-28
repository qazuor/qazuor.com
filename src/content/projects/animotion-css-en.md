---
title: Animotion CSS
description:
  Visual CSS animation generator with interactive timeline. Create keyframe
  animations, transitions and micro-interactions without writing code manually.
longDescription:
  A tool for developers that allows creating CSS animations visually. Includes
  an interactive keyframe editor, 15 preset animations, 17 timing functions and
  real-time preview. Export production-ready CSS with one click.
lang: en
category: open-source
tags: [Dev Tool, CSS Generator, Design Tool, Animation]
technologies:
  [React, TypeScript, Vite, Tailwind CSS, Zustand, Radix UI, Motion, i18next]
images:
  - ./_images/animotion-css/1.png
  - ./_images/animotion-css/2.png
  - ./_images/animotion-css/3.png
mainImage: ./_images/animotion-css/1.png
githubUrl: https://github.com/qazuor/animotion-css
demoUrl: https://qazuor-animotion-css.vercel.app
featured: true
publishDate: 2025-11-25
order: 4
---

## Project Description

Writing CSS animations by hand is tedious. Finding the right timing, easing, and
keyframe percentages requires constant trial and error. Every time I needed an
animation, I found myself searching for online tools, dealing with cluttered
interfaces, and copying code that needed adjustments.

Animotion CSS is my custom solution: a visual animation generator where I can
see exactly what I'm creating in real-time and export clean, production-ready
CSS instantly.

## Key Features

### Visual Keyframe Editor

- **Interactive timeline**: Add and remove keyframes at any position (0-100%)
- **Property toggles**: Enable/disable specific CSS properties per keyframe
- **Real-time preview**: Watch your animation update as you edit
- **Collapsible panels**: Keep your workspace organized

### Animation Configuration

Full control over animation behavior:

- **Duration**: 100ms to 5000ms
- **Delay**: 0ms to 2000ms
- **Iterations**: 1, 2, 3, 5, 10, or infinite
- **Direction**: normal, reverse, alternate, alternate-reverse
- **Fill mode**: none, forwards, backwards, both

### 17 Timing Functions

From basic to advanced:

- **Basic**: linear, ease, ease-in, ease-out, ease-in-out
- **Steps**: step-start, step-end, steps(n)
- **Advanced**: cubic-bezier curves for custom easing

### Animatable Properties

Transform and visual properties:

- **Transform**: translateX, translateY, scale, rotate, skewX, skewY
- **Visual**: opacity, backgroundColor, color, borderRadius, boxShadow
- **Custom**: Support for any CSS property

### 15 Preset Animations

Ready-to-use animations:

- **Fade**: fadeIn, fadeOut
- **Slide**: slideInLeft, slideInRight, slideInUp, slideInDown
- **Zoom**: zoomIn, zoomOut
- **Effects**: pulse, spin, flip, bounce, shake, heartbeat

### User Experience

- **Multiple preview shapes**: Square, circle, text, icon
- **Auto-save**: LocalStorage persistence
- **Animation history**: Quickly apply previous animations
- **One-click copy**: Export CSS instantly
- **Bilingual**: English and Spanish

## Technical Architecture

### Stack

- **React 19** with hooks
- **TypeScript 5.9** for type safety
- **Vite 7** for development
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible primitives
- **Zustand** with persistence for state
- **Motion** library for UI animations
- **Lucide React** for icons
- **i18next** for internationalization
- **Biome** for linting
- **Vitest** for testing

### How It Works

1. **Select or create**: Choose a preset or start from scratch
2. **Configure timing**: Set duration, delay, iterations, direction
3. **Edit keyframes**: Enable properties and adjust values at each keyframe
4. **Preview**: Watch the animation in real-time
5. **Export**: Copy the generated CSS

## Generated Code Example

```css
@keyframes custom-animation {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-element {
  animation: custom-animation 300ms ease-out forwards;
}
```

## Future Ideas

- Animation sequencing (chain multiple animations)
- CSS-in-JS output formats
- Export animation library
- Shareable animation URLs
- More preset categories
