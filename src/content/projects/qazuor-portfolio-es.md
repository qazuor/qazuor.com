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
technologies: [Astro, React, TypeScript, Tailwind CSS, GSAP, Lenis, Vercel]
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
---

## Descripción del Proyecto

Este portfolio representa mi compromiso con construir experiencias web rápidas,
accesibles y bien elaboradas. Cada decisión, desde el stack tecnológico hasta la
interacción más pequeña, fue tomada pensando en el rendimiento y la experiencia
del usuario.

El sitio sirve tanto como vitrina de mi trabajo como un blog técnico donde
comparto insights sobre desarrollo web.

## Rendimiento Primero

Construido con optimización agresiva de rendimiento como principio fundamental:

### Core Web Vitals

- **LCP**: ~271ms (objetivo: <2.5s)
- **FCP**: ~271ms (objetivo: <1.8s)
- **CLS**: 0.00 (objetivo: <0.1)
- **Bundle JS**: 308KB gzipped (38% bajo el presupuesto de 500KB)
- **Bundle CSS**: 40KB gzipped (60% bajo el presupuesto de 100KB)

### Técnicas de Optimización

- **CSS crítico inline**: Estilos esenciales cargan inmediatamente
- **Precarga de fuentes**: Fuentes web con estrategia swap para renderizado
  rápido de texto
- **Optimización de imágenes**: Formatos modernos con hints de prioridad de
  fetch
- **Consolidación de sprites SVG**: 99.3% de reducción en assets de íconos
- **Lazy loading estratégico**: Componentes bajo el fold difieren hidratación

## Estándares de Accesibilidad

Cumplimiento WCAG 2.1 Nivel AA en todo el sitio:

- Estructura HTML semántica
- Navegación por teclado para todos los elementos interactivos
- Contenido optimizado para lectores de pantalla
- Ratios de contraste de color suficientes
- Indicadores de foco en todos los elementos enfocables
- Skip links para contenido principal

## Características Principales

### Soporte Bilingüe

Localización completa en inglés y español con cambio de idioma fluido.

### Modo Oscuro

Tema oscuro por defecto con capacidad de cambio. Respeta preferencias del
sistema y persiste la elección del usuario.

### View Transitions API

Transiciones de página suaves para una experiencia de navegación similar a una
app nativa.

### Paleta de Comandos

Navegación rápida via atajo de teclado `Ctrl+K`, permitiendo acceso veloz a
cualquier página o acción.

### Progressive Web App

Instalable como PWA con web manifest y soporte offline.

### Optimización SEO

- Marcado de datos estructurados (JSON-LD)
- Tarjetas Open Graph y Twitter
- Generación automática de sitemap
- URLs canónicas

## Arquitectura Técnica

### Stack

- **Astro**: Generación de Sitios Estáticos para rendimiento óptimo
- **React 19**: Arquitectura Islands para componentes interactivos
- **TypeScript**: Type safety completo
- **Tailwind CSS**: Estilos utility-first
- **GSAP + Lenis**: Animaciones y scroll suaves
- **Vercel**: Deployment edge con CDN global

### Gestión de Contenido

Astro Content Collections para contenido type-safe:

- Posts de blog con soporte de series
- Showcases de proyectos
- Testimonios
- Snippets de código y trucos CSS
- Links útiles curados

### Diseño Responsive

Enfoque mobile-first con breakpoints optimizados para:

- Teléfonos móviles (320px+)
- Tablets (768px+)
- Escritorios (1024px+)
- Pantallas grandes (1440px+)

## Filosofía de Diseño

El diseño balancea minimalismo con personalidad:

- Tipografía limpia con la familia de fuentes Inter
- Escala de espaciado consistente
- Animaciones sutiles que mejoran en lugar de distraer
- Tema oscuro optimizado para reducir fatiga visual
- Jerarquía visual que guía al usuario

## Open Source

Todo el código es open source, sirviendo como implementación de referencia para
sitios Astro modernos con foco en rendimiento y accesibilidad.
