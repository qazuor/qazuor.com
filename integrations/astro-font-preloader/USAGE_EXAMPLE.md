# Usage Example: Updating BaseLayout.astro

After the integration copies fonts to `/public/fonts/`, you can update your
layout to use static preload hints with predictable paths.

## Before (Dynamic Paths - Don't Work in Production)

```astro
<!-- ❌ Old approach: Dynamic paths to node_modules (breaks in production) -->
<link
  rel="preload"
  href="/node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="/node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="/node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

## After (Static Paths - Works Everywhere)

```astro
<!-- ✅ New approach: Static paths from public/fonts/ -->
<link
  rel="preload"
  href="/fonts/inter-latin-400-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="/fonts/inter-latin-600-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="/fonts/inter-latin-700-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

## Complete Example: src/layouts/BaseLayout.astro

```astro
---
// Import fonts (keep these for @font-face declarations)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';

// ... other imports
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- ✅ Preload critical fonts with static paths -->
    <!-- Inter 400 (body text) -->
    <link
      rel="preload"
      href="/fonts/inter-latin-400-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />

    <!-- Inter 600 (headings) -->
    <link
      rel="preload"
      href="/fonts/inter-latin-600-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />

    <!-- Inter 700 (bold) -->
    <link
      rel="preload"
      href="/fonts/inter-latin-700-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />

    <!-- JetBrains Mono 400 (code blocks) -->
    <link
      rel="preload"
      href="/fonts/jetbrains-mono-latin-400-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />

    <!-- ... rest of head -->
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

## Font Naming Convention

The integration uses this naming pattern:

```
{family}-{subset}-{weight}-{style}.woff2
```

**Examples:**

- `inter-latin-400-normal.woff2` → Inter, Latin subset, weight 400, normal style
- `inter-latin-600-normal.woff2` → Inter, Latin subset, weight 600, normal style
- `jetbrains-mono-latin-400-normal.woff2` → JetBrains Mono, Latin, 400, normal

## Which Fonts to Preload?

**Only preload critical fonts** used above-the-fold:

✅ **DO preload:**

- Body font (400)
- Heading fonts (600, 700)
- Code font (if visible above fold)

❌ **DON'T preload:**

- Italic variants (unless critical)
- Heavy weights (800, 900) unless used prominently
- Fonts only used below the fold

**Why?** Each preload hint delays other resources. Only preload fonts that
prevent layout shifts or improve LCP (Largest Contentful Paint).

## Testing

After updating BaseLayout.astro:

1. **Development:**

   ```bash
   npm run dev
   # Visit http://localhost:4321
   # Open DevTools → Network → Filter "fonts"
   # Verify fonts load from /fonts/ (not /node_modules/)
   ```

2. **Production:**

   ```bash
   npm run build
   npm run preview
   # Visit http://localhost:4322
   # Check Network tab again
   ```

3. **Lighthouse:**
   ```bash
   npm run build
   # Run Lighthouse audit
   # Check "Preload key requests" recommendation
   ```

## Expected Results

**Before integration:**

- ❌ 404 errors for font preloads (node_modules/ not deployed)
- ❌ Lighthouse warning: "Preload key requests"
- ❌ FOIT/FOUT (Flash of Invisible/Unstyled Text)

**After integration:**

- ✅ Fonts load successfully from /fonts/
- ✅ Lighthouse passes preload check
- ✅ Fonts load early, preventing layout shifts
- ✅ Improved LCP score

## Debugging

If fonts don't load:

1. **Check public/fonts/ exists:**

   ```bash
   ls public/fonts/
   ```

2. **Verify integration logs:**

   ```bash
   npm run dev --verbose
   # Look for "✅ Font Preloader: Copied X fonts"
   ```

3. **Check browser DevTools:**
   - Network tab → Filter "fonts"
   - Should see 200 status codes for /fonts/\*.woff2
   - Should NOT see /node_modules/ requests

## Performance Impact

**Metrics improvement (typical):**

- **LCP:** -100 to -300ms (fonts load earlier)
- **CLS:** Reduced layout shifts from font swaps
- **FCP:** Slight improvement (fonts available sooner)

**Bundle size:** No impact (fonts already in @fontsource packages)

## Related

- [Font Loading Best Practices](https://web.dev/font-best-practices/)
- [Preload Key Requests](https://web.dev/uses-rel-preload/)
- [FOUT vs FOIT](https://css-tricks.com/fout-foit-foft/)
