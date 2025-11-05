# Getting Started 🚀

Todo está configurado y listo para usar. Aquí está cómo empezar.

---

## ✅ Estado del Proyecto

- ✅ React + Astro configurado
- ✅ GSAP + Tailwind animations instalado
- ✅ i18n (inglés/español) funcionando
- ✅ Dark mode implementado
- ✅ Navegación responsive con mobile menu
- ✅ 3 páginas de ejemplo creadas
- ✅ Build exitoso (3 páginas generadas)
- ✅ Git hooks (Husky) configurados
- ✅ GitHub Actions listo
- ✅ Lighthouse CI configurado

---

## 🏃 Inicio Rápido

### 1. Instalar Git Hooks

```bash
npm run prepare
```

Esto instala Husky y los hooks de pre-commit y commit-msg.

### 2. Iniciar Desarrollo

```bash
npm run dev
```

Abre tu navegador en http://localhost:4321

### 3. Probar las Páginas

**Home:**

- http://localhost:4321 → Redirige a `/en`
- http://localhost:4321/en → Inglés
- http://localhost:4321/es → Español

**Blog:**

- http://localhost:4321/en/blog
- http://localhost:4321/es/blog

**Projects:**

- http://localhost:4321/en/projects
- http://localhost:4321/es/proyectos (¡ruta traducida!)

---

## 🎨 Probar las Funcionalidades

### Dark Mode

1. Haz click en el ícono sol/luna en la navegación
2. El tema debería cambiar sin parpadeo
3. Recarga la página - el tema persiste

**Shortcuts de teclado (opcional - no implementado aún):**

- `Ctrl + D` o `Cmd + D` para toggle

### Language Switcher

1. Haz click en EN/ES en la navegación
2. El idioma cambia manteniendo la misma ruta
3. Nota cómo `/en/projects` se convierte en `/es/proyectos`

### Animaciones

**GSAP:**

- Scroll en la home page - las secciones animan suavemente
- Hero section con timeline coordinado
- Cards con entrada escalonada

**Tailwind:**

- Hover sobre los buttons y cards
- Efectos de escala, sombra, y traslación
- Transitions suaves

**Mobile:**

- Reduce el ancho del navegador
- Click en el menú hamburger
- Navegación mobile se despliega

---

## 🛠️ Comandos Disponibles

### Desarrollo

```bash
npm run dev          # Dev server con hot reload
npm run build        # Build para producción
npm run preview      # Preview del build
```

### Quality Checks

```bash
npm run typecheck    # TypeScript checking
npm run lint         # Biome lint
npm run lint:fix     # Biome fix automático
npm run format       # Biome format
```

### Testing

```bash
npm run test         # Run tests
npm run test:ui      # Tests con UI
npm run test:coverage # Tests con coverage
```

### Markdown

```bash
npm run format:md          # Format all markdown
npm run format:md:claude   # Format .claude docs only
npm run lint:md            # Lint markdown
```

---

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── AnimatedHero.tsx           # Hero con GSAP timeline
│   ├── TailwindAnimations.tsx     # Demo Tailwind
│   ├── ScrollAnimatedSection.tsx  # Scroll trigger GSAP
│   ├── ProjectCard.tsx            # Card de proyecto
│   ├── BlogCard.tsx               # Card de blog
│   ├── ThemeToggle.tsx            # Dark mode toggle
│   ├── LanguageSelector.tsx       # i18n selector
│   └── Navigation.astro           # Nav bar
├── layouts/
│   └── BaseLayout.astro           # Layout principal
├── pages/
│   ├── index.astro                # Home
│   ├── blog/
│   │   └── index.astro            # Blog index
│   └── projects/
│       └── index.astro            # Projects index
├── styles/
│   └── global.css                 # Tailwind + custom
└── env.d.ts                       # Types para i18n
```

---

## 🌐 URLs Generadas

### Inglés (EN)

```
/                    → Redirect to /en
/en                  → Home (inglés)
/en/blog             → Blog (inglés)
/en/projects         → Projects (inglés)
```

### Español (ES)

```
/es                  → Home (español)
/es/blog             → Blog (español)
/es/proyectos        → Projects (español) ← Ruta traducida!
```

---

## 🎯 Flujo de Trabajo Recomendado

### Para Nuevas Features

1. **Planifica** (opcional)

   ```bash
   # Si es una feature grande
   /start-feature-plan
   ```

2. **Desarrolla**

   ```bash
   npm run dev
   # Edita archivos, hot reload funciona
   ```

3. **Quality Checks**

   ```bash
   npm run typecheck
   npm run lint
   npm run test
   ```

4. **Build Local**

   ```bash
   npm run build
   npm run preview
   ```

5. **Commit**
   ```bash
   git add <archivos-específicos>
   git commit -m "feat(scope): descripción"
   # Los hooks corren automáticamente
   ```

### Para Fixes Rápidos

1. **Edita** el archivo
2. **Commit** directamente (hooks validarán)
   ```bash
   git add archivo.tsx
   git commit -m "fix(component): descripción del fix"
   ```

---

## 🎨 Personalización

### Colores del Tema

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        900: '#0c4a6e',
      },
    },
  },
},
```

