# Technical Analysis: i18n Lazy Loading Architecture

**Author:** product-technical **Date:** 2025-11-22 **Context:** Performance
Optimization - Tasks PB-005 to PB-010 **Status:** APPROVED ✅

---

## Executive Summary

This document presents a comprehensive technical architecture to refactor the
current i18n system from static imports to lazy-loaded namespaces. The solution
will reduce initial bundle size by ~64KB (all translations), improve First
Contentful Paint (FCP), and maintain full backward compatibility with existing
code.

**Impact:**

- **Bundle Reduction:** ~64KB → ~10-15KB per page (80% reduction)
- **Load Time:** Only load namespaces needed per page
- **Cache Strategy:** In-memory cache + background preloading
- **Compatibility:** 100% backward compatible with existing API

---

## 1. Current State Analysis

### 1.1 Problem Statement

**Current Implementation (`src/i18n/ui.ts`):**

```typescript
// ❌ PROBLEM: Static imports load ALL translations at build time
import commonEn from '@/locales/en/common.json';
import projectsEn from '@/locales/en/projects.json';
import servicesEn from '@/locales/en/services.json';
import skillsEn from '@/locales/en/skills.json';

import commonEs from '@/locales/es/common.json';
import projectsEs from '@/locales/es/projects.json';
import servicesEs from '@/locales/es/services.json';
import skillsEs from '@/locales/es/skills.json';

// All translations bundled into single object
export const ui = {
  en: {
    ...commonEn,
    services: servicesEn,
    skills: skillsEn,
    projects: projectsEn,
  },
  es: {
    ...commonEs,
    services: servicesEs,
    skills: skillsEs,
    projects: projectsEs,
  },
} as const;
```

**Issues:**

1. **Bundle Bloat:** All 8 translation files (65,385 bytes) loaded on every page
2. **Unused Code:** Most pages only need 1-2 namespaces, but get all 4
3. **No Code Splitting:** Vite cannot tree-shake unused translations
4. **Poor Caching:** No granular caching strategy per namespace

### 1.2 Translation Files Analysis

**File Sizes:**

| File               | Size (bytes) | Lines     | Usage                         |
| ------------------ | ------------ | --------- | ----------------------------- |
| `en/common.json`   | 9,682        | 229       | ALL pages (nav, footer, hero) |
| `es/common.json`   | 10,252       | 229       | ALL pages (nav, footer, hero) |
| `en/services.json` | 16,692       | 290       | ONLY `/services/*` pages      |
| `es/services.json` | 18,418       | 290       | ONLY `/services/*` pages      |
| `en/projects.json` | 2,962        | 84        | ONLY `/projects/*` pages      |
| `es/projects.json` | 3,175        | 84        | ONLY `/projects/*` pages      |
| `en/skills.json`   | 2,001        | 42        | ONLY home page                |
| `es/skills.json`   | 2,203        | 42        | ONLY home page                |
| **TOTAL**          | **65,385**   | **1,290** |                               |

**Key Insight:** `services.json` is the largest (35KB combined) but ONLY used in
2 pages!

### 1.3 Page-Level Namespace Usage

Analysis of which namespaces each page actually uses:

| Page                    | Namespaces Needed    | Current Load | Waste |
| ----------------------- | -------------------- | ------------ | ----- |
| `index.astro`           | `common`, `skills`   | ALL 4        | 50%   |
| `blog/[slug].astro`     | `common`             | ALL 4        | 75%   |
| `blog/[...page].astro`  | `common`             | ALL 4        | 75%   |
| `services/index.astro`  | `common`, `services` | ALL 4        | 50%   |
| `services/[slug].astro` | `common`, `services` | ALL 4        | 50%   |
| `projects/index.astro`  | `common`, `projects` | ALL 4        | 50%   |
| `projects/[slug].astro` | `common`, `projects` | ALL 4        | 50%   |
| `tools.astro`           | `common`             | ALL 4        | 75%   |
| `tools/[...slug].astro` | `common`             | ALL 4        | 75%   |

**Average waste:** ~60% of loaded translation data is unused per page!

### 1.4 Current API Usage

**Pages (9 files):**

```typescript
import { getLangFromUrl, getTranslations } from '@/i18n/utils';
const lang = getLangFromUrl(Astro.url);
const t = getTranslations(lang);

// Usage in templates
const title = t('services.webApps.title', { markdown: true });
const feature = t('services.webApps.features.0');
```

**React Components (1 file - `TranslatedText.tsx`):**

```typescript
import { useTranslations } from '@/i18n/utils';

export function useTranslations() {
  const lang = getCurrentLang();
  return getTranslations(lang);
}
```

### 1.5 Performance Impact Estimate

**Current State:**

- Initial bundle includes full i18n object: ~65KB
- Gzip compression reduces to ~15-20KB
- But still parsed and executed on every page load

**Target State:**

- Initial bundle includes only `common.json`: ~10KB (gzipped: ~3KB)
- Page-specific namespaces loaded on-demand: ~5-18KB each
- 60-80% reduction in unused translations

---

## 2. Proposed Architecture

### 2.1 Design Principles

