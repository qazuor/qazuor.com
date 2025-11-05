# Setup Complete! 🎉

Todo está instalado y configurado. Aquí está todo lo que tienes disponible:

## 🎨 Animaciones

### GSAP

Librería profesional de animaciones JavaScript. Usa en componentes React.

**Ejemplo:**

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function MyComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(elementRef.current, {
      x: 100,
      duration: 1,
      ease: 'power2.out',
    });
  }, []);

  return <div ref={elementRef}>Animated element</div>;
}
```

**Plugins útiles:**

```typescript
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

gsap.to('.element', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.element',
    start: 'top center',
    end: 'bottom top',
    scrub: true,
  },
});
```

### Tailwind Animations

Animaciones CSS con clases de Tailwind. Funciona en Astro y React.

**Clases disponibles:**

```tsx
// Fade in
<div className="animate-in fade-in duration-1000">Content</div>

// Slide in from bottom
<div className="animate-in slide-in-from-bottom-4 duration-700">Content</div>

// Slide in from left
<div className="animate-in slide-in-from-left-4 duration-500">Content</div>

// Zoom in
<div className="animate-in zoom-in-50 duration-600">Content</div>

// Hover animations
<button className="transition-transform hover:scale-105 active:scale-95">
  Button
</button>
```

### View Transitions (Astro)

Transiciones nativas entre páginas. Ya configurado en `Layout.astro`.

**Uso:**

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
</head>

<!-- Elementos que se animan entre páginas -->
<div transition:name="hero">Hero content</div>
<img transition:name="main-image" src="..." />
```

---

## 🧪 Testing

### Vitest

Framework de testing configurado con React Testing Library.

**Comandos:**

```bash
npm run test           # Run tests
npm run test:ui        # Run tests with UI
npm run test:coverage  # Run tests with coverage
```

**Ejemplo de test:**

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## 🔍 Linting & Formatting

### Biome

Linter y formatter todo-en-uno (reemplaza ESLint + Prettier para JS/TS).

**Comandos:**

```bash
npm run lint       # Check for issues
npm run lint:fix   # Fix issues automatically
npm run format     # Format code
```

### Prettier (solo Markdown)

Formateador de Markdown.

**Comandos:**

```bash
npm run format:md         # Format all markdown
npm run format:md:claude  # Format .claude docs only
npm run lint:md           # Check markdown
```

---

## 🪝 Git Hooks

### Husky + lint-staged

**Pre-commit hook:**

- Auto-formatea código con Biome
- Auto-formatea Markdown con Prettier
- Se ejecuta solo en archivos staged

**Commit-msg hook:**

- Valida mensajes de commit (conventional commits)
- Requiere formato: `type(scope): message`

**Tipos válidos:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento
- `perf`: Performance
- `ci`: CI/CD

**Ejemplos:**

```bash
git commit -m "feat(hero): add animated hero section"
git commit -m "fix(button): resolve hover state bug"
git commit -m "docs(readme): update installation instructions"
```

**Saltar hooks (usar con precaución):**

```bash
git commit --no-verify -m "message"
```

---

## 🚀 GitHub Actions

### CI Pipeline (`.github/workflows/ci.yml`)

Corre en cada push y PR:

- ✅ Type checking
- ✅ Linting
- ✅ Tests
- ✅ Build

### Lighthouse CI (`.github/workflows/lighthouse.yml`)

Corre en PRs:

- ✅ Performance score (mín. 90)
- ✅ Accessibility score (mín. 90)
- ✅ SEO score (mín. 90)
- ✅ Best Practices score (mín. 90)

### CodeQL Security (`.github/workflows/codeql.yml`)

Corre en push, PR y semanalmente:

- ✅ Escaneo de vulnerabilidades
- ✅ Análisis de código estático
- ✅ Security alerts

### Dependabot (`.github/dependabot.yml`)

Actualiza dependencias automáticamente:

- 📅 Semanalmente (lunes 09:00)
- 🔢 Máximo 5 PRs abiertos
- 🏷️ Labels: `dependencies`, `automated`

---

## 🎨 Tailwind CSS

Configurado con plugin de animaciones.

**Archivo:** `tailwind.config.js`

**Personalizar colores:**

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

---

## 📦 Scripts Disponibles

```bash
# Development
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build

# Quality
npm run typecheck  # TypeScript type checking
npm run lint       # Lint with Biome
npm run lint:fix   # Fix lint issues
npm run format     # Format code

# Testing
npm run test           # Run tests
npm run test:ui        # Run tests with UI
npm run test:coverage  # Run tests with coverage

# Markdown
npm run format:md         # Format markdown
npm run format:md:claude  # Format .claude docs
npm run lint:md           # Lint markdown
```

---

## 🗂️ Estructura de Proyecto

```
qazuor.com/
├── src/
│   ├── components/        # React components
│   │   ├── AnimatedHero.tsx
│   │   ├── TailwindAnimations.tsx
│   │   └── *.test.tsx     # Component tests
│   ├── layouts/           # Astro layouts
│   │   └── Layout.astro   # Main layout with View Transitions
│   ├── pages/             # Astro pages (routes)
│   ├── styles/            # Global styles
│   │   └── global.css     # Tailwind base + custom styles
│   └── test/              # Test setup
│       └── setup.ts
├── public/                # Static assets
├── .github/
│   ├── workflows/         # GitHub Actions
│   │   ├── ci.yml
│   │   ├── lighthouse.yml
│   │   └── codeql.yml
│   └── dependabot.yml
├── .husky/                # Git hooks
│   ├── pre-commit
│   └── commit-msg
├── .claude/               # Claude configuration
├── astro.config.mjs       # Astro config
├── tailwind.config.js     # Tailwind config
├── biome.json             # Biome config
├── vitest.config.ts       # Vitest config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies & scripts
```

---

## 🚦 Próximos Pasos

### 1. Inicializar Git Hooks

```bash
npm run prepare
```

Esto instala los hooks de Husky.

### 2. Crear tu primera página

```bash
# Edita src/pages/index.astro
```

```astro
---
import Layout from '../layouts/Layout.astro';
import { AnimatedHero } from '../components/AnimatedHero';
import { TailwindAnimations } from '../components/TailwindAnimations';
---

<Layout title="Home - qazuor.com">
  <AnimatedHero client:load />
  <TailwindAnimations client:load />
</Layout>
```

### 3. Prueba el dev server

```bash
npm run dev
```

Abre http://localhost:4321

### 4. Verifica que todo funciona

```bash
npm run typecheck  # Should pass
npm run lint       # Should pass
npm run test       # Should pass (no tests yet)
npm run build      # Should build successfully
```

### 5. Haz tu primer commit

```bash
git add .
git commit -m "feat(setup): initial project configuration"
```

Los hooks deberían correr automáticamente.

---

## 📚 Recursos

### Documentación

- [Astro](https://docs.astro.build)
- [React](https://react.dev)
- [GSAP](https://gsap.com/docs/v3/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev)
- [Biome](https://biomejs.dev)

### Ejemplos de Animaciones

- **GSAP ScrollTrigger**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **View Transitions**: https://docs.astro.build/en/guides/view-transitions/
- **Tailwind Animations**: https://github.com/jamiebuilds/tailwindcss-animate

---

## ❓ Troubleshooting

### Error: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Hooks no corren

```bash
npx husky install
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Lighthouse CI falla

Asegúrate de que el servidor de preview esté corriendo correctamente:

```bash
npm run build
npm run preview
```

### TypeScript errors en componentes

Verifica que `tsconfig.json` tenga:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

---

**¡Todo listo! 🚀 Empieza a construir algo increíble.**
