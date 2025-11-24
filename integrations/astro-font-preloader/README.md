# Astro Font Preloader Integration

Automatically detects `@fontsource` fonts used in your Astro project and copies
`.woff2` files to `public/fonts/` directory. This enables static font preloading
with predictable paths.

## Features

- **Auto-detection**: Scans source files for `@fontsource` imports
- **Manual configuration**: Explicitly specify fonts if needed
- **Dev + Build support**: Works in both development and production
- **Subset filtering**: Only copy needed character subsets (e.g., latin)
- **Type-safe**: Full TypeScript support
- **Verbose logging**: Optional detailed output for debugging

## Installation

This integration is already part of the project. No installation needed.

## Usage

### Basic (Auto-detect)

```ts
// astro.config.mjs
import fontPreloader from './src/integrations/astro-font-preloader';

export default defineConfig({
  integrations: [
    fontPreloader({
      autoDetect: true,
      subsets: ['latin'],
      verbose: true,
    }),
  ],
});
```

### Manual Configuration

```ts
// astro.config.mjs
import fontPreloader from './src/integrations/astro-font-preloader';

export default defineConfig({
  integrations: [
    fontPreloader({
      autoDetect: false,
      fonts: [
        {
          family: 'inter',
          weights: [400, 600, 700],
          subsets: ['latin'],
          styles: ['normal'],
        },
        {
          family: 'jetbrains-mono',
          weights: [400, 600],
          subsets: ['latin'],
          styles: ['normal'],
        },
      ],
      verbose: true,
    }),
  ],
});
```

## Configuration Options

| Option          | Type      | Default          | Description                                   |
| --------------- | --------- | ---------------- | --------------------------------------------- |
| `autoDetect`    | `boolean` | `true`           | Enable automatic font detection from imports  |
| `fonts`         | `array`   | `[]`             | Manual font configuration (if autoDetect off) |
| `subsets`       | `array`   | `['latin']`      | Character subsets to include                  |
| `includeItalic` | `boolean` | `false`          | Include italic font variants                  |
| `outputDir`     | `string`  | `'public/fonts'` | Output directory for copied fonts             |
| `verbose`       | `boolean` | `false`          | Enable detailed logging                       |

## How It Works

### 1. Detection Phase

The integration scans all `.astro`, `.ts`, `.tsx`, and `.css` files in `src/`
for `@fontsource` imports:

```ts
// Detects these patterns:
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
```

### 2. Resolution Phase

For each detected font, it:

1. Extracts: family, weight, style
2. Generates filename: `{family}-{subset}-{weight}-{style}.woff2`
3. Resolves source path: `node_modules/@fontsource/{family}/files/{filename}`

### 3. Copy Phase

Copies `.woff2` files to `public/fonts/`:

```
node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2
  → public/fonts/inter-latin-400-normal.woff2
```

## Example Output (Verbose Mode)

```
⚡ Font Preloader: Initializing...
   Project root: /home/user/project
   Output dir: public/fonts

🔍 Scanning for @fontsource imports...
   Found 45 files to scan
   ✅ Detected 6 font variants

📁 Resolving font file paths...
   ✓ inter 400 normal (latin)
   ✓ inter 600 normal (latin)
   ✓ inter 700 normal (latin)
   ✓ jetbrains-mono 400 normal (latin)
   ✓ jetbrains-mono 600 normal (latin)
   ✓ jetbrains-mono 700 normal (latin)
   ✅ Resolved 6 font files

📦 Copying font files...
   ✓ inter-latin-400-normal.woff2
   ✓ inter-latin-600-normal.woff2
   ✓ inter-latin-700-normal.woff2
   ✓ jetbrains-mono-latin-400-normal.woff2
   ✓ jetbrains-mono-latin-600-normal.woff2
   ✓ jetbrains-mono-latin-700-normal.woff2

✅ Font Preloader: Copied 6 fonts
```

## Using Preloaded Fonts

After fonts are copied to `public/fonts/`, update your layout to use static
preload hints:

```astro
---
// src/layouts/BaseLayout.astro
---

<html>
  <head>
    <!-- Static preload hints with predictable paths -->
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

    <!-- Keep @fontsource imports for @font-face declarations -->
    <style>
      @import '@fontsource/inter/400.css';
      @import '@fontsource/inter/600.css';
      @import '@fontsource/inter/700.css';
    </style>
  </head>
</html>
```

## Troubleshooting

### Fonts not copied

1. **Check imports**: Ensure `@fontsource` imports exist in source files
2. **Verify node_modules**: Run `npm install` to ensure packages exist
3. **Enable verbose**: Set `verbose: true` to see detailed logs
4. **Check subsets**: Ensure requested subset exists (e.g., 'latin')

### Build errors

1. **Missing fonts**: Integration will warn but not fail the build
2. **Permission errors**: Ensure `public/fonts/` is writable
3. **Path issues**: Check `outputDir` configuration

### Performance

- Integration runs once at startup (dev) and once at build
- Minimal overhead (~50-100ms for typical projects)
- No runtime performance impact

## Technical Details

### File Structure

```
src/integrations/astro-font-preloader/
├── index.ts          # Main integration & Astro hooks
├── font-detector.ts  # Detection & resolution logic
└── README.md         # This file
```

### Astro Hooks Used

- `astro:config:setup`: Initialize and store config
- `astro:config:done`: Copy fonts (runs in both dev and build)
- `astro:server:start`: Log dev server readiness

### Supported Font Formats

- `.woff2` only (best compression, universal support)
- Other formats (`.woff`, `.ttf`) not needed for modern browsers

## Future Enhancements

Potential improvements for future versions:

- [ ] Support for custom font packages (non-@fontsource)
- [ ] Automatic preload hint generation
- [ ] Cache invalidation strategies
- [ ] Subset optimization (only copy used glyphs)
- [ ] Font subsetting integration

## License

MIT License - Part of qazuor.com project

## Related

- [@fontsource](https://fontsource.org/) - Self-hosted open source fonts
- [Astro Integrations](https://docs.astro.build/en/reference/integrations-reference/)
- [Font Loading Best Practices](https://web.dev/font-best-practices/)
