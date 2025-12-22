---
title: Claude Code Config
description:
  Una herramienta CLI completa para instalar y gestionar configuraciones de
  Claude Code. Asistente interactivo que configura agentes IA, skills, comandos,
  servidores MCP, permisos y estándares de proyecto en minutos.
longDescription:
  Deja de copiar archivos de configuración manualmente. Este CLI detecta tu
  stack tecnológico, sugiere módulos relevantes, configura servidores MCP,
  define permisos, establece estándares de proyecto y reemplaza placeholders
  automáticamente en más de 100 módulos organizados en 23 bundles.
lang: es
category: open-source
tags: [Herramienta CLI, Desarrollo IA, TypeScript, Herramientas de Desarrollo]
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
  developmentTime: '10 días'
  startDate: 2025-12-08
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Detección de stack inconsistente - Algunos proyectos usan configuraciones
      no estándar'
    solution: 'Implementé fallbacks y detección manual con prompts'
  - problem:
      'Conflictos de placeholders - Placeholders anidados o con caracteres
      especiales rompían el reemplazo'
    solution: 'Mejoré la regex con escape de caracteres especiales'
  - problem:
      'Compatibilidad de gestores de paquetes - pnpm, npm, yarn, bun tienen
      diferencias sutiles en comandos'
    solution: 'Abstracción de comandos con adaptadores por gestor de paquetes'
  - problem:
      'Complejidad de configuración de estándares - Seis categorías con
      múltiples opciones cada una'
    solution:
      'Sistema de presets (strict, balanced, relaxed, startup, enterprise) con
      personalización por categoría'
highlights:
  - 'Más de 100 módulos organizados en 5 categorías (agentes, skills, comandos,
    docs, servidores MCP)'
  - '23 bundles preconfigurados para stacks y workflows específicos'
  - '27 servidores MCP verificados con auto-configuración'
  - 'Detección automática de stack tecnológico (framework, base de datos,
    testing, gestor de paquetes)'
  - 'Asistente de estándares de proyecto con 6 categorías y 5 presets'
  - 'Configuración de hooks pre-commit via Husky'
  - 'Personalización del estilo de respuesta (tono, verbosidad, idioma)'
  - 'Herramientas de estilo de código (EditorConfig, Biome, Prettier,
    Commitlint)'
  - '3 presets de permisos con personalización granular'
  - 'API programática para aplicaciones Node.js'
futureImprovements:
  - 'Soporte para monorepos (detectar y configurar múltiples apps)'
  - 'Interfaz web para configuración visual'
  - 'Sincronización de configuración entre proyectos'
  - 'Marketplace de módulos de la comunidad'
  - 'Generación automática de documentación'
stackRationale:
  Commander.js: 'Estándar de la industria para CLIs, excelente documentación'
  Inquirer.js: 'UX superior para prompts interactivos, checkboxes, selects'
  TypeScript:
    'Seguridad de tipos crítica para generar configuraciones correctas'
  Vitest + memfs: 'Testing de filesystem sin escribir archivos reales'
---

## Descripción del Proyecto

Configurar Claude Code para un nuevo proyecto solía tomar horas: copiar agentes,
ajustar skills, configurar servidores MCP, definir permisos, configurar
estándares, reemplazar placeholders. Cada proyecto terminaba ligeramente
diferente porque siempre se olvidaba algo.

Claude Code Config automatiza todo esto. Ejecuta un comando, responde algunas
preguntas, y obtén un entorno Claude Code completamente configurado en minutos.
El CLI detecta tu stack, sugiere módulos relevantes, configura estándares, y
maneja todo el trabajo tedioso de configuración.

## Características Principales

### Detección Inteligente de Stack

El CLI analiza tu proyecto y detecta automáticamente:

- **Gestor de paquetes**: pnpm, npm, yarn, bun
- **Framework**: React, Next.js, Astro, Hono, Express, NestJS, Fastify
- **Base de datos**: Drizzle, Prisma, Mongoose
- **Testing**: Vitest, Jest, Playwright

```bash
$ qazuor-claude-config init

Detectando configuración del proyecto...
  ✓ Gestor de paquetes: pnpm
  ✓ Framework: Hono (detectado desde dependencias)
  ✓ Base de datos: Drizzle (detectado desde scripts)
  ✓ Testing: Vitest (detectado desde devDependencies)

Bundles sugeridos basados en tu stack:
  ◉ stack-hono-drizzle
  ◉ testing-complete
```

