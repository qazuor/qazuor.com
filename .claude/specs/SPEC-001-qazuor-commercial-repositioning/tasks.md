# Tasks: Qazuor Commercial Repositioning

## Phase 1: Foundations

- [x] 1.1 Identify the editable source entrypoints that currently generate
      `/{lang}/`, `services`, `projects`, `blog`, nav, footer, and SEO output.
- [x] 1.2 Apply the spec rule `modify if present, create if missing` and map
      each required target route to a concrete source file.
- [x] 1.3 Create any missing route shells for `/{lang}/work`,
      `/{lang}/work/[slug]`, `/{lang}/hire`, `/{lang}/about`, and
      `/{lang}/contact`.
- [x] 1.4 Create or extend shared navigation/footer data so primary and
      secondary nav can be managed centrally.

## Phase 2: Homepage and Navigation

- [x] 2.1 Rewrite the homepage structure into commercial order: hero, trust,
      services, why Qazuor, featured work, testimonials, FAQ, CTA.
- [x] 2.2 Remove timeline/about-depth, skills-heavy, recruiter-heavy, and
      portfolio-first content from the main homepage flow.
- [x] 2.3 Update primary navigation to `services`, `work`, `projects`, `blog`,
      `about`, `hire`, `contact` in both locales.
- [x] 2.4 Remove `goodies` from primary nav and expose it only from footer or
      equivalent secondary navigation.

## Phase 3: Work and Portfolio Separation

- [x] 3.1 Create the `work` content model or data source for curated commercial
      case studies.
- [x] 3.2 Build the `work` index page with cards that surface problem, role,
      service tags, and impact.
- [x] 3.3 Build the `work` detail template with context, problem, constraints,
      solution, impact, stack, and service CTA.
- [x] 3.4 Reframe the `projects` index copy so it reads as the broader technical
      portfolio, not the main sales proof page.
- [x] 3.5 Add cross-links between relevant `projects` items and corresponding
      `work` case studies.

## Phase 4: Service and Recruiter Surfaces

- [x] 4.1 Update the services hub so it helps visitors choose the right service,
      not just browse cards.
- [x] 4.2 Enhance each service detail page with `who it is for`,
      `problems solved`, related work, and stronger final CTAs.
- [x] 4.3 Build `hire` as a standalone recruiter landing page with summary, fit,
      experience, strengths, selected work, resume, and contact.
- [x] 4.4 Build `about` as the new home for extended brand/operator context.
- [x] 4.5 Build `contact` as a dedicated route with inquiry framing and response
      expectations.

## Phase 5: SEO, AEO, and Machine-Readable Assets

- [x] 5.1 Rewrite metadata for homepage, services hub, work hub, hire, about,
      and contact under the Qazuor commercial framing.
- [x] 5.2 Add or update structured data for Organization/ProfessionalService,
      Service, Person, FAQPage, Article, and breadcrumbs where required.
- [x] 5.3 Update `llms.txt`, sitemap generation, and any central route-priority
      logic to include the new architecture.
- [x] 5.4 Add contextual internal linking from blog posts to related services,
      work case studies, and contact where appropriate.

## Phase 6: Verification

- [x] 6.1 Verify all new routes exist in both `es` and `en`.
- [x] 6.2 Verify `goodies` is absent from primary nav and reachable from footer.
- [x] 6.3 Verify homepage CTAs prioritize services/work/contact over
      projects/hire.
- [x] 6.4 Verify existing blog, project, and goodies URLs remain accessible
      without regressions.
- [x] 6.5 Verify titles, descriptions, canonical tags, and schema outputs on all
      new or rewritten commercial pages.
