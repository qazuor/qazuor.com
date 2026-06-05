# Phase 1 Report: Foundations (SPEC-001)

> **Status**: ✅ Complete. All four Phase 1 tasks (`1.1`, `1.2`, `1.3`, `1.4`)
> are checked off in `tasks.md`. All commits are on
> `feat/spec-001-implementation`. Working tree is clean apart from
> auto-regenerated `public/styles/giscus-custom-*.css` files, which are not part
> of SPEC-001 and were touched by the theme integration during `astro check`
> (see Risks section).

## 1. Entry Points Map

> Maps the **current** editable source entrypoints to the routes they generate
> and the cross-cutting concerns (nav, footer, SEO) they own.

### 1.1 Route-generating entry points

| Generated route                   | Source file                                                     | Owner concern                        |
| --------------------------------- | --------------------------------------------------------------- | ------------------------------------ |
| `/` (root redirect)               | `src/pages/index.astro`                                         | SSR language detection redirect      |
| `/{lang}/` (homepage)             | `src/pages/[lang]/index.astro`                                  | Homepage composition                 |
| `/{lang}/work` (NEW shell)        | `src/pages/[lang]/work/index.astro`                             | Work hub placeholder (Phase 3 fills) |
| `/{lang}/work/[slug]` (NEW shell) | `src/pages/[lang]/work/[slug].astro`                            | Work case study placeholder          |
| `/{lang}/hire` (NEW shell)        | `src/pages/[lang]/hire/index.astro`                             | Hire landing placeholder             |
| `/{lang}/about` (NEW shell)       | `src/pages/[lang]/about/index.astro`                            | About placeholder                    |
| `/{lang}/contact` (NEW shell)     | `src/pages/[lang]/contact/index.astro`                          | Contact placeholder                  |
| `/{lang}/rss.xml`                 | `src/pages/[lang]/rss.xml.ts`                                   | RSS feed                             |
| `/{lang}/og.png`                  | `src/pages/[lang]/og.png.ts`                                    | Default OG image                     |
| `/{lang}/services`                | `src/pages/[lang]/services/index.astro`                         | Services hub                         |
| `/{lang}/services/[slug]`         | `src/pages/[lang]/services/[slug].astro`                        | Service detail (slugs from data)     |
| `/{lang}/services/og.png`         | `src/pages/[lang]/services/og.png.ts`                           | Services hub OG image                |
| `/{lang}/projects`                | `src/pages/[lang]/projects/index.astro`                         | Projects hub                         |
| `/{lang}/projects/[slug]`         | `src/pages/[lang]/projects/[slug].astro`                        | Project detail (from content)        |
| `/{lang}/projects/[slug]/og.png`  | `src/pages/[lang]/projects/[slug]/og.png.ts`                    | Project OG image                     |
| `/{lang}/blog`                    | `src/pages/[lang]/blog/[...page].astro`                         | Blog listing with pagination         |
| `/{lang}/blog/[slug]`             | `src/pages/[lang]/blog/[slug].astro`                            | Blog post detail (from content)      |
| `/{lang}/blog/category/[cat]`     | `src/pages/[lang]/blog/category/[category]/` (directory exists) | Blog category filter                 |
| `/{lang}/goodies`                 | `src/pages/[lang]/goodies.astro`                                | Goodies hub                          |
| `/{lang}/goodies/tools`           | `src/pages/[lang]/goodies/tools/index.astro`                    | Tools listing                        |
| `/{lang}/goodies/snippets`        | `src/pages/[lang]/goodies/snippets/index.astro`                 | Snippets listing                     |
| `/{lang}/goodies/snippets/[..]`   | `src/pages/[lang]/goodies/snippets/[...slug].astro`             | Snippet detail (catch-all)           |
| `/{lang}/goodies/css-tricks`      | `src/pages/[lang]/goodies/css-tricks/index.astro`               | CSS tricks listing                   |
| `/{lang}/goodies/css-tricks/[s]`  | `src/pages/[lang]/goodies/css-tricks/[slug].astro`              | CSS trick detail                     |
| `/{lang}/goodies/useful-links`    | `src/pages/[lang]/goodies/useful-links/index.astro`             | Useful links listing                 |
| `/{lang}/404` fallback            | `src/pages/404.astro`                                           | 404 page                             |
| `/sitemap.xml`                    | `src/pages/sitemap.xml.ts`                                      | Sitemap generator                    |

### 1.2 Cross-cutting entry points

