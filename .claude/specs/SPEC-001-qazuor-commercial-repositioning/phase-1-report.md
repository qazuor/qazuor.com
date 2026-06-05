# Phase 1 Report: Foundations (SPEC-001)

> **Status**: In progress (initial draft with entry points map and route plan).
> Final report will replace this file after all shells are created and verified.

## 1. Entry Points Map

> Maps the **current** editable source entrypoints to the routes they generate
> and the cross-cutting concerns (nav, footer, SEO) they own.

### 1.1 Route-generating entry points

| Generated route                  | Source file                                                     | Owner concern                    |
| -------------------------------- | --------------------------------------------------------------- | -------------------------------- |
| `/` (root redirect)              | `src/pages/index.astro`                                         | SSR language detection redirect  |
| `/{lang}/` (homepage)            | `src/pages/[lang]/index.astro`                                  | Homepage composition             |
| `/{lang}/rss.xml`                | `src/pages/[lang]/rss.xml.ts`                                   | RSS feed                         |
| `/{lang}/og.png`                 | `src/pages/[lang]/og.png.ts`                                    | Default OG image                 |
| `/{lang}/services`               | `src/pages/[lang]/services/index.astro`                         | Services hub                     |
| `/{lang}/services/[slug]`        | `src/pages/[lang]/services/[slug].astro`                        | Service detail (slugs from data) |
| `/{lang}/services/og.png`        | `src/pages/[lang]/services/og.png.ts`                           | Services hub OG image            |
| `/{lang}/projects`               | `src/pages/[lang]/projects/index.astro`                         | Projects hub                     |
| `/{lang}/projects/[slug]`        | `src/pages/[lang]/projects/[slug].astro`                        | Project detail (from content)    |
| `/{lang}/projects/[slug]/og.png` | `src/pages/[lang]/projects/[slug]/og.png.ts`                    | Project OG image                 |
| `/{lang}/blog`                   | `src/pages/[lang]/blog/[...page].astro`                         | Blog listing with pagination     |
| `/{lang}/blog/[slug]`            | `src/pages/[lang]/blog/[slug].astro`                            | Blog post detail (from content)  |
| `/{lang}/blog/category/[cat]`    | `src/pages/[lang]/blog/category/[category]/` (directory exists) | Blog category filter             |
| `/{lang}/goodies`                | `src/pages/[lang]/goodies.astro`                                | Goodies hub                      |
| `/{lang}/goodies/tools`          | `src/pages/[lang]/goodies/tools/index.astro`                    | Tools listing                    |
| `/{lang}/goodies/snippets`       | `src/pages/[lang]/goodies/snippets/index.astro`                 | Snippets listing                 |
| `/{lang}/goodies/snippets/[..]`  | `src/pages/[lang]/goodies/snippets/[...slug].astro`             | Snippet detail (catch-all)       |
| `/{lang}/goodies/css-tricks`     | `src/pages/[lang]/goodies/css-tricks/index.astro`               | CSS tricks listing               |
| `/{lang}/goodies/css-tricks/[s]` | `src/pages/[lang]/goodies/css-tricks/[slug].astro`              | CSS trick detail                 |
| `/{lang}/goodies/useful-links`   | `src/pages/[lang]/goodies/useful-links/index.astro`             | Useful links listing             |
| `/{lang}/404` fallback           | `src/pages/404.astro`                                           | 404 page                         |
| `/sitemap.xml`                   | `src/pages/sitemap.xml.ts`                                      | Sitemap generator                |

### 1.2 Cross-cutting entry points

| Concern                | Source file                                                                | Notes                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Layout shell           | `src/layouts/BaseLayout.astro`                                             | Loads SEO, FloatingNav, Footer, ViewTransitions. Mounts `<main>`.                                      |
| Primary (floating) nav | `src/components/navigation/FloatingNav.tsx`                                | Currently the **only** persistent nav. `NAV_SECTIONS` array hard-codes 9 anchors.                      |
| Mobile nav utilities   | `src/components/navigation/MobileUtilitiesPopover.tsx`                     | Theme / language / goodies / command palette popover on mobile.                                        |
| Footer                 | `src/components/layout/Footer.astro`                                       | Hard-codes `exploreItems` (services, projects, blog, goodies) and reads i18n labels.                   |
| SEO meta + JSON-LD     | `src/components/layout/SEO.astro`                                          | Title, OG, Twitter, canonical, JSON-LD (WebSite/Person/Article), RSS link, AI tags.                    |
| WebSite JSON-LD        | `src/components/seo/JsonLd.astro`                                          | Generic JSON-LD passthrough used by BaseLayout.                                                        |
| Breadcrumb JSON-LD     | `src/components/seo/BreadcrumbJsonLd.astro`                                | Per-page breadcrumb schema (driven by `src/utils/breadcrumbs.ts`).                                     |
| Service JSON-LD        | `src/components/seo/ServiceJsonLd.astro`                                   | Per-service schema.                                                                                    |
| Project JSON-LD        | `src/components/seo/ProjectJsonLd.astro`                                   | Per-project schema.                                                                                    |
| Blog post JSON-LD      | `src/components/seo/BlogPostJsonLd.astro`                                  | Per-post Article schema.                                                                               |
| Goodies JSON-LD        | `src/components/seo/GoodiesJsonLd.astro`                                   | Goodies-specific schema.                                                                               |
| i18n runtime           | `src/i18n/utils.ts` (`getTranslations`, `getLangFromUrl`, `translatePath`) | Translation loader.                                                                                    |
| i18n catalog           | `src/locales/{en,es}/{common,services,projects,skills}.json`               | Translation strings.                                                                                   |
| Content collections    | `src/content/config.ts`                                                    | Zod schemas for `projects`, `blog`, `testimonials`, `tools`, `snippets`, `css-tricks`, `useful-links`. |
| Contact data           | `src/data/contact.ts`                                                      | Email, phone, social URLs.                                                                             |