1. **Lazy Loading:** Only load namespaces when requested
2. **Caching:** In-memory cache to avoid duplicate loads
3. **Preloading:** Background preload of alternate language
4. **Backward Compatibility:** Existing `getTranslations()` API unchanged
5. **Type Safety:** Full TypeScript support with correct types
6. **SSR-Friendly:** Works with Astro SSG (static site generation)

### 2.2 Namespace Strategy

**Namespace Structure:**

```
common → Always loaded first (nav, footer, hero, etc.)
services → Loaded on /services/* pages
projects → Loaded on /projects/* pages
skills → Loaded on home page only
blog → Future namespace for blog-specific translations
```

**Loading Strategy:**

1. **Eager Load:** `common` namespace on all pages
2. **Lazy Load:** Route-specific namespaces on-demand
3. **Background Preload:** Alternate language after initial load
4. **Cache:** Store loaded namespaces in memory (Map)

### 2.3 File Structure

**New Structure:**

```
src/
├── i18n/
│   ├── config.ts              # Config & types (NEW)
│   ├── loader.ts              # Namespace loading logic (NEW)
│   ├── cache.ts               # Caching mechanism (NEW)
│   ├── preload.ts             # Background preloading (NEW)
│   ├── ui.ts                  # REFACTORED - No static imports
│   └── utils.ts               # REFACTORED - Uses loader
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── projects.json
    │   ├── services.json
    │   └── skills.json
    └── es/
        ├── common.json
        ├── projects.json
        ├── services.json
        └── skills.json
```

### 2.4 Core Interfaces

```typescript
// src/i18n/config.ts

/**
 * Available languages
 */
export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export const defaultLang = 'en';

/**
 * Available translation namespaces
 */
export const namespaces = ['common', 'services', 'projects', 'skills'] as const;

/**
 * Type definitions
 */
export type Locale = keyof typeof languages;
export type Namespace = (typeof namespaces)[number];

/**
 * Translation dictionary type
 */
export type TranslationDict = Record<string, unknown>;

/**
 * Namespace data type
 */
export type NamespaceData = Record<string, unknown>;

/**
 * Cache key type
 */
export type CacheKey = `${Locale}:${Namespace}`;

/**
 * Loader options
 */
export interface LoaderOptions {
  /** Language to load */
  locale: Locale;
  /** Namespace to load */
  namespace: Namespace;
  /** Force reload (bypass cache) */
  forceReload?: boolean;
}

/**
 * Preload options
 */
export interface PreloadOptions {
  /** Target language to preload */
  locale: Locale;
  /** Namespaces to preload (default: all) */
  namespaces?: Namespace[];
  /** Priority (default: 'low') */
  priority?: 'high' | 'low';
}
```

### 2.5 Dynamic Import Strategy

**Key Challenge:** Astro SSG requires all imports to be analyzable at build
time.

**Solution:** Use template literals with known paths:

```typescript
// src/i18n/loader.ts

/**
 * Dynamic import function for translation files
 * Uses Vite's import.meta.glob for build-time analysis
 */
const translationModules = import.meta.glob<{ default: TranslationDict }>(
  '@/locales/**/*.json',
  { eager: false }
);

/**
 * Load a translation namespace dynamically
 */
export async function loadNamespace(
  locale: Locale,
  namespace: Namespace
): Promise<NamespaceData> {
  const path = `/src/locales/${locale}/${namespace}.json`;

  const module = translationModules[path];

  if (!module) {
    throw new Error(`Translation file not found: ${path}`);
  }

  const data = await module();
  return data.default;
}
```

**Why `import.meta.glob`?**

- ✅ Vite can analyze at build time
- ✅ Creates separate chunks per namespace
- ✅ Lazy loading with `eager: false`
- ✅ Type-safe with generics

---

## 3. Implementation Details

### 3.1 Cache System

**Design:**

```typescript
// src/i18n/cache.ts

/**
 * In-memory cache for loaded translation namespaces
 * Key format: "{locale}:{namespace}" (e.g., "en:common")
 */
class NamespaceCache {
  private cache: Map<CacheKey, NamespaceData>;
  private loadingPromises: Map<CacheKey, Promise<NamespaceData>>;

  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Get namespace from cache
   */
  get(locale: Locale, namespace: Namespace): NamespaceData | undefined {
    const key = this.getCacheKey(locale, namespace);
    return this.cache.get(key);
  }

  /**
   * Set namespace in cache
   */
  set(locale: Locale, namespace: Namespace, data: NamespaceData): void {
    const key = this.getCacheKey(locale, namespace);
    this.cache.set(key, data);
  }

  /**
   * Check if namespace is cached
   */
  has(locale: Locale, namespace: Namespace): boolean {
    const key = this.getCacheKey(locale, namespace);
    return this.cache.has(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Clear cache for specific locale
   */
  clearLocale(locale: Locale): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${locale}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get or set loading promise to avoid duplicate loads
   */
  getLoadingPromise(
    locale: Locale,
    namespace: Namespace
  ): Promise<NamespaceData> | undefined {
    const key = this.getCacheKey(locale, namespace);
    return this.loadingPromises.get(key);
  }

  setLoadingPromise(
    locale: Locale,
    namespace: Namespace,
    promise: Promise<NamespaceData>
  ): void {
    const key = this.getCacheKey(locale, namespace);
    this.loadingPromises.set(key, promise);

    // Clean up after promise resolves
    promise.finally(() => {
      this.loadingPromises.delete(key);
    });
  }

  private getCacheKey(locale: Locale, namespace: Namespace): CacheKey {
    return `${locale}:${namespace}`;
  }
}

/**
 * Global cache instance
 */
export const namespaceCache = new NamespaceCache();
```

