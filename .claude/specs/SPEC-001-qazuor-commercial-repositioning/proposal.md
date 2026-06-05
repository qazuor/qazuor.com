# Proposal: Qazuor Commercial Repositioning

## Problem

`qazuor.com` already contains services, projects, blog content, and
machine-readable discovery assets, but the current homepage and overall
narrative remain too personal and portfolio-led. That dilutes conversion for
client acquisition and forces one surface to serve three different intents at
once:

- client intent: hire Qazuor for paid work
- recruiter intent: evaluate fit for employment or contract roles
- peer/developer intent: explore portfolio, blog, and goodies

The result is an information architecture that is technically rich but
commercially under-positioned.

## Desired Outcome

Reframe the site into a **commercial-first experience** under the **Qazuor**
brand while preserving:

- a broad technical portfolio
- recruiter-oriented hiring material
- SEO/AEO authority content
- indexable goodies/resources

## Scope

### In Scope

- homepage repositioning
- primary navigation redesign
- route additions for `work`, `hire`, `about`, and `contact`
- migration rules for existing homepage sections
- repositioning of `projects` vs `work`
- removal of `goodies` from primary navigation
- SEO/AEO metadata, schema, and internal linking updates
- cross-locale consistency for route names

### Out of Scope

- brand rename away from Qazuor
- changing top-level paths to Spanish
- creating a fake agency/team narrative
- deleting blog, projects, or goodies content
- changing deployment, hosting, or analytics providers

## Confirmed Product Decisions

1. `goodies` remains on the site, but only in secondary navigation or footer.
2. Commercial messaging becomes brand-first under **Qazuor**, not person-first
   under **Leandro**.
3. Visual identity remains in the same family, but `hire` gets a more
   recruiter-friendly tone.
4. `hire` is a standalone landing page, not a simple CV download page.
5. Commercial proof lives under `/work`.
6. Top-level routes remain in English in both locales.

## Target Information Architecture

```text
/{lang}/
├── services/
│   ├── web-apps/
│   ├── landing-pages/
│   ├── automation-integration/
│   ├── web-optimization/
│   └── social-media-design/
├── work/
│   ├── index
│   └── [case-study]/
├── projects/
│   ├── index
│   └── [project]/
├── hire/
├── about/
├── contact/
├── blog/
│   ├── index
│   ├── category/[category]/
│   └── [post]/
└── goodies/
    ├── tools/
    ├── snippets/
    ├── css-tricks/
    └── useful-links/
```

## Content Strategy

### Homepage

The homepage stops being a general personal overview and becomes a commercial
landing page for the Qazuor brand.

### Work

`/work` becomes the curated commercial proof layer. It only contains selected
cases that support selling services.

### Projects

`/projects` remains broader, more technical, and more portfolio-oriented. It may
include side projects, internal tools, experiments, and product work.

### Hire

`/hire` becomes a recruiter-only landing page with a premium editorial tone and
structured information for evaluation.

### Goodies

`/goodies` remains indexable for authority and long-tail discovery, but it stops
competing with primary commercial navigation.

## Success Criteria

- homepage leads users toward services and contact, not toward general biography
- commercial navigation is clear within one screen
- `work` and `projects` are meaningfully separated by intent
- `hire` stands alone as a recruiter surface
- blog and goodies continue contributing authority without diluting primary
  navigation
- the site remains coherent across `es` and `en`
