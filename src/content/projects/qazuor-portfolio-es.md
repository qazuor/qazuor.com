---
title: qazuor.com
description:
  Portfolio personal y blog técnico construido con Astro y React. Optimizado
  para rendimiento excepcional, accesibilidad y diseño responsive.
longDescription:
  Un portfolio bilingüe que muestra experiencia en desarrollo web con foco en
  altos estándares de rendimiento, cumplimiento de accesibilidad WCAG AA y
  tecnologías web modernas.
lang: es
category: open-source
tags: [Portfolio, Blog, Astro, Rendimiento]
technologies:
  [
    Astro,
    React 19,
    TypeScript,
    Tailwind CSS,
    Embla Carousel,
    Giscus,
    Fuse.js,
    Vitest,
    Playwright,
    Vercel,
  ]
images:
  - ./_images/qazuor.com/1.png
  - ./_images/qazuor.com/2.png
  - ./_images/qazuor.com/3.png
  - ./_images/qazuor.com/4.png
mainImage: ./_images/qazuor.com/1.png
githubUrl: https://github.com/qazuor/qazuor.com
demoUrl: https://qazuor.com
featured: true
publishDate: 2025-12-01
order: 3
status: production
metrics:
  commits: 750
  linesOfCode: 43731
  developmentTime: '3 meses'
  startDate: 2025-09-24
  contributors: 1
  openIssues: 0
challenges:
  - problem:
      'SVG sprites vs componentes de íconos - Componentes individuales añadían
      393KB de JS'
    solution:
      'Migración a sprite SVG inline (2.6KB), logrando 99.3% de reducción'
  - problem:
      'Lazy loading en SSG - import.meta.glob() pre-empaqueta todo en build time'
    solution:
      'Abandonar lazy loading de i18n ya que no proporcionaba beneficios en
      contexto SSG'
  - problem:
      'Sistema de comentarios integrado - Necesitaba comentarios sin backend
      propio'
    solution:
      'Integración de Giscus con GitHub Discussions y temas personalizados que
      matchean el diseño'
  - problem:
      'Testing visual cross-browser - Detectar regresiones visuales en múltiples
      navegadores'
    solution: 'Playwright con visual snapshots en Chromium, Firefox y WebKit'
highlights:
  - 'LCP ~184ms, CLS 0.00, TTFB ~48ms - Core Web Vitals excepcionales'
  - '38K+ líneas de código con cobertura de tests'
  - '15+ posts de blog con sistema de series y comentarios'
  - 'Paleta de comandos (Ctrl+K) con búsqueda fuzzy via Fuse.js'
  - 'PWA instalable con soporte offline'
  - 'Sección Goodies: CSS tricks, snippets, links útiles y herramientas'
  - 'Galería de proyectos con lightbox y carrusel'
  - 'Formulario de contacto funcional con Resend'
  - 'Cumplimiento de accesibilidad WCAG 2.1 Nivel AA'
futureImprovements:
  - 'Integración de newsletter'
  - 'Analytics enfocado en privacidad (Plausible o Fathom)'
  - 'Más animaciones de scroll reveal'
  - 'Sistema de likes en posts'
stackRationale:
  Astro:
    'Rendimiento óptimo con 0 JS por defecto, perfecto para sitios de contenido'
  React 19:
    'Islands architecture para componentes interactivos sin penalizar el resto'
  Embla Carousel:
    'Carruseles ligeros y accesibles, mejor que soluciones pesadas'
  Giscus: 'Comentarios via GitHub Discussions, sin backend propio'
  Fuse.js: 'Búsqueda fuzzy ligera para la paleta de comandos'
  Vitest + Playwright: 'Testing unitario rápido + E2E cross-browser'
---

## Descripción del Proyecto

Este portfolio representa mi compromiso con construir experiencias web rápidas,
accesibles y bien elaboradas. Cada decisión, desde el stack tecnológico hasta la
interacción más pequeña, fue tomada pensando en el rendimiento y la experiencia
del usuario.

El sitio sirve como vitrina de mi trabajo, blog técnico donde comparto insights
sobre desarrollo web, y una sección de recursos útiles para otros
desarrolladores.

## Rendimiento Primero

Construido con optimización agresiva de rendimiento como principio fundamental:

### Core Web Vitals (Diciembre 2025)

