# Guía Completa de Theming - qazuor.com

Esta guía explica **todo** sobre el sistema de colores y theming del sitio. Está
diseñada para que cualquier desarrollador pueda entender y modificar los colores
del sitio de forma segura.

---

## Tabla de Contenidos

1. [Resumen Rápido](#resumen-rápido)
2. [Arquitectura del Sistema de Colores](#arquitectura-del-sistema-de-colores)
3. [Archivos Principales](#archivos-principales)
4. [Variables CSS por Categoría](#variables-css-por-categoría)
5. [Componentes y sus Variables](#componentes-y-sus-variables)
6. [Cómo Cambiar el Color Primario](#cómo-cambiar-el-color-primario)
7. [Cómo Cambiar Colores de Servicios](#cómo-cambiar-colores-de-servicios)
8. [Cómo Cambiar Colores de Secciones](#cómo-cambiar-colores-de-secciones)
9. [Colores que NO Debes Cambiar](#colores-que-no-debes-cambiar)
10. [Paletas Predefinidas](#paletas-predefinidas)
11. [Herramientas y Verificación](#herramientas-y-verificación)

---

## Resumen Rápido

### Si necesitas cambiar el color primario del sitio:

1. **`src/styles/global.css`** - Variables principales (líneas ~80-115 y
   ~170-210)
2. **`src/layouts/BaseLayout.astro`** - Critical CSS (líneas ~217 y ~229)

### Si necesitas cambiar colores de servicios:

1. **`src/data/serviceColors.ts`** - Colores para efectos pixel
2. **`src/styles/global.css`** - Variables CSS de servicios

### Si necesitas cambiar colores de secciones:

1. **`src/data/colors.ts`** - Fuente de verdad
2. El archivo `generated-colors.css` se genera automáticamente

---

## Arquitectura del Sistema de Colores

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SISTEMA DE COLORES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐    │
│  │  global.css      │     │  colors.ts       │     │  serviceColors.ts│    │
│  │  (CSS Variables) │     │  (Section BGs)   │     │  (Pixel Effects) │    │
│  └────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘    │
│           │                        │                        │               │
│           ▼                        ▼                        ▼               │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐    │
│  │ Componentes CSS  │     │ generated-       │     │ ServicesPreview  │    │
│  │ Tailwind classes │     │ colors.css       │     │ services/index   │    │
│  │ Inline styles    │     │ (AUTO-GENERADO)  │     │ (PixelCanvas)    │    │
│  └──────────────────┘     └──────────────────┘     └──────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tipos de Variables CSS

| Formato         | Uso             | Ejemplo                                  |
| --------------- | --------------- | ---------------------------------------- |
| `HSL sin comas` | Tailwind/shadcn | `--primary: 200 100% 36%`                |
| `RGB valores`   | Para `rgba()`   | `--color-primary: 0, 119, 182`           |
| `RGB completo`  | Para gradientes | `--color-primary-full: rgb(0, 119, 182)` |
| `Hex`           | Para JS/Canvas  | `--mermaid-primary: #3b82f6`             |

---

## Archivos Principales

### 1. `src/styles/global.css`

**Archivo central de todas las CSS variables.** Contiene:

- Colores primarios, secundarios, terciarios
- Colores semánticos (success, error, warning, info)
- Colores de brand (LinkedIn)
- Colores de servicios
- Colores de blog cards
- Colores de Mermaid diagrams
- Colores de View Transitions
- Colores de botones

### 2. `src/data/colors.ts`

**Colores de fondo de secciones.** Define:

- `lightModeColors` - Fondos para modo claro
- `darkModeColors` - Fondos para modo oscuro

### 3. `src/data/serviceColors.ts`

**Colores para efectos pixel de servicios.** Define:

- Gradientes para cada servicio
- Colores activos para hover
- Configuración de efectos

### 4. `src/styles/generated-colors.css`

**⚠️ AUTO-GENERADO - NO EDITAR MANUALMENTE**

Este archivo se regenera en cada build desde `colors.ts`.

### 5. `src/layouts/BaseLayout.astro`

**Critical CSS inline** para evitar flash de colores durante la carga inicial.

---

## Variables CSS por Categoría

### Colores Primarios (Ocean Blue)

```css
/* En :root (light mode) */
--color-primary: 0, 119, 182; /* RGB para rgba() */
--color-primary-dark: 0, 95, 146; /* Versión oscura */
--color-primary-full: rgb(0, 119, 182); /* Para gradientes */
--primary: 200 100% 36%; /* HSL para Tailwind */

/* En .dark */
--color-primary: 0, 119, 182;
--color-primary-dark: 0, 95, 146;
--color-primary-full: rgb(0, 119, 182);
--primary: 200 100% 45%; /* Más claro en dark mode */
```

### Colores Secundarios (Cyan)

```css
--color-secondary: 0, 180, 216;
--color-secondary-dark: 0, 150, 180;
--color-secondary-full: rgb(0, 180, 216);
--secondary: 190 100% 42%;
```

### Colores Terciarios (Coral)

```css
--color-tertiary: 255, 107, 107;
--color-tertiary-dark: 229, 90, 90;
--color-tertiary-full: rgb(255, 107, 107);
```

### Colores Semánticos UI

```css
/* Success - Emerald */
--color-ui-success: 16, 185, 129; /* Light: emerald-500 */
--color-ui-success: 52, 211, 153; /* Dark: emerald-400 */

/* Error - Red */
--color-ui-error: 239, 68, 68; /* Light: red-500 */
--color-ui-error: 248, 113, 113; /* Dark: red-400 */

/* Warning - Amber */
--color-ui-warning: 245, 158, 11; /* Light: amber-500 */
--color-ui-warning: 251, 191, 36; /* Dark: amber-400 */

/* Info - Blue */
--color-ui-info: 59, 130, 246; /* Light: blue-500 */
--color-ui-info: 96, 165, 250; /* Dark: blue-400 */

/* Tip - Violet */
--color-ui-tip: 139, 92, 246; /* Light: violet-500 */
--color-ui-tip: 167, 139, 250; /* Dark: violet-400 */

/* Quote - Cyan */
--color-ui-quote: 6, 182, 212; /* Light: cyan-500 */
--color-ui-quote: 34, 211, 238; /* Dark: cyan-400 */
```

### Colores de Brand

```css
/* LinkedIn */
--color-linkedin: 0, 119, 181; /* #0077B5 RGB */
--color-linkedin-full: #0077b5;
```

### Colores de Servicios

```css
/* Web Apps - Sky Blue */
--color-service-web-apps: 14, 165, 233;
--color-service-web-apps-full: #0ea5e9;
--color-service-web-apps-light: 7, 89, 133;
--color-service-web-apps-light-full: #0369a1;

/* Landing Pages - Emerald */
--color-service-landing-pages: 16, 185, 129;
--color-service-landing-pages-full: #10b981;
--color-service-landing-pages-light: 4, 120, 87;
--color-service-landing-pages-light-full: #047857;

/* Automation - Yellow */
--color-service-automation: 234, 179, 8;
--color-service-automation-full: #eab308;
--color-service-automation-light: 161, 98, 7;
--color-service-automation-light-full: #a16207;

/* Social Media Design - Rose */
--color-service-social-design: 225, 29, 72;
--color-service-social-design-full: #e11d48;
--color-service-social-design-light: 190, 18, 60;
--color-service-social-design-light-full: #be123c;

/* Web Optimization - Violet */
--color-service-web-optimization: 139, 92, 246;
--color-service-web-optimization-full: #8b5cf6;
--color-service-web-optimization-light: 109, 40, 217;
--color-service-web-optimization-light-full: #6d28d9;

/* WordPress - Blue */
--color-service-wordpress: 59, 130, 246;
--color-service-wordpress-full: #3b82f6;
--color-service-wordpress-light: 29, 78, 216;
--color-service-wordpress-light-full: #1d4ed8;
```

### Colores de Blog Cards

```css
--color-blog-card-overlay: 12, 12, 12; /* Overlay oscuro */
--color-blog-card-overlay-full: #0c0c0c;
--color-blog-card-badge-text: #282828; /* Texto del badge */
--color-blog-card-title: #ffe6e6; /* Color del título */
```

### Colores de Mermaid Diagrams

```css
/* Light Mode */
--mermaid-primary: #3b82f6; /* blue-500 */
--mermaid-secondary: #0891b2; /* cyan-600 */
--mermaid-background: #f1f5f9; /* slate-100 */
--mermaid-border: #e2e8f0; /* slate-200 */
--mermaid-text: #1f2937; /* gray-800 */

/* Dark Mode */
--mermaid-primary: #10b981; /* emerald-500 */
--mermaid-secondary: #22d3ee; /* cyan-400 */
--mermaid-background: #1e293b; /* slate-800 */
--mermaid-border: #334155; /* slate-700 */
--mermaid-text: #f3f4f6; /* gray-100 */
```

### Colores de View Transitions

```css
--transition-gradient-start: #3b82f6; /* blue-500 */
--transition-gradient-mid: #10b981; /* emerald-500 */
--transition-gradient-end: #14b8a6; /* teal-500 */
```

### Colores de Botones

```css
/* Success Button (Submit buttons) */
--btn-success-shadow: rgba(16, 185, 129, 0.3);
--btn-success-bg-start: #10b981; /* emerald-500 */
--btn-success-bg-end: #059669; /* emerald-600 */
--btn-success-hover-start: #6ee7b7; /* emerald-300 */
--btn-success-hover-end: #047857; /* emerald-700 */

/* Tertiary Button (Resume/Coral buttons) */
--btn-tertiary-shadow: rgba(255, 107, 107, 0.3);
--btn-tertiary-bg-start: #ff6b6b; /* coral */
--btn-tertiary-bg-end: #e55a5a; /* darker coral */
--btn-tertiary-hover-start: #ff8a8a; /* lighter coral */
--btn-tertiary-hover-end: #cc4a4a; /* even darker coral */
```

### Colores de Secciones (Auto-generados)

```css
/* Se generan desde colors.ts */
--section-hero-bg
--section-about-bg
--section-skills-bg
--section-projects-bg
--section-services-preview-bg
--section-blog-bg
--section-services-bg
--section-goodies-bg
--section-testimonials-bg
--section-contact-bg
--section-faqs-bg
--section-footer-bg
```

### Colores de Glow de Secciones

```css
/* Light Mode */
--section-background-glow-from: #295ca3;
--section-background-glow-via: #d3d8de;
--section-background-glow-to: #3980c6;

/* Dark Mode */
--section-background-glow-from: #8270db;
--section-background-glow-via: #282640;
--section-background-glow-to: #a17de8;
```

---

## Componentes y sus Variables

### Tabla de Referencia Rápida

| Componente             | Variables que usa                        | Archivo                                 |
| ---------------------- | ---------------------------------------- | --------------------------------------- |
| SubmitButton           | `--btn-success-*`                        | `forms/SubmitButton.tsx`                |
| ResumeDownloadDropdown | `--btn-tertiary-*`                       | `ui/ResumeDownloadDropdown.astro`       |
| ShareButton            | `--color-ui-success`, `--color-ui-error` | `blog/ShareButton.tsx`                  |
| TestimonialsSection    | `--color-linkedin-*`                     | `sections/TestimonialsSection.astro`    |
| BlogPostCard           | `--color-blog-card-*`                    | `cards/BlogPostCard.css`                |
| MermaidRenderer        | `--mermaid-*`                            | `blog/MermaidRenderer.astro`            |
| ViewTransitionGSAP     | `--transition-gradient-*`                | `transitions/ViewTransitionGSAP.astro`  |
| SEO                    | Hardcoded `#0077B6`                      | `layout/SEO.astro`                      |
| Secciones              | `--section-*-bg`                         | `sections/*.astro`                      |
| ServicesPreviewSection | `servicePixelColors`                     | `sections/ServicesPreviewSection.astro` |
| Services Page          | `servicePixelColors`                     | `pages/[lang]/services/index.astro`     |

### Detalle por Componente

#### SubmitButton.tsx (Botón de envío del formulario)

```tsx
// Usa variables de botón success
'shadow-[var(--btn-success-shadow)]';
'bg-[linear-gradient(...var(--btn-success-bg-start)...var(--btn-success-bg-end)...)]';
'before:bg-[linear-gradient(...var(--btn-success-hover-start)...var(--btn-success-hover-end)...)]';
```

**Para cambiar el color:** Modifica `--btn-success-*` en `global.css`

#### ResumeDownloadDropdown.astro (Dropdown de CV)

```astro
// Usa variables de botón tertiary (coral)
'shadow-[var(--btn-tertiary-shadow)]'
'bg-[linear-gradient(...var(--btn-tertiary-bg-start)...var(--btn-tertiary-bg-end)...)]'
```

**Para cambiar el color:** Modifica `--btn-tertiary-*` en `global.css`

#### ShareButton.tsx (Botón de compartir)

```tsx
// Estados copied/failed usando colores semánticos
copyStatus === 'copied'
  ? 'text-[rgb(var(--color-ui-success))] bg-[rgba(var(--color-ui-success),0.2)]'
  : 'text-[rgb(var(--color-ui-error))] bg-[rgba(var(--color-ui-error),0.2)]';
```

**Para cambiar el color:** Modifica `--color-ui-success` y `--color-ui-error` en
`global.css`

#### TestimonialsSection.astro (Badge y modal de LinkedIn)

```css
.linkedin-badge {
  background: rgba(var(--color-linkedin), 0.2);
  border: 1px solid rgba(var(--color-linkedin), 0.3);
  color: var(--color-linkedin-full);
}
```

**Para cambiar el color:** Modifica `--color-linkedin-*` en `global.css`

#### BlogPostCard.css (Cards del blog)

```css
.blog-post-card__overlay {
  background-color: var(--color-blog-card-overlay-full);
}
.blog-post-card__category {
  color: var(--color-blog-card-badge-text);
}
.blog-post-card__title {
  color: var(--color-blog-card-title);
}
```

**Para cambiar el color:** Modifica `--color-blog-card-*` en `global.css`

#### MermaidRenderer.astro (Diagramas)

```javascript
// Lee las variables CSS dinámicamente
const style = getComputedStyle(document.documentElement);
const primary = style.getPropertyValue('--mermaid-primary').trim();
```

**Para cambiar el color:** Modifica `--mermaid-*` en `global.css`

#### SEO.astro (Meta theme-color)

```html
<meta name="theme-color" content="#0077B6" />
```

**Para cambiar el color:** Edita directamente el valor hex (no puede usar CSS
vars)

#### Secciones (About, Skills, Projects, etc.)

```astro
// Cada sección usa su variable CSS correspondiente
const { primaryColor = 'var(--section-about-bg)' } = Astro.props;
```

**Para cambiar el color:** Modifica `colors.ts` y regenera

---

## Cómo Cambiar el Color Primario

### Paso 1: Elegir el nuevo color

Decide el color en formato:

- **Hex:** `#0077B6`
- **RGB:** `0, 119, 182`
- **HSL:** `200 100% 36%`

### Paso 2: Editar global.css

Busca y reemplaza en **`:root`** (light mode):

```css
/* Líneas ~80-85 */
--color-primary: 0, 119, 182; /* ← Tu nuevo RGB */
--color-primary-dark: 0, 95, 146; /* ← Versión más oscura */
--color-primary-full: rgb(0, 119, 182);
--color-primary-dark-full: rgb(0, 95, 146);

/* Línea ~138 */
--primary: 200 100% 36%; /* ← Tu nuevo HSL */

/* Línea ~144 */
--accent: 200 100% 36%; /* ← Igual que primary */

/* Línea ~150 */
--ring: 200 100% 36%; /* ← Igual que primary */
```

Busca y reemplaza en **`.dark`**:

```css
/* Líneas ~172-176 */
--color-primary: 0, 119, 182;
--color-primary-dark: 0, 95, 146;
--color-primary-full: rgb(0, 119, 182);
--color-primary-dark-full: rgb(0, 95, 146);

/* Línea ~225 */
--primary: 200 100% 45%; /* ← Un poco más claro */

/* Línea ~231 */
--accent: 200 100% 50%;

/* Línea ~237 */
--ring: 200 100% 45%;
```

### Paso 3: Editar BaseLayout.astro (Critical CSS)

Busca el bloque de CSS crítico (líneas ~210-240):

```css
/* Light mode - línea ~217 */
:root {
  --primary: 200 100% 36%; /* ← Tu nuevo HSL */
}

/* Dark mode - línea ~229 */
html.dark {
  --primary: 200 100% 45%; /* ← Un poco más claro */
}
```

### Paso 4: Actualizar SEO.astro

```html
<!-- Línea ~226 -->
<meta name="theme-color" content="#0077B6" />
<!-- ← Tu nuevo hex -->
```

### Paso 5: Verificar

```bash
npm run dev
```

Revisar:

- [ ] Homepage en light mode
- [ ] Homepage en dark mode
- [ ] Página de servicios
- [ ] Blog post
- [ ] Formulario de contacto (botón submit)

---

## Cómo Cambiar Colores de Servicios

Los servicios tienen **dos lugares** donde se definen colores:

### 1. Variables CSS (global.css)

Para estilos CSS/Tailwind:

```css
/* Web Apps - cambiar estos valores */
--color-service-web-apps: 14, 165, 233;
--color-service-web-apps-full: #0ea5e9;
```

### 2. serviceColors.ts

Para efectos pixel (PixelCanvas):

```typescript
// src/data/serviceColors.ts
'web-apps': {
    colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9'],     // Gradiente dark
    colorsLight: ['#0369a1', '#0284c7', '#0ea5e9'], // Gradiente light
    activeColor: '#0ea5e9',                         // Hover dark
    activeColorLight: '#0369a1',                    // Hover light
    gap: 8,
    speed: 30
}
```

### Sincronizar ambos

Si cambias un color de servicio, **actualiza en ambos lugares**:

| Servicio         | Variable CSS                       | serviceColors.ts key       |
| ---------------- | ---------------------------------- | -------------------------- |
| Web Apps         | `--color-service-web-apps`         | `'web-apps'`               |
| Landing Pages    | `--color-service-landing-pages`    | `'landing-pages'`          |
| Automation       | `--color-service-automation`       | `'automation-integration'` |
| Social Media     | `--color-service-social-design`    | `'social-media-design'`    |
| Web Optimization | `--color-service-web-optimization` | `'web-optimization'`       |
| WordPress        | `--color-service-wordpress`        | `'wordpress'`              |

---

## Cómo Cambiar Colores de Secciones

### Paso 1: Editar colors.ts

```typescript
// src/data/colors.ts

// Light Mode
export const lightModeColors: SectionColors = {
  hero: '#9AA6B2', // ← Cambiar aquí
  about: '#BCCCDC',
  skills: '#96B6C5',
  // ... etc
};

// Dark Mode
export const darkModeColors: SectionColors = {
  hero: '#0F1A2B', // ← Cambiar aquí
  about: '#1A2A3D',
  skills: '#1E3552',
  // ... etc
};
```

### Paso 2: Regenerar

```bash
npm run build
```

El archivo `generated-colors.css` se actualizará automáticamente con:

- Variables `--section-*-bg`
- Transiciones entre secciones `--*-to-*-1` hasta `--*-to-*-5`

---

## Colores que NO Debes Cambiar

Estos colores son **intencionales** y no deben modificarse al cambiar el tema:

### 1. Timeline (`src/data/timeline.ts`)

Cada evento tiene su color único que representa diferentes etapas/tipos.

### 2. Skills (`src/components/interactive/SkillsGrid.astro`)

Los colores son los **colores oficiales de cada tecnología** (React azul, Vue
verde, etc.).

### 3. Share Buttons Brand Colors (`src/data/shareButtons.ts`)

Los colores son los **oficiales de cada plataforma** (Twitter azul, LinkedIn
azul, etc.).

### 4. Process Section Gradient (`src/components/sections/ProcessSection.astro`)

El gradiente es parte del diseño fijo de la sección.

### 5. Project Card Categories (`src/components/cards/ProjectCard.tsx`)

Los colores distinguen tipos de proyectos (open source, commercial, client).

### 6. ToolCard Difficulty (`src/components/cards/ToolCard.astro`)

Los colores indican nivel de dificultad (fácil=verde, medio=amarillo,
difícil=rojo).

### 7. ProfileCodeBlock (`src/components/ui/ProfileCodeBlock.astro`)

Usa el tema **Dracula** que tiene sus propios colores fijos.

### 8. Section Background Glows

Los colores de glow crean la atmósfera del sitio y son independientes del color
primario:

- Light mode: Gradiente azul
- Dark mode: Gradiente púrpura

---

## Paletas Predefinidas

### Paleta Actual: Ocean Depths

```
Primary: #0077B6 (Ocean Blue)
Secondary: #00B4D8 (Cyan)
Tertiary: #FF6B6B (Coral)
```

### Otras Paletas Disponibles

Ver las 10 paletas completas en la sección
[Paletas de Colores Predefinidas](#paletas-de-colores-predefinidas-detalle) al
final de este documento.

---

## Herramientas y Verificación

### Conversión de Colores

| De  | A   | Herramienta                                                                                                |
| --- | --- | ---------------------------------------------------------------------------------------------------------- |
| Hex | RGB | `parseInt(hex.slice(1,3), 16), parseInt(hex.slice(3,5), 16), parseInt(hex.slice(5,7), 16)`                 |
| Hex | HSL | [rapidtables.com/convert/color/hex-to-hsl.html](https://www.rapidtables.com/convert/color/hex-to-hsl.html) |
| RGB | Hex | `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`     |

### Verificar Variables en DevTools

```javascript
// Ejecutar en la consola del navegador
const style = getComputedStyle(document.documentElement);

// Ver color primario
console.log('Primary HSL:', style.getPropertyValue('--primary'));
console.log('Primary RGB:', style.getPropertyValue('--color-primary'));

// Ver todos los colores de servicios
[
  'web-apps',
  'landing-pages',
  'automation',
  'social-design',
  'web-optimization',
  'wordpress',
].forEach((s) =>
  console.log(`${s}:`, style.getPropertyValue(`--color-service-${s}-full`))
);
```

### Checklist de Verificación

Después de cambiar colores, verificar:

- [ ] **Homepage** (`/es/` y `/en/`)
  - [ ] Hero section
  - [ ] Botones (Get in Touch, Resume)
  - [ ] Cards de servicios
  - [ ] Cards de proyectos
  - [ ] Cards de blog
- [ ] **Página de servicios** (`/es/services`)
  - [ ] Efectos pixel de cada servicio
  - [ ] Iconos de servicios
- [ ] **Página de proyectos** (`/es/projects`)
- [ ] **Blog post** (cualquiera)
  - [ ] Share buttons
  - [ ] Diagramas Mermaid (si hay)
  - [ ] Code blocks (Dracula theme - no cambiar)
- [ ] **Página de contacto**
  - [ ] Formulario
  - [ ] Botón de envío
- [ ] **Testimonials**
  - [ ] Badge de LinkedIn
  - [ ] Modal de LinkedIn
- [ ] **Modo claro y oscuro** (toggle de tema)
- [ ] **Mobile responsive**

---

## Paletas de Colores Predefinidas (Detalle)

### Resumen Visual

```
┌───────────────────────────────────────────────────────────────────────────┐
│  #   NOMBRE              LIGHT PRIMARY      DARK PRIMARY     CONCEPTO    │
├───────────────────────────────────────────────────────────────────────────┤
│  1   Ocean Depths        #0077B6            #0099E6          Profesional │
│  2   Forest Canopy       #1A9167            #22B882          Natural     │
│  3   Sunset Glow         #E86A1C            #F58732          Energético  │
│  4   Royal Amethyst      #7C3AED            #9F67F5          Elegante    │
│  5   Arctic Aurora       #1D9CA5            #26CCD9          Moderno     │
│  6   Crimson Rose        #C42D4E            #E85A7A          Audaz       │
│  7   Golden Hour         #D4A012            #EBC026          Lujoso      │
│  8   Midnight Sapphire   #2F4DB3            #5C7BE0          Confiable   │
│  9   Sage Garden         #4D8C5F            #66B37A          Tranquilo   │
│  10  Copper Ember        #BF6A33            #D9884D          Industrial  │
└───────────────────────────────────────────────────────────────────────────┘
```

Para ver los valores completos de cada paleta, consulta el archivo anterior de
THEMING.md o contacta al equipo de diseño.

---

## Preguntas Frecuentes

### ¿Por qué hay tantos formatos de color?

- **HSL sin comas** (`200 100% 36%`): Requerido por Tailwind/shadcn para usar
  con `hsl(var(--primary))`
- **RGB valores** (`0, 119, 182`): Requerido para usar con
  `rgba(var(--color-primary), 0.5)`
- **RGB completo** (`rgb(0, 119, 182)`): Para uso directo en gradientes CSS
- **Hex** (`#0077B6`): Para JavaScript/Canvas y algunas propiedades CSS

### ¿Por qué algunos colores están hardcoded?

- **SEO.astro theme-color**: Los meta tags no soportan CSS variables
- **Timeline/Skills/Share buttons**: Son colores de marca de terceros
- **Dracula theme**: Es un tema de código externo

### ¿Cómo sé si un color usa CSS variable o está hardcoded?

Busca en el código:

- `var(--` = usa CSS variable
- `#` o `rgb(` directo = hardcoded

### ¿Qué pasa si olvido actualizar algún archivo?

El sitio seguirá funcionando pero tendrás colores inconsistentes. Usa el
checklist de verificación para asegurarte de actualizar todo.

---

_Última actualización: Diciembre 2025_
