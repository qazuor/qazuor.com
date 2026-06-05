# Specification: Qazuor Commercial Repositioning

## 1. Global Brand and Messaging

### Requirement 1.1

All commercial-first surfaces MUST present **Qazuor** as the primary brand
entity.

#### Rules

- Homepage, services, work, about, contact, and footer commercial copy MUST use
  `Qazuor` as the leading brand reference.
- `Leandro` MAY appear in biography, project authorship, or recruiter-specific
  context, but MUST NOT be the dominant commercial homepage identity.
- Copy tone MUST be friendly, direct, and confident, but MUST NOT read like a
  personal portfolio introduction.
- Copy MUST avoid fake-agency language unless it reflects a real operating
  model.

### Requirement 1.2

Primary commercial copy MUST describe outcomes, capabilities, and fit, not
personal journey.

#### Rules

- Hero copy MUST communicate who Qazuor helps, what Qazuor builds, and why it
  matters.
- Personal timeline, autobiographical story, and dense CV-style content MUST NOT
  appear in the main homepage flow.
- If a personal credibility block exists on commercial pages, it MUST be short
  and framed as proof, not as the page's main purpose.

## 2. Routes and Locale Policy

### Requirement 2.1

Top-level paths MUST remain in English across both locales.

#### Required Paths

- `/es/services` and `/en/services`
- `/es/work` and `/en/work`
- `/es/projects` and `/en/projects`
- `/es/hire` and `/en/hire`
- `/es/blog` and `/en/blog`
- `/es/goodies` and `/en/goodies`

#### Rules

- The implementing agent MUST NOT translate top-level route names into Spanish.
- Existing top-level English route conventions MUST be preserved for continuity
  and URL stability.

### Requirement 2.2

Every new route added in one locale MUST exist in the other locale, even if
placeholder content is temporarily needed during rollout.

## 3. Primary Navigation

### Requirement 3.1

Primary navigation MUST expose the commercial-first structure.

#### Required Nav Order

1. Services
2. Work
3. Projects
4. Blog
5. About
6. Hire
7. Contact

#### Rules

- `goodies` MUST NOT appear in primary navigation.
- Primary nav labels MUST be mirrored by locale, but route segments remain
  English.
- Contact MUST be directly reachable from primary navigation.

### Requirement 3.2

Footer navigation MUST contain the primary links plus secondary discovery links.

#### Secondary Footer Links

- Goodies
- Tools
- Snippets
- Useful Links
- CSS Tricks
- Legal or repository links if already present

## 4. Homepage (`/{lang}/`)

### Requirement 4.1

The homepage MUST become a commercial landing page.

#### Required Sections in Order

1. Hero
2. Trust / proof strip
3. Service overview
4. Why Qazuor / working model
5. Featured work
6. Testimonials or social proof
7. Short FAQ
8. Final CTA / contact handoff

### Requirement 4.2

The homepage MUST migrate existing content according to this matrix.

| Current area             | Action                     | Destination              |
| ------------------------ | -------------------------- | ------------------------ |
| Hero visual system       | Keep, rewrite copy         | Homepage                 |
| Trust badges             | Keep, tighten              | Homepage                 |
| About / timeline         | Remove from main flow      | About / Hire             |
| Skills section           | Remove from homepage       | Hire                     |
| Featured projects        | Replace with curated cases | Work preview on homepage |
| Services preview         | Keep and promote           | Homepage                 |
| Testimonials             | Keep                       | Homepage                 |
| Contact section          | Keep summarized            | Homepage + Contact page  |
| Resume download in hero  | Remove from homepage hero  | Hire                     |
| Dense social links block | Reduce                     | Footer / Contact / Hire  |

### Requirement 4.3

Homepage CTAs MUST prioritize commercial conversion.

#### Required CTA Priorities

- Primary CTA: start a conversation / contact / request project discussion
- Secondary CTA: explore services or work
- Recruiter CTA: MAY exist, but MUST be visually secondary to client CTAs

## 5. Services Hub (`/{lang}/services`)

### Requirement 5.1

The services hub MUST function as the primary solution map for commercial
visitors.

#### Required Sections

1. Intro hero
2. Service cards grid
3. Process overview
4. Comparison or fit guidance
5. FAQ or objection handling
6. CTA to contact

### Requirement 5.2

The services hub MUST clearly differentiate each service by business need.

#### Required Services

- Web Apps
- Landing Pages
- Automation & Integration
- Web Optimization
- Social Media Design

#### Rules

- Each service card MUST communicate audience, value, and example outcomes.
- The page MUST help users choose the right service, not just list offerings.

## 6. Service Detail Pages (`/{lang}/services/[slug]`)

### Requirement 6.1

Every service detail page MUST use a consistent conversion-oriented template.

#### Required Sections