| Concern                | Source file                                                                | Notes                                                                                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout shell           | `src/layouts/BaseLayout.astro`                                             | Loads SEO, FloatingNav, Footer, ViewTransitions. Mounts `<main>`.                                                                                                                                       |
| Primary (floating) nav | `src/components/navigation/FloatingNav.tsx`                                | Currently the **only** persistent nav. `NAV_SECTIONS` array hard-codes 9 anchors.                                                                                                                       |
| Mobile nav utilities   | `src/components/navigation/MobileUtilitiesPopover.tsx`                     | Theme / language / goodies / command palette popover on mobile.                                                                                                                                         |
| Footer                 | `src/components/layout/Footer.astro`                                       | Hard-codes `exploreItems` (services, projects, blog, goodies) and reads i18n labels.                                                                                                                    |
| Nav data (NEW)         | `src/data/navigation.ts`                                                   | Central source of truth for primary/secondary/utility nav items.                                                                                                                                        |
| Footer data (NEW)      | `src/data/footer.ts`                                                       | Central source of truth for footer link groups and contact surface.                                                                                                                                     |
| Data barrel            | `src/data/index.ts`                                                        | Re-exports `navigation` and `footer` alongside existing modules.                                                                                                                                        |
| SEO meta + JSON-LD     | `src/components/layout/SEO.astro`                                          | Title, OG, Twitter, canonical, JSON-LD (WebSite/Person/Article), RSS link, AI tags.                                                                                                                     |
| WebSite JSON-LD        | `src/components/seo/JsonLd.astro`                                          | Generic JSON-LD passthrough used by BaseLayout.                                                                                                                                                         |
| Breadcrumb JSON-LD     | `src/components/seo/BreadcrumbJsonLd.astro`                                | Per-page breadcrumb schema (driven by `src/utils/breadcrumbs.ts`).                                                                                                                                      |
| Service JSON-LD        | `src/components/seo/ServiceJsonLd.astro`                                   | Per-service schema.                                                                                                                                                                                     |
| Project JSON-LD        | `src/components/seo/ProjectJsonLd.astro`                                   | Per-project schema.                                                                                                                                                                                     |
| Blog post JSON-LD      | `src/components/seo/BlogPostJsonLd.astro`                                  | Per-post Article schema.                                                                                                                                                                                |
| Goodies JSON-LD        | `src/components/seo/GoodiesJsonLd.astro`                                   | Goodies-specific schema.                                                                                                                                                                                |
| i18n runtime           | `src/i18n/utils.ts` (`getTranslations`, `getLangFromUrl`, `translatePath`) | Translation loader.                                                                                                                                                                                     |
| i18n catalog           | `src/locales/{en,es}/{common,services,projects,skills}.json`               | Translation strings (extended in Phase 1 with `nav.work`, `nav.hire`, `footer.commercial.*`, `footer.discovery.*`, `footer.resources.*`, `footer.legal.*`, `work.*`, `hire.*`, `about.*`, `contact.*`). |
| Content collections    | `src/content/config.ts`                                                    | Zod schemas for `projects`, `blog`, `testimonials`, `tools`, `snippets`, `css-tricks`, `useful-links`. `work` is **not** yet defined — it will be added in Phase 3.                                     |
| Contact data           | `src/data/contact.ts`                                                      | Email, phone, social URLs.                                                                                                                                                                              |

### 1.3 Nav label source

- Side-floating nav labels are read from `t('nav.*')` in `BaseLayout.astro` and
  passed into `FloatingNav` as `labels` / `utilityLabels` props.
- Phase 1 extended `nav.*` keys in `src/locales/{en,es}/common.json` with
  `work`, `hire`, `snippets`, `cssTricks`, `usefulLinks`. Existing keys (`home`,
  `blog`, `projects`, `services`, `tools`, `about`, `skills`, `testimonials`,
  `faqs`, `contact`) were preserved.
- Footer `explore.*` keys remain for back-compat. New `footer.commercial.*`,
  `footer.discovery.*`, `footer.resources.*`, `footer.legal.*` keys were added
  to support the new footer data shape.

## 2. Route Status Table (target vs current)

> Status of each **target** route required by SPEC-001 against the current
> state. `Modify` = use existing file in place. `Create` = missing, must be
> authored. `Keep` = already exists, no Phase 1 changes required.