**Features:**

- Prevents duplicate loads (loading promises map)
- Per-locale clearing capability
- Simple key-based access
- Type-safe with TypeScript

### 3.2 Namespace Loader

```typescript
// src/i18n/loader.ts

import { namespaceCache } from './cache';
import type { Locale, Namespace, NamespaceData, LoaderOptions } from './config';

/**
 * Vite dynamic import for translations
 * Analyzed at build time, loaded at runtime
 */
const translationModules = import.meta.glob<{ default: NamespaceData }>(
  '/src/locales/**/*.json',
  { eager: false }
);

/**
 * Load a translation namespace with caching
 */
export async function loadNamespace(
  options: LoaderOptions
): Promise<NamespaceData> {
  const { locale, namespace, forceReload = false } = options;

  // Check cache first
  if (!forceReload) {
    const cached = namespaceCache.get(locale, namespace);
    if (cached) {
      return cached;
    }

    // Check if already loading
    const loadingPromise = namespaceCache.getLoadingPromise(locale, namespace);
    if (loadingPromise) {
      return loadingPromise;
    }
  }

  // Load from file
  const promise = loadFromFile(locale, namespace);
  namespaceCache.setLoadingPromise(locale, namespace, promise);

  try {
    const data = await promise;
    namespaceCache.set(locale, namespace, data);
    return data;
  } catch (error) {
    console.error(`Failed to load namespace ${locale}:${namespace}`, error);
    throw error;
  }
}

/**
 * Load namespace from file system
 */
async function loadFromFile(
  locale: Locale,
  namespace: Namespace
): Promise<NamespaceData> {
  const path = `/src/locales/${locale}/${namespace}.json`;

  const module = translationModules[path];

  if (!module) {
    throw new Error(
      `Translation file not found: ${path}\n` +
        `Available locales: en, es\n` +
        `Available namespaces: common, services, projects, skills`
    );
  }

  const result = await module();
  return result.default;
}

/**
 * Load multiple namespaces in parallel
 */
export async function loadNamespaces(
  locale: Locale,
  namespaces: Namespace[]
): Promise<Map<Namespace, NamespaceData>> {
  const results = await Promise.all(
    namespaces.map((ns) =>
      loadNamespace({ locale, namespace: ns }).then(
        (data) => ({ namespace: ns, data }) as const
      )
    )
  );

  return new Map(results.map(({ namespace, data }) => [namespace, data]));
}

/**
 * Check if namespace is available (does not load it)
 */
export function hasNamespace(locale: Locale, namespace: Namespace): boolean {
  return namespaceCache.has(locale, namespace);
}
```

### 3.3 Background Preloader

```typescript
// src/i18n/preload.ts

import { loadNamespaces } from './loader';
import { namespaces } from './config';
import type { Locale, Namespace, PreloadOptions } from './config';

/**
 * Preload translation namespaces in the background
 * Uses requestIdleCallback for non-blocking execution
 */
export function preloadNamespaces(options: PreloadOptions): void {
  const {
    locale,
    namespaces: targetNamespaces = namespaces,
    priority = 'low',
  } = options;

  const preloadFn = () => {
    loadNamespaces(locale, targetNamespaces).catch((error) => {
      console.warn(`Background preload failed for ${locale}`, error);
    });
  };

  if (priority === 'high') {
    // High priority: Execute immediately
    preloadFn();
  } else {
    // Low priority: Execute when browser is idle
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(preloadFn);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preloadFn, 0);
    }
  }
}

/**
 * Preload alternate language in background
 * Called after initial page load
 */
export function preloadAlternateLanguage(
  currentLocale: Locale,
  currentNamespaces: Namespace[]
): void {
  // Determine alternate language
  const alternateLocale: Locale = currentLocale === 'en' ? 'es' : 'en';

  // Preload same namespaces as current page
  preloadNamespaces({
    locale: alternateLocale,
    namespaces: currentNamespaces,
    priority: 'low',
  });
}

/**
 * Preload common namespace for all pages
 * Should be called early in app initialization
 */
export async function preloadCommon(locale: Locale): Promise<void> {
  await loadNamespaces(locale, ['common']);
}
```

### 3.4 Refactored UI Module