### Arquitectura Modular

Más de 100 módulos organizados en 5 categorías:

| Tipo               | Cantidad | Propósito                                              |
| ------------------ | -------- | ------------------------------------------------------ |
| **Agentes**        | 15       | Roles de IA especializados (tech-lead, ingenieros, QA) |
| **Skills**         | 41       | Capacidades reutilizables (TDD, testing, auth)         |
| **Comandos**       | 23       | Comandos slash para workflows                          |
| **Docs**           | 21       | Guías de referencia y plantillas                       |
| **Servidores MCP** | 27       | Integraciones con herramientas externas                |

Instala solo lo que necesitas. Cada módulo es independiente pero puede
combinarse mediante bundles.

### 23 Bundles Preconfigurados

Bundles específicos por stack que instalan módulos relacionados juntos:

```bash
# Bundles de stack
stack-react-tanstack    # React + TanStack Query/Router
stack-astro-react       # Astro + React Islands
stack-hono-drizzle      # Hono + Drizzle ORM
stack-nextjs-prisma     # Next.js + Prisma
stack-express-prisma    # Express + Prisma

# Bundles por categoría
testing-complete        # Suite completa de testing
testing-minimal         # Herramientas esenciales de testing
quality-complete        # Todos los comandos de calidad
database-drizzle        # Ingeniero + skills de Drizzle
database-prisma         # Ingeniero + skills de Prisma
```

### 27 Servidores MCP Verificados

Integraciones preconfiguradas para herramientas externas:

- **Documentación y Búsqueda**: Context7, Brave Search, Perplexity
- **Bases de datos**: PostgreSQL, Neon, MySQL, Redis, Supabase
- **Control de versiones**: GitHub, GitLab, Git
- **Despliegue**: Vercel, Cloudflare, Docker, AWS
- **Testing**: Playwright, Chrome DevTools
- **Comunicación**: Slack, Linear, Notion
- **Pagos**: Stripe, Mercado Pago
- **Diseño**: Figma, Shadcn UI, Magic UI

```bash
? ¿Qué servidores MCP quieres configurar?
  ◉ github (Sugerido: detectado remote de GitHub)
  ◉ postgres (Sugerido: detectada dependencia de base de datos)
  ◯ vercel
  ◯ stripe
```

### Asistente de Estándares de Proyecto

Configura estándares a nivel de proyecto en 6 categorías con 5 presets (strict,
balanced, relaxed, startup, enterprise):

**Estándares de Código** - Estilo de indentación, comillas, punto y coma,
longitud de línea, reglas TypeScript, requisitos de JSDoc

**Estándares de Testing** - Objetivos de cobertura (60-95%), requisitos de TDD,
patrones de test, preferencias de ubicación de archivos

**Estándares de Documentación** - Niveles de JSDoc, requisitos de ejemplos,
formatos de changelog, políticas de comentarios

**Estándares de Diseño** - Framework CSS, librería de componentes, nivel de
accesibilidad (A/AA/AAA), soporte de modo oscuro

**Estándares de Seguridad** - Patrón de autenticación, validación de entrada,
protección CSRF, rate limiting

**Estándares de Rendimiento** - Objetivos de Core Web Vitals (LCP, FID, CLS),
límites de tamaño de bundle y tiempo de respuesta de API

### Configuración de Hooks Pre-commit

Hooks de Git configurables via Husky con tres presets:

- **Minimal**: Solo lint
- **Standard**: Lint + typecheck
- **Strict**: Lint + typecheck + tests

Soporta Biome o ESLint, verificación de TypeScript, ejecución de tests en
archivos staged, y comandos de validación personalizados.

### Personalización del Estilo de Respuesta

Personaliza cómo se comunica Claude:

- **Tono**: Amigable, profesional, formal, estricto, mentor
- **Verbosidad**: Conciso, balanceado, detallado
- **Idioma**: Inglés, español, o auto-detectar
- **Reporte de errores**: Comprensivo, neutral, o directo
- **Proactividad**: Nivel de sugerencias no solicitadas

Cuatro presets disponibles: friendly, professional, strict, mentor.

### Control Granular de Permisos

Tres presets de permisos con opciones de personalización:

- **Default**: Balance entre seguridad y productividad
- **Trust**: Operaciones completas excepto git push
- **Restrictive**: Solo lectura para codebases sensibles

