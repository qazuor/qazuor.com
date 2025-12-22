---
title: Claude Code Config
description:
  A comprehensive CLI tool for installing and managing Claude Code
  configurations. Interactive wizard that sets up AI agents, skills, commands,
  MCP servers, permissions, and project standards in minutes.
longDescription:
  Stop copying configuration files manually. This CLI detects your tech stack,
  suggests relevant modules, configures MCP servers, defines permissions, sets
  up project standards, and replaces placeholders automatically across 100+
  modules organized in 23 bundles.
lang: en
category: open-source
tags: [CLI Tool, AI Development, TypeScript, Developer Tools]
technologies: [Node.js, TypeScript, Commander.js, Inquirer.js, Claude Code]
images:
  - ./_images/claudeCodeConfig/1.png
  - ./_images/claudeCodeConfig/2.png
  - ./_images/claudeCodeConfig/3.png
  - ./_images/claudeCodeConfig/4.png
  - ./_images/claudeCodeConfig/5.png
  - ./_images/claudeCodeConfig/6.png
  - ./_images/claudeCodeConfig/7.png
  - ./_images/claudeCodeConfig/8.png
  - ./_images/claudeCodeConfig/9.png
  - ./_images/claudeCodeConfig/10.png
mainImage: ./_images/claudeCodeConfig/1.png
githubUrl: https://github.com/qazuor/claude-code-config
npmUrl: https://www.npmjs.com/package/@qazuor/claude-code-config
featured: true
publishDate: 2025-12-11
order: 1
status: production
metrics:
  commits: 142
  linesOfCode: 23216
  developmentTime: '10 days'
  startDate: 2025-12-08
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Inconsistent stack detection - Some projects use non-standard
      configurations'
    solution: 'Implemented fallbacks and manual detection with prompts'
  - problem:
      'Placeholder conflicts - Nested or special character placeholders broke
      replacement'
    solution: 'Improved regex with special character escaping'
  - problem:
      'Package manager compatibility - pnpm, npm, yarn, bun have subtle command
      differences'
    solution: 'Command abstraction with per-package-manager adapters'
  - problem:
      'Standards configuration complexity - Six categories with multiple options
      each'
    solution:
      'Preset system (strict, balanced, relaxed, startup, enterprise) with
      per-category customization'
highlights:
  - '100+ modules organized in 5 categories (agents, skills, commands, docs, MCP
    servers)'
  - '23 pre-configured bundles for specific stacks and workflows'
  - '27 verified MCP servers with auto-configuration'
  - 'Automatic tech stack detection (framework, database, testing, package
    manager)'
  - '6-category project standards wizard with 5 presets'
  - 'Pre-commit hooks configuration via Husky'
  - 'Response style customization (tone, verbosity, language)'
  - 'Code style tooling (EditorConfig, Biome, Prettier, Commitlint)'
  - '3 permission presets with granular customization'
  - 'Programmatic API for Node.js applications'
futureImprovements:
  - 'Monorepo support (detect and configure multiple apps)'
  - 'Web interface for visual configuration'
  - 'Configuration sync between projects'
  - 'Community module marketplace'
  - 'Automatic documentation generation'
stackRationale:
  Commander.js: 'Industry standard for CLIs, excellent documentation'
  Inquirer.js: 'Superior UX for interactive prompts, checkboxes, selects'
  TypeScript: 'Type safety critical for generating correct configurations'
  Vitest + memfs: 'Filesystem testing without writing real files'
---

## Project Description

Configuring Claude Code for a new project used to take hours: copying agents,
adjusting skills, setting up MCP servers, defining permissions, configuring
standards, replacing placeholders. Every project ended up slightly different
because something was always forgotten.

Claude Code Config automates all of this. Run one command, answer a few
questions, and get a fully configured Claude Code environment in minutes. The
CLI detects your stack, suggests relevant modules, configures standards, and
handles all the tedious configuration work.

## Key Features

### Smart Stack Detection

The CLI analyzes your project and automatically detects:

- **Package manager**: pnpm, npm, yarn, bun
- **Framework**: React, Next.js, Astro, Hono, Express, NestJS, Fastify
- **Database**: Drizzle, Prisma, Mongoose
- **Testing**: Vitest, Jest, Playwright

```bash
$ qazuor-claude-config init

Detecting project setup...
  ✓ Package manager: pnpm
  ✓ Framework: Hono (detected from dependencies)
  ✓ Database: Drizzle (detected from scripts)
  ✓ Testing: Vitest (detected from devDependencies)

Suggested bundles based on your stack:
  ◉ stack-hono-drizzle
  ◉ testing-complete
```

### Modular Architecture

100+ modules organized into 5 categories:

| Type            | Count | Purpose                                         |
| --------------- | ----- | ----------------------------------------------- |
| **Agents**      | 15    | Specialized AI roles (tech-lead, engineers, QA) |
| **Skills**      | 41    | Reusable capabilities (TDD, testing, auth)      |
| **Commands**    | 23    | Slash commands for workflows                    |
| **Docs**        | 21    | Reference guides and templates                  |
| **MCP Servers** | 27    | External tool integrations                      |

Install only what you need. Each module is independent but can be combined
through bundles.

### 23 Pre-configured Bundles

Stack-specific bundles that install related modules together:

```bash
# Stack bundles
stack-react-tanstack    # React + TanStack Query/Router
stack-astro-react       # Astro + React Islands
stack-hono-drizzle      # Hono + Drizzle ORM
stack-nextjs-prisma     # Next.js + Prisma
stack-express-prisma    # Express + Prisma

# Category bundles
testing-complete        # Full testing suite
testing-minimal         # Essential testing tools
quality-complete        # All quality commands
database-drizzle        # Drizzle engineer + skills
database-prisma         # Prisma engineer + skills
```

### 27 Verified MCP Servers

Pre-configured integrations for external tools:

- **Documentation & Search**: Context7, Brave Search, Perplexity
- **Databases**: PostgreSQL, Neon, MySQL, Redis, Supabase
- **Version Control**: GitHub, GitLab, Git
- **Deployment**: Vercel, Cloudflare, Docker, AWS
- **Testing**: Playwright, Chrome DevTools
- **Communication**: Slack, Linear, Notion
- **Payments**: Stripe, Mercado Pago
- **Design**: Figma, Shadcn UI, Magic UI

```bash
? Which MCP servers do you want to configure?
  ◉ github (Suggested: detected GitHub remote)
  ◉ postgres (Suggested: detected database dependency)
  ◯ vercel
  ◯ stripe
```

### Project Standards Wizard

Configure project-wide standards across 6 categories with 5 presets (strict,
balanced, relaxed, startup, enterprise):

**Code Standards** - Indent style, quotes, semicolons, line length, TypeScript
rules, JSDoc requirements

**Testing Standards** - Coverage targets (60-95%), TDD requirements, test
patterns, file location preferences

**Documentation Standards** - JSDoc levels, example requirements, changelog
formats, comment policies

**Design Standards** - CSS framework, component library, accessibility level
(A/AA/AAA), dark mode support

**Security Standards** - Authentication pattern, input validation, CSRF
protection, rate limiting

**Performance Standards** - Core Web Vitals targets (LCP, FID, CLS), bundle size
and API response time limits

### Pre-commit Hooks Configuration

Configurable Git hooks via Husky with three presets:

- **Minimal**: Lint only
- **Standard**: Lint + typecheck
- **Strict**: Lint + typecheck + tests

Supports Biome or ESLint, TypeScript checking, test execution on staged files,
and custom validation commands.

### Response Style Customization

Customize how Claude communicates:

- **Tone**: Friendly, professional, formal, strict, mentor
- **Verbosity**: Concise, balanced, detailed
- **Language**: English, Spanish, or auto-detect
- **Error reporting**: Supportive, neutral, or direct
- **Proactivity**: Level of unsolicited suggestions