| Target route                       | Source file (current or new)                                           | Status   |
| ---------------------------------- | ---------------------------------------------------------------------- | -------- |
| `/{lang}/` (homepage)              | `src/pages/[lang]/index.astro`                                         | Keep     |
| `/{lang}/work`                     | `src/pages/[lang]/work/index.astro`                                    | Created  |
| `/{lang}/work/[slug]`              | `src/pages/[lang]/work/[slug].astro`                                   | Created  |
| `/{lang}/hire`                     | `src/pages/[lang]/hire/index.astro`                                    | Created  |
| `/{lang}/about`                    | `src/pages/[lang]/about/index.astro`                                   | Created  |
| `/{lang}/contact`                  | `src/pages/[lang]/contact/index.astro`                                 | Created  |
| `/{lang}/services`                 | `src/pages/[lang]/services/index.astro`                                | Keep     |
| `/{lang}/services/[slug]`          | `src/pages/[lang]/services/[slug].astro`                               | Keep     |
| `/{lang}/projects`                 | `src/pages/[lang]/projects/index.astro`                                | Keep     |
| `/{lang}/projects/[slug]`          | `src/pages/[lang]/projects/[slug].astro`                               | Keep     |
| `/{lang}/blog`                     | `src/pages/[lang]/blog/[...page].astro`                                | Keep     |
| `/{lang}/blog/[slug]`              | `src/pages/[lang]/blog/[slug].astro`                                   | Keep     |
| `/{lang}/blog/category/[category]` | `src/pages/[lang]/blog/category/[category]/` (to be authored in Phase) | Keep dir |
| `/{lang}/goodies`                  | `src/pages/[lang]/goodies.astro`                                       | Keep     |
| `/{lang}/goodies/*`                | `src/pages/[lang]/goodies/{tools,snippets,css-tricks,useful-links}/`   | Keep     |

### 2.1 Locale parity (Requirement 2.2)

All new routes (Created) exist in both `es` and `en`. Per-locale authoring is
achieved by emitting a `getStaticPaths` that iterates `Object.keys(languages)`
and a per-page `getLangFromUrl(Astro.url)` call to select the right translation
key.

### 2.2 Naming policy (Requirement 2.1)

All new top-level segments stay in English (`/es/work`, `/en/work`). Spanish
locales get a translated _label_ in the nav data, not a translated _path_.

### 2.3 Placeholder behavior for `work/[slug]`

`src/pages/[lang]/work/[slug].astro` declares an empty `getStaticPaths` so no
build output is produced until Phase 3 introduces the `work` content collection
and its case studies. The placeholder content inside the file is intentionally
dormant but typed and JSDoc-documented so Phase 3 can simply iterate the new
collection.

## 3. Nav / Footer Data Source

### 3.1 Current state (pre-Phase 1)

- No `src/data/navigation.ts` and no `src/data/footer.ts` existed.
- The side nav is a hard-coded `NAV_SECTIONS` array in
  `src/components/navigation/FloatingNav.tsx`.
- The footer has a hard-coded `exploreItems` array in
  `src/components/layout/Footer.astro`.
- Nav and footer labels are sourced from `src/locales/{en,es}/common.json`.

### 3.2 Target state (Phase 1 contribution)

- **Created** `src/data/navigation.ts` — central primary/secondary/utility nav
  data with i18n keys, locale-aware paths (`localizedNavPath` helper), stable
  icon identifiers, and a `findNavItem` lookup.
- **Created** `src/data/footer.ts` — central footer link groups (`commercial`,
  `discovery`, `resources`, `legal`) plus `footerContact` sourced from
  `src/data/contact.ts`, and a `localizedFooterPath` helper.
- **Updated** `src/data/index.ts` to re-export the new modules.
- **Extended** `src/locales/{en,es}/common.json` with the i18n keys referenced
  by the new data shape (`nav.work`, `nav.hire`, etc., and
  `footer.commercial.*`, `footer.discovery.*`, `footer.resources.*`,
  `footer.legal.*`).

### 3.3 Out of scope for Phase 1 (deferred to Phase 2)

- Rewiring `FloatingNav.tsx` and `Footer.astro` to consume the new data files.
  That refactor belongs to Phase 2 (homepage and navigation).
- Updating the homepage primary nav composition. The new `BaseLayout` does not
  yet mount a top-bar; that is a Phase 2 deliverable.

## 4. Commits Made in Phase 1

All commits are on branch `feat/spec-001-implementation`.

| SHA       | Message                                                                   |
| --------- | ------------------------------------------------------------------------- |
| `8a608ef` | `docs(spec-001): phase 1 entry points map and route status table`         |
| `66db4fc` | `feat(spec-001): add work route shells for es and en locales`             |
| `2cea45e` | `feat(spec-001): add hire, about and contact route shells for es and en`  |
| `4338142` | `feat(spec-001): centralize navigation and footer data sources`           |
| (this)    | `docs(spec-001): finalize phase 1 foundations report and check off tasks` |

`git log --oneline -10` at the end of the phase:

```text
4338142 feat(spec-001): centralize navigation and footer data sources
2cea45e feat(spec-001): add hire, about and contact route shells for es and en
66db4fc feat(spec-001): add work route shells for es and en locales
8a608ef docs(spec-001): phase 1 entry points map and route status table
b86db22 docs(specs): add SPEC-001 for qazuor commercial repositioning
5dcb188 fix(projects): render ProjectCard visible in SSR to prevent blank page after View Transitions
690f931 feat(footer): add MIT license and open source attribution
990fe03 fix(seo): add redirects and fix SearchAction for Google indexing
9f8b845 feat(projects): add MarkView markdown editor project in ES and EN
17d6fb6 feat(blog): add MarkView editor blog post in ES and EN
```

## 5. Files Touched

### 5.1 Created (6 files)

- `src/pages/[lang]/work/index.astro`
- `src/pages/[lang]/work/[slug].astro`
- `src/pages/[lang]/hire/index.astro`
- `src/pages/[lang]/about/index.astro`
- `src/pages/[lang]/contact/index.astro`
- `src/data/navigation.ts`
- `src/data/footer.ts`
- `.claude/specs/SPEC-001-qazuor-commercial-repositioning/phase-1-report.md`

### 5.2 Modified (4 files)

- `src/locales/en/common.json` (added `nav.work`, `nav.hire`, `nav.snippets`,
  `nav.cssTricks`, `nav.usefulLinks`, `footer.commercial.*`,
  `footer.discovery.*`, `footer.resources.*`, `footer.legal.*`, `work.*`,
  `hire.*`, `about.*`, `contact.*`)
- `src/locales/es/common.json` (mirrored additions in Spanish)
- `src/data/index.ts` (re-exports for the two new modules)
- `.claude/specs/SPEC-001-qazuor-commercial-repositioning/tasks.md` (Phase 1
  checkboxes)

## 6. Open Questions / Risks for the User

### 6.1 Auto-regenerated giscus styles

Running `astro check` regenerates `public/styles/giscus-custom*.css` (theme
integration). These files are tracked in git and show as modified after every
typecheck, which can confuse future `git status` reviews. Two options for the
user to choose:

- **Option A (recommended)**: keep them tracked. The diffs are tiny and
  noise-free. They will be committed if/when a real change occurs.
- **Option B**: add them to `.gitignore`. The trade-off is that future theme
  changes won't be visible in git diffs.

This is **not blocking Phase 1** — Phase 1 leaves them unmodified in the final
commit — but Phase 2 should decide.

### 6.2 Locale parity for placeholder copy

The new shells (work, hire, about, contact) render copy in **English** (per the
code/UI copy policy in `CLAUDE.md`) but use i18n keys to localize the **title
and meta description**. Spanish locale users will see the English placeholder
body inside an otherwise Spanish-rendered page. This is acceptable for Phase 1
(placeholders are explicitly marked as such and labeled "Phase 3" / "Phase 4")
but Phase 3+ should expand the i18n catalogs with full Spanish placeholder copy
if desired.

### 6.3 Icon identifier vs. icon component resolution

`src/data/navigation.ts` exposes icons as stable string identifiers
(`'briefcase'`, `'badge-check'`, etc.) instead of importing `lucide-react`
components directly. This keeps the data layer free of UI-library coupling.
**Phase 2 must map each `NavIconId` to its component in
`src/components/navigation/navIcons.tsx`** (or a new resolver module) before the
nav data is consumed by `FloatingNav` or a new top-bar.

If the user prefers component references in the data file (at the cost of
coupling data → React → lucide-react), Phase 2 can switch the type to
`LucideIcon` from `lucide-react`.

### 6.4 Working-tree dirty after `astro check`

After running `astro check`, the working tree shows two modifications to
`public/styles/giscus-custom*.css`. These are not part of SPEC-001 and are left
**uncommitted**. A final `git status --short` after the Phase 1 commit stack
will show only those two files as modified. This is the expected, intended
state.

## 7. Verification Checklist (Phase 1 acceptance)

- [x] `phase-1-report.md` exists at the documented path with all required tables
      and the final commit list.
- [x] All four Phase 1 checkboxes in `tasks.md` are marked `- [x]`.
- [x] `npx astro check` reports 0 errors and 0 warnings.
- [x] All 4 task checkboxes in `tasks.md` (Phase 1) are checked off.
- [x] The branch `feat/spec-001-implementation` has 4 atomic SPEC-001 commits on
      top of the spec doc commit.
- [x] Existing routes still build (no broken imports, no removed pages).
- [x] Every new route exists in both `es` and `en`.
- [x] `npx astro check` passes after the final commit.
