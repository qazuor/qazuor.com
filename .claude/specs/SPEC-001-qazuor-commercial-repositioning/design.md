# Design: Qazuor Commercial Repositioning

## 1. Technical Approach

Implement the change as a content-architecture and navigation refactor on top of
the existing multilingual static site. Reuse current visual primitives, services
data, projects content, blog content, footer links, and SEO assets where
possible. Add only the missing route surfaces required by the new information
architecture.

This is a **repositioning change**, not a platform rewrite.

## 2. Implementation Principles

### Principle A: Modify if Present, Create if Missing

The repo currently exposes published output and route directories, but editable
source entrypoints are not fully visible from the current workspace scan. To
avoid ambiguity:

- if a target file already exists, modify it in place
- if it does not exist, create it at the exact target path defined below
- do not create alternate parallel route systems

This rule is mandatory for the implementing agent.

### Principle B: One Brand, Multiple Intents

Maintain one design system and one brand identity. Differentiate audience intent
by content hierarchy, CTA weight, layout tone, and metadata, not by creating an
unrelated visual sub-brand.

### Principle C: Commercial First, Portfolio Preserved

Commercial intent leads on homepage and services. Portfolio remains available
but moves to explicit proof layers (`work` and `projects`).

## 3. Route Design

## Existing Routes to Keep

- `/{lang}/`
- `/{lang}/services`
- `/{lang}/services/[slug]`
- `/{lang}/projects`
- `/{lang}/projects/[slug]`
- `/{lang}/blog`
- `/{lang}/blog/[slug]`
- `/{lang}/blog/category/[category]`
- `/{lang}/goodies` and children

## New Routes to Create

- `/{lang}/work`
- `/{lang}/work/[slug]`
- `/{lang}/hire`
- `/{lang}/about`
- `/{lang}/contact`

## 4. Recommended Source Targets

The implementing agent MUST use these source targets unless the project already
has established equivalents.

| Concern             | Preferred target                                                                   |
| ------------------- | ---------------------------------------------------------------------------------- |
| Locale home route   | `src/pages/[lang]/index.astro` or equivalent existing home entry                   |
| Work index route    | `src/pages/[lang]/work/index.astro`                                                |
| Work detail route   | `src/pages/[lang]/work/[slug].astro` or `src/pages/[lang]/work/[slug]/index.astro` |
| Hire route          | `src/pages/[lang]/hire/index.astro`                                                |
| About route         | `src/pages/[lang]/about/index.astro`                                               |
| Contact route       | `src/pages/[lang]/contact/index.astro`                                             |
| Services hub route  | existing `src/pages/[lang]/services/index.astro` equivalent                        |
| Projects hub route  | existing `src/pages/[lang]/projects/index.astro` equivalent                        |
| Nav config          | existing site nav data source; otherwise create `src/data/navigation.ts`           |
| Footer config       | existing footer data source; otherwise create `src/data/footer.ts`                 |
| Work content source | `src/content/work/`                                                                |
| Hire page copy data | `src/data/hire.ts` or page-local content object                                    |
| SEO helpers         | existing SEO utilities; otherwise `src/components/seo/` or `src/utils/seo.ts`      |

If these preferred targets are absent, the agent MUST create them exactly rather
than inventing a new layout.

## 5. Content Migration Design

## Homepage

Reuse current homepage visual primitives where strong:

- hero shell
- trust badge strip
- services preview cards
- testimonials block
- contact CTA block

Move or remove from homepage:

- long about/timeline
- skills grid
- recruiter-first resume actions
- overly dense social icon cluster
- project gallery as the main primary CTA destination

Replace the current projects area with a curated `Featured Work` slice driven by
a `work` content collection or equivalent data source.

## Services

Keep current service detail template pattern and strengthen copy hierarchy:

- rewrite intro framing
- add `who this is for`
- add `problems solved`
- link related work items
- keep FAQs and final CTA

## Work

Create a new content layer separate from `projects`.

Recommended frontmatter fields for each work item:

```ts
title;
slug;
summary;
clientType;
services;
role;
industry;
problem;
solution;
impact;
stack;
relatedProjectSlug;
featured;
order;
locale;
```

`relatedProjectSlug` allows the same underlying project to exist in `/projects`
while also powering a commercial case study in `/work`.

## Hire

Build `hire` as a self-contained recruiter landing page. It should pull from
structured data, not from homepage-only composition.

Recommended data fields:

```ts
headline;
availability;
roleTargets;
experienceSummary;
keyStrengths;
selectedProjectSlugs;
resumeLinks;
professionalLinks;
contactPreference;
```

## Goodies

No structural rewrite required. Only adjust navigation exposure and internal
linking context.

## 6. SEO/AEO Design

### Metadata

- homepage metadata changes from personal portfolio framing to commercial brand
  framing
- `work` receives its own index metadata and OG image strategy
- `hire` receives recruiter-facing metadata
- service page titles remain service-specific but shift from generic dev
  branding to Qazuor commercial positioning

### Structured Data

Recommended entity split:

- Qazuor commercial surfaces: `Organization` or `ProfessionalService`
- author pages, bio, recruiter content, and article authorship: `Person`

Recommended schema placement:

- homepage: `Organization` or `ProfessionalService`
- services: `Service`
- work case study: `CreativeWork` or `Article`-like proof page plus breadcrumbs
- hire: `Person` with professional profile context
- blog posts: `Article`
- FAQ sections: `FAQPage`

### Machine-Readable Assets

Update:

- `llms.txt`
- sitemap entries and priorities
- breadcrumb generation if centrally managed
- internal linking suggestions in blog and service pages

## 7. Navigation and Footer Design

Primary nav becomes commercial-first. Footer becomes the place for:

- goodies/resources
- expanded social links
- legal or repo links
- utility links

This preserves discovery without distracting above the fold.

## 8. Visual System Treatment

### Commercial Surfaces

- stronger CTA contrast
- more explicit proof sections
- less autobiographical density

### Hire Surface

- same palette family and typography tokens
- calmer information density
- more scan-friendly section rhythm
- more editorial than promotional

## 9. Testing Strategy

| Layer            | What to validate                                              |
| ---------------- | ------------------------------------------------------------- |
| Route rendering  | new routes exist in both locales                              |
| Navigation       | `goodies` absent from primary nav, present in footer          |
| Content intent   | homepage leads to services/work/contact before portfolio/hire |
| SEO              | titles, descriptions, canonicals, schema presence             |
| Internal linking | blog to service/work handoffs, project to work cross-links    |
| Regression       | existing blog/projects/goodies routes remain accessible       |

## 10. Rollout Order

1. Navigation and route scaffolding
2. Homepage repositioning
3. Work hub and work detail pages
4. Hire, About, Contact pages
5. Services copy and linking enhancements
6. SEO/AEO metadata and machine-readable updates
7. Footer cleanup and goodies demotion