Four presets available: friendly, professional, strict, mentor.

### Granular Permission Control

Three permission presets with customization options:

- **Default**: Balanced security and productivity
- **Trust**: Full operations except git push
- **Restrictive**: Read-only for sensitive codebases

```json
{
  "allow": ["Read", "Edit", "Write", "Bash(pnpm run *)", "Bash(git status)"],
  "deny": ["Bash(rm -rf *)", "Bash(git push --force)"]
}
```

### Automatic Placeholder Replacement

Templates include placeholders like `{{PROJECT_NAME}}`, `{{GITHUB_ORG}}`,
`{{DOMAIN}}`. The CLI:

1. Detects values from package.json and git
2. Prompts for missing values
3. Replaces across all files automatically
4. Saves preferences in `~/.claude/defaults.json` for reuse

```bash
Scanning files for placeholders...
  .claude/CLAUDE.md - 12 replacements
  .claude/agents/tech-lead.md - 3 replacements
  .claude/commands/commit.md - 2 replacements

✓ 47 files updated with 156 replacements
```

### Code Style Tooling

Integrated configuration for development consistency:

- **EditorConfig**: Editor-agnostic rules (indent, line endings)
- **Biome**: Fast linting and formatting
- **Prettier**: Opinionated code formatting
- **Commitlint**: Conventional commit validation

## Commands

### init

Complete setup wizard for new projects:

```bash
qazuor-claude-config init [path]
```

Options: `--bundle`, `--template`, `--dry-run`, `--force`

### list

Display available modules, bundles, or MCP servers:

```bash
qazuor-claude-config list agents
qazuor-claude-config list skills
qazuor-claude-config list bundles
qazuor-claude-config list mcp
```

### add / remove

Manage individual modules:

```bash
qazuor-claude-config add agent tech-lead
qazuor-claude-config add skill api-testing
qazuor-claude-config remove command review-code
```

### configure

Reconfigure template placeholders:

```bash
qazuor-claude-config configure [--scan] [--preview] [--category <name>]
```

### standards

Configure project standards:

```bash
qazuor-claude-config standards [--preset <name>] [--category <name>]
```

### status

Show current configuration:

```bash
qazuor-claude-config status [--verbose] [--json]
```

### update

Update configuration and modules:

```bash
qazuor-claude-config update [--modules] [--config]
```

## Additional Generators

Beyond modules, the CLI can generate:

- **CLAUDE.md**: Dynamic project instructions file
- **Code Style**: EditorConfig, Biome, Prettier, Commitlint
- **Git Hooks**: Husky with commit-msg and pre-commit
- **CI/CD**: GitHub Actions workflows
- **VSCode**: Settings and extension recommendations

## Technical Details

### Requirements

- Node.js 18.0+
- pnpm, npm, yarn, or bun
- Git (optional but recommended)

### Installation

```bash
# Global installation (recommended)
pnpm add -g @qazuor/claude-code-config

# Or run directly without installation
npx @qazuor/claude-code-config init
```

### Stack

- **Runtime**: Node.js with ESM
- **Language**: TypeScript 5.7+ (strict mode)
- **CLI Framework**: Commander.js
- **Prompts**: Inquirer.js
- **Styling**: chalk, ora, figlet
- **Testing**: Vitest with memfs

### Programmatic API

Available as an npm package for Node.js applications, providing functions for:

- Reading/writing configuration
- Loading module registry
- Detecting project types
- Processing templates
- Resolving bundles
- Managing placeholders

TypeScript types included for all functionality.

### Status

Active development with new features being added regularly. Stable for
production use.

## Why I Built This

Every new project meant hours of repetitive configuration. Copy agents from
another project, adjust settings, configure MCP servers, replace placeholders
manually. Each project ended up slightly different.

This tool solves that: consistent, automated configuration in minutes instead of
hours. It's opinionated (TypeScript, TDD, layered architecture) but modular
enough to adapt to different stacks.

The goal is to spend time solving problems, not configuring tools.