```json
{
  "allow": ["Read", "Edit", "Write", "Bash(pnpm run *)", "Bash(git status)"],
  "deny": ["Bash(rm -rf *)", "Bash(git push --force)"]
}
```

### Reemplazo Automático de Placeholders

Las plantillas incluyen placeholders como `{{PROJECT_NAME}}`, `{{GITHUB_ORG}}`,
`{{DOMAIN}}`. El CLI:

1. Detecta valores desde package.json y git
2. Solicita valores faltantes
3. Reemplaza en todos los archivos automáticamente
4. Guarda preferencias en `~/.claude/defaults.json` para reutilizar

```bash
Escaneando archivos en busca de placeholders...
  .claude/CLAUDE.md - 12 reemplazos
  .claude/agents/tech-lead.md - 3 reemplazos
  .claude/commands/commit.md - 2 reemplazos

✓ 47 archivos actualizados con 156 reemplazos
```

### Herramientas de Estilo de Código

Configuración integrada para consistencia en el desarrollo:

- **EditorConfig**: Reglas agnósticas del editor (indentación, fin de línea)
- **Biome**: Linting y formateo rápido
- **Prettier**: Formateo de código opinionado
- **Commitlint**: Validación de commits convencionales

## Comandos

### init

Asistente de configuración completo para nuevos proyectos:

```bash
qazuor-claude-config init [path]
```

Opciones: `--bundle`, `--template`, `--dry-run`, `--force`

### list

Muestra módulos, bundles o servidores MCP disponibles:

```bash
qazuor-claude-config list agents
qazuor-claude-config list skills
qazuor-claude-config list bundles
qazuor-claude-config list mcp
```

### add / remove

Gestiona módulos individuales:

```bash
qazuor-claude-config add agent tech-lead
qazuor-claude-config add skill api-testing
qazuor-claude-config remove command review-code
```

### configure

Reconfigura placeholders de plantillas:

```bash
qazuor-claude-config configure [--scan] [--preview] [--category <name>]
```

### standards

Configura estándares del proyecto:

```bash
qazuor-claude-config standards [--preset <name>] [--category <name>]
```

### status

Muestra el estado actual de la configuración:

```bash
qazuor-claude-config status [--verbose] [--json]
```

### update

Actualiza configuración y módulos:

```bash
qazuor-claude-config update [--modules] [--config]
```

## Generadores Adicionales

Además de módulos, el CLI puede generar:

- **CLAUDE.md**: Archivo de instrucciones dinámico del proyecto
- **Estilo de Código**: EditorConfig, Biome, Prettier, Commitlint
- **Git Hooks**: Husky con commit-msg y pre-commit
- **CI/CD**: Workflows de GitHub Actions
- **VSCode**: Configuraciones y recomendaciones de extensiones

## Detalles Técnicos

### Requisitos

- Node.js 18.0+
- pnpm, npm, yarn, o bun
- Git (opcional pero recomendado)

### Instalación

```bash
# Instalación global (recomendada)
pnpm add -g @qazuor/claude-code-config

# O ejecutar directamente sin instalación
npx @qazuor/claude-code-config init
```

### Stack

- **Runtime**: Node.js con ESM
- **Lenguaje**: TypeScript 5.7+ (modo estricto)
- **Framework CLI**: Commander.js
- **Prompts**: Inquirer.js
- **Estilos**: chalk, ora, figlet
- **Testing**: Vitest con memfs

### API Programática

Disponible como paquete npm para aplicaciones Node.js, proporcionando funciones
para:

- Leer/escribir configuración
- Cargar registro de módulos
- Detectar tipos de proyecto
- Procesar plantillas
- Resolver bundles
- Gestionar placeholders

Tipos de TypeScript incluidos para toda la funcionalidad.

### Estado

Desarrollo activo con nuevas características añadidas regularmente. Estable para
uso en producción.

## Por Qué Construí Esto

Cada nuevo proyecto significaba horas de configuración repetitiva. Copiar
agentes de otro proyecto, ajustar configuraciones, configurar servidores MCP,
reemplazar placeholders manualmente. Cada proyecto terminaba ligeramente
diferente.

Esta herramienta resuelve eso: configuración consistente y automatizada en
minutos en lugar de horas. Es opinionada (TypeScript, TDD, arquitectura en
capas) pero lo suficientemente modular para adaptarse a diferentes stacks.

El objetivo es dedicar tiempo a resolver problemas, no a configurar
herramientas.
