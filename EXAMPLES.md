# Examples Guide 🎨

Este documento describe todas las páginas y componentes de ejemplo creados.

---

## 📄 Páginas Creadas

### 1. Home (`/`)

**Ubicación:** `src/pages/index.astro`

**Características:**

- Hero section con animaciones GSAP
- Sección de features con scroll animations
- Cards animadas con Tailwind CSS
- Totalmente responsive
- Soporte i18n (inglés/español)

**Componentes usados:**

- `<AnimatedHero />` - Hero con GSAP timeline
- `<ScrollAnimatedSection />` - Sección con scroll trigger
- `<TailwindAnimations />` - Demo de animaciones Tailwind

**Rutas generadas:**

- `/` (redirige a `/en`)
- `/en` - Versión en inglés
- `/es` - Versión en español

---

### 2. Blog (`/blog`)

**Ubicación:** `src/pages/blog/index.astro`

**Características:**

- Grid de artículos con animaciones
- Cards de blog con entrada escalonada
- Tags y metadatos
- Enlaces a artículos individuales (placeholder)

**Componentes usados:**

- `<BlogCard />` - Card individual de blog con animaciones GSAP

**Datos de ejemplo:**

- 3 posts de ejemplo con título, extracto, fecha, tags
- Enlaces funcionales (apuntan a rutas que aún no existen)

**Rutas generadas:**

- `/en/blog` - Blog en inglés
- `/es/blog` - Blog en español

---

### 3. Projects (`/projects`)

**Ubicación:** `src/pages/projects/index.astro`

**Características:**

- Grid de proyectos con animaciones escalonadas
- Cards interactivas con hover effects
- Enlaces a demos y código fuente
- CTA (Call to Action) final con gradiente

**Componentes usados:**

- `<ProjectCard />` - Card de proyecto con GSAP + Tailwind
- `<ScrollAnimatedSection />` - Header con scroll animation

**Datos de ejemplo:**

- 6 proyectos ficticios
- Cada uno con título, descripción, tags, links

**Rutas generadas:**

- `/en/projects` - Proyectos en inglés
- `/es/proyectos` - Proyectos en español (ruta traducida!)

---

## 🧩 Componentes Creados

### Animaciones GSAP

#### `AnimatedHero.tsx`

```tsx
<AnimatedHero client:load />
```

**Funcionalidad:**

- Hero section con animaciones de entrada
- Timeline de GSAP para coordinar múltiples elementos
- Animación de título, subtítulo y contenedor
- Gradiente animado en el texto

**Técnicas usadas:**

- `gsap.timeline()`
- Animaciones coordinadas con delays negativos
- `ease` functions (power3.out, power2.out, back.out)

---

#### `ScrollAnimatedSection.tsx`

```tsx
<ScrollAnimatedSection
  client:load
  title="Section Title"
  description="Section description"
>
  {children}
</ScrollAnimatedSection>
```

**Funcionalidad:**

- Sección que anima al hacer scroll
- Usa ScrollTrigger de GSAP
- Anima título, descripción y contenido por separado
- Scrub para efecto suave

**Técnicas usadas:**

- `gsap.registerPlugin(ScrollTrigger)`
- `scrollTrigger` con start/end markers
- `scrub` para animación vinculada al scroll

---

#### `ProjectCard.tsx`

```tsx
<ProjectCard
  client:load
  title="Project Name"
  description="Project description"
  tags={['Tag1', 'Tag2']}
  demoUrl="https://..."
  githubUrl="https://..."
  delay={0.1}
/>
```

**Funcionalidad:**

- Card de proyecto con animación de entrada
- Hover effects con Tailwind
- Enlaces a demo y GitHub
- Placeholder image con letra inicial

**Técnicas usadas:**

- GSAP para animación inicial con delay
- Tailwind para hover effects (translate-y, shadow)
- Group hover para efectos coordinados

---

#### `BlogCard.tsx`

```tsx
<BlogCard
  client:load
  title="Article Title"
  excerpt="Article excerpt..."
  date="2024-11-01"
  readTime="5 min read"
  tags={['tag1', 'tag2']}
  slug="article-slug"
  delay={0.2}
/>
```

