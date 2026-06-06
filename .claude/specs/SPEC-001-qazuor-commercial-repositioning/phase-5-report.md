# Phase 5 — SEO, AEO, and Machine-Readable Assets

## Summary

Phase 5 closes the SEO/AEO loop. Per-page metadata under the Qazuor commercial
framing is now wired across every commercial surface, machine-readable entity
clarity is upgraded with Organization, ProfessionalService, and FAQPage schemas,
the sitemap reflects the full new architecture, and `llms.txt` is rewritten as a
clean LLM-facing brand brief.

## Scope

- 5.1 Per-page metadata (homepage, services hub/detail, work hub/detail, hire,
  about, contact)
- 5.2 New JSON-LD components: Organization, ProfessionalService, FAQPage
- 5.3 Sitemap updates + `llms.txt` rewrite
- 5.4 Blog contextual handoffs (related service, work, contact)

## Commits

| Task | Hash        | Description                                                          |
| ---- | ----------- | -------------------------------------------------------------------- |
| 5.2  | `7f6a85b`   | Add Organization, ProfessionalService, FAQPage JSON-LD components    |
| 5.3  | `193c458`   | Update sitemap with work, hire, about, contact + rewrite llms.txt    |
| 5.4  | `162a487`   | Add related service/work slugs to blog schema + contextual handoff   |
| 5.3  | `9b5868f`   | Fix sitemap `getUrlMeta` to be locale-agnostic for new routes        |
| 5.1  | (no commit) | Verification pass — all 8 target pages already wired from Phases 3-4 |

## Files Changed

### Created

- `src/components/seo/OrganizationJsonLd.astro` — Qazuor brand entity: name,
  url, logo, sameAs (LinkedIn, GitHub, Read.cv), description. Used on homepage.
- `src/components/seo/ProfessionalServiceJsonLd.astro` — Senior practice entity:
  name, areaServed, serviceType, provider (Organization reference). Used on
  homepage and services hub.
- `src/components/seo/FaqPageJsonLd.astro` — FAQ schema generated from
  `common.json` `faqs.faqs.{clients,employers}`. Used on homepage.

### Modified

- `src/types/jsonld.ts` — added `ProfessionalServiceSchema`, extended
  `JsonLdSchema` union to cover Organization, ProfessionalService, FAQPage,
  Question.
- `src/pages/[lang]/index.astro` — wired the 3 new JSON-LD components in
  `slot="head"`.
- `src/pages/[lang]/services/index.astro` — wired ProfessionalServiceJsonLd.
- `src/pages/sitemap.xml.ts` — added `/work/` (per locale), `/work/[slug]/` (per
  locale per work entry), `/hire/`, `/about/`, `/contact/`. New `getUrlMeta`
  rules: `/work/` 0.9, `/hire/` 0.8, `/about/` 0.7, `/contact/` 0.7.
- `public/llms.txt` — full rewrite under Qazuor commercial framing. Dropped
  Fiverr/Upwork/USD pricing references. Lists services as outcomes, references
  all 5 commercial surfaces (`/work/`, `/hire/`, `/about/`, `/contact/`,
  `/projects/`). English only.
- `src/content/config.ts` — added optional `relatedServiceSlug` and
  `relatedWorkSlug` to blog schema.
- `src/locales/{en,es}/common.json` — added
  `blog.related.handoff.{title,serviceLabel,workLabel,contactLabel,contactCta}`.
- `src/pages/[lang]/blog/[slug].astro` — renders editorial handoff block after
  post body: related service (if `relatedServiceSlug` set), related work (if
  `relatedWorkSlug` set, with locale fallback), always-present contact CTA.

### Verified Unchanged

- `public/robots.txt` — existing rules already cover the new routes.
- All 8 target pages' `title` and `description` wiring — already correct from
  Phases 3-4. Task 5.1 became a verification pass.

## Data Sources and Wiring

- `src/data/services.ts` — `serviceGroupings`, `whoItIsFor`, `problemsSolved`,
  `relatedWorkSlugs`, `ctaHref`. All already in place from Phase 4.
- `src/data/hire.ts` — `HireProfile` (en/es). Locale keys in `common.json`
  `hire.meta.*` are wired into `/[lang]/hire/index.astro`.
- `src/data/work.ts` — `getWorkBySlug` (en/es resolution).
- New locale keys added: `about.meta.*`, `contact.meta.*` in
  `src/locales/{en,es}/common.json`.

## Verification

- `pnpm astro check` — 0 errors, 0 new warnings (pre-existing 293 unused-imports
  warnings unchanged).
- `pnpm build` — succeeded.
- `dist/client/sitemap.xml` regenerated, contains:
  - 3 work case studies × 2 locales
  - 4 new static pages × 2 locales (work hub, hire, about, contact)
  - Correct priorities (work hub 0.9, /hire/ 0.8, /about/ 0.7, /contact/ 0.7,
    work case studies 0.9).
- `public/llms.txt` regenerated, English-only, Qazuor-commercial framed.

## Deviations from Spec

1. **Locale-agnostic regex fix (`9b5868f`):** Initial `getUrlMeta`
   implementations for the new routes required a locale prefix, but call sites
   pass locale-less paths. Fixed post-build verification (caught by the agent's
   own self-review, not by external review).
2. **Namespace `blog.related.handoff.*`:** Added as a sub-namespace under the
   existing `blog.related` to preserve the existing `blog.related.title` (used
   by the related-posts section). The spec's intent of grouping under
   `blog.related` is preserved.
3. **Task 5.1 had no code changes:** All 8 target pages already had proper
   `title` and `description` wiring from Phases 3-4. Documented but no diff.
   About and contact added new `*.meta.*` keys to `common.json`, which were
   wired in the same commit as the page implementations in Phase 4.

## Issues Noted

- `src/data/searchIndex.ts` had an unstaged 4→2 space indentation change
  (whitespace only). The file is auto-generated and biome reformats it on every
  commit. Pre-existing, not from Phase 5 work. The orchestrator reverted the
  change rather than commit it under Phase 5, per the atomic commits policy.
  Candidate for a future biome config cleanup or a `.gitignore` entry.

## Status

4 of 4 Phase 5 tasks complete. Branch is at `9b5868f`, 4 commits ahead of
`origin/feat/spec-001-implementation`, working tree clean.
