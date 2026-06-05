# Phase 2 Report: Homepage and Navigation

## Goal

Rewrite the homepage in commercial order and rewire primary navigation to
surface services, work, hire, and contact before portfolio. Remove
personal-portfolio sections from the main flow. Demote `goodies` from primary
nav to footer only.

## Homepage Section Order (new)

The commercial homepage renders, in order:

1. **Hero** — Qazuor commercial framing; CTAs to `/work` and `/contact` (not
   `/projects`); resume download disabled by default and lives on `/hire`
2. **Why Qazuor** — 4 differentiator cards (boutique senior practice, direct
   senior work, outcome-driven scoping, code quality as default, built to last)
   — replaces the old personal "Why work with me" panel
3. **Services Preview** — kept from before, with new copy in commercial framing
4. **Featured Work** — placeholder card ("Coming soon") with three CTAs (work,
   projects, blog); full curated feed lands in Phase 3
5. **Testimonials** — kept from before
6. **FAQs** — kept from before (client + employer FAQ split)
7. **Contact** — final CTA, kept from before

Section dividers between
hero/why-qazuor/services-preview/featured-work/testimonials/faqs/contact/footer
are all new and pull from the regenerated
`src/styles/generated-section-backgrounds.css`.

## What was removed from the homepage

The following section imports and uses were deleted from
`src/pages/[lang]/index.astro`:

- `AboutSection` (long about / timeline content)
- `BlogSection` (blog feed on homepage)
- `ProjectsFeaturedSection` (project gallery as the main primary CTA
  destination)
- `SkillsSection` (skills-heavy grid)
- `getEffectiveSlug`, `getProjectSlug`, `getBlogPostsForLangWithFallback`
  imports
- `BlogCategoryKey`, `getCategoryName` imports
- `ImageMetadata`, `getImage` from `astro:assets` (no longer used inline; avatar
  optimization still happens inside the testimonials pipeline)
- `getCollection('blog')` and `getCollection('projects')` calls (homepage no
  longer surfaces those)
- "Why work with me" copy that was inside `ServicesPreviewSection` (the old
  personal panel)

The "Download Resume" CTA in the hero is now hidden via the new `showResume`
prop (the resume lives on `/hire`).

## What was added

- `src/components/sections/WhyQazuorSection.astro` — new 4-card differentiator
  grid
- `src/components/sections/FeaturedWorkSection.astro` — new centered placeholder
  card
- `src/components/sections/HeroSection.astro` — new `showResume` (default `true`
  for back-compat), `viewProjectsHref` (default `#projects`), `getInTouchHref`
  (default `#contact`) props so callers can override the hero CTAs
- New `whyQazuor.*` and `featuredWork.*` i18n keys (es + en)
- `src/data/navIcons.tsx` — `NavIconId` resolver (string ID → component)
- `src/data/navigation.ts` (already in Phase 1) — primary nav now consumed by
  `FloatingNav.tsx` and `MobileUtilitiesPopover.tsx`
- `src/data/footer.ts` (already in Phase 1) — now consumed by `Footer.astro`;
  goodies lives in `footer.discovery`
- New divider transitions between new sections (colors added to
  `src/styles/generated-section-backgrounds.css`)
- `workHref` and `contactHref` constants at the top of `index.astro` so hero
  CTAs route to commercial destinations

## Navigation Changes

### Before (per phase-1 report)

- Primary nav: services, projects, blog, goodies (and others)
- `goodies` was reachable from primary nav
- Hero CTAs routed to `#projects` and `#contact`
- `FloatingNav` and `MobileUtilitiesPopover` consumed their own hardcoded nav
  data
- `Footer.astro` had its own hardcoded link lists

### After (phase 2)

- Primary nav order (per spec.md §3.1): **services, work, projects, blog, about,
  hire, contact**
- `goodies` removed from primary nav entirely
- `goodies` reachable from the footer discovery/resources section
- Hero CTAs route to `/{lang}/work` and `/{lang}/contact` (not `/projects` or
  `#projects`)