1. Hero with business outcome framing
2. Who it is for
3. Problems solved
4. What is included
5. Process / delivery flow
6. Relevant proof or linked work
7. FAQ
8. Final CTA

### Requirement 6.2

Service detail pages MUST preserve useful current content and replace weak
generic content.

#### Keep

- current hero visuals if strong
- feature/inclusion blocks
- FAQ sections
- final CTA blocks

#### Rewrite or Replace

- vague descriptions that only enumerate technologies
- overly generic “integral solutions” language
- excessive emphasis on personal identity over service outcomes

## 7. Work Hub (`/{lang}/work`)

### Requirement 7.1

`/work` MUST be created as a curated commercial proof area.

#### Purpose

- show selected cases relevant to selling services
- demonstrate problem solving, constraints, outcomes, and execution quality
- separate commercial proof from the broader technical portfolio

#### Required Listing Data Per Card

- title
- one-line context
- service or capability tags
- role summary
- result or impact summary
- CTA to full case study

### Requirement 7.2

`/work/[case-study]` MUST use a case-study template.

#### Required Sections

1. Context
2. Problem
3. Constraints
4. Solution
5. Delivery scope
6. Stack summary
7. Result / impact
8. Related service CTA

#### Rules

- Case studies MUST be written for clients, not for recruiters.
- Case studies MAY reference technical depth, but business framing MUST come
  first.

## 8. Projects Hub (`/{lang}/projects`)

### Requirement 8.1

`/projects` MUST remain as the broader technical portfolio.

#### Rules

- It MUST remain indexable and accessible from primary navigation.
- It MUST be framed as a broader body of work, including product, client,
  internal, and experimental projects.
- It MUST NOT replace `/work` as the primary commercial proof area.

### Requirement 8.2

Projects that are commercially relevant SHOULD be linked bi-directionally with
corresponding work case studies.

## 9. Hire Landing (`/{lang}/hire`)

### Requirement 9.1

`/hire` MUST be created as a standalone recruiter-oriented landing page.

#### Required Sections

1. Hero summary
2. Role fit / availability
3. Experience highlights
4. Relevant projects / selected work
5. Core stack and strengths
6. Resume / CV access
7. Professional links
8. Contact / recruiter CTA

### Requirement 9.2

`/hire` MUST feel related to the main brand but distinct in tone.

#### Rules

- It MUST use the same design system family.
- It SHOULD use a more editorial, sober, and scan-friendly layout style.
- It MUST be optimized for quick recruiter evaluation.

## 10. About and Contact

### Requirement 10.1

`/about` MUST contain the longer-form brand and operator context removed from
the homepage.

### Requirement 10.2

`/contact` MUST be a dedicated route and MUST NOT rely only on a homepage
anchor.

#### Contact Page Requirements

- clear intro
- project inquiry path
- optional structured form fields
- alternative channels
- expectation setting for response and fit

## 11. Goodies and Resources

### Requirement 11.1

`/goodies` MUST remain published and indexable.

### Requirement 11.2

`/goodies` MUST be discoverable through footer or secondary navigation only.

### Requirement 11.3

Goodies content MUST continue to support authority, internal linking, and
long-tail discovery, but MUST NOT compete with core commercial navigation.

## 12. Blog Strategy

### Requirement 12.1

The blog MUST remain published and indexable.

### Requirement 12.2

Each post template SHOULD include contextual handoffs to:

- a related service page
- a relevant case study in `/work`
- contact when appropriate

### Requirement 12.3

Blog listing and category pages SHOULD prioritize posts with authority and
commercial adjacency, such as SEO, performance, architecture, product decisions,
and freelance/business trade-off content.

## 13. SEO and AEO

### Requirement 13.1

Metadata and structured data MUST be updated to match the new commercial-first
architecture.

#### Required Updates

- homepage title and description
- services hub title and description
- work hub metadata
- hire metadata
- canonical consistency across locales
- breadcrumbs on nested routes

### Requirement 13.2

The site MUST expose stronger machine-readable entity clarity.

#### Required Schema Coverage

- Organization or brand entity for Qazuor
- Person schema where author or recruiter context needs it
- Service schema on service pages
- FAQPage schema where FAQ sections exist
- Article schema on blog posts
- BreadcrumbList on nested pages

### Requirement 13.3

Existing discovery assets such as `llms.txt`, sitemap, and robots rules MUST be
updated to reflect the new route structure and page purposes.

## 14. Migration and Stability

### Requirement 14.1

Existing URLs that remain valid MUST preserve indexability.

### Requirement 14.2

If any renamed or newly split route replaces an old navigation destination,
internal links MUST be updated to the new preferred route.

### Requirement 14.3

The implementation MUST favor rewriting current components and data where
reasonable over introducing parallel duplicate systems.
