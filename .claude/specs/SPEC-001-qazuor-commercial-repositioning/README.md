# SPEC-001: Qazuor Commercial Repositioning

## Purpose

This spec defines the end-to-end repositioning of `qazuor.com` from a hybrid
personal portfolio home into a commercial-first website under the **Qazuor**
brand, without losing portfolio and recruiting value.

## Artifacts

- `proposal.md`: business context, scope, decisions, information architecture
- `spec.md`: behavioral and content requirements
- `design.md`: technical implementation design and file plan
- `tasks.md`: execution checklist in dependency order
- `metadata.json`: machine-readable summary

## Implementation Intent

The implementing agent must treat this spec as the source of truth for:

- navigation and route structure
- content hierarchy and section-level ownership
- SEO/AEO rules
- page-by-page migration of existing content
- distinction between commercial, portfolio, and hiring audiences

## Non-Negotiable Decisions

- Commercial surfaces use **Qazuor**, not **Leandro**, as the primary brand.
- The site becomes **commercial-first**, not portfolio-first.
- `goodies` stays indexable but leaves the primary navigation.
- Top-level paths remain in English across locales.
- `work` becomes the commercial proof area.
- `projects` remains the broader technical portfolio.
- `hire` becomes a recruiter-specific landing page.