- `FloatingNav.tsx` and `MobileUtilitiesPopover.tsx` now import from
  `src/data/navigation.ts` and use the `NavIconId` resolver
- `Footer.astro` now imports from `src/data/footer.ts`
- Hero resume download is hidden on the homepage (lives on `/hire`)

## NavIconId Resolver

Location: `src/data/navIcons.tsx` (added by the agent)

Exports:

- `resolveNavIcon(id: NavIconId): ComponentType | null` — returns the React
  component for a given nav icon ID, or `null` if the ID is not yet mapped
- Re-exports `NavIconId` type from `src/data/navigation.ts` for convenience

Current icon ID list (must be expanded as new primary-nav items are added):

- `services`, `work`, `projects`, `blog`, `about`, `hire`, `contact`

The resolver pattern is UI-library agnostic — if the project ever swaps the icon
library, only `navIcons.tsx` needs to change; `navigation.ts` stays stable.

## Locale Coverage

All new homepage copy and all primary nav labels are mirrored in
`src/locales/en/common.json` and `src/locales/es/common.json`. Top-level paths
stay in English in both locales per spec §2.1.

## Commits Made

| SHA       | Message                                                                           |
| --------- | --------------------------------------------------------------------------------- |
| `311bca1` | `feat(spec-001): add NavIconId resolver for navigation data`                      |
| `5477ad3` | `feat(spec-001): rewire primary nav to commercial-first order`                    |
| `1102073` | `feat(spec-001): rewire footer to consume central data and add goodies discovery` |
| `db0335d` | `fix(spec-001): resolve duplicate i18n keys and parseColors missing sections`     |
| `19bfced` | `feat(spec-001): add color transitions for WhyQazuor and FeaturedWork sections`   |
| `0402ca9` | `feat(spec-001): add showResume opt-out prop to HeroSection`                      |
| `1c3b425` | `refactor(spec-001): remove personal WhyWorkWithMe panel and dead i18n keys`      |
| `0483999` | `feat(spec-001): add WhyQazuor and FeaturedWork homepage sections`                |
| (pending) | `fix(spec-001): pass through hero CTA hrefs and type homepage callbacks`          |
| (pending) | `docs(spec-001): finalize phase 2 report and check off tasks`                     |

The 2 pending commits are the typecheck fix the orchestrator applied after the
agent's run (callback typing + hero href passthrough) and the phase 2 report +
tasks update.

## Verification

- `npx astro check` → 0 errors, 0 warnings (11 unrelated pre-existing hints)
- `npx astro build` → successful. Both `es` and `en` homepages build. All
  existing routes still build.
- `git status` → clean after final commits
- Branch `feat/spec-001-implementation` will be ahead of `main` by 10 commits (8
  agent + 2 orchestrator) once the pending commits land

## Open Questions / Decisions for User

1. **Homepage copy review** — `WhyQazuorSection` 4-card copy and
   `FeaturedWorkSection` placeholder copy are agent-generated. The user should
   review the tone/voice against their brand and request changes if any card
   reads off-message.
2. **Hero avatar** — the hero still renders `HeroAvatar` (the developer photo).
   For full commercial repositioning, the user may want to consider removing the
   avatar from the hero and putting it only on `/about`. Out of scope for Phase
   2 but worth flagging for Phase 4.
3. **Auto-generated `searchIndex.ts` and `generated-section-backgrounds.css`** —
   these are still tracked. The first regenerates on every build
   (whitespace-only diff in this phase) and the second regenerates whenever
   section colors change (legit new color interpolations this phase). Consistent
   with the giscus CSS decision (Decisión 1), they could be gitignored. NOT done
   in this phase to keep the scope tight; surfacing here for the user.
4. **Phase 2 commits are 8 atomic units** — the agent split them finely for
   review clarity. If the user prefers fewer/larger commits, the user can squash
   on merge.

## Blockers for Phase 3

**None.** Phase 3 (work hub and work detail pages) can proceed. The data
sources, nav resolver, and homepage sections are all in place. The work content
collection is the next thing to design and create.