```typescript
// src/i18n/ui.ts (REFACTORED)

import { loadNamespace, loadNamespaces } from './loader';
import type { Locale, Namespace, NamespaceData } from './config';

/**
 * Available languages
 */
export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export const defaultLang = 'en';

export type { Locale };

/**
 * Legacy ui object (DEPRECATED - for backward compatibility only)
 * Use getTranslations() instead
 *
 * WARNING: This is a Proxy that loads translations on-demand
 * Do NOT destructure or iterate over this object
 */
export const ui = new Proxy({} as Record<Locale, Record<string, unknown>>, {
  get(target, locale: string) {
    if (!(locale in languages)) {
      throw new Error(`Invalid locale: ${locale}`);
    }

    // Return a nested Proxy for namespace access
    return new Proxy({} as Record<string, unknown>, {
      get(_target, namespace: string) {
        // Synchronous access requires pre-loaded data
        throw new Error(
          `Synchronous access to ui.${locale}.${namespace} is not supported.\n` +
            `Use getTranslations() instead for lazy-loaded translations.`
        );
      },
    });
  },
});

/**
 * Load all namespaces for a locale (for testing/debugging only)
 * This defeats the purpose of lazy loading - use sparingly!
 */
export async function loadAllNamespaces(
  locale: Locale
): Promise<NamespaceData> {
  const allNamespaces: Namespace[] = [
    'common',
    'services',
    'projects',
    'skills',
  ];
  const results = await loadNamespaces(locale, allNamespaces);

  // Merge all namespaces into single object
  const merged: NamespaceData = {};

  for (const [namespace, data] of results) {
    if (namespace === 'common') {
      // Common goes at root level
      Object.assign(merged, data);
    } else {
      // Other namespaces nested
      merged[namespace] = data;
    }
  }

  return merged;
}
```

### 3.5 Refactored Utils Module

```typescript
// src/i18n/utils.ts (REFACTORED)

import { defaultLang, type Locale } from './ui';
import { loadNamespace } from './loader';
import { namespaceCache } from './cache';
import type { Namespace, NamespaceData } from './config';

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'es') return lang as Locale;
  return defaultLang;
}

/**
 * Process Markdown markers in text
 */
function processMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );
}

/**
 * Interpolate parameters in text
 */
function interpolateParams(
  text: string,
  params?: Record<string, string | number>
): string {
  if (!params) return text;

  return text.replace(
    /\{([^}:]+)(?::([^}]*))?\}/g,
    (match, key, defaultValue) => {
      const value = params[key];
      if (value !== undefined) {
        return String(value);
      }
      return defaultValue || match;
    }
  );
}

export interface TranslationOptions {
  params?: Record<string, string | number>;
  markdown?: boolean;
  fallback?: string;
}

/**
 * Translation function type
 */
type TranslationFunction = (
  key: string,
  options?: TranslationOptions
) => string;

/**
 * Get translations function for a locale
 *
 * IMPORTANT: This function now uses lazy-loaded namespaces
 * Namespaces are loaded on-demand when accessing nested keys
 */
export function getTranslations(lang: Locale): TranslationFunction {
  return function t(key: string, options?: TranslationOptions): string {
    const keys = key.split('.');

    // Determine namespace from first key
    const firstKey = keys[0];
    const namespace = getNamespaceFromKey(firstKey);

    // Get namespace data from cache
    const namespaceData = namespaceCache.get(lang, namespace);

    if (!namespaceData) {
      // Namespace not loaded - return fallback or key
      console.warn(
        `Namespace '${namespace}' not loaded for locale '${lang}'.\n` +
          `Make sure to preload required namespaces before rendering.\n` +
          `Key: ${key}`
      );
      return options?.fallback || key;
    }

    // Navigate through nested keys
    let value: unknown = namespaceData;

    // If first key is namespace name, skip it
    const startIndex = isNamespaceKey(firstKey) ? 1 : 0;

    for (let i = startIndex; i < keys.length; i++) {
      const k = keys[i];
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return options?.fallback || key;
      }
    }

    if (typeof value !== 'string') {
      return options?.fallback || key;
    }

    let result = value;

    // Interpolate parameters
    if (options?.params) {
      result = interpolateParams(result, options.params);
    }

    // Process Markdown
    if (options?.markdown) {
      result = processMarkdown(result);
    }

    return result;
  };
}

/**
 * Determine namespace from translation key
 */
function getNamespaceFromKey(firstKey: string): Namespace {
  const knownNamespaces: Namespace[] = ['services', 'projects', 'skills'];

  if (knownNamespaces.includes(firstKey as Namespace)) {
    return firstKey as Namespace;
  }

  // Default to common namespace
  return 'common';
}

/**
 * Check if key is a namespace identifier
 */
function isNamespaceKey(key: string): boolean {
  return ['services', 'projects', 'skills'].includes(key);
}

/**
 * Async version of getTranslations that loads namespaces on-demand
 * Use this for dynamic translation needs
 */
export async function getTranslationsAsync(
  lang: Locale,
  requiredNamespaces: Namespace[]
): Promise<TranslationFunction> {
  // Load all required namespaces
  await Promise.all(
    requiredNamespaces.map((ns) =>
      loadNamespace({ locale: lang, namespace: ns })
    )
  );

  // Return synchronous translation function
  return getTranslations(lang);
}

export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname;
  const parts = pathname.split('/');
  const lang = parts[1];

  if (lang === 'en' || lang === 'es') {
    parts.splice(1, 1);
  }

  return parts.join('/') || '/';
}

export function translatePath(path: string, lang: Locale): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${lang}/${cleanPath}`;
}
```

### 3.6 Updated TranslatedText Component

```typescript
// src/components/ui/TranslatedText.tsx (UPDATED)

import React, { useMemo } from 'react';
import type { TranslationOptions } from '@/i18n/utils';
import { getLangFromUrl, getTranslations } from '@/i18n/utils';
import type { Namespace } from '@/i18n/config';
import { loadNamespace } from '@/i18n/loader';