**Funcionalidad:**

- Card de artículo con slide-in animation
- Metadata (fecha, tiempo de lectura)
- Tags
- Link a artículo completo

**Técnicas usadas:**

- GSAP con animación de slide desde la izquierda
- Tailwind para hover border
- Group hover para flecha animada

---

### Animaciones Tailwind

#### `TailwindAnimations.tsx`

```tsx
<TailwindAnimations client:load />
```

**Funcionalidad:**

- Showcase de animaciones Tailwind CSS
- Ejemplos de fade-in, slide-in
- Hover effects (scale, lift, color)
- Grid responsive

**Clases de animación usadas:**

```css
animate-in fade-in duration-1000
slide-in-from-bottom-4 duration-700 delay-300
transition-transform hover:scale-105
hover:shadow-lg hover:-translate-y-1
```

---

### UI Components

#### `ThemeToggle.tsx`

```tsx
<ThemeToggle client:load />
```

**Funcionalidad:**

- Switch entre light/dark mode
- Persiste preferencia en localStorage
- Previene FOUC (Flash of Unstyled Content)
- Íconos SVG para sol/luna

**Técnicas usadas:**

- `useState` + `useEffect` para hydration
- `localStorage` para persistencia
- `document.documentElement.classList` para aplicar tema
- Mounted state para SSR compatibility

---

#### `LanguageSelector.tsx`

```tsx
<LanguageSelector currentLocale="en" client:load />
```

**Funcionalidad:**

- Selector de idioma (EN/ES)
- Banderas de países
- Cambia la URL manteniendo la ruta actual
- Indicador visual del idioma activo

**Técnicas usadas:**

- Toggle buttons con estados activos
- `window.location.href` para cambio de idioma
- Path manipulation para mantener ruta

---

### Layout Components

#### `Navigation.astro`

**Funcionalidad:**

- Navegación sticky responsive
- Links a páginas principales
- Theme toggle integrado
- Language selector integrado
- Mobile menu con toggle

**Características:**

- Sticky header con backdrop blur
- Active link highlighting
- Mobile hamburger menu
- Responsive design (desktop/mobile)

---

#### `BaseLayout.astro`

```astro
<BaseLayout title="Page Title" description="Page description">
  {content}
</BaseLayout>
```

**Funcionalidad:**

- Layout base para todas las páginas
- Navegación incluida
- Footer con links sociales
- View Transitions habilitadas
- FOUC prevention para dark mode
- i18n lang tags y hreflang

**Incluye:**

- Navigation component
- Footer con año actual
- Social links (GitHub, Twitter)
- SEO meta tags
- Dark mode script inline

---

## 🌐 Sistema de Internacionalización (i18n)

### Configuración

**Archivo:** `astro-i18next.config.ts`

```typescript
{
  defaultLocale: 'en',
  locales: ['en', 'es'],
  routes: {
    es: {
      blog: 'blog',
      projects: 'proyectos',  // Ruta traducida!
    },
  },
}
```

### Traducciones

**Ubicación:** `public/locales/{locale}/common.json`

**Idiomas disponibles:**

- `en` - English
- `es` - Español

**Namespaces:**

- `nav` - Navegación
- `theme` - Theme switcher
- `home` - Página principal
- `blog` - Blog
- `projects` - Projects
- `footer` - Footer

### Uso en Componentes

```astro
---
import { t } from 'i18next';
---

<h1>{t('home.title')}</h1>
<p>{t('home.description')}</p>
```

### Rutas Generadas

```
/en                 → Home (inglés)
/es                 → Home (español)
/en/blog            → Blog (inglés)
/es/blog            → Blog (español)
/en/projects        → Projects (inglés)
/es/proyectos       → Projects (español) ← ¡Ruta traducida!
```

---

## 🎨 Sistema de Themes (Dark Mode)

### Configuración

**Tailwind Config:** `darkMode: 'class'`

**CSS Variables:** `src/styles/global.css`

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

### Prevención de FOUC

Script inline en `<head>` de BaseLayout:

```javascript
const theme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (theme === 'dark' || (!theme && prefersDark)) {
  document.documentElement.classList.add('dark');
}
```

