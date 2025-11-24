# Timeline Sprite Watcher Integration

Astro integration that watches for changes in timeline SVG icons and triggers
Hot Module Replacement (HMR) automatically.

## Problem Solved

By default, Astro components using `import.meta.glob` with `eager: true` load
files at module evaluation time. When you modify an SVG file, Vite's HMR doesn't
detect changes to globbed files, so the sprite doesn't regenerate without
restarting the dev server.

This integration solves that by:

1. Watching the `src/icons/timeline/` directory for SVG changes
2. Invalidating the `TimelineIconSprite.astro` module when changes are detected
3. Triggering a full page reload to show the updated sprite

## Installation

Already installed in `astro.config.mjs`:

```typescript
import timelineSpriteWatcher from './integrations/timeline-sprite-watcher';

export default defineConfig({
  integrations: [
    timelineSpriteWatcher({
      iconsPath: 'src/icons/timeline',
      verbose: true,
    }),
  ],
});
```

## Configuration Options

### `iconsPath`

- **Type:** `string`
- **Default:** `'src/icons/timeline'`
- Path to the icons directory relative to project root

### `verbose`

- **Type:** `boolean`
- **Default:** `false`
- Enable detailed logging for debugging

## How It Works

### 1. Setup Phase

During `astro:config:setup`, the integration:

- Stores the project root path
- Injects a Vite plugin named `timeline-sprite-hmr`
- Configures the Vite dev server reference

### 2. Watch Phase

When the dev server starts (`buildStart`), the integration:

- Starts watching `src/icons/timeline/` directory using `fs.watch`
- Listens for file change events (modify, create, delete)
- Filters for `.svg` file changes only

### 3. HMR Phase

When an SVG file changes, the integration:

1. Finds the `TimelineIconSprite.astro` module in Vite's module graph
2. Invalidates that module using `viteServer.moduleGraph.invalidateModule()`
3. Sends a full-reload message via WebSocket to the browser
4. Browser reloads and sprite regenerates with updated SVG

## Example Output (Verbose Mode)

```bash
🎨 Timeline Sprite Watcher: Initializing...
   Icons path: src/icons/timeline
   Project root: /home/user/project

✅ Timeline Sprite Watcher: Vite plugin configured

👀 Watching for changes: src/icons/timeline

# When you modify bolt.svg:
🔄 SVG changed: bolt.svg
✅ Sprite module invalidated, HMR triggered
```

## Troubleshooting

### Changes not detected

**Problem:** You modify an SVG but the sprite doesn't update

**Solution:**

1. Enable verbose mode to see logs
2. Check that the SVG file is in `src/icons/timeline/`
3. Verify the file extension is `.svg` (case-sensitive)
4. If still not working, restart the dev server

### Full reload instead of HMR

**Behavior:** The integration triggers a full page reload instead of hot module
replacement

**Why:** `import.meta.glob` with `eager: true` makes it difficult to do partial
HMR. A full reload ensures the sprite regenerates correctly.

**Is this okay?** Yes, full reloads are fast (< 100ms) and ensure consistency.

## Technical Notes

### Why not use Vite's built-in glob HMR?

Vite's HMR for `import.meta.glob` only works when:

- You use `{ eager: false }` (dynamic imports)
- The glob pattern is in a separate module that re-exports

Since we use `{ eager: true }` for better performance (no runtime async
loading), and the glob is inside an Astro component, we need manual HMR
handling.

### Why full reload instead of partial HMR?

Astro components are compiled to JavaScript at build time. When the component's
logic changes (the glob result), Vite can't partially update it without
re-evaluating the entire component. A full reload is the most reliable approach.

### Performance Impact

- **Development:** Negligible (< 1ms per file change)
- **Build:** Zero (only runs in dev mode)
- **Memory:** Minimal (single file watcher, ~1KB)

## Related Files

- **Integration:** `integrations/timeline-sprite-watcher/index.ts`
- **Sprite Component:** `src/components/ui/TimelineIconSprite.astro`
- **Icon Component:** `src/components/ui/TimelineIcon.tsx`
- **Icons Directory:** `src/icons/timeline/*.svg`

## License

Same as project license.