- **LCP**: ~184ms (objetivo: <2.5s) ✅
- **FCP**: ~271ms (objetivo: <1.8s) ✅
- **CLS**: 0.00 (objetivo: <0.1) ✅
- **TTFB**: ~48ms ✅
- **Lighthouse Performance**: 97/100 desktop, 87/100 mobile

### Técnicas de Optimización

- **CSS crítico inline**: Estilos esenciales cargan inmediatamente (~2KB)
- **Precarga de fuentes**: Solo 3 variantes críticas (Inter 400/600/700)
- **Optimización de imágenes**: WebP/AVIF con lazy loading y priority hints
- **Consolidación de sprites SVG**: 99.3% de reducción en assets de íconos
- **Compresión**: Brotli y gzip en todos los assets

## Estándares de Accesibilidad

Cumplimiento WCAG 2.1 Nivel AA verificado con Lighthouse y axe-core:

- Estructura HTML semántica
- Navegación por teclado para todos los elementos interactivos
- Contenido optimizado para lectores de pantalla
- Ratios de contraste de color suficientes
- Indicadores de foco visibles
- Skip links para contenido principal
- Score de accesibilidad: 97/100

## Características Principales

### Blog Técnico

15+ posts organizados en series temáticas:

- Sistema de series con navegación entre posts relacionados
- Comentarios integrados via Giscus (GitHub Discussions)
- Syntax highlighting con Expressive Code
- Table of contents automático
- Tiempo de lectura estimado

### Paleta de Comandos

Navegación rápida via `Ctrl+K` con búsqueda fuzzy:

- Búsqueda instantánea con Fuse.js
- Acceso rápido a páginas, posts y proyectos
- Atajos de teclado para acciones comunes
- Diseño inspirado en VS Code/Raycast

### Sección Goodies

Recursos útiles para desarrolladores:

- **CSS Tricks**: Efectos y técnicas CSS interesantes
- **Snippets**: Código reutilizable organizado por categoría
- **Links Útiles**: Recursos curados de desarrollo web
- **Herramientas**: Utilidades y generadores

### Galería de Proyectos

Showcase interactivo de proyectos:

- Carrusel con Embla Carousel
- Lightbox para ver imágenes en detalle
- Métricas de proyecto (commits, líneas de código, tiempo)
- Stack rationale explicando decisiones técnicas

### Soporte Bilingüe

Localización completa en inglés y español:

- Cambio de idioma fluido sin recargar
- URLs localizadas (`/es/...`, `/en/...`)
- Contenido traducido (no auto-traducido)

### Modo Oscuro

Tema oscuro optimizado:

- Respeta preferencias del sistema
- Persiste elección del usuario
- Transición suave entre temas
- Temas de Giscus sincronizados

### Progressive Web App

Instalable como aplicación:

- Web manifest completo
- Service worker para offline básico
- Iconos optimizados para todas las plataformas

## Arquitectura Técnica

### Stack Principal

- **Astro 5**: SSG con Islands Architecture
- **React 19**: Componentes interactivos (carruseles, formularios, lightbox)
- **TypeScript**: Type safety completo
- **Tailwind CSS**: Utility-first con tema personalizado
- **Vercel**: Edge deployment con CDN global

### Testing

Suite de testing comprehensiva:

- **Vitest**: Tests unitarios y de componentes
- **Playwright**: E2E y visual regression tests
- **axe-core**: Tests de accesibilidad automatizados
- **Lighthouse CI**: Performance budgets en CI

### Calidad de Código

- **Biome**: Linting y formatting rápido
- **Husky + lint-staged**: Pre-commit hooks
- **Commitlint**: Commits convencionales
- **TypeScript strict mode**: Sin any implícitos

### Gestión de Contenido

Astro Content Collections para contenido type-safe:

- Posts de blog con frontmatter validado
- Proyectos con métricas y metadata
- Testimonios
- Snippets y CSS tricks
- Links útiles categorizados

## Diseño Responsive

Mobile-first con breakpoints optimizados:

- Móviles: 320px+
- Tablets: 768px+
- Escritorios: 1024px+
- Pantallas grandes: 1440px+

## SEO y Social

- Structured data (JSON-LD) para proyectos, posts y persona
- Open Graph y Twitter cards dinámicas
- Sitemap XML automático
- Canonical URLs
- robots.txt optimizado

## Open Source

Todo el código es open source, sirviendo como implementación de referencia para
portfolios Astro modernos con foco en rendimiento, accesibilidad y buenas
prácticas.
