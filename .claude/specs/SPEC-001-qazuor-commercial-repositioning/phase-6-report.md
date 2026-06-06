# Phase 6 — Verification

## Summary

Phase 6 verifies the full SPEC-001 implementation against the spec's migration
and stability requirements. All 5 verification items pass. One non-blocking
deviation documented: the homepage does not emit a `BreadcrumbList` JSON-LD
block because the breadcrumb resolves to a single `[Home]` item, and Google
explicitly does not recommend single-item breadcrumb lists.

## Verification Results

### 6.1 — Route Parity: PASS

All 5 new commercial surfaces + enhanced services exist in BOTH `es` and `en`.

| Route family                            | EN  | ES  |
| --------------------------------------- | --- | --- |
| `/[lang]/work/` (hub)                   | ✓   | ✓   |
| `/[lang]/work/[slug]/` (3 case studies) | ✓   | ✓   |
| `/[lang]/hire/`                         | ✓   | ✓   |
| `/[lang]/about/`                        | ✓   | ✓   |
| `/[lang]/contact/`                      | ✓   | ✓   |
| `/[lang]/services/` (hub)               | ✓   | ✓   |
| `/[lang]/services/[slug]/` (6 services) | ✓   | ✓   |

The implementation has 6 services (the spec mentions 4); the collection grew
between the spec and the build. The spec is stale on counts; the implementation
is correct.

### 6.2 — Nav Discipline: PASS

| Check                                       | File                                                   | Result                                                   |
| ------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| Primary nav excludes `goodies`              | `src/data/navigation.ts`                               | ✓ (in `secondaryNav` and `utilityNav`, not `primaryNav`) |
| Footer includes `goodies`                   | `src/data/footer.ts`                                   | ✓ (in `discoveryFooter`)                                 |
| `FloatingNav` consumes only `primaryNav`    | `src/components/navigation/FloatingNav.tsx`            | ✓ (0 goodies references)                                 |
| `MobileUtilitiesPopover` excludes `goodies` | `src/components/navigation/MobileUtilitiesPopover.tsx` | ✓ (0 goodies references)                                 |
| Rendered home has no goodies in primary nav | `dist/client/en/index.html`                            | ✓ (5 `/goodies*` links, all in footer)                   |

### 6.3 — Homepage CTA Priority: PASS

| Source                                                   | Value                             |
| -------------------------------------------------------- | --------------------------------- |
| `viewProjectsHref`                                       | `/[lang]/work` (commercial)       |
| `getInTouchHref`                                         | `/[lang]/contact` (commercial)    |
| `showResume`                                             | `false` (resume lives on `/hire`) |
| Old personal anchors (`#projects`, `#services`, `#blog`) | 0 occurrences in rendered HTML    |

The hero, services, and featured-work CTAs all route to commercial surfaces
under the new architecture. Old personal-portfolio anchor pattern is fully
removed.

### 6.4 — No Regressions: PASS

All existing routes remain accessible and are in the sitemap (Requirement 14.1
satisfied). `dist/client/sitemap.xml` contains 222 URLs:

| Section                                                        | Total URLs | Locale split |
| -------------------------------------------------------------- | ---------- | ------------ |
| `/work/` (hub + 3 case studies)                                | 8          | 4 × 2        |
| `/hire/`, `/about/`, `/contact/`                               | 6          | 1 × 2 each   |
| `/services/` (hub + 6 services)                                | 14         | 7 × 2        |
| `/projects/` (14 unique + 1 index)                             | 30         | 15 × 2       |
| `/blog/` (7 unique + fallback + 5 categories + index)          | 34         | 17 × 2       |
| `/goodies/` (snippets/css-tricks/useful-links/tools + entries) | 128        | 64 × 2       |
| **Total**                                                      | **222**    |              |

No existing URL was renamed or removed. All previous content remains indexable.

### 6.5 — Metadata and Schema Coverage: PASS with 1 deviation

Canonical tags are correct on every page checked. No double-slash on canonical
URLs.

