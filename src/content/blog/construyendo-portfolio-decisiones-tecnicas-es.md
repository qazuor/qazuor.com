---
title:
  'Construyendo mi portfolio desde cero: decisiones técnicas y lecciones
  aprendidas'
slug: 'construyendo-portfolio-decisiones-tecnicas'
lang: es
excerpt:
  'Un recorrido completo por el desarrollo de qazuor.com: stack técnico,
  arquitectura, features implementadas, problemas reales que encontré y cómo los
  resolví.'
publishDate: 2025-11-11
tags: [portfolio, astro, react, typescript, arquitectura, performance]
readTime: 25 min read
draft: false
category: development
image: ./_images/portfolio-design.jpg
---

Después de 741 _commits_ y meses de desarrollo (intercalados con trabajo real),
finalmente tengo mi portfolio en producción. No quería hacer _"otro sitio de
portfolio genérico"_, así que me propuse construir algo que sirviera como carta
de presentación técnica, hub de contenido, y laboratorio de ideas.

En este post cuento todo: las decisiones técnicas, los problemas que encontré,
cómo los resolví, y qué aprendí en el proceso. Es largo, pero si estás pensando
en armar tu propio portfolio o querés ver cómo pienso un proyecto de principio a
fin, acá está todo.

---

## El stack técnico

### Por qué Astro

La decisión más importante fue elegir **Astro** como _framework_ principal. Un
portfolio no necesita _server-side rendering_ dinámico — quiero páginas
pre-renderizadas, rápidas, cacheables.

Las razones principales:

- **SSG nativo** — Páginas estáticas por defecto, sin JavaScript innecesario
- **Islands Architecture** — Componentes interactivos solo donde los necesito
- **Content Collections** — Sistema de contenido _type-safe_ integrado, perfecto
  para blog y proyectos
- **Performance por defecto** — Astro optimiza agresivamente sin que tenga que
  pelear contra el _framework_

Consideré Next.js y Remix, pero ambos están optimizados para aplicaciones
dinámicas. Para un sitio mayormente estático con algunas islas interactivas,
Astro era la elección obvia.

### React para las islas interactivas

Uso **React 19** para los componentes que necesitan interactividad: _Command
Palette_, carrusel de testimonios, filtros de proyectos, _radar chart_ de
_skills_, y _timeline_ interactivo.

El truco está en usar las directivas de Astro para controlar cuándo se hidrata
cada componente:

```astro
<!-- Se hidrata cuando entra al viewport -->
<TestimonialsCarousel client:visible />

<!-- Se hidrata inmediatamente - para componentes críticos -->
<CommandPalette client:load />

<!-- Se hidrata cuando el browser está idle -->
<RadarChart client:idle />
```

### TypeScript estricto

**TypeScript 5.7** con configuración estricta. Nada de `any`. Cuando no sé el
tipo, uso `unknown` con _type guards_.

```ts
// ❌ Prohibido
function processData(data: any) { ... }

// ✅ Correcto
function processData(data: unknown) {
  if (isValidData(data)) {
    // Ahora TypeScript sabe qué es
  }
}
```

El beneficio: puedo refactorizar con confianza. Si cambio un tipo, TypeScript me
muestra todos los lugares que rompo.

### El resto del stack

- **Tailwind CSS** — _Utility-first_, rápido de iterar
- **CSS + Web Animations API** — Para animaciones (migré desde GSAP, más sobre
  esto abajo)
- **Fuse.js** — Búsqueda _fuzzy_ client-side
- **Biome** — _Linting_ y _formatting_ (reemplazo de ESLint + Prettier)
- **Vitest + Playwright** — _Testing_ unitario y E2E

---

## Arquitectura del proyecto

### Estructura de carpetas

```
qazuor.com/
├── src/
│   ├── components/          # 120+ componentes organizados
│   │   ├── sections/        # Secciones de página
│   │   ├── ui/              # Componentes reutilizables
│   │   ├── interactive/     # Componentes React
│   │   └── seo/             # JSON-LD y meta tags
│   ├── content/             # 108+ archivos de contenido
│   │   ├── blog/
│   │   ├── projects/
│   │   ├── snippets/
│   │   └── testimonials/
│   ├── integrations/        # Integraciones custom de Astro
│   ├── scripts/             # Scripts de animación y comportamiento
│   └── styles/              # CSS global y generado
└── public/                  # Assets estáticos
```

