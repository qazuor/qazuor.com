---
title: 'Claude Code Config: de horas de setup a un install de un comando'
summary: >-
  Un CLI interactivo que detecta el stack del proyecto e instala una
  configuración completa de Claude Code — agentes, skills, servidores MCP,
  permisos, estándares — en minutos, no en horas.
clientType: Open-source developer tool
services:
  - automation-integration
role: Lead engineer
industry: Developer tooling / IA
problem: >-
  Cada proyecto nuevo de Claude Code empezaba con las mismas horas de setup
  manual: copiar agentes, configurar skills, montar servidores MCP, definir
  permisos, reemplazar placeholders. El resultado siempre era un poco distinto,
  y la configuración siempre estaba un poco rota.
solution: >-
  Construí un CLI en Node.js con un wizard interactivo que detecta el stack del
  proyecto, sugiere módulos relevantes de los 100+ disponibles, configura 27
  servidores MCP verificados y corre reemplazo automático de placeholders en
  todo el proyecto. Los 23 bundles pre-configurados instalan grupos de módulos
  relacionados juntos.
impact: >-
  100+ módulos publicados en 23 bundles, 27 integraciones MCP verificadas y 142
  commits en los primeros 10 días de desarrollo activo. Usado en producción por
  mis propios proyectos para estandarizar el setup de cada repo nuevo.
stack:
  - Node.js
  - TypeScript
  - Commander.js
  - Inquirer.js
  - Vitest
relatedProjectSlug: claude-code-config
featured: true
order: 2
lang: es
date: 2025-12-08
timeframe: 10 días
teamSize: 1
---

## Qué es

`@qazuor/claude-code-config` es un CLI publicado en npm que se corre una vez por
proyecto y produce un entorno Claude Code completamente configurado: agentes,
skills, slash commands, servidores MCP, permisos, code style, Git hooks y
estándares de proyecto. Reemplaza el loop manual de copy-paste con un wizard
dirigido por detección automática.

## El problema real

Configurar Claude Code solía verse así en cada proyecto nuevo:

1. Copiar la carpeta `.claude/` del último proyecto.
2. Darse cuenta de que dos tercios de los agentes y skills no aplican.
3. Editar manualmente los permisos para el nuevo package manager y framework.
4. Configurar manualmente cada servidor MCP (Context7, GitHub, Postgres, Vercel,
   Stripe) con las env vars correctas.
5. Reemplazar manualmente `{{PROJECT_NAME}}`, `{{GITHUB_ORG}}`, `{{DOMAIN}}` en
   los templates.
6. Darse cuenta de que se olvidó de actualizar el commit-msg hook de nuevo.

Cada proyecto terminaba un poco distinto, y la configuración siempre estaba un
poco rota — generalmente de una forma que aparecía semanas después cuando Claude
intentaba usar una tool que faltaba.

## Qué construí

El CLI es una app Node.js / TypeScript con tres capas:

- **Detección**: Recorre `package.json`, la config de git y el filesystem para
  inferir el package manager, framework, base de datos y librería de testing.
  Tiene fallback a prompts interactivos cuando la detección es ambigua.
- **Wiring**: Selecciona e instala desde un registro de 100+ módulos repartidos
  en 5 categorías. Los 23 bundles pre-configurados agrupan módulos relacionados
  (por ejemplo, `stack-hono-drizzle`, `testing-complete`).
- **Reemplazo**: Escanea los archivos instalados en busca de tokens
  `{{PLACEHOLDER}}`, pide los valores faltantes y los reescribe in-place. Guarda
  las preferencias en `~/.claude/defaults.json` para la próxima vez.

Los 27 servidores MCP verificados se entregan con el command, args y env vars
correctas — así, agregar GitHub, Postgres o Vercel es un checkbox en lugar de
una inmersión en la docs.

## Por qué funciona

Tres números que explican el valor:

- **100+ módulos, 23 bundles.** El catálogo cubre las combinaciones realistas
  que un equipo senior va a usar. Los módulos nuevos se enchufan sin cambiar la
  superficie del CLI.
- **142 commits, 10 días.** El primer corte se construyó y publicó en 10 días.
  Eso es lo que pasa cuando el developer que usa la tool es también el developer
  que la construye.
- **Cero issues abiertos en producción.** En uso en producción por cada repo
  nuevo que arranco. La consistencia es todo el punto.

La página del proyecto tiene el catálogo completo de módulos, el wizard de
estándares, el API programático y el engine de placeholders. El caso de estudio
es la versión business-facing de eso — el dolor que elimina, los trade-offs
involucrados y el outcome.
