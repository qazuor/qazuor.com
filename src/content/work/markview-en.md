---
title: 'MarkView: A markdown editor that works everywhere you do'
summary: >-
  A PWA markdown editor with cloud sync (GitHub + Google Drive), offline
  support, and a professional editor — built for writers and developers who live
  in their browser.
clientType: Own product / developer tool
services:
  - web-apps
  - web-optimization
role: Lead engineer + designer
industry: Developer tools / productivity
problem: >-
  Existing markdown editors are either too simple (textareas with no
  integration) or require subscriptions and desktop installs. I needed a
  web-first editor with real cloud sync, offline support, and a professional
  writing environment — without compromising on either.
solution: >-
  Built a full PWA with CodeMirror 6, bidirectional GitHub and Google Drive
  sync, Mermaid and KaTeX support, export to multiple formats, and a Service
  Worker that keeps the app fully functional offline. All state is keyed
  per-document with localStorage persistence.
impact: >-
  Production app with 2,900+ unit tests and 77%+ coverage, in active use as a
  daily tool. The PWA installs natively on any device and the offline experience
  is indistinguishable from online.
stack:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Zustand
  - CodeMirror 6
  - Hono
  - Drizzle ORM
  - Better Auth
  - Vercel
relatedProjectSlug: markview
featured: true
order: 1
lang: en
date: 2025-12-07
timeframe: 1 month
teamSize: 1
---

## What it is

MarkView is a single-page web app for people who write markdown every day —
documentation, notes, READMEs, specs — and who got tired of the trade-offs in
the existing editor landscape. It installs as a PWA, syncs to GitHub and Google
Drive, and stays usable even when the network is unreliable.

## The actual problem

The simple editors are glorified textareas: no syntax highlighting, no keyboard
shortcuts, no integration with where the writing ends up. The serious editors
(Typora, Obsidian, Bear) require installs and sometimes monthly subscriptions,
and they live outside the browser. None of them combine the three things that
mattered to me:

- A professional writing environment (CodeMirror 6 with the same engine VS Code
  uses on the web).
- Real cloud sync that does not require copy-paste between apps.
- An offline experience that feels the same as the online one.

## What I built

The whole project was a single-person build over four weeks. The interesting
parts:

- **Editor**: CodeMirror 6 with extensions for GFM, KaTeX math, Mermaid
  diagrams, YAML frontmatter, and an autocomplete for links/images.
- **Sync**: Bidirectional GitHub (browse, open, save, delete files) and Google
  Drive with auto-sync every 30 seconds. A conflict modal surfaces
  local-vs-remote divergence when both sides change.
- **Offline**: A Service Worker precaches the shell and uses CacheFirst for
  static assets and NetworkFirst for sync. The app installs natively and the
  offline experience is functionally identical to the online one.
- **Export**: Markdown, standalone HTML, PDF, and PNG/JPEG — for both
  documentation and social sharing.
- **State**: Zustand stores per responsibility (document, settings, UI, GitHub,
  GDrive, sync queue), persisted to localStorage so the offline boot path is
  fast.

## Why it works

Three numbers that explain why this is a real product and not a side project:

- **2,900+ unit tests** with 77%+ coverage. The editor, sync, and storage layers
  are tested to the point where the core flows are not in doubt.
- **Active daily use.** I have been writing in MarkView for months. If it
  breaks, I notice immediately and fix it. That is the most useful QA loop there
  is.
- **Zero open issues.** Because the testing + active use combination surfaces
  things before they ship.

The project page has the full architecture, store structure, and markdown
processing pipeline. The case study is the business-facing version of that — the
why, the trade-offs, and the outcome.