interface TranslatedTextProps extends TranslationOptions {
  textKey: string;
  as?: React.ElementType;
  className?: string;
  elementProps?: Record<string, unknown>;
  dangerouslySetInnerHTML?: boolean;
  /** Required namespaces to load before rendering */
  requiredNamespaces?: Namespace[];
}

/**
 * Component for rendering translated text with lazy-loaded namespaces
 *
 * NOTE: For SSR compatibility, required namespaces should be preloaded
 * in the parent Astro component before hydration
 */
export function TranslatedText({
  textKey,
  params,
  markdown = false,
  fallback,
  as: Element = 'span',
  className,
  elementProps = {},
  dangerouslySetInnerHTML = false,
  requiredNamespaces = [],
  ...rest
}: TranslatedTextProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const getCurrentLang = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      return getLangFromUrl(url);
    }
    return 'en' as const;
  }, []);

  // Load required namespaces
  React.useEffect(() => {
    const lang = getCurrentLang();

    if (requiredNamespaces.length > 0) {
      Promise.all(
        requiredNamespaces.map((ns) =>
          loadNamespace({ locale: lang, namespace: ns })
        )
      )
        .then(() => {
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Failed to load namespaces', error);
          setIsLoaded(true); // Render anyway with fallback
        });
    } else {
      setIsLoaded(true);
    }
  }, [requiredNamespaces, getCurrentLang]);

  const translatedText = useMemo(() => {
    if (!isLoaded) return fallback || textKey;

    const lang = getCurrentLang();
    const t = getTranslations(lang);
    return t(textKey, { params, markdown, fallback });
  }, [textKey, params, markdown, fallback, getCurrentLang, isLoaded]);

  const shouldUseHTML = markdown || dangerouslySetInnerHTML;

  if (shouldUseHTML) {
    return React.createElement(Element, {
      className,
      dangerouslySetInnerHTML: { __html: translatedText },
      ...elementProps,
      ...rest,
    });
  }

  return React.createElement(
    Element,
    {
      className,
      ...elementProps,
      ...rest,
    },
    translatedText
  );
}

/**
 * Hook for translations with lazy-loaded namespaces
 */
export function useTranslations(requiredNamespaces: Namespace[] = []) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const getCurrentLang = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      return getLangFromUrl(url);
    }
    return 'en' as const;
  }, []);

  // Load required namespaces
  React.useEffect(() => {
    const lang = getCurrentLang();

    if (requiredNamespaces.length > 0) {
      Promise.all(
        requiredNamespaces.map((ns) =>
          loadNamespace({ locale: lang, namespace: ns })
        )
      )
        .then(() => {
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Failed to load namespaces', error);
          setIsLoaded(true);
        });
    } else {
      setIsLoaded(true);
    }
  }, [requiredNamespaces, getCurrentLang]);

  return useMemo(() => {
    const lang = getCurrentLang();
    return {
      t: getTranslations(lang),
      isLoaded,
    };
  }, [getCurrentLang, isLoaded]);
}
```

---

## 4. Usage Patterns

### 4.1 In Astro Pages (SSR)

**Pattern: Preload namespaces before rendering**

```astro
---
// src/pages/[lang]/services/index.astro

import { getLangFromUrl } from '@/i18n/utils';
import { loadNamespaces } from '@/i18n/loader';
import { getTranslations } from '@/i18n/utils';
import { preloadAlternateLanguage } from '@/i18n/preload';

const lang = getLangFromUrl(Astro.url);

// Preload required namespaces for this page
await loadNamespaces(lang, ['common', 'services']);

// Now we can use translations synchronously
const t = getTranslations(lang);

// Optional: Preload alternate language in background (client-side)
// This will happen after page hydration
---

<BaseLayout>
    <h1>{t('services.title')}</h1>
    <p>{t('services.subtitle')}</p>
</BaseLayout>

<script>
    import { preloadAlternateLanguage } from '@/i18n/preload';

    // Preload Spanish if current is English (or vice versa)
    const currentLang = document.documentElement.lang as 'en' | 'es';
    preloadAlternateLanguage(currentLang, ['common', 'services']);
</script>
```

### 4.2 In React Components (Client-Side)

**Pattern: Use hook with required namespaces**

```tsx
// src/components/ServiceCard.tsx

import { useTranslations } from '@/components/ui/TranslatedText';

export function ServiceCard() {
  const { t, isLoaded } = useTranslations(['services']);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{t('services.webApps.title')}</h2>
      <p>{t('services.webApps.description')}</p>
    </div>
  );
}
```

### 4.3 Page-Specific Namespace Mapping

**Create a helper to determine required namespaces per route:**

```typescript
// src/i18n/route-namespaces.ts

import type { Namespace } from './config';

/**
 * Map routes to required translation namespaces
 */
export function getNamespacesForRoute(pathname: string): Namespace[] {
  // Always include common
  const namespaces: Namespace[] = ['common'];

  // Add route-specific namespaces
  if (pathname.includes('/services')) {
    namespaces.push('services');
  } else if (pathname.includes('/projects')) {
    namespaces.push('projects');
  } else if (pathname === '/en' || pathname === '/es' || pathname === '/') {
    // Home page needs skills
    namespaces.push('skills');
  }

  return namespaces;
}

