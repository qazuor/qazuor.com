---
title: 'MarkView: un editor markdown que funciona donde vos estés'
summary: >-
  Un editor markdown PWA con sync en la nube (GitHub + Google Drive), soporte
  offline y un editor profesional — hecho para escritores y developers que viven
  en el navegador.
clientType: Producto propio / developer tool
services:
  - web-apps
  - web-optimization
role: Lead engineer + diseñador
industry: Developer tools / productividad
problem: >-
  Los editores markdown existentes son demasiado simples (textareas sin
  integración) o requieren suscripciones e instalaciones de escritorio.
  Necesitaba un editor web-first con sync real en la nube, soporte offline y un
  entorno de escritura profesional — sin comprometer ninguno de los dos.
solution: >-
  Construí una PWA completa con CodeMirror 6, sync bidireccional con GitHub y
  Google Drive, soporte para Mermaid y KaTeX, exportación a múltiples formatos y
  un Service Worker que mantiene la app 100% funcional offline. Todo el estado
  está keyado por documento con persistencia en localStorage.
impact: >-
  App en producción con 2.900+ tests unitarios y 77%+ de coverage, en uso activo
  como herramienta diaria. La PWA se instala nativamente en cualquier
  dispositivo y la experiencia offline es indistinguible de online.
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
lang: es
date: 2025-12-07
timeframe: 1 mes
teamSize: 1
---

## Qué es

MarkView es una single-page web app para gente que escribe markdown todos los
días — documentación, notas, READMEs, specs — y se cansó de los trade-offs del
resto del mercado. Se instala como PWA, sincroniza con GitHub y Google Drive, y
sigue siendo usable incluso cuando la red está floja.

## El problema real

Los editores simples son textareas glorificados: sin resaltado de sintaxis, sin
atajos de teclado, sin integración con el lugar donde la escritura termina
viviendo. Los editores serios (Typora, Obsidian, Bear) requieren instalación y a
veces suscripciones mensuales, y viven afuera del navegante. Ninguno combina las
tres cosas que me importaban:

- Un entorno de escritura profesional (CodeMirror 6, el mismo motor que usa VS
  Code en la web).
- Sync real en la nube, sin copy-paste entre apps.
- Una experiencia offline que se sienta igual que la online.

## Qué construí

El proyecto entero fue un build single-person en cuatro semanas. Las partes
interesantes:

- **Editor**: CodeMirror 6 con extensiones para GFM, KaTeX math, diagramas
  Mermaid, YAML frontmatter y autocomplete para links/imágenes.
- **Sync**: Bidireccional con GitHub (explorar, abrir, guardar, borrar archivos)
  y Google Drive con auto-sync cada 30 segundos. Un modal de conflictos surface
  la divergencia local-vs-remoto cuando ambos lados cambian.
- **Offline**: Un Service Worker pre-cachea el shell y usa CacheFirst para
  assets estáticos y NetworkFirst para el sync. La app se instala nativamente y
  la experiencia offline es funcionalmente idéntica a la online.
- **Export**: Markdown, HTML standalone, PDF y PNG/JPEG — para documentación y
  para compartir en redes.
- **Estado**: Stores de Zustand por responsabilidad (documento, settings, UI,
  GitHub, GDrive, cola de sync), persistidos en localStorage para que el boot
  offline sea rápido.

## Por qué funciona

Tres números que explican por qué esto es un producto real y no un side project:

- **2.900+ tests unitarios** con 77%+ de coverage. Las capas de editor, sync y
  storage están testeadas al punto en que los flujos core no están en duda.
- **Uso diario activo.** Llevo meses escribiendo en MarkView. Si algo se rompe,
  lo noto inmediatamente y lo arreglo. Ese es el mejor loop de QA que existe.
- **Cero issues abiertos.** Porque la combinación de testing + uso activo
  surface los problemas antes de que lleguen a producción.

La página del proyecto tiene la arquitectura completa, la estructura de stores y
el pipeline de procesamiento de markdown. El caso de estudio es la versión
business-facing de eso — el por qué, los trade-offs y el outcome.