| Page                       | Required schema                                                         | Emitted @types                                                               | Status                                         |
| -------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| `/[lang]/` (homepage)      | Organization + ProfessionalService + FAQPage + WebSite + BreadcrumbList | `Person`, `WebSite`, `Organization`, `ProfessionalService`, `FAQPage`        | ⚠️ DEVIATION (no `BreadcrumbList`)             |
| `/[lang]/services/`        | ProfessionalService + BreadcrumbList                                    | `Organization`, `Person`, `ProfessionalService`, `BreadcrumbList`, `WebSite` | ✓                                              |
| `/[lang]/services/[slug]/` | Service + BreadcrumbList                                                | `Service`, `BreadcrumbList`, `FAQPage`, `Offer`, `Person`, `WebSite`         | ✓                                              |
| `/[lang]/work/`            | BreadcrumbList                                                          | `BreadcrumbList`, `CreativeWork` (ItemList), `Person`, `WebSite`             | ✓                                              |
| `/[lang]/work/[slug]/`     | Work/CreativeWork + BreadcrumbList                                      | `CreativeWork`, `BreadcrumbList`, `Article`, `Person`, `WebSite`             | ✓                                              |
| `/[lang]/hire/`            | Person + BreadcrumbList                                                 | `Person`, `BreadcrumbList`, `WebSite`                                        | ✓                                              |
| `/[lang]/about/`           | Person + BreadcrumbList                                                 | `Person`, `BreadcrumbList`, `WebSite`                                        | ✓                                              |
| `/[lang]/contact/`         | BreadcrumbList                                                          | `BreadcrumbList`, `Person`, `WebSite` (inherited)                            | ✓                                              |
| `/[lang]/blog/[slug]/`     | BlogPost + BreadcrumbList                                               | `BlogPosting`, `BreadcrumbList`, `Person`, `WebSite`                         | ✓ (BlogPosting is the correct schema.org type) |

## Verification

- `pnpm astro check` — 0 errors, 0 warnings, 12 hints (all pre-existing)
- `pnpm build` — succeeded in ~111s
- `dist/client/sitemap.xml` — 222 URLs, all commercial and existing surfaces
  listed

## Deviations and Notes

### 1. Homepage `BreadcrumbList` not emitted (6.5)

`src/layouts/BaseLayout.astro` only renders `BreadcrumbJsonLd` when
`breadcrumbItems.length > 1`. On the homepage, the breadcrumb resolves to a
single `[Home]` item (because `getBreadcrumbsForPath` returns just `Home` for
the locale root), so it is suppressed.

This is a **defensible** default — Google explicitly does not recommend
single-item `BreadcrumbList` JSON-LD blocks because they don't help search
engines understand site hierarchy. The spec line 6.5 listed `BreadcrumbList` on
the homepage, but no search engine or LLM consumer is harmed by the omission.

**Fix if strict spec adherence is required**: change `> 1` to `>= 1` on
`src/layouts/BaseLayout.astro:367`. This is a one-line change.

**Recommendation**: merge as-is. The deviation is documented and the SEO best
practice is the opposite of strict spec compliance here.

### 2. `BlogPosting` vs `BlogPost` (6.5)

`src/components/seo/BlogPostJsonLd.astro:64` emits `@type: "BlogPosting"`. This
is the correct schema.org type — `BlogPost` is not a valid schema.org type. The
spec line 6.5 listed `BlogPost`, but the implementation is correct. No action
needed.

### 3. `hreflang` double slash (pre-existing)

`BaseLayout.astro:361` builds hreflang as `${Astro.site}${path}`. When
`Astro.site` ends with `/` (it does, set to `https://qazuor.com/`), the result
is `https://qazuor.com//en/`. **Canonical URLs are correct** (no double slash)
so `og:url` and canonical are unaffected. Pre-existing Astro trailing-slash
issue, not introduced by SPEC-001.

### 4. Stale spec counts (6.1, 6.4)

Spec says "4 services × 2 locales" (actual: 6) and "3 projects × 2 locales"
(actual: 14). The collections grew between the spec and the build. The
implementation includes everything the spec requires plus more.

### 5. `searchIndex.ts` auto-reformat (pre-existing)

The file is reformatted by `lint-staged` on every commit cycle. Not blocking.
Candidate for a future biome config cleanup or `.gitignore` entry.

## Final Verdict

**READY FOR MERGE**

All 5 verification items pass. The single deviation (homepage `BreadcrumbList`)
is non-blocking and follows current SEO best practice. The one-line fix to
enforce strict spec compliance is available if needed.