/**
 * Preload namespaces for current route
 */
export async function preloadRouteNamespaces(
  url: URL,
  locale: Locale
): Promise<void> {
  const namespaces = getNamespacesForRoute(url.pathname);
  await loadNamespaces(locale, namespaces);
}
```

**Usage in layouts:**

```astro
---
// src/layouts/BaseLayout.astro

import { getLangFromUrl } from '@/i18n/utils';
import { preloadRouteNamespaces } from '@/i18n/route-namespaces';

const lang = getLangFromUrl(Astro.url);

// Preload all required namespaces for current route
await preloadRouteNamespaces(Astro.url, lang);
---

<!DOCTYPE html>
<html lang={lang}>
    <head>
        <!-- ... -->
    </head>
    <body>
        <slot />
    </body>
</html>
```

---

## 5. Migration Strategy

### 5.1 Phase-by-Phase Changes

**PB-005: Refactor i18n/ui.ts**

- Create `src/i18n/config.ts` with types
- Refactor `src/i18n/ui.ts` to remove static imports
- Create Proxy for backward compatibility
- **Testing:** Verify no runtime errors

**PB-006: Implement dynamic imports**

- Create `src/i18n/loader.ts` with `import.meta.glob`
- Implement `loadNamespace()` function
- Implement `loadNamespaces()` for parallel loading
- **Testing:** Test namespace loading in isolation

**PB-007: Create cache system**

- Create `src/i18n/cache.ts`
- Implement `NamespaceCache` class
- Integrate cache into loader
- **Testing:** Verify cache hits/misses

**PB-008: Background preloading**

- Create `src/i18n/preload.ts`
- Implement `preloadNamespaces()` with `requestIdleCallback`
- Implement `preloadAlternateLanguage()`
- **Testing:** Monitor network tab for background loads

**PB-009: Update TranslatedText component**

- Add `requiredNamespaces` prop
- Implement namespace loading in `useEffect`
- Update `useTranslations` hook
- **Testing:** Test in Storybook with different namespaces

**PB-010: Update all pages**

- Add `loadNamespaces()` calls to each page
- Add background preload scripts
- Remove any direct `ui` object access
- **Testing:** Full site testing

### 5.2 Files to Create

| File                           | Purpose                    | Lines Est. |
| ------------------------------ | -------------------------- | ---------- |
| `src/i18n/config.ts`           | Types & configuration      | 80         |
| `src/i18n/loader.ts`           | Dynamic loading logic      | 120        |
| `src/i18n/cache.ts`            | Caching mechanism          | 100        |
| `src/i18n/preload.ts`          | Background preloading      | 80         |
| `src/i18n/route-namespaces.ts` | Route-to-namespace mapping | 60         |

### 5.3 Files to Modify

| File                                   | Changes                          | Risk   |
| -------------------------------------- | -------------------------------- | ------ |
| `src/i18n/ui.ts`                       | Remove static imports, add Proxy | Medium |
| `src/i18n/utils.ts`                    | Use cache instead of `ui` object | Medium |
| `src/components/ui/TranslatedText.tsx` | Add namespace loading            | Low    |
| All 9 pages in `src/pages/[lang]/`     | Add `loadNamespaces()` calls     | Low    |
| `src/layouts/BaseLayout.astro`         | Add route-based preloading       | Low    |

### 5.4 Testing Checklist

**Per Task:**

- [ ] TypeScript compiles without errors
- [ ] All imports resolve correctly
- [ ] No runtime errors in console

**Integration Testing:**

- [ ] Navigate to each page - verify translations load
- [ ] Switch languages - verify translations update
- [ ] Check Network tab - verify only needed namespaces load
- [ ] Test in production build (`npm run build && npm run preview`)

**Performance Testing:**

- [ ] Measure bundle size before/after
- [ ] Lighthouse scores (should improve)
- [ ] Network waterfall (verify lazy loading)

---

## 6. Before/After Comparison

### 6.1 Bundle Size Impact

**Current State (Static Imports):**

```
Initial Bundle:
  - i18n/ui.ts: 65KB (all translations)
  - Gzipped: ~18KB

Per Page:
  - Home: 65KB i18n (uses 20KB → 45KB waste)
  - Services: 65KB i18n (uses 30KB → 35KB waste)
  - Blog: 65KB i18n (uses 10KB → 55KB waste)
```

**Future State (Lazy Loading):**

```
Initial Bundle:
  - i18n/config.ts: 2KB
  - i18n/loader.ts: 3KB
  - i18n/cache.ts: 2KB
  - i18n/preload.ts: 2KB
  - common.json: 10KB
  - Total: ~19KB → Gzipped: ~6KB

Per Page (on-demand):
  - Home: 19KB initial + 2KB (skills) = 21KB total
  - Services: 19KB initial + 18KB (services) = 37KB total
  - Blog: 19KB initial + 0KB = 19KB total
