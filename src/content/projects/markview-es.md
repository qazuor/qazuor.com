---
title: MarkView
description:
  Editor de Markdown moderno con preview en tiempo real, múltiples temas,
  integración cloud con GitHub y Google Drive, y soporte offline como PWA.
longDescription:
  Un editor markdown completo que combina la potencia de CodeMirror 6 con
  preview en vivo, sincronización con servicios cloud, exportación a múltiples
  formatos y una experiencia offline-first. Diseñado para escritores y
  desarrolladores que necesitan una herramienta profesional sin complicaciones.
lang: es
category: open-source
tags: [Editor, Markdown, PWA, Full-Stack, Integración Cloud]
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
  developmentTime: '1 mes'
  startDate: 2025-12-07
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'Sincronización de scroll entre editor y preview - El contenido markdown
      no mapea 1:1 con el HTML renderizado'
    solution:
      'Un sistema de line numbers en rehype que mapea cada elemento HTML a su
      línea de origen'
  - problem:
      'Conflictos de edición cloud - Cambios simultáneos en local y remoto
      causaban pérdida de datos'
    solution:
      'Sistema de detección de conflictos con modal de resolución que muestra
      ambas versiones'
  - problem:
      'Rendimiento del preview con documentos largos - Re-render de Mermaid y
      KaTeX era lento'
    solution:
      'Cache de diagramas renderizados y procesamiento incremental solo de
      bloques modificados'
  - problem:
      'Gestión de pestañas con historial de versiones - Cada pestaña necesita su
      propio historial independiente'
    solution:
      'Arquitectura de stores separados por documento con persistencia en
      localStorage'
highlights:
  - 'Editor CodeMirror 6 con resaltado de sintaxis y autocompletado contextual'
  - '8 temas de preview: GitHub, GitLab, Notion, Obsidian, Stack Overflow, etc.'
  - 'Integración bidireccional con GitHub (explorar, abrir, guardar, eliminar)'
  - 'Integración con Google Drive con auto-sync cada 30 segundos'
  - 'Exportación a Markdown, HTML standalone, PDF y PNG/JPEG'
  - 'PWA instalable con soporte offline completo'
  - 'Historial de versiones por documento con visor de diferencias'
  - 'Soporte para Mermaid (diagramas) y KaTeX (ecuaciones matemáticas)'
  - 'Onboarding interactivo con tour de características'
futureImprovements:
  - 'Local File System Access API para trabajar con archivos del sistema'
  - 'Colaboración en tiempo real con múltiples usuarios'
  - 'Sistema de plugins para extender funcionalidad'
  - 'Abrir local file/folder con guardado'
  - 'Desktop app con Tauri'
  - 'Integraciones adicionales: Dropbox, OneDrive, GitLab'
stackRationale:
  CodeMirror 6:
    'El editor más extensible y performante para la web, arquitectura modular'
  Zustand: 'Estado simple y predecible, perfecto para múltiples stores'
  Hono: 'Framework HTTP ultraligero, ideal para API serverless'
  Better Auth: 'OAuth 2.0 sin vendor lock-in, fácil de configurar'
  Drizzle + Neon: 'PostgreSQL serverless con type-safety completo'
---

## Descripción del Proyecto

Llevo bastante tiempo usando editores markdown. Probé varias alternativas. Cada
uno tiene algo bueno, pero ninguno tenía todo lo que necesitaba: un editor
potente, con soporte para mermaid y code highlighting, preview en tiempo real
con estilos personalizables, integración directa con mis repos de GitHub, o mi
Gdrive, la capacidad de trabajar offline, y sincro del trabajo para poder
continuar en cualquiera de mis dispositivos exactamente igual a lo que lo había
dejado.

MarkView nació de esa necesidad. Quería un editor que se sienta como una
herramienta profesional, no como un campo de texto glorificado. Un editor donde
pueda escribir documentación, tomar notas, y sincronizar todo con mis proyectos
sin saltar entre aplicaciones/dispositivos.

## El Problema

Los editores markdown existentes caen en dos categorías:

**Los simples** ofrecen un textarea con preview. Funciona, pero sin resaltado de
sintaxis decente, sin atajos de teclado, sin integración con nada.

**Los complejos** son aplicaciones desktop/mobile que requieren instalación,
configuración, y a veces suscripción mensual. Funcionan bien pero en general no
están donde las quiero: en el navegador, accesibles desde cualquier dispositivo.

MarkView resuelve esto ofreciendo:

- **Editor profesional** con CodeMirror 6, el mismo motor que usan VS Code Web y
  muchos IDEs
- **Preview en vivo** con temas que replican el estilo de GitHub, Notion,
  Obsidian y más
- **Cloud nativo** con sincronización directa a GitHub y Google Drive
- **Offline-first** como PWA instalable que funciona sin conexión