### Content Collections

Astro Content Collections me da tipado estático para todo el contenido. Definí 7
colecciones (blog, projects, snippets, css-tricks, tools, useful-links,
testimonials).

```ts
// src/content/config.ts (simplificado)
const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      publishDate: z.date(),
      tags: z.array(z.string()),
      image: image(),
      series: z
        .object({
          id: z.string(),
          name: z.string(),
          part: z.number(),
        })
        .optional(),
    }),
});
```

El beneficio: si me olvido de un campo requerido o pongo un tipo incorrecto,
Astro me avisa en _build time_. No hay _posts_ rotos en producción.

### Integraciones custom

Creé 5 integraciones custom de Astro para automatizar tareas en _build time_:

1. **Search Index Generator** — Genera índice de búsqueda
2. **Social Blog Data** — Exporta _metadata_ para redes sociales
3. **Testimonial Avatars Downloader** — Descarga avatares externos a local
4. **Color Interpolation Generator** — Genera gradientes entre secciones
5. **Giscus Theme Generator** — Genera temas custom para comentarios

---

## Features principales

### Internacionalización (i18n)

El sitio soporta **inglés y español**. Cada página tiene su versión en ambos
idiomas con rutas prefijadas (`/en/blog`, `/es/blog`).

Un problema que encontré: inicialmente intenté _lazy-load_ de traducciones, pero
en SSG esto no aporta beneficios. Astro pre-bundlea todo en _build time_, así
que el _lazy loading_ solo agregaba complejidad sin ganancia. Aprendí esto
después de perder horas en una _"optimización"_ que no optimizaba nada.

### Command Palette

`Ctrl+K` (o `Cmd+K` en Mac) abre un buscador global con búsqueda _fuzzy_ usando
Fuse.js. Resultados agrupados por tipo, navegación con teclado, y atajos rápidos
para páginas principales.

### Timeline interactivo

24 eventos de mi carrera desde 1980 hasta 2025. El componente tiene 3 capas:

1. **TimelineWrapper** (Astro) — Detecta el tema y mapea colores
2. **TimelineContent** (React) — Layout scrollable con controles
3. **useTimelineAnimation** (Hook) — Estado, auto-play, gestos touch

Optimización importante: los iconos del _timeline_ pasaron de 393KB en JS
_chunks_ a 2.6KB usando SVG _sprites_. Una reducción del 99.3%.

### Blog con navegación inteligente

- **Table of Contents** — Sidebar fijo con _scroll spy_ usando
  IntersectionObserver
- **Posts relacionados** — Algoritmo de relevancia basado en _tags_ y categoría
- **Series** — Posts pueden pertenecer a una serie con navegación prev/next

### Divisores animados

Entre cada sección hay divisores SVG animados con gradientes de color
interpolados. Una integración genera CSS en _build time_ con 5 pasos intermedios
para cada transición de color.

---

## Problemas reales y cómo los resolví

Esta es la parte más valiosa del post. Todos estos problemas vienen del
historial de _git_ real del proyecto.

### La migración de GSAP a CSS nativo

**El problema:** GSAP + Lenis sumaban ~34KB de JavaScript gzipped. Para un
portfolio, era demasiado peso para animaciones que podían hacerse de otra forma.

**La solución:** En el commit `58ffe5d` hice una migración completa:

| Antes               | Después                    |
| ------------------- | -------------------------- |
| GSAP timeline       | Web Animations API         |
| GSAP ScrollTrigger  | IntersectionObserver + CSS |
| Lenis smooth scroll | `scroll-behavior: smooth`  |
| Custom scroll hooks | `scrollIntoView()` nativo  |

Eliminé 1530 líneas de código y agregué 445. El resultado: misma funcionalidad,
34KB menos de JavaScript.

