# Phase 3 Report: Work and Portfolio Separation

## Goal

Carve out a separate `work` content layer for curated commercial case studies,
build the `/work` index and `/work/[slug]` detail pages, and reframe the
`/projects` page as the broader technical portfolio (not the main sales proof).
Cross-link the two layers so visitors can move from curated case study to deeper
technical breakdown and back.

## Work Content Collection

### Schema (`src/content/config.ts`)

Added `workCollection` with Zod-validated frontmatter:

| Field                | Type            | Description                                                     |
| -------------------- | --------------- | --------------------------------------------------------------- |
| `title`              | `string`        | Case study headline                                             |
| `slug`               | `string`        | URL slug, locale-suffixed (e.g. `markview-en`, `markview-es`)   |
| `summary`            | `string`        | 1-2 sentence elevator pitch                                     |
| `clientType`         | `string`        | Anonymized client category (e.g. "Tourism startup", "B2B SaaS") |
| `services`           | `string[]`      | Slugs from `src/data/services.ts`                               |
| `role`               | `string`        | Qazuor's role on the engagement                                 |
| `industry`           | `string`        | Industry vertical                                               |
| `problem`            | `string`        | 2-3 sentences on the problem                                    |
| `solution`           | `string`        | 2-3 sentences on the solution                                   |
| `impact`             | `string`        | 1-2 sentences with metrics or outcomes                          |
| `stack`              | `string[]`      | Tech stack items                                                |
| `relatedProjectSlug` | `string?` (opt) | Cross-link to a slug in `src/content/projects/`                 |
| `featured`           | `boolean`       | Show in featured-work homepage slice                            |
| `order`              | `number`        | Sort order on the index                                         |
| `locale`             | `'es' \| 'en'`  | Locale tag (mirrors the existing project pattern)               |
| `date`               | `Date?`         | Optional engagement date                                        |
| `coverImage`         | `string?`       | Optional cover                                                  |
| `thumbnail`          | `string?`       | Optional thumbnail                                              |

### Seed entries (`src/content/work/`)

3 case studies × 2 locales = 6 markdown files:

| Slug base             | Client type                | Services                                                   | Related project           |
| --------------------- | -------------------------- | ---------------------------------------------------------- | ------------------------- |
| `markview`            | Individual developer / OSS | `web-apps`, `web-optimization`                             | `markview`                |
| `cheroga-casa-quinta` | Tourism SMB                | `landing-pages`, `web-optimization`, `social-media-design` | `cheroga-casa-quinta.com` |
| `claude-code-config`  | Developer tooling          | `web-apps`, `automation-integration`                       | `claude-code-config`      |

Each entry has a complete, honest frontmatter with real metrics where available.
Body content is light in this phase — the case study prose can be expanded in a
follow-up phase or directly by the user.

## Work Index Page (`src/pages/[lang]/work/index.astro`)

- Reuses the projects index page structure as a starting point, adapted to the
  work collection.
- Cards (via new `WorkCard.tsx` presentational component) surface: **client
  type, role, services (chips), impact excerpt**.
- Cards sorted by `order` ascending; `featured: true` items visually emphasized.
- Filter + sort are powered by a new client island `WorkList.tsx` (React) so
  visitors can sort by order/recency or filter by service.
- Empty state: friendly bilingual message if no work items exist for the current
  locale.
- Cross-discovery links: explicit links to `/projects` and `/services` in the
  page header.
- Bilingual: header, intro, empty state, and all UI copy are i18n-keyed in
  `src/locales/{en,es}/common.json` under the `work.*` namespace.

## Work Detail Page (`src/pages/[lang]/work/[slug].astro`)

Replaces the dormant Phase-1 shell. Sections, in order:

1. **Header** — title, client type, role, services (chips)
2. **Context** — frontmatter-derived intro
3. **Problem** — frontmatter
4. **Constraints** — frontmatter (or body prose)
5. **Solution** — frontmatter
6. **Impact** — frontmatter (with metrics highlighted)
7. **Stack** — chips
8. **CTA** — link to the most relevant service detail (computed from
   `services[0]`) + link to `/contact`
9. **Cross-link** — if `relatedProjectSlug` is set, render a "See the technical
   breakdown on /projects" link

