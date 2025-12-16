# Theming System Reference

Technical reference for the qazuor.com theming system. For step-by-step
instructions, see `/docs/THEMING.md`.

## Architecture

```text
src/config/themeConfig.ts (SINGLE SOURCE OF TRUTH)
         │
         ├──► Critical CSS (inline in <head>) - Prevents FOUC
         ├──► src/styles/generated-theme.css - Complete theme variables
         ├──► public/styles/giscus-custom*.css - Comment widget themes
         └──► tailwind.config.js (imports tailwindColorScales)

src/data/sectionBackgrounds.ts (Section layout colors)
         │
         └──► src/styles/generated-section-backgrounds.css
```

## Key Files

| File                                           | Purpose                          | Edit?   |
| ---------------------------------------------- | -------------------------------- | ------- |
| `src/config/themeConfig.ts`                    | Theme colors (single source)     | **YES** |
| `src/data/sectionBackgrounds.ts`               | Section background colors        | **YES** |
| `tailwind.config.js`                           | Imports generated color scales   | Rarely  |
| `src/styles/generated-theme.css`               | Auto-generated theme CSS         | NO      |
| `src/styles/generated-section-backgrounds.css` | Auto-generated section CSS       | NO      |
| `src/config/colorHelpers.ts`                   | Color conversion utilities       | NO      |
| `integrations/theme-generator.ts`              | Theme CSS generation integration | NO      |
| `integrations/giscus-theme.ts`                 | Giscus theme integration         | NO      |
| `integrations/color-interpolation.ts`          | Section background integration   | NO      |

## Theme Color Locations

### Primary Theme Colors (themeConfig.ts)

```typescript
// Edit darkTheme and lightTheme objects
export const darkTheme: ThemeConfig = {
  critical: {
    primary: '200 100% 45%', // HSL - Main accent
    background: '215 28% 7%',
    foreground: '210 15% 95%',
    // ...
  },
  colors: {
    colorPrimary: '0, 119, 182', // RGB - Used for rgba()
    colorSecondary: '0, 180, 216',
    colorTertiary: '255, 107, 107',
    // ...
  },
  // ... other sections
};
```

### Tailwind Color Scales

Generated automatically from `themeConfig.ts`:

```javascript
// tailwind.config.js
import { tailwindColorScales } from './src/config/themeConfig.ts';

// Available: primary, secondary, tertiary, accent
// Each has: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, DEFAULT
```

Usage in components:

```html
<div class="bg-primary-500 text-primary-100">
  <div class="border-tertiary-600"></div>
</div>
```

### Section Background Colors (sectionBackgrounds.ts)

```typescript
// Edit for section layout colors (NOT theme accent colors)
export const darkModeColors: SectionColors = {
  hero: '#0F1A2B',
  about: '#1A2A3D',
  skills: '#1E3552',
  // ...
};
```

## Variable Formats

| Format | Example            | Usage                             |
| ------ | ------------------ | --------------------------------- |
| HSL    | `200 100% 45%`     | `hsl(var(--primary))`             |
| RGB    | `0, 119, 182`      | `rgba(var(--color-primary), 0.5)` |
| Hex    | `#0077b6`          | Direct color values               |
| Full   | `rgb(0, 119, 182)` | Complete CSS value                |

## CSS Variable Categories

### Critical (inline in head)

- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--background`, `--foreground`, `--primary`

### Shadcn/ui Compatible

- `--card`, `--popover`, `--muted`, `--accent`, `--destructive`
- Each has `-foreground` variant

### Brand Colors (RGB)

- `--color-primary`, `--color-secondary`, `--color-tertiary`
- Each has `-dark` and `-full` variants

### UI Semantic

- `--color-ui-info`, `--color-ui-warning`, `--color-ui-error`
- `--color-ui-success`, `--color-ui-tip`, `--color-ui-quote`

### Component-Specific

- Timeline: `--color-timeline-blue/amber/violet-from/to`
- Mermaid: `--mermaid-primary/secondary/background/text`
- Testimonials: `--testimonial-accent/bg/border`
- Dividers: `--divider-primary/secondary/accent`

## Regeneration

Changes auto-regenerate in dev mode. For manual regeneration:

```bash
npx tsx scripts/generate-theme-css.ts
npx tsx scripts/generate-giscus-css.ts
```

## Color Semantic Meaning

These colors have fixed semantic meaning - change with care:

| Variable               | Meaning                                          |
| ---------------------- | ------------------------------------------------ |
| `--color-ui-success`   | Success states (green)                           |
| `--color-ui-error`     | Error states (red)                               |
| `--color-ui-warning`   | Warning states (amber)                           |
| `--color-difficulty-*` | Beginner=green, Intermediate=amber, Advanced=red |
| `--color-category-*`   | opensource=green, commercial=blue, client=amber  |

## DO NOT Edit

- `src/styles/generated-*.css` - Auto-generated
- `public/styles/giscus-custom*.css` - Auto-generated
- Brand colors in components (LinkedIn, technology logos)
- Dracula theme in code blocks

---

_Last updated: 2025-12-16_