### Uso de Clases Dark

```html
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-white">Content</p>
</div>
```

---

## 🎬 Animaciones Implementadas

### GSAP Animations

1. **Timeline Animations** (`AnimatedHero`)
   - Entrada coordinada de múltiples elementos
   - Delays negativos para solapamiento

2. **Scroll Trigger** (`ScrollAnimatedSection`)
   - Animaciones activadas por scroll
   - Scrub para movimiento suave

3. **Staggered Entrance** (`ProjectCard`, `BlogCard`)
   - Entrada escalonada con delays incrementales
   - Mejora la percepción de profundidad

### Tailwind Animations

1. **Fade In**

   ```html
   <div class="animate-in fade-in duration-1000"></div>
   ```

2. **Slide In**

   ```html
   <div class="animate-in slide-in-from-bottom-4 duration-700"></div>
   ```

3. **Hover Effects**
   ```html
   <button
     class="hover:scale-105 active:scale-95 transition-transform"
   ></button>
   ```

### View Transitions

Habilitadas globalmente en BaseLayout:

```astro
import { ViewTransitions } from 'astro:transitions';
<ViewTransitions />
```

---

## 🚀 Cómo Probar las Páginas

### 1. Iniciar Dev Server

```bash
npm run dev
```

### 2. Navegar a las Páginas

**Home:**

- http://localhost:4321 → Redirige a /en
- http://localhost:4321/en → Inglés
- http://localhost:4321/es → Español

**Blog:**

- http://localhost:4321/en/blog
- http://localhost:4321/es/blog

**Projects:**

- http://localhost:4321/en/projects
- http://localhost:4321/es/proyectos

### 3. Probar Funcionalidades

✅ **Dark Mode:**

- Click en el botón sol/luna en la navegación
- Debería cambiar sin parpadeo
- Se guarda en localStorage

✅ **Language Switcher:**

- Click en EN/ES en la navegación
- Cambia idioma manteniendo la ruta
- Rutas traducidas funcionan (projects → proyectos)

✅ **Animaciones GSAP:**

- Hero anima al cargar
- Sections animan al hacer scroll
- Cards animan en entrada

✅ **Animaciones Tailwind:**

- Hover effects en buttons/cards
- Fade in animations
- Smooth transitions

✅ **View Transitions:**

- Navegación entre páginas suave
- Transiciones de elementos compartidos

✅ **Navegación:**

- Mobile menu toggle funciona
- Active links se destacan
- Sticky header al scrollear

---

## 📝 Próximos Pasos Sugeridos

### Contenido Real

1. **Blog Posts:**
   - Crear carpeta `src/content/blog/`
   - Usar Astro Content Collections
   - Markdown con frontmatter

2. **Projects:**
   - Mover datos a archivo JSON o CMS
   - Añadir imágenes reales
   - Crear páginas individuales de proyectos

### Mejoras

1. **SEO:**
   - Open Graph tags
   - Twitter cards
   - Structured data (JSON-LD)

2. **Performance:**
   - Optimizar imágenes
   - Lazy loading
   - Code splitting

3. **Features:**
   - Newsletter signup
   - Contact form
   - Search functionality
   - RSS feed

---

## 🐛 Troubleshooting

### Las animaciones no funcionan

1. Verifica que `client:load` esté en componentes React
2. Comprueba que GSAP esté importado correctamente
3. Revisa la consola del browser por errores

### Dark mode no persiste

1. Verifica localStorage en DevTools
2. Comprueba que el script inline esté en `<head>`
3. Revisa que Tailwind tenga `darkMode: 'class'`

### i18n no traduce

1. Verifica que los archivos JSON estén en `public/locales/`
2. Comprueba que las keys existan en ambos idiomas
3. Revisa que `astro-i18next` esté configurado

### View Transitions con errores

1. Asegúrate de tener `<ViewTransitions />` en BaseLayout
2. Verifica que Astro esté actualizado a v4+
3. Algunos navegadores pueden no soportarlo (fallback gracioso)

---

**¡Todo listo! Explora el código y personaliza según tus necesidades.** 🚀