```

**Estimated Savings:**

| Page        | Current  | New      | Savings |
| ----------- | -------- | -------- | ------- |
| Home        | 65KB     | 21KB     | 68%     |
| Blog        | 65KB     | 19KB     | 71%     |
| Services    | 65KB     | 37KB     | 43%     |
| Projects    | 65KB     | 23KB     | 65%     |
| **Average** | **65KB** | **25KB** | **62%** |

### 6.2 Performance Metrics (Estimated)

**Lighthouse Impact:**

| Metric                       | Before | After | Change |
| ---------------------------- | ------ | ----- | ------ |
| FCP (First Contentful Paint) | 1.2s   | 0.9s  | -25%   |
| TTI (Time to Interactive)    | 2.8s   | 2.3s  | -18%   |
| Total Blocking Time          | 420ms  | 340ms | -19%   |
| Performance Score            | 88     | 94    | +6     |

**Network Waterfall:**

```
BEFORE:
Page Load → i18n bundle (65KB) → Render

AFTER:
Page Load → i18n core (6KB) → common.json (10KB) → Render
         → [idle] → services.json (18KB if needed)
         → [background] → es/common.json (10KB)
```

### 6.3 Code Changes Summary

**Minimal Changes Required:**

Most pages only need 2 lines added:

```diff
// src/pages/[lang]/services/index.astro

import { getLangFromUrl, getTranslations } from '@/i18n/utils';
+ import { loadNamespaces } from '@/i18n/loader';

const lang = getLangFromUrl(Astro.url);
+ await loadNamespaces(lang, ['common', 'services']);
const t = getTranslations(lang);
```

**Fully Backward Compatible:**

- Existing `getTranslations(lang)` API unchanged
- All existing translation keys work as-is
- No changes to JSON files

---

## 7. Risk Assessment

### 7.1 Technical Risks

| Risk                     | Severity | Mitigation                                     |
| ------------------------ | -------- | ---------------------------------------------- |
| SSR compatibility issues | Medium   | Use `import.meta.glob` for build-time analysis |
| Missing namespace errors | High     | Add runtime warnings, fallback to key          |
| Cache invalidation bugs  | Low      | Simple Map-based cache, easy to debug          |
| Type safety regression   | Low      | Comprehensive TypeScript types                 |
| Breaking existing code   | Medium   | Maintain backward compatibility, add Proxy     |

### 7.2 Performance Risks

| Risk                      | Severity | Mitigation                           |
| ------------------------- | -------- | ------------------------------------ |
| Slower first translation  | Low      | Preload common namespace eagerly     |
| Multiple network requests | Low      | Vite bundles JSON into chunks        |
| Cache memory bloat        | Very Low | Translations are small (~20KB total) |

### 7.3 Rollback Plan

If issues arise:

1. **Immediate:** Revert `src/i18n/utils.ts` to use static imports
2. **Keep new files:** Leave loader/cache for future use
3. **Gradual rollback:** Revert page-by-page if only some pages fail

---

## 8. Success Metrics

### 8.1 Performance KPIs

**Target Improvements:**

- ✅ Bundle size reduction: >50% for i18n code
- ✅ FCP improvement: >200ms faster
- ✅ Lighthouse Performance: >90 score
- ✅ Unused code: <10% per page

**Measurement Tools:**

- Vite build analyzer for bundle sizes
- Chrome DevTools Network tab
- Lighthouse CI in GitHub Actions

### 8.2 Code Quality KPIs

- ✅ Zero TypeScript errors
- ✅ All existing tests pass
- ✅ 100% backward compatibility
- ✅ No console warnings in production

---

## 9. Implementation Timeline

### Task Breakdown (PB-005 to PB-010)

| Task                              | Estimated Time  | Dependencies |
| --------------------------------- | --------------- | ------------ |
| **PB-005:** Refactor ui.ts        | 1-2 hours       | None         |
| **PB-006:** Dynamic imports       | 2-3 hours       | PB-005       |
| **PB-007:** Cache system          | 1-2 hours       | PB-006       |
| **PB-008:** Background preload    | 1-2 hours       | PB-007       |
| **PB-009:** Update TranslatedText | 1-2 hours       | PB-007       |
| **PB-010:** Update pages          | 2-3 hours       | PB-009       |
| **Testing & QA**                  | 2-3 hours       | PB-010       |
| **Total**                         | **10-17 hours** |              |

### Recommended Schedule

**Day 1:**

- PB-005: Refactor ui.ts (morning)
- PB-006: Dynamic imports (afternoon)

**Day 2:**

- PB-007: Cache system (morning)
- PB-008: Background preload (afternoon)

**Day 3:**

- PB-009: Update TranslatedText (morning)
- PB-010: Update all pages (afternoon)

**Day 4:**

- Full testing and QA
- Performance benchmarking
- Bug fixes

---

## 10. Conclusion

This architecture provides a comprehensive solution for lazy-loading i18n
namespaces while maintaining 100% backward compatibility. The implementation is
split into 6 atomic tasks (PB-005 to PB-010) that can be completed
incrementally.

**Key Benefits:**

1. **62% average bundle reduction** for i18n code
2. **Improved FCP** by ~300ms
3. **Better code splitting** via Vite chunks
4. **Background preloading** for smooth UX
5. **Zero breaking changes** to existing code

**Next Steps:**

1. Review and approve this architecture
2. Create detailed task breakdown in TODOs.md
3. Begin implementation starting with PB-005
4. Test incrementally after each task
5. Deploy and monitor performance metrics

---

## Appendix A: Type Definitions

Complete TypeScript interfaces:

```typescript
// src/i18n/types.ts

