/**
 * Astro Integration: Timeline Sprite Watcher
 *
 * Watches for changes in timeline SVG icons and invalidates the sprite module
 * to trigger HMR (Hot Module Replacement) in development mode.
 *
 * This ensures that when you modify an SVG file in src/icons/timeline/,
 * the TimelineIconSprite component automatically regenerates without requiring
 * a dev server restart.
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import timelineSpriteWatcher from './integrations/timeline-sprite-watcher';
 *
 * export default defineConfig({
 *   integrations: [
 *     timelineSpriteWatcher({
 *       iconsPath: 'src/icons/timeline',
 *       verbose: true
 *     })
 *   ]
 * });
 * ```
 */

import { readdir, watch } from 'node:fs/promises';
import { join } from 'node:path';
import type { AstroIntegration } from 'astro';
import type { ViteDevServer } from 'vite';

/**
 * Configuration options for the timeline sprite watcher integration
 */
export interface TimelineSpriteWatcherOptions {
    /**
     * Path to the icons directory relative to project root
     * @default 'src/icons/timeline'
     */
    iconsPath?: string;

    /**
     * Enable verbose logging
     * @default false
     */
    verbose?: boolean;
}

/**
 * Creates the Timeline Sprite Watcher integration
 *
 * @param options - Integration configuration options
 * @returns Astro integration object
 */
export default function timelineSpriteWatcher(options: TimelineSpriteWatcherOptions = {}): AstroIntegration {
    const { iconsPath = 'src/icons/timeline', verbose = false } = options;

    let projectRoot = '';
    let viteServer: ViteDevServer | null = null;

    return {
        name: 'timeline-sprite-watcher',
        hooks: {
            'astro:config:setup': async ({ config, command, updateConfig }) => {
                projectRoot = config.root.pathname;

                // Only setup watcher in dev mode
                if (command !== 'dev') {
                    return;
                }

                if (verbose) {
                    console.log('\n🎨 Timeline Sprite Watcher: Initializing...');
                    console.log(`   Icons path: ${iconsPath}`);
                    console.log(`   Project root: ${projectRoot}\n`);
                }

                // Add Vite plugin to handle HMR
                updateConfig({
                    vite: {
                        plugins: [
                            {
                                name: 'timeline-sprite-hmr',
                                configureServer(server) {
                                    viteServer = server;

                                    if (verbose) {
                                        console.log('✅ Timeline Sprite Watcher: Vite plugin configured\n');
                                    }
                                },
                                async buildStart() {
                                    // Start watching for SVG changes
                                    startWatching();
                                }
                            }
                        ]
                    }
                });
            }
        }
    };

    /**
     * Starts watching the icons directory for changes
     */
    async function startWatching(): Promise<void> {
        const watchPath = join(projectRoot, iconsPath);

        try {
            // Verify directory exists
            await readdir(watchPath);

            if (verbose) {
                console.log(`👀 Watching for changes: ${iconsPath}`);
            }

            // Watch for changes using fs.watch
            const watcher = watch(watchPath, { recursive: false });

            for await (const event of watcher) {
                // Only react to .svg file changes
                if (event.filename?.endsWith('.svg')) {
                    if (verbose) {
                        console.log(`\n🔄 SVG changed: ${event.filename}`);
                    }

                    // Invalidate the sprite module to trigger HMR
                    if (viteServer) {
                        // Find the TimelineIconSprite module
                        const spriteModule = Array.from(viteServer.moduleGraph.urlToModuleMap.keys()).find((url) =>
                            url.includes('TimelineIconSprite.astro')
                        );

                        if (spriteModule) {
                            const module = viteServer.moduleGraph.urlToModuleMap.get(spriteModule);
                            if (module) {
                                // Invalidate the module
                                viteServer.moduleGraph.invalidateModule(module);

                                // Trigger HMR update
                                viteServer.ws.send({
                                    type: 'full-reload',
                                    path: '*'
                                });

                                if (verbose) {
                                    console.log('✅ Sprite module invalidated, HMR triggered\n');
                                }
                            }
                        } else if (verbose) {
                            console.warn('⚠️  Could not find TimelineIconSprite module\n');
                        }
                    }
                }
            }
        } catch (error) {
            if (verbose) {
                console.error(`❌ Error watching directory: ${iconsPath}`);
                console.error(error);
            }
        }
    }
}