```ts
// Antes: hook custom con GSAP
const { ref } = useScrollAnimation({
  animation: 'fadeInUp',
  duration: 0.8,
});

// Después: CSS + IntersectionObserver
// src/scripts/scroll-reveal.ts
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-visible');
    }
  });
});
```

### DOM mutations matando la performance mobile

**El problema:** El score de _performance_ mobile era bajo (~60) por _"Avoid
large layout shifts"_ y _"Reduce DOM size"_.

**La causa:** Varios componentes usaban JavaScript para animaciones que mutaban
el DOM constantemente:

- Typewriter effect
- Rotating roles en el hero
- Trust badges marquee
- Testimonials carousel

**La solución:** Migré todo a animaciones CSS-only:

```css
/* Antes: JavaScript mutando el DOM cada frame */
/* Después: CSS animation */
.typewriter-text {
  overflow: hidden;
  border-right: 2px solid;
  white-space: nowrap;
  animation:
    typing 3.5s steps(40, end),
    blink 0.75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

Commits relevantes: `a079b41`, `1f4ba25`, `33af274`, `3c1b720`.

### Hydration mismatches con React

**El problema:** Errores de _hydration_ en consola: el servidor renderizaba una
cosa y el cliente esperaba otra.

**La causa:** Componentes que dependían de `window` o `localStorage` durante el
render inicial.

**La solución:** Guards de SSR y valores por defecto seguros:

```tsx
// ❌ Causa hydration mismatch
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

// ✅ Correcto
const [theme, setTheme] = useState('dark');
useEffect(() => {
  setTheme(localStorage.getItem('theme') || 'dark');
}, []);
```

Commit: `096d590`.

### LinkedIn 403 en avatares de testimonios

**El problema:** Los avatares de testimonios venían de LinkedIn, pero en cada
_build_ LinkedIn devolvía 403 Forbidden.

**La causa:** LinkedIn bloquea _requests_ automatizados a sus CDN de imágenes.

**La solución:** Descargué los avatares una vez y los comiteé al repo. Creé una
integración que usa _fallback_ a local cuando el _download_ falla:

```ts
// integrations/testimonial-avatars-downloader.ts
async function downloadAvatar(url: string, filename: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    // ... save to local
  } catch {
    console.log(`Using git fallback for ${filename}`);
    // Avatar ya existe en el repo
  }
}
```

Commits: `7a9fd59`, `1612f8e`.

### Touch targets demasiado pequeños

**El problema:** Lighthouse reportaba _"Touch targets are not sized
appropriately"_ para los dots del carousel y timeline.

**La solución:** Expandí el área de toque a 44px (el mínimo recomendado por
WCAG):

```css
.carousel-dot {
  /* Visual: 8px */
  width: 8px;
  height: 8px;

  /* Touch target: 44px con padding */
  padding: 18px;
  margin: -18px;
}
```

Commits: `b2e5617`, `a02083a`.

### View Transitions y scripts que no se re-ejecutaban

**El problema:** Después de navegar con View Transitions, los _scripts_ no se
volvían a ejecutar. Esto rompía _callouts_ del blog, inicialización de
componentes, y cualquier script que dependiera del contenido nuevo.

**La solución:** Un sistema de _lifecycle_ centralizado que dispara eventos
custom después del _swap_:

```ts
// El componente de transición dispara un evento custom
document.addEventListener('astro:before-swap', (event) => {
  event.swap = async () => {
    await animateOverlayIn();
    event.defaultSwap();
    document.dispatchEvent(new CustomEvent('qazuor:content-ready'));
    await animateOverlayOut();
  };
});

