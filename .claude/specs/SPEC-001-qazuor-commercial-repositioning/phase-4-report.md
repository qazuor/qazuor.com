# Phase 4 — Service and Recruiter Surfaces

## Summary

Phase 4 reframes the services hub around visitor intent and builds out the
recruiter (`hire`), operator (`about`), and contact surfaces. The homepage
already establishes the commercial framing in Phase 2; this phase completes the
rest of the top-level funnel so visitors can self-serve into a service, download
a resume, or open a conversation without leaving the site.

## Scope

- 4.1 Services hub reframe — decision-outcome groupings
- 4.2 Service detail enhancements — audience, problems, related work, CTA
- 4.3 Hire landing page — recruiter-oriented, English + Spanish
- 4.4 About page — brand and operator context
- 5.5 Contact page — inquiry framing, response expectations, URL prefill

## Commits

| Task | Hash      | Description                                            |
| ---- | --------- | ------------------------------------------------------ |
| 4.1  | `21c1d01` | Reframe services hub around decision-outcome groupings |
| 4.2  | `87ccdb5` | Add who-its-for, problems-solved, related-work, CTA    |
| 4.3  | `285f235` | Build recruiter-oriented hire landing page             |
| 4.4  | `9d60a53` | Build brand and operator context page                  |
| 4.5  | `9713b43` | Build dedicated contact surface with URL prefill       |

Foundation commits from the partial delegation (already on branch):

| Hash      | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `13b74f4` | Services data layer (groupings + per-service fields)           |
| `30b57fc` | i18n keys for hire, about, contact, and services hub groupings |
| `362dc5c` | HireProfile data source and Person JSON-LD component           |

## Files Changed

### Created

- `src/components/sections/ServiceAudienceSection.astro` (93 LOC) — audience
  - problems variant for service detail
- `src/components/sections/ServiceRelatedSection.astro` (84 LOC) — related work
  rendering via `WorkCard`
- `src/components/sections/ServiceCtaSection.astro` (73 LOC) — service-level
  final CTA

### Modified

- `src/pages/[lang]/services/index.astro` (308 LOC) — reframe around
  `serviceGroupings`
- `src/pages/[lang]/services/[slug].astro` (497 LOC) — three new sections plus
  service-specific CTA
- `src/pages/[lang]/hire/index.astro` (306 LOC) — full recruiter landing with
  `PersonJsonLd`
- `src/pages/[lang]/about/index.astro` (228 LOC) — full brand and operator page
  with `PersonJsonLd`
- `src/pages/[lang]/contact/index.astro` (396 LOC) — full contact surface with
  URL prefill (no JSON-LD — transactional surface)
- `src/locales/{en,es}/common.json` — `servicesHub.groupings.*` (4 groupings ×
  headline + fit)
- `src/locales/{en,es}/services.json` — `whoItIsFor*`, `problemsSolved*`,
  `relatedWork*`

## Data Sources

- `src/data/services.ts` — `serviceGroupings` and per-service fields
  (`whoItIsFor`, `problemsSolved`, `relatedWorkSlugs`, `ctaHref`)
- `src/data/hire.ts` — `HireProfile` (en/es) with role targets, experience
  summary, key strengths, resume links, professional links, contact preference
- `src/components/seo/PersonJsonLd.astro` — `Person` + `BreadcrumbList` schema,
  used by hire and about

## Verification

- `pnpm astro check` — 0 errors, 0 warnings, 12 pre-existing hints (none from
  this batch)
- `pnpm build` — succeeded in 111s
- All eight expected output files present in `dist/client/{en,es}/`:
  - `services/index.html`
  - `services/web-apps/index.html` (and other service slugs)
  - `hire/index.html`
  - `about/index.html`
  - `contact/index.html`

## Deviations from Design

- **ES per-service content**: `services.json` ES locale lacks `whoItIsFor`,
  `problemsSolved`, and `detailCta` per-service keys. The data file's English
  strings are rendered directly, matching the existing `descriptionExpanded`
  pattern. The ES per-service CTA falls back to the generic `services.cta.*`
  keys. This is consistent with the implicit design contract; expanding ES
  per-service copy is deferred to a content pass.
- **Contact sidebar** uses `hireProfile.contactPreference` verbatim as a
  personal signature under the response expectations card. The design did not
  specify this placement, but the orchestrator brief explicitly asked for
  "response expectations" + "direct contact" in the sidebar.
- **Tasks 4.1, 4.2, 4.3, 4.4**: no deviations.

## Issues Noted

- `src/data/searchIndex.ts` is reformatted by both `lint-staged` and the build's
  biome pass on every commit cycle. The agent restored the file before each
  commit to keep diffs atomic. This is consistent with prior phases and a
  candidate for a future husky/biome config cleanup.
- Husky pre-commit hook emits a `DEPRECATED` warning about two lines to remove
  from `.husky/commit-msg` for v10.0.0. Not blocking.
- The contact page is the largest single Astro page (396 LOC). If a future phase
  extends it, extract `ContactForm.astro` + `ContactSidebar.astro` first to keep
  the file under the 500 LOC ceiling.

## Status

5 of 5 Phase 4 tasks complete. Branch is at `9713b43`, 8 commits ahead of
`origin/feat/spec-001-implementation`, working tree clean.
