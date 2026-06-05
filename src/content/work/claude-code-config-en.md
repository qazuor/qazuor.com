---
title: 'Claude Code Config: from hours of setup to a one-command install'
summary: >-
  An interactive CLI that detects your project stack and installs a complete
  Claude Code configuration — agents, skills, MCP servers, permissions, project
  standards — in minutes, not hours.
clientType: Open-source developer tool
services:
  - automation-integration
role: Lead engineer
industry: Developer tooling / AI
problem: >-
  Every new Claude Code project started with the same hours of manual setup:
  copy agents, configure skills, set up MCP servers, define permissions, replace
  placeholders. The result was always slightly different, and the configuration
  was always slightly broken.
solution: >-
  Built a Node.js CLI with an interactive wizard that detects the project stack,
  suggests relevant modules from 100+ available, configures 27 verified MCP
  servers, and runs automatic placeholder replacement across the entire project.
  The 23 pre-configured bundles install groups of related modules together.
impact: >-
  100+ modules shipped in 23 bundles, 27 verified MCP integrations, and 142
  commits in the first 10 days of active development. Used in production by my
  own projects to standardize every new repo's setup.
stack:
  - Node.js
  - TypeScript
  - Commander.js
  - Inquirer.js
  - Vitest
relatedProjectSlug: claude-code-config
featured: true
order: 2
lang: en
date: 2025-12-08
timeframe: 10 days
teamSize: 1
---

## What it is

`@qazuor/claude-code-config` is an npm-published CLI that runs once per project
and produces a fully configured Claude Code environment: agents, skills, slash
commands, MCP servers, permissions, code style, Git hooks, and project
standards. It replaces the manual copy-paste loop with a detection-driven
wizard.

## The actual problem

Configuring Claude Code used to look like this on every new project:

1. Copy the `.claude/` folder from the last project.
2. Realize two-thirds of the agents and skills do not apply.
3. Manually edit permissions for the new package manager and framework.
4. Manually configure each MCP server (Context7, GitHub, Postgres, Vercel,
   Stripe) with the right env vars.
5. Manually replace `{{PROJECT_NAME}}`, `{{GITHUB_ORG}}`, `{{DOMAIN}}`
   placeholders across the templates.
6. Realize you forgot to update the commit-msg hook again.

Each project ended up slightly different, and the configuration was always
slightly broken — usually in a way that surfaced weeks later when Claude tried
to use a missing tool.

## What I built

The CLI is a Node.js / TypeScript app with three layers:

- **Detection**: Walks `package.json`, git config, and the filesystem to infer
  the package manager, framework, database, and testing library. Falls back to
  interactive prompts when detection is ambiguous.
- **Wiring**: Selects and installs from a registry of 100+ modules across 5
  categories. The 23 pre-configured bundles group related modules together
  (e.g., `stack-hono-drizzle`, `testing-complete`).
- **Replacement**: Scans the installed files for `{{PLACEHOLDER}}` tokens,
  prompts for missing values, and rewrites them in place. Saves preferences to
  `~/.claude/defaults.json` for next time.

The 27 verified MCP servers ship with the right command, args, and required env
vars — so adding GitHub, Postgres, or Vercel is a checkbox instead of a docs
dive.

## Why it works

Three numbers that explain the value:

- **100+ modules, 23 bundles.** The catalog covers the realistic combinations a
  senior team will reach for. New modules slot in without changing the CLI
  surface.
- **142 commits, 10 days.** The first cut was built and shipped in 10 days. That
  is what happens when the developer using the tool is also the developer
  building it.
- **Zero open issues in production.** Used in production by every new repo I
  start. Consistency is the whole point.

The project page has the full module catalog, the standards wizard, the
programmatic API, and the placeholders engine. The case study is the
business-facing version of that — the pain it removes, the trade-offs involved,
and the outcome.