// Los componentes escuchan este evento
document.addEventListener('qazuor:content-ready', () => {
  enhanceCallouts();
});
```

Este fue un _rabbit hole_ de días. La documentación de Astro no cubre bien este
caso.

---

## Optimización de performance

### Métricas actuales

**Desktop:**

- Performance Score: 100
- LCP: 0.7s
- CLS: 0
- FCP: 0.5s
- Speed Index: 0.7s

**Mobile:**

- Performance Score: 89
- LCP: ~2.0s
- CLS: 0
- Speed Index: 2.0s

_Métricas obtenidas de
[PageSpeed Insights](https://pagespeed.web.dev/analysis/https-qazuor-com-es/ufo8n8lokb).
Los valores pueden variar según las condiciones de red._

### Estrategias que funcionaron

**Critical CSS inline** — ~2KB de estilos críticos del hero en
`<style is:inline>`.

**Font preloading selectivo** — Solo 3 fonts críticas (Inter 400/600/700). El
resto se carga después.

**Image optimization** — Sharp para optimización en _build_, preload de la
imagen LCP, lazy loading para _below-the-fold_.

**CSS-only animations** — Como mencioné arriba, migrar de JS a CSS eliminó DOM
mutations y mejoró el score mobile significativamente.

### Lo que NO funcionó

**Lazy loading de traducciones en SSG** — En Astro SSG todo se resuelve en
_build time_. El _lazy loading_ solo agregó complejidad sin beneficio real.

**Demasiados chunks pequeños** — Inicialmente tenía _chunks_ muy granulares.
Esto causaba más _requests_ HTTP que el beneficio de cacheabilidad.

---

## Testing

### Estrategia

- **Unit tests (Vitest):** Lógica de utilidades, _helpers_, transformaciones
- **Component tests:** Componentes React aislados
- **E2E tests (Playwright):** Flujos completos de usuario
- **Accessibility tests:** WCAG compliance con axe-core

5 suites E2E principales: Accessibility, Command Palette, Contact Form,
Homepage, Services.

```ts
// tests/e2e/accessibility.spec.ts
test('homepage meets WCAG AA', async ({ page }) => {
  await page.goto('/en/');
  const violations = await new AxeBuilder({ page }).analyze();
  expect(violations.violations).toHaveLength(0);
});
```

---

## Estadísticas del proyecto

- **741 commits** desde septiembre 2025
- **120+ componentes** organizados por tipo
- **108+ archivos de contenido** (blog, projects, snippets, etc.)
- **5 integraciones custom** de Astro
- **2 idiomas** con traducciones completas
- **~34KB menos de JS** después de remover GSAP/Lenis

---

## Lecciones aprendidas

### Lo que haría igual

- **Astro para contenido estático** — La mejor decisión del proyecto
- **TypeScript estricto** — Me salvó de incontables bugs
- **Content Collections** — _Type-safe content_ es un _game changer_
- **CSS-first animations** — Debería haber empezado así, no migrar después

### Lo que haría diferente

- **Empezar con menos features** — El _scope creep_ es real
- **Definir design system antes** — Gasté tiempo rehaciendo componentes
- **Mobile-first desde el día 1** — Evité refactorizar después para mobile
- **No usar librerías de animación pesadas** — La migración de GSAP fue
  innecesaria si hubiera empezado con CSS

### Consejos si estás armando tu portfolio

1. **No copies plantillas** — Armá algo que refleje cómo pensás
2. **Priorizá performance** — Un portfolio lento es una mala primera impresión
3. **Incluí contenido real** — Blog posts, proyectos, código que muestre tu
   trabajo
4. **Hacelo mantenible** — Vas a querer actualizarlo. Si es un _pain_, no lo vas
   a hacer
5. **Medí todo** — Analytics, Lighthouse, Core Web Vitals. Lo que no medís, no
   mejorás

---

## Próximos pasos

El portfolio está en producción pero sigue evolucionando:

- Agregar más proyectos con _case studies_ detallados
- Implementar _newsletter_
- Agregar más CSS tricks interactivos
- Experimentar con nuevas animaciones CSS

---

## Cierre

Construir un portfolio desde cero es un proyecto que nunca _"termina"_. Pero
llegar a este punto, con un sitio funcional que representa bien lo que hago, fue
un ejercicio valioso.

Si algo te sirve de este post, o tenés preguntas sobre alguna implementación
específica, [escribime](/es/contact). El código es _open source_ en
[GitHub](https://github.com/qazuor/qazuor.com), así que también podés explorar
el repo directamente.

El mejor portfolio es el que demuestra que podés construir algo real, no solo
que sabés copiar tutoriales.

_— qazuor_
