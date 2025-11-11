# 🎨 Color System Documentation

This project uses an **automated color interpolation system** that generates all
section background colors and divider transitions automatically from a single
source of truth.

## 📁 **How It Works**

### **Source of Truth: `src/data/colors.ts`**

All colors are defined in this file:

```typescript
export const darkModeColors: SectionColors = {
  hero: '#473472',
  about: '#53629E',
  skills: '#473472',
  projects: '#87BAC3',
  blog: '#473472',
  testimonials: '#53629E',
  contact: '#87BAC3',
  footer: '#000000',
};

export const lightModeColors: SectionColors = {
  hero: '#E6E0F0',
  about: '#E1E7F5',
  skills: '#E6E0F0',
  projects: '#F0F8FA',
  blog: '#E6E0F0',
  testimonials: '#E1E7F5',
  contact: '#F0F8FA',
  footer: '#F5F5F5',
};
```

### **Automatic Generation**

The **Astro Integration** (`integrations/color-interpolation.ts`) automatically:

1. **Reads** `src/data/colors.ts` during build
2. **Calculates** 5-step interpolations between all adjacent sections
3. **Generates** `src/styles/generated-colors.css` with all CSS custom
   properties
4. **Watches** for changes in development mode

### **Generated Output**

For each transition (like hero → about), it generates:

```css
/* Auto-generated in src/styles/generated-colors.css */
:root {
  --section-hero-bg: #e6e0f0;
  --section-about-bg: #e1e7f5;

  --hero-to-about-1: #e5e1f1;
  --hero-to-about-2: #e4e3f2;
  --hero-to-about-3: #e3e4f3;
  --hero-to-about-4: #e2e6f4;
  --hero-to-about-5: #e1e7f5;
}

.dark {
  --section-hero-bg: #473472;
  --section-about-bg: #53629e;

  --hero-to-about-1: #493677;
  /* ... more interpolations ... */
}
```

## 🎯 **How to Change Colors**

### **Step 1: Edit the Source**

Simply modify the colors in `src/data/colors.ts`:

```typescript
export const darkModeColors: SectionColors = {
  hero: '#473472',
  about: '#53629E',
  skills: '#B91C1C', // ← Change to red
  projects: '#87BAC3',
  // ... rest unchanged
};
```

### **Step 2: Automatic Regeneration**

The system automatically:

- ✅ **Development**: Regenerates colors when you save `colors.ts`
- ✅ **Build**: Regenerates colors before every build
- ✅ **All Transitions**: Updates all affected divider interpolations

### **Step 3: That's It!**

No manual work needed. The system handles:

- ✅ Section background colors (light & dark)
- ✅ All 7 divider transitions with 5-step interpolations
- ✅ Smooth theme switching
- ✅ CSS custom properties for all components

## 🚀 **Examples**

### **Change Skills Section to Red**

```typescript
// src/data/colors.ts
export const darkModeColors: SectionColors = {
  // ... other colors
  skills: '#B91C1C', // Red for dark mode
};

export const lightModeColors: SectionColors = {
  // ... other colors
  skills: '#FEF2F2', // Light red for light mode
};
```

**Result**: Skills section becomes red, and both `about-to-skills` and
`skills-to-projects` dividers automatically interpolate to/from red.

### **Change Projects Section to Green**

```typescript
export const darkModeColors: SectionColors = {
  // ... other colors
  projects: '#059669', // Green for dark mode
};

export const lightModeColors: SectionColors = {
  // ... other colors
  projects: '#ECFDF5', // Light green for light mode
};
```

**Result**: Projects section becomes green, and `skills-to-projects` and
`projects-to-blog` dividers automatically update.

## 🔧 **Technical Details**

### **Files Modified by System**

- ✅ **Generated**: `src/styles/generated-colors.css` (auto-overwritten)
- ✅ **Source**: `src/data/colors.ts` (you edit this)
- ✅ **Integration**: `integrations/color-interpolation.ts` (handles automation)

### **Files Using the Colors**

- ✅ **Layout**: `src/layouts/BaseLayout.astro` imports generated CSS
- ✅ **Dividers**: All divider components use `data-transition` attributes
- ✅ **Sections**: Use `--section-*-bg` CSS custom properties

### **Build Integration**

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    colorInterpolation({
      sourceFile: 'src/data/colors.ts',
      outputFile: 'src/styles/generated-colors.css',
      steps: 5,
      watch: true,
    }),
    // ... other integrations
  ],
});
```

## ⚡ **Performance**

- ✅ **Zero Runtime Cost**: All colors pre-generated at build time
- ✅ **Efficient CSS**: Single file with all interpolations
- ✅ **Fast Development**: Instant regeneration on file changes
- ✅ **Small Bundle**: No JavaScript color libraries needed

## 🎨 **Color Guidelines**

### **Recommended Approach**

1. **Start with Dark Mode**: Pick vibrant colors for dark mode
2. **Generate Light Mode**: Use very light versions for light mode
3. **Test Contrast**: Ensure readability in both themes
4. **Preview Transitions**: Check that divider interpolations look smooth

### **Color Picker Tips**

Use online tools like [Colorpicker.me](https://colorpicker.me) to:

- ✅ Pick complementary colors
- ✅ Generate light variants
- ✅ Preview gradient transitions
- ✅ Check accessibility contrast

---

## 📝 **Summary**

This automated system gives you:

- 🎯 **Single Source of Truth**: Edit one file to change everything
- 🚀 **Zero Manual Work**: All interpolations calculated automatically
- ⚡ **Perfect Performance**: Build-time generation, zero runtime cost
- 🔄 **Instant Updates**: Development mode watches for changes
- 🎨 **Professional Results**: Smooth color transitions between all sections

**Just change `src/data/colors.ts` and everything else happens automatically!**
🎉
