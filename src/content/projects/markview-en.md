---
title: MarkView
description:
  Modern Markdown editor with real-time preview, multiple themes, cloud
  integration with GitHub and Google Drive, and offline support as a PWA.
longDescription:
  A complete markdown editor that combines the power of CodeMirror 6 with live
  preview, cloud service synchronization, export to multiple formats, and an
  offline-first experience. Designed for writers and developers who need a
  professional tool without complications.
lang: en
category: open-source
tags: [Editor, Markdown, PWA, Full-Stack, Cloud Integration]
technologies:
  [
    React,
    TypeScript,
    Vite,
    Tailwind CSS,
    Zustand,
    CodeMirror 6,
    Hono,
    Drizzle ORM,
    Better Auth,
    Vercel,
  ]
images:
  - ./_images/markview/1.png
  - ./_images/markview/2.png
  - ./_images/markview/3.png
  - ./_images/markview/4.png
  - ./_images/markview/5.png
mainImage: ./_images/markview/1.png
githubUrl: https://github.com/qazuor/markview
demoUrl: https://qazuor-markview.vercel.app
featured: true
publishDate: 2026-01-05
order: 2
status: production
metrics:
  developmentTime: '1 month'
  startDate: 2025-12-07
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Scroll synchronization between editor and preview - Markdown content does
      not map 1:1 with rendered HTML'
    solution:
      'A line numbers system in rehype that maps each HTML element to its source
      line'
  - problem:
      'Cloud editing conflicts - Simultaneous changes in local and remote caused
      data loss'
    solution:
      'Conflict detection system with resolution modal that shows both versions'
  - problem:
      'Preview performance with long documents - Re-rendering Mermaid and KaTeX
      was slow'
    solution:
      'Cache of rendered diagrams and incremental processing of only modified
      blocks'
  - problem:
      'Tab management with version history - Each tab needs its own independent
      history'
    solution:
      'Architecture of separate stores per document with localStorage
      persistence'
highlights:
  - 'CodeMirror 6 editor with syntax highlighting and contextual autocomplete'
  - '8 preview themes: GitHub, GitLab, Notion, Obsidian, Stack Overflow, etc.'
  - 'Bidirectional GitHub integration (browse, open, save, delete)'
  - 'Google Drive integration with auto-sync every 30 seconds'
  - 'Export to Markdown, standalone HTML, PDF and PNG/JPEG'
  - 'Installable PWA with complete offline support'
  - 'Version history per document with diff viewer'
  - 'Support for Mermaid (diagrams) and KaTeX (math equations)'
  - 'Interactive onboarding with feature tour'
futureImprovements:
  - 'Local File System Access API to work with system files'
  - 'Real-time collaboration with multiple users'
  - 'Plugin system to extend functionality'
  - 'Open local file/folder with save'
  - 'Desktop app with Tauri'
  - 'Additional integrations: Dropbox, OneDrive, GitLab'
stackRationale:
  CodeMirror 6:
    'The most extensible and performant editor for the web, modular architecture'
  Zustand: 'Simple and predictable state, perfect for multiple stores'
  Hono: 'Ultra-lightweight HTTP framework, ideal for serverless API'
  Better Auth: 'OAuth 2.0 without vendor lock-in, easy to configure'
  Drizzle + Neon: 'Serverless PostgreSQL with complete type-safety'
---

## Project Description

I've been using markdown editors for quite some time. I tried several
alternatives. Each one has something good, but none had everything I needed: a
powerful editor, with support for mermaid and code highlighting, real-time
preview with customizable styles, direct integration with my GitHub repos, or my
Gdrive, the ability to work offline, and work sync to continue on any of my
devices exactly as I had left it.

MarkView was born from that need. I wanted an editor that feels like a
professional tool, not like a glorified text field. An editor where I can write
documentation, take notes, and sync everything with my projects without jumping
between applications/devices.

## The Problem

Existing markdown editors fall into two categories:

**The simple ones** offer a textarea with preview. It works, but without decent
syntax highlighting, without keyboard shortcuts, without integration with
anything.

**The complex ones** are desktop/mobile applications that require installation,
configuration, and sometimes monthly subscription. They work well but generally
aren't where I want them: in the browser, accessible from any device.

MarkView solves this by offering:

- **Professional editor** with CodeMirror 6, the same engine used by VS Code Web
  and many IDEs
- **Live preview** with themes that replicate the style of GitHub, Notion,
  Obsidian and more
- **Cloud native** with direct synchronization to GitHub and Google Drive
- **Offline-first** as an installable PWA that works without connection

## Main Features

### Powerful Editor

The heart of MarkView is CodeMirror 6 with custom extensions:

- Syntax highlighting for GFM (GitHub Flavored Markdown)
- Contextual autocomplete for links, images and emojis
- Keyboard shortcuts for formatting (bold, italic, lists, code)
- Search and replace with regex support
- Line numbers and minimap for long documents
- Real-time linting with remark-lint

### Real-Time Preview

The preview panel updates as you type, with synchronized scroll that keeps both
panels aligned. You can choose between 8 themes:

- GitHub Light/Dark
- GitLab
- Notion
- Obsidian
- Stack Overflow
- Dev.to

### Advanced Markdown Support

MarkView isn't limited to basic markdown:

- **Mermaid** for flowcharts, sequences, Gantt
- **KaTeX** for LaTeX math equations
- **Callouts** GitHub and Obsidian style (note, warning, tip)
- **YAML Frontmatter** with highlighting and validation
- **Task lists** with interactive checkboxes

### Cloud Integration

**GitHub:**

- Browse repositories and branches
- Open markdown files directly
- Save with custom commits
- Create new files in any location
- Delete files from the repository

**Google Drive:**

- Browse folders and files
- Auto-sync every 30 seconds after editing
- Manual save with Ctrl+S
- Sync status indicator
- Create folders on-the-fly

### Document Management

- Multiple simultaneous tabs
- Version history with diff viewer
- Drag & drop of .md, .txt, .mdx files
- Configurable auto-save in localStorage
- File explorer with folders

### Export

- **Markdown** (.md) with clean formatting
- **HTML** standalone with embedded styles
- **PDF** optimized for printing
- **PNG/JPEG** for sharing on social media

### Offline-First PWA

MarkView works completely offline. It installs as a native app on any device,
automatically caches resources, and syncs when connection returns.

## Technical Architecture

### Frontend

| Technology     | What for?                      |
| -------------- | ------------------------------ |
| React 18       | UI components                  |
| TypeScript 5.7 | Type safety                    |
| Vite 6         | Dev server and bundling        |
| CodeMirror 6   | Code editor                    |
| Zustand 5      | Global state                   |
| Tailwind CSS 3 | Styles                         |
| unified/remark | Processing pipeline            |
| Shiki          | Syntax highlighting in preview |
| Mermaid        | Diagrams                       |
| KaTeX          | Math equations                 |
| i18next        | Internationalization (EN/ES)   |
| Radix UI       | Accessible components          |

### Backend

| Technology  | What for?             |
| ----------- | --------------------- |
| Hono 4      | Lightweight HTTP API  |
| Better Auth | OAuth 2.0             |
| Drizzle     | Type-safe ORM         |
| Neon        | Serverless PostgreSQL |
| Vercel      | Deployment            |

### Store Structure

State management uses Zustand with stores separated by responsibility:

- **documentStore** - Documents, tabs, content
- **settingsStore** - User preferences
- **uiStore** - UI state (modals, sidebar)
- **githubStore** - GitHub connection state
- **gdriveStore** - Google Drive connection state
- **syncStore** - Sync queue

### Markdown Processing

Processing uses unified with chained plugins:

```
Markdown → remark-parse → remark-gfm → remark-math → remark-frontmatter
         → rehype → rehype-katex → rehype-shiki → rehype-sanitize → HTML
```

## Current Status

MarkView is in production with all core features working. The test suite has
2920+ unit tests with 77%+ coverage. Development will continue actively, with
improvements that I need myself or are requested.

## Why I Built This

I wanted a markdown editor that I could use on any device, that syncs with my
GitHub projects without issues, and that works offline when I'm in some boring
place without connection wanting to tinker.

Existing alternatives are either too simple, or require subscriptions, or don't
have the integrations I need. MarkView is exactly what I personally needed, and
that I hope will be useful to more people.

The goal is not to compete with any other tool, but to have a web-first
alternative that works well for my specific work.
