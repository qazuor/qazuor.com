---
title: React Custom Hooks
description:
  A collection of over 20 high-quality, fully tested React hooks for common use
  cases. Zero dependencies, tree-shakeable, and SSR compatible.
longDescription:
  Centralized repository of reusable React hooks covering state management, side
  effects, browser APIs, and user interaction. Written in TypeScript with
  complete documentation.
lang: en
category: open-source
tags: [React Library, Hooks, TypeScript, NPM Package]
technologies: [React, TypeScript, Vitest]
images:
  - ./_images/reactCustomHooks/1.png
mainImage: ./_images/reactCustomHooks/1.png
githubUrl: https://github.com/qazuor/reactCustomHooks
npmUrl: https://www.npmjs.com/package/@qazuor/react-hooks
featured: false
publishDate: 2025-04-01
order: 6
status: production
metrics:
  commits: 53
  linesOfCode: 1155
  developmentTime: '2 weeks'
  startDate: 2025-03-04
  contributors: 1
  openIssues: 0
challenges:
  - problem: 'SSR compatibility - Hooks accessing window broke in SSR'
    solution: "typeof window !== 'undefined' checks with safe initial values"
  - problem: 'Memory leaks in intervals - Timers not cleaned up on unmount'
    solution: 'Rigorous cleanup in useEffect return functions'
  - problem:
      'Complex type inference - Generics for hooks with multiple overloads'
    solution: 'Well-defined overload signatures plus type tests'
highlights:
  - '20+ hooks covering common use cases'
  - 'Zero dependencies - only React as peer dependency'
  - 'Full TypeScript support with excellent type inference'
  - 'Tree-shakeable - only import what you use'
  - 'SSR safe - compatible with Next.js and others'
  - 'Bundle under 5KB gzipped for entire library'
futureImprovements:
  - 'usePrevious - Track previous value'
  - 'useAsync - Async operation state management'
  - 'useIntersectionObserver - Viewport visibility detection'
  - 'useGeolocation - Browser geolocation API'
  - 'useEventListener - Simplified event listener management'
stackRationale:
  TypeScript: 'Excellent type inference for hook consumers'
  Vitest: 'Fast testing with great DX'
  Zero dependencies: 'Minimal bundle size, no version conflicts'
---

## Project Description

Every React project I work on ends up needing the same utilities: debouncing,
local storage sync, click outside detection, media queries, and more. Instead of
copying code between projects or installing multiple small packages, I created a
centralized repository of hooks I can reuse everywhere.

This library is my personal toolkit that I've refined through multiple projects,
ensuring each hook is well-tested, properly typed, and follows React best
practices.

## Features

- **Over 20 hooks** covering common use cases
- **Zero dependencies** - only React as peer dependency
- **Full TypeScript support** with proper type inference
- **Tree-shakeable** - only import what you need
- **SSR compatible** - safe for Next.js and other SSR frameworks
- **Fully tested** with complete test coverage

## Installation

```bash
npm install @qazuor/react-hooks
# or
pnpm add @qazuor/react-hooks
# or
yarn add @qazuor/react-hooks
```

## Available Hooks

### State Management

- **useBoolean** - Boolean state with `setTrue`, `setFalse`, `toggle` methods
- **useToggle** - Toggleable state with optional persistence
- **useQueue** - FIFO queue with `enqueue`, `dequeue` operations

### Side Effects

- **useTimeout** - Delayed callback execution with `start`, `stop`, `reset`
- **useInterval** - Recurring callbacks with pause/resume functionality
- **useHandledInterval** - Enhanced interval with random delay support
- **useDebounce** - Debouncing values with configurable delay

### Browser APIs

- **useLocalStorage** - Persistent state synced with localStorage
- **useSessionStorage** - Session storage management
- **useCopyToClipboard** - Clipboard read/write utilities
- **useMediaQuery** - Reactive media query matching
- **useNetworkState** - Network connectivity detection
- **useVisibilityChange** - Document visibility monitoring
- **useWindowWidth** - Window dimensions tracking

### User Interaction

- **useClickOutside** - Detect clicks outside an element
- **useIdleness** - Monitor user activity/inactivity
- **usePageLeave** - Detect when user leaves the page
- **useLockBodyScroll** - Prevent body scroll (modals, overlays)
- **useMeasure** - Element dimensions via ResizeObserver

### Development

- **useLogger** - Development logging with lifecycle tracking

## Usage Example

```tsx
import {
  useLocalStorage,
  useDebounce,
  useClickOutside,
} from '@qazuor/react-hooks';

function SearchDropdown() {
  const [query, setQuery] = useLocalStorage('search-query', '');
  const debouncedQuery = useDebounce(query, 300);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div ref={dropdownRef}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* Results dropdown */}
    </div>
  );
}
```

## Technical Details

### Requirements

- React 18.2+
- TypeScript 4.9+ (for TypeScript users)

### Bundle Size

Each hook is independently importable, so you only include what you use in your
bundle. The entire library is under 5KB gzipped.