## Características Principales

### Editor Potente

El corazón de MarkView es CodeMirror 6 con extensiones personalizadas:

- Resaltado de sintaxis para GFM (GitHub Flavored Markdown)
- Autocompletado contextual para links, imágenes y emojis
- Atajos de teclado para formato (negrita, cursiva, listas, código)
- Búsqueda y reemplazo con soporte regex
- Números de línea y minimap para documentos largos
- Linting en tiempo real con remark-lint

### Preview en Tiempo Real

El panel de preview se actualiza mientras escribís, con scroll sincronizado que
mantiene ambos paneles alineados. Podés elegir entre 8 temas:

- GitHub Light/Dark
- GitLab
- Notion
- Obsidian
- Stack Overflow
- Dev.to

### Soporte Avanzado de Markdown

MarkView no se limita a markdown básico:

- **Mermaid** para diagramas de flujo, secuencias, Gantt
- **KaTeX** para ecuaciones matemáticas LaTeX
- **Callouts** estilo GitHub y Obsidian (note, warning, tip)
- **Frontmatter YAML** con resaltado y validación
- **Task lists** con checkboxes interactivos

### Integración Cloud

**GitHub:**

- Explorar repositorios y ramas
- Abrir archivos markdown directamente
- Guardar con commits personalizados
- Crear archivos nuevos en cualquier ubicación
- Eliminar archivos del repositorio

**Google Drive:**

- Explorar carpetas y archivos
- Auto-sync cada 30 segundos después de editar
- Guardado manual con Ctrl+S
- Indicador de estado de sincronización
- Crear carpetas on-the-fly

### Gestión de Documentos

- Múltiples pestañas simultáneas
- Historial de versiones con visor de diferencias (diff)
- Drag & drop de archivos .md, .txt, .mdx
- Auto-guardado configurable en localStorage
- Explorador de archivos con carpetas

### Exportación

- **Markdown** (.md) con formato limpio
- **HTML** standalone con estilos embebidos
- **PDF** optimizado para impresión
- **PNG/JPEG** para compartir en redes sociales

### PWA Offline-First

MarkView funciona completamente offline. Se instala como app nativa en cualquier
dispositivo, cachea recursos automáticamente, y sincroniza cuando vuelve la
conexión.

## Arquitectura Técnica

### Frontend

| Tecnología     | Para que?                      |
| -------------- | ------------------------------ |
| React 18       | UI components                  |
| TypeScript 5.7 | Type safety                    |
| Vite 6         | Dev server y bundling          |
| CodeMirror 6   | Editor de código               |
| Zustand 5      | Estado global                  |
| Tailwind CSS 3 | Estilos                        |
| unified/remark | Pipeline de procesamiento      |
| Shiki          | Syntax highlighting en preview |
| Mermaid        | Diagramas                      |
| KaTeX          | Ecuaciones matemáticas         |
| i18next        | Internacionalización (EN/ES)   |
| Radix UI       | Componentes accesibles         |

### Backend

| Tecnología  | Para que?             |
| ----------- | --------------------- |
| Hono 4      | API HTTP ligera       |
| Better Auth | OAuth 2.0             |
| Drizzle     | ORM type-safe         |
| Neon        | PostgreSQL serverless |
| Vercel      | Deployment            |

### Estructura de Stores

La gestión de estado usa Zustand con stores separados por responsabilidad:

- **documentStore** - Documentos, pestañas, contenido
- **settingsStore** - Preferencias del usuario
- **uiStore** - Estado de UI (modales, sidebar)
- **githubStore** - Estado de conexión GitHub
- **gdriveStore** - Estado de conexión Google Drive
- **syncStore** - Cola de sincronización

### Procesado de Markdown

El procesamiento usa unified con plugins encadenados:

```
Markdown → remark-parse → remark-gfm → remark-math → remark-frontmatter
         → rehype → rehype-katex → rehype-shiki → rehype-sanitize → HTML
```

## Estado Actual

MarkView está en producción con todas las features core funcionando. La suite de
tests tiene 2920+ tests unitarios con 77%+ de coverage. El desarrollo continuará
activo, con mejoras que yo mismo vaya necesitando o vayan solicitando.

## Por Qué Construí Esto

Quería un editor markdown que pueda usar en cualquier dispositivo, que
sincronice con mis proyectos de GitHub sin problemas, y que funcione offline
cuando estoy en algún lugar sin conexión aburrido con ganas de meter mano.

Las alternativas existentes o son demasiado simples, o requieren suscripciones,
o no tienen las integraciones que necesito. MarkView es exactamente lo que yo
personalmente necesitaba, y que espero les sirva a más personas.

El objetivo no es competir con ninguna otra tool, sino tener una alternativa
web-first que funcione bien para mi trabajo específico.