### 1.3 Nav label source

- Side-floating nav labels are read from `t('nav.*')` in `BaseLayout.astro` and
  passed into `FloatingNav` as `labels` / `utilityLabels` props.
- Current `nav.*` keys in `src/locales/{en,es}/common.json`: `home`, `blog`,
  `projects`, `services`, `tools`, `about`, `skills`, `testimonials`, `faqs`,
  `contact`.
- Footer `explore.*` keys exist for `services`, `projects`, `blog`, `goodies`.

## 2. Route Status Table (target vs current)

> Status of each **target** route required by SPEC-001 against the current
> state. `Modify` = use existing file in place. `Create` = missing, must be
> authored. `Keep` = already exists, no Phase 1 changes required.

| Target route                       | Source file (current or new)                                           | Status   |
| ---------------------------------- | ---------------------------------------------------------------------- | -------- |
| `/{lang}/` (homepage)              | `src/pages/[lang]/index.astro`                                         | Keep     |
| `/{lang}/work`                     | `src/pages/[lang]/work/index.astro`                                    | Create   |
| `/{lang}/work/[slug]`              | `src/pages/[lang]/work/[slug].astro`                                   | Create   |
| `/{lang}/hire`                     | `src/pages/[lang]/hire/index.astro`                                    | Create   |
| `/{lang}/about`                    | `src/pages/[lang]/about/index.astro`                                   | Create   |
| `/{lang}/contact`                  | `src/pages/[lang]/contact/index.astro`                                 | Create   |
| `/{lang}/services`                 | `src/pages/[lang]/services/index.astro`                                | Keep     |
| `/{lang}/services/[slug]`          | `src/pages/[lang]/services/[slug].astro`                               | Keep     |
| `/{lang}/projects`                 | `src/pages/[lang]/projects/index.astro`                                | Keep     |
| `/{lang}/projects/[slug]`          | `src/pages/[lang]/projects/[slug].astro`                               | Keep     |
| `/{lang}/blog`                     | `src/pages/[lang]/blog/[...page].astro`                                | Keep     |
| `/{lang}/blog/[slug]`              | `src/pages/[lang]/blog/[slug].astro`                                   | Keep     |
| `/{lang}/blog/category/[category]` | `src/pages/[lang]/blog/category/[category]/` (to be authored in Phase) | Keep dir |
| `/{lang}/goodies`                  | `src/pages/[lang]/goodies.astro`                                       | Keep     |
| `/{lang}/goodies/*`                | `src/pages/[lang]/goodies/{tools,snippets,css-tricks,useful-links}/`   | Keep     |

### 2.1 Locale parity

All new routes (Create) MUST exist in both `es` and `en`. Per-locale authoring
is achieved by emitting a `getStaticPaths` that iterates
`Object.keys(languages)` and a per-page `getLangFromUrl(Astro.url)` call to
select the right translation key.

### 2.2 Naming policy (enforced)

All new top-level segments stay in English (`/es/work`, `/en/work`). Spanish
locales will get a translated _label_ in the nav, not a translated _path_.

## 3. Nav / Footer Data Source

### 3.1 Current state

- **No `src/data/navigation.ts`** and **no `src/data/footer.ts`** exist.
- The side nav is a hard-coded `NAV_SECTIONS` array in
  `src/components/navigation/FloatingNav.tsx`.
- The footer has a hard-coded `exploreItems` array in
  `src/components/layout/Footer.astro`.
- Nav and footer labels are sourced from `src/locales/{en,es}/common.json`.

### 3.2 Target state (Phase 1 contribution)

- **Create** `src/data/navigation.ts` — central primary/secondary nav data
  (segment + i18n key + label fallback + icon hint).
- **Create** `src/data/footer.ts` — central footer link groups (commercial,
  discovery, resources, legal).
- **Re-export** from `src/data/index.ts`.

### 3.3 Out of scope for Phase 1

- Rewiring `FloatingNav.tsx` and `Footer.astro` to consume the new data files.
  That refactor is part of Phase 2 (homepage and navigation).

## 4. Commits in this Phase

(To be appended as work progresses. Final list committed in the final report.)

## 5. Open Questions / Risks

(To be appended after route shells and data files are authored.)
