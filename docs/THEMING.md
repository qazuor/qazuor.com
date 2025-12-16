# Theming Guide for Developers

This guide explains how the theming system works and how to change colors in
qazuor.com.

## Quick Start

**Want to change the main site colors?**

1. Open `src/config/themeConfig.ts`
2. Find the color you want to change (primary, secondary, tertiary)
3. Update the RGB values
4. Save the file - changes apply automatically in dev mode

**Want to change section background colors?**

1. Open `src/data/sectionBackgrounds.ts`
2. Change the hex color for the section you want
3. Save - the system regenerates transitions automatically

## How the System Works

The theming system has **one main file** that controls everything:

```
src/config/themeConfig.ts  ──►  All theme colors, Tailwind scales, CSS variables
```

When you save this file, several things happen automatically:

1. CSS variables are regenerated (`src/styles/generated-theme.css`)
2. Giscus comment themes are updated (`public/styles/giscus-custom*.css`)
3. Tailwind color scales are recalculated for classes like `bg-primary-500`
4. The dev server hot-reloads the changes

## File Overview

| File                             | What it controls                                                | Do you edit it? |
| -------------------------------- | --------------------------------------------------------------- | --------------- |
| `src/config/themeConfig.ts`      | Primary/secondary/tertiary colors, UI colors, all CSS variables | **Yes**         |
| `src/data/sectionBackgrounds.ts` | Hero, About, Skills section backgrounds                         | **Yes**         |
| `tailwind.config.js`             | Imports color scales from themeConfig                           | Rarely          |
| `src/styles/generated-*.css`     | Auto-generated CSS                                              | **Never**       |
| `src/styles/global.css`          | Base styles (not theme colors)                                  | Rarely          |

## Changing the Primary Color

The primary color is the main accent color (currently ocean blue `#0077B6`).

### Step 1: Choose your new color

Pick a color in these formats:

- **Hex:** `#0077B6`
- **RGB:** `0, 119, 182` (for CSS rgba)
- **HSL:** `200 100% 36%` (for Tailwind)

### Step 2: Edit themeConfig.ts

Open `src/config/themeConfig.ts` and find the `colors` section:

```typescript
// Around line 200-230 for darkTheme
colors: {
    colorPrimary: '0, 119, 182',         // ← Change this RGB
    colorPrimaryDark: '0, 95, 146',      // ← Darker version
    colorPrimaryFull: 'rgb(0, 119, 182)',
    // ...
}
```

Also update the `critical` section:

```typescript
critical: {
    primary: '200 100% 45%',  // ← Change this HSL
    // ...
}
```

Do the same for `lightTheme` if you want different light mode colors.

### Step 3: Verify

1. Save the file
2. Check the browser - colors should update instantly
3. Test both light and dark modes
4. Check a few pages (home, services, blog)

## Changing Section Backgrounds

Section backgrounds are the colors behind each major section (Hero, About,
Skills, etc.).

### Edit sectionBackgrounds.ts

```typescript
// src/data/sectionBackgrounds.ts

// Dark mode backgrounds
export const darkModeColors: SectionColors = {
  hero: '#0F1A2B', // ← Deep blue
  about: '#1A2A3D', // ← Dark blue
  skills: '#1E3552', // ← Medium blue
  projects: '#253853',
  // ...
};

// Light mode backgrounds
export const lightModeColors: SectionColors = {
  hero: '#9AA6B2',
  about: '#BCCCDC',
  // ...
};
```

The system automatically creates smooth color transitions between sections.

## Using Colors in Components

### Tailwind Classes

Use the semantic color names:

```html
<!-- Primary color (50-900 scale) -->
<div class="bg-primary-500 text-primary-100 border-primary-700">
  <!-- Secondary color -->
  <button class="bg-secondary-600 hover:bg-secondary-500">
    <!-- Tertiary color -->
    <span class="text-tertiary-400"></span>
  </button>
</div>
```

### CSS Variables

For custom CSS or dynamic values:

```css
/* HSL format */
.my-element {
  color: hsl(var(--primary));
  background: hsl(var(--secondary));
}

/* RGB format (for opacity) */
.my-overlay {
  background: rgba(var(--color-primary), 0.5);
}
```

### Available Variables

| Variable            | Usage                  |
| ------------------- | ---------------------- |
| `--primary`         | Main accent (HSL)      |
| `--secondary`       | Secondary accent (HSL) |
| `--color-primary`   | Main accent (RGB)      |
| `--color-secondary` | Secondary accent (RGB) |
| `--color-tertiary`  | Tertiary accent (RGB)  |
| `--background`      | Page background (HSL)  |
| `--foreground`      | Main text color (HSL)  |

## Color Formats Explained

We use different formats because CSS needs them for different purposes:

| Format                | Example            | When to use                                |
| --------------------- | ------------------ | ------------------------------------------ |
| HSL (no wrapper)      | `200 100% 45%`     | Tailwind: `hsl(var(--primary))`            |
| RGB (comma separated) | `0, 119, 182`      | Opacity: `rgba(var(--color-primary), 0.5)` |
| Hex                   | `#0077B6`          | Direct values, JavaScript                  |
| Full RGB              | `rgb(0, 119, 182)` | Gradients, some CSS                        |

## Things to Avoid

### Don't edit generated files

These files are overwritten automatically:

- `src/styles/generated-theme.css`
- `src/styles/generated-section-backgrounds.css`
- `public/styles/giscus-custom*.css`

### Don't change semantic colors randomly

These colors have meaning to users:

- **Green** = Success, beginner difficulty
- **Red** = Error, advanced difficulty
- **Yellow/Amber** = Warning, intermediate difficulty

Changing them could confuse users.

### Don't touch brand colors

These are official colors and shouldn't change:

- LinkedIn blue (`#0077B5`)
- Technology logos (React, Vue, etc.)
- Dracula code theme

## Troubleshooting

### Colors not updating?

1. Make sure dev server is running (`npm run dev`)
2. Try hard refresh: `Ctrl+Shift+R`
3. Check the console for errors

### Flash of wrong colors on page load?

The critical CSS might be missing. Check that `BaseLayout.astro` includes the
critical CSS injection.

### Tailwind classes not working?

Make sure you're using the correct scale:

- `bg-primary` - Uses DEFAULT (CSS variable)
- `bg-primary-500` - Uses generated OKLCH scale
- `bg-primary/50` - Opacity modifier

## Quick Reference

### Change primary color

Edit `src/config/themeConfig.ts`:

- `colors.colorPrimary` (RGB)
- `critical.primary` (HSL)

### Change section backgrounds

Edit `src/data/sectionBackgrounds.ts`:

- `darkModeColors.hero` (hex)
- `lightModeColors.hero` (hex)

### Add a new color

1. Add to `themeConfig.ts` in the appropriate section
2. The color will be available as a CSS variable
3. For Tailwind classes, add to `tailwindColorScales` export

## Current Color Palette

**Ocean Depths** (current theme):

- **Primary:** `#0077B6` (Ocean Blue)
- **Secondary:** `#00B4D8` (Cyan)
- **Tertiary:** `#FF6B6B` (Coral)

---

_Last updated: 2025-12-16_