`getStaticPaths`:

- Reads the work collection
- Returns a path for each entry whose `locale` matches the route's `[lang]`
- Falls back gracefully: if a slug only exists in `en`, the `es` route resolves
  to the `en` entry (and renders the `es` translation if available via the same
  fallback pattern as blog posts)
- Unknown slug → 404 (Astro default)

## Projects Page Reframe (task 3.4)

`src/pages/[lang]/projects/index.astro` intro and meta copy updated:

- **Before**: projects page read as the main sales proof ("here are the things I
  built")
- **After**: projects page reads as the **broader technical archive** ("tools,
  experiments, side projects — see `/work` for curated commercial case studies")
- Added a small "looking for commercial outcomes? See `/work`" link near the
  page top
- No structural redesign — copy only

## Cross-Links (task 3.5)

Implemented as a **frontmatter field on the project collection** + a section in
the project detail page. The new field is `relatedWorkSlug?: string` (optional,
points to a slug in `src/content/work/`).

- The 3 projects that have a corresponding work entry now declare
  `relatedWorkSlug`.
- The project detail page (`src/pages/[lang]/projects/[slug].astro`) checks for
  the field and renders a "See the commercial case study on /work" link in a
  consistent spot.
- Symmetrical: the work detail page renders the back-link to the project, so
  visitors can move in both directions.

## SEO and AEO

- New `WorkJsonLd.tsx` component generates `CreativeWork` + `BreadcrumbList`
  JSON-LD per work detail page (reuses the `JsonLd.astro` and
  `BreadcrumbJsonLd.astro` patterns from the existing SEO components).
- Work detail pages include `<title>`, `<meta description>`, OpenGraph, and
  Twitter card metadata derived from frontmatter.
- `hreflang` alternates generated via the existing fallback helper.
- Sitemap entries and `llms.txt` updates are deferred to Phase 5.

## Commits Made

| SHA       | Message                                                                          |
| --------- | -------------------------------------------------------------------------------- |
| `0c49ad8` | `feat(content): add work collection schema for commercial case studies`          |
| `a6c556e` | `feat(content): seed three curated commercial case studies (en + es)`            |
| `ee5d13f` | `feat(work): add i18n strings, section background, and slug helper for work hub` |
| `c799176` | `feat(work): add WorkJsonLd and WorkCard components for case study surface`      |
| `608c1ac` | `feat(work): implement /work index with curated case study cards`                |
| `ed891fa` | `feat(work): add work detail page and work data utility`                         |
| (pending) | `docs(spec-001): finalize phase 3 work and portfolio separation report`          |

The pending commit is the phase 3 report and tasks.md update applied by the
orchestrator after the agent's run.

## Verification

- `npx astro check` → 0 errors, 0 warnings (12 pre-existing hints in unrelated
  files)
- `npx astro build` → successful. Generated `/en/work/`, `/es/work/`, plus 3
  detail pages per locale. All existing routes still build.
- `git status` is clean after the final docs commit lands
- Branch `feat/spec-001-implementation` will be ahead of `main` by 23 commits (6
  work + 1 docs pending) once the docs commit lands

## Open Questions / Decisions for User

1. **Case study prose depth** — the 3 seed entries have light body content
   (frontmatter is complete, body is intentionally minimal). The user can expand
   the case study prose in the `.md` files directly, or a follow-up phase can
   write the full narratives.
2. **`relatedWorkSlug` placement on project detail** — the cross-link was placed
   in a consistent spot on the project page. If the user prefers a different
   visual treatment (banner, sidebar, footer block), it's a small change.
3. **Sitemap and `llms.txt` updates** — new work pages are NOT yet in the
   sitemap or `llms.txt`. This is deferred to Phase 5 (SEO/AEO) per the spec's
   rollout order. Surfacing here for visibility.
4. **Projects page reframe** — copy change only. If the user wants a more
   substantial redesign (e.g., reorganize the project cards to surface tech
   stack more prominently), that's a separate task.

## Blockers for Phase 4

**None.** Phase 4 (services copy + linking, hire, about, contact pages) can
proceed. The work data model is in place; new hires/about/contact shells already
exist from Phase 1 and can be filled in.