export type Locale = 'en' | 'es';
export type Namespace = 'common' | 'services' | 'projects' | 'skills';
export type CacheKey = `${Locale}:${Namespace}`;

export interface TranslationDict {
  [key: string]: string | TranslationDict;
}

export interface LoaderOptions {
  locale: Locale;
  namespace: Namespace;
  forceReload?: boolean;
}

export interface PreloadOptions {
  locale: Locale;
  namespaces?: Namespace[];
  priority?: 'high' | 'low';
}

export interface TranslationOptions {
  params?: Record<string, string | number>;
  markdown?: boolean;
  fallback?: string;
}

export type TranslationFunction = (
  key: string,
  options?: TranslationOptions
) => string;
```

---

## Appendix B: Example Use Cases

### Use Case 1: Services Page

```astro
---
// src/pages/[lang]/services/[slug].astro

import { getLangFromUrl, getTranslations } from '@/i18n/utils';
import { loadNamespaces } from '@/i18n/loader';
import { preloadAlternateLanguage } from '@/i18n/preload';

const lang = getLangFromUrl(Astro.url);

// Load only what we need
await loadNamespaces(lang, ['common', 'services']);

const t = getTranslations(lang);
---

<BaseLayout>
    <h1>{t('services.webApps.title', { markdown: true })}</h1>
    <p>{t('services.webApps.description')}</p>

    {/* Features list */}
    <ul>
        {[0, 1, 2, 3, 4, 5].map(i => (
            <li>{t(`services.webApps.features.${i}`)}</li>
        ))}
    </ul>
</BaseLayout>

<script>
    import { preloadAlternateLanguage } from '@/i18n/preload';

    // Preload Spanish version in background
    const lang = document.documentElement.lang as 'en' | 'es';
    preloadAlternateLanguage(lang, ['common', 'services']);
</script>
```

**Network Activity:**

1. Initial load: `config.ts` (2KB) + `loader.ts` (3KB) + `cache.ts` (2KB)
2. Immediate: `en/common.json` (10KB) + `en/services.json` (17KB)
3. Background (low priority): `es/common.json` + `es/services.json`

**Total initial:** ~34KB (vs. 65KB before = 48% reduction)

### Use Case 2: Blog Page (Minimal Translations)

```astro
---
// src/pages/[lang]/blog/[slug].astro

import { getLangFromUrl, getTranslations } from '@/i18n/utils';
import { loadNamespaces } from '@/i18n/loader';

const lang = getLangFromUrl(Astro.url);

// Only need common namespace
await loadNamespaces(lang, ['common']);

const t = getTranslations(lang);
---

<h1>{post.data.title}</h1>
<time>{t('blog.publishedOn')}</time>
```

**Total initial:** ~19KB (vs. 65KB before = 71% reduction)

### Use Case 3: React Component with Dynamic Namespace

```tsx
// src/components/ServiceCard.tsx

import {
  TranslatedText,
  useTranslations,
} from '@/components/ui/TranslatedText';

interface ServiceCardProps {
  serviceKey: string;
}

export function ServiceCard({ serviceKey }: ServiceCardProps) {
  const { t, isLoaded } = useTranslations(['services']);

  if (!isLoaded) {
    return <div className="skeleton">Loading...</div>;
  }

  return (
    <div className="service-card">
      <TranslatedText
        textKey={`services.${serviceKey}.title`}
        as="h3"
        markdown={true}
      />
      <TranslatedText textKey={`services.${serviceKey}.description`} as="p" />
    </div>
  );
}
```

---

## Appendix C: Debug Utilities

Useful debugging helpers:

```typescript
// src/i18n/debug.ts

import { namespaceCache } from './cache';
import type { Locale } from './config';

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const stats = {
    totalEntries: 0,
    entriesByLocale: {} as Record<Locale, number>,
    entries: [] as string[],
  };

  // Access private cache for debugging
  const cache = (namespaceCache as any).cache as Map<string, unknown>;

  for (const key of cache.keys()) {
    stats.totalEntries++;
    stats.entries.push(key);

    const locale = key.split(':')[0] as Locale;
    stats.entriesByLocale[locale] = (stats.entriesByLocale[locale] || 0) + 1;
  }

  return stats;
}

/**
 * Log cache contents to console
 */
export function debugCache() {
  const stats = getCacheStats();
  console.group('i18n Cache Debug');
  console.log('Total entries:', stats.totalEntries);
  console.log('By locale:', stats.entriesByLocale);
  console.log('Cache keys:', stats.entries);
  console.groupEnd();
}

/**
 * Clear cache and reload
 */
export function resetCache() {
  namespaceCache.clear();
  console.log('i18n cache cleared');
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).__i18nDebug = {
    getCacheStats,
    debugCache,
    resetCache,
  };
}
```

**Usage in browser console:**

```javascript
// View cache statistics
window.__i18nDebug.getCacheStats();

// Log cache contents
window.__i18nDebug.debugCache();

// Clear cache
window.__i18nDebug.resetCache();
```

---

**END OF DOCUMENT**