Úsalos en componentes:

```html
<div class="bg-brand-50 dark:bg-brand-900">
  <h1 class="text-brand-500">Title</h1>
</div>
```

### Agregar Nuevas Traducciones

Edita `public/locales/{locale}/common.json`:

```json
{
  "mySection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

Usa en componentes:

```astro
---
import { t } from 'i18next';
---

<h1>{t('mySection.title')}</h1>
<p>{t('mySection.description')}</p>
```

### Agregar Nuevas Rutas

Crea archivo en `src/pages/`:

```astro
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About">
  <div class="max-w-4xl mx-auto py-16 px-4">
    <h1>About Page</h1>
  </div>
</BaseLayout>
```

Astro i18next generará automáticamente:

- `/en/about`
- `/es/about` (o ruta traducida si la configuras)

Para rutas traducidas, edita `astro-i18next.config.ts`:

```typescript
routes: {
  es: {
    about: 'acerca-de',
  },
}
```

Genera:

- `/en/about`
- `/es/acerca-de`

### Agregar Nuevos Idiomas

1. **Configuración** (`astro-i18next.config.ts`):

   ```typescript
   locales: ['en', 'es', 'fr'],
   ```

2. **Traducciones** (`public/locales/fr/common.json`):

   ```json
   {
     "nav": {
       "home": "Accueil",
       "blog": "Blog",
       ...
     }
   }
   ```

3. **Language Selector** (`LanguageSelector.tsx`):
   ```typescript
   const languages = [
     { code: 'en', label: 'EN', flag: '🇺🇸' },
     { code: 'es', label: 'ES', flag: '🇪🇸' },
     { code: 'fr', label: 'FR', flag: '🇫🇷' },
   ];
   ```

---

## 🔧 Troubleshooting

### Build falla con error de Tailwind

**Síntoma:** `The 'some-class' class does not exist`

**Solución:**

1. Verifica que la clase existe en Tailwind
2. Si es custom, agrégala en `tailwind.config.js`
3. Si usas `@apply`, asegúrate de estar en un `@layer`

### Dark mode no funciona

**Síntoma:** El toggle no cambia el tema

**Solución:**

1. Verifica que Tailwind tenga `darkMode: 'class'`
2. Comprueba que el script inline esté en `<head>`
3. Revisa localStorage en DevTools

### i18n no traduce

**Síntoma:** Las traducciones no aparecen

**Solución:**

1. Verifica que el archivo JSON existe en `public/locales/{locale}/`
2. Comprueba que la key existe en el JSON
3. Revisa que estás usando `t('key.path')` correctamente

### Animaciones GSAP no funcionan

**Síntoma:** Los elementos no animan

**Solución:**

1. Verifica que tienes `client:load` en el componente
2. Comprueba imports de GSAP
3. Revisa consola del browser por errores
4. Para ScrollTrigger, asegúrate de usar dynamic import

### Hooks de Git no corren

**Síntoma:** Commits sin formatear código

**Solución:**

```bash
npx husky install
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

---

## 📚 Documentación Adicional

- **Ejemplos detallados:** `EXAMPLES.md`
- **Setup inicial:** `SETUP.md`
- **Componentes:** Ver archivos individuales con JSDoc

---

## 🚀 Deploy a Vercel

### Opción 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Opción 2: GitHub Integration

1. Push tu código a GitHub
2. Conecta tu repo en vercel.com
3. Vercel detecta Astro automáticamente
4. Deploy automático en cada push

### Variables de Entorno

Si necesitas variables de entorno:

```bash
# .env.local (no commitear!)
PUBLIC_API_URL=https://api.example.com
```

En Vercel Dashboard:

- Settings → Environment Variables
- Agrega `PUBLIC_API_URL`

---

## 🎉 Próximos Pasos Sugeridos

1. **Personaliza el contenido**
   - Cambia textos en `public/locales/`
   - Actualiza metadata en layouts
   - Agrega tu información personal

2. **Agrega contenido real**
   - Blog posts en Content Collections
   - Projects con datos reales
   - Imágenes optimizadas

3. **Mejoras SEO**
   - Open Graph tags
   - Twitter cards
   - Sitemap
   - robots.txt

4. **Features adicionales**
   - Contact form
   - Newsletter signup
   - RSS feed
   - Search

5. **Deploy**
   - Push a GitHub
   - Connect Vercel
   - ¡Go live!

---

**¡Empieza a construir! Todo está listo.** 🎨🚀
