import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import normalizeTrailingSlash from '@reunmedia/astro-normalize-trailing-slash';
import AstroPWA from '@vite-pwa/astro';
import compressor from 'astro-compressor';
import expressiveCode from 'astro-expressive-code';
import favicons from 'astro-favicons';
import lighthouse from 'astro-lighthouse';
import { defineConfig } from 'astro/config';
import { pluginLanguageBadge } from 'expressive-code-language-badge';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import colorInterpolation from './integrations/color-interpolation.ts';
import giscusTheme from './integrations/giscus-theme.ts';
import searchIndex from './integrations/search-index.ts';
import socialBlogData from './integrations/social-blog-data.ts';
import testimonialAvatars from './integrations/testimonial-avatars.ts';
import themeGenerator from './integrations/theme-generator.ts';
import timelineSpriteWatcher from './integrations/timeline-sprite-watcher/index.ts';

// https://astro.build/config
export default defineConfig({
    site: 'https://qazuor.com',
    // Static output with selective SSR via prerender = false on specific pages
    // Root / uses SSR for language detection, all other pages are static
    output: 'static',
    // Vercel adapter for production, Node adapter for local preview
    adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),

    // Prefetch optimization for faster navigation
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'viewport' // More aggressive than 'hover' default
    },

    // Image optimization with Sharp
    image: {
        service: {
            entrypoint: 'astro/assets/services/sharp'
        }
    },

    integrations: [
        // Search Index Generator (early to setup infrastructure)
        searchIndex(),

        // Color Interpolation Generator (first to run early)
        colorInterpolation({
            sourceFile: 'src/data/sectionBackgrounds.ts',
            outputFile: 'src/styles/generated-section-backgrounds.css',
            steps: 5,
            watch: true
        }),

        // Theme Generator (generates theme CSS from themeConfig.ts)
        themeGenerator({
            configFile: 'src/config/themeConfig.ts',
            outputFile: 'src/styles/generated-theme.css',
            watch: true
        }),

        // Giscus Theme Generator (generates CSS from themeConfig)
        giscusTheme({
            sourceFile: 'src/config/themeConfig.ts',
            outputDir: 'public/styles',
            watch: true
        }),

        // Timeline Sprite Watcher (enable HMR for icon changes)
        timelineSpriteWatcher({
            iconsPath: 'src/icons/timeline',
            verbose: true
        }),

        // Testimonial Avatars Downloader (downloads avatarUrl images locally)
        testimonialAvatars({
            verbose: true
        }),

        // Social Blog Data Generator (generates JSON for social network publishing)
        socialBlogData({
            outputFile: 'public/socialNetworksBlogData.json',
            verbose: true
        }),

        lighthouse(),
        // 1. Frameworks first
        react(),
        tailwind({
            applyBaseStyles: false
        }),

        // 2. Content & Features
        expressiveCode({
            themes: ['dracula', 'github-light'],
            defaultProps: {
                showLineNumbers: true,
                wrap: true
            },
            plugins: [
                pluginLanguageBadge({
                    textTransform: 'lowercase',
                    excludeLanguages: ['txt', 'text', 'plaintext'],
                    languageMap: {
                        cpp: 'C++',
                        csharp: 'C#',
                        ts: 'TypeScript',
                        js: 'JavaScript',
                        tsx: 'TSX',
                        jsx: 'JSX',
                        md: 'Markdown'
                    }
                })
            ],
            // Minimal styleOverrides - CSS handles the rest
            styleOverrides: {
                borderRadius: '0',
                borderWidth: '0'
            }
        }),
        mdx(),
        favicons({
            input: {
                favicons: ['public/favicon.svg', 'public/avatar.png']
            },
            name: 'qazuor - Full-Stack Developer',
            short_name: 'qazuor',
            description: 'Portfolio & Technical Blog - Full Stack Developer',
            lang: 'en',
            background: '#0f172a',
            theme_color: '#3b82f6'
        }),
        sitemap({
            i18n: {
                defaultLocale: 'en',
                locales: {
                    en: 'en',
                    es: 'es'
                }
            },
            // Custom priority and changefreq based on page type
            serialize(item) {
                // Homepage - highest priority
                if (item.url.match(/\/(en|es)\/?$/)) {
                    item.priority = 1.0;
                    item.changefreq = 'weekly';
                }
                // Services pages - high priority
                else if (item.url.includes('/services')) {
                    item.priority = 0.9;
                    item.changefreq = 'monthly';
                }
                // Projects pages - high priority
                else if (item.url.includes('/projects')) {
                    item.priority = 0.8;
                    item.changefreq = 'monthly';
                }
                // Blog pages - medium-high priority (fresh content)
                else if (item.url.includes('/blog')) {
                    item.priority = 0.7;
                    item.changefreq = 'weekly';
                }
                // Goodies pages - medium priority
                else if (item.url.includes('/goodies')) {
                    item.priority = 0.6;
                    item.changefreq = 'monthly';
                }
                // Default for other pages
                else {
                    item.priority = 0.5;
                    item.changefreq = 'monthly';
                }
                return item;
            }
        }),
        normalizeTrailingSlash(),

        // 4. PWA - Service Worker for offline caching
        AstroPWA({
            mode: 'production',
            base: '/',
            scope: '/',
            includeAssets: ['favicon.svg', 'fonts/*.woff2'],
            registerType: 'autoUpdate',
            manifest: false, // Using astro-favicons manifest
            workbox: {
                // Exclude HTML from precache (too large due to inline SVGs)
                // HTML will be cached at runtime with NetworkFirst strategy
                globPatterns: ['**/*.{js,css,woff2,png,jpg,jpeg,svg,webp,avif,ico}'],
                // Cache strategies
                runtimeCaching: [
                    {
                        // Cache pages with NetworkFirst (always try network)
                        urlPattern: /^https:\/\/qazuor-com\.vercel\.app\/.*$/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'pages-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        // Cache static assets with CacheFirst
                        urlPattern: /\.(js|css|woff2?|png|jpg|jpeg|svg|webp|avif)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'static-assets',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        // Cache fonts specifically
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    }
                ],
                // Don't cache these
                navigateFallback: null,
                cleanupOutdatedCaches: true
            },
            devOptions: {
                enabled: false // Disable in dev to avoid issues
            }
        }),

        // 5. Compression - ALWAYS LAST
        compressor({
            gzip: true,
            brotli: true
        })
    ],
    vite: {
        plugins: [
            // Bundle analyzer (only in build mode)
            process.env.ANALYZE === 'true' &&
                visualizer({
                    filename: './dist/stats.html',
                    open: true,
                    gzipSize: true,
                    brotliSize: true
                }),
            // Enable compression in development and preview
            viteCompression({
                algorithm: 'gzip',
                ext: '.gz',
                threshold: 1024, // Only compress files > 1KB
                deleteOriginFile: false
            }),
            viteCompression({
                algorithm: 'brotliCompress',
                ext: '.br',
                threshold: 1024,
                deleteOriginFile: false
            })
        ],
        assetsInclude: ['**/*.woff', '**/*.woff2'],
        resolve: {
            alias: {
                '@': new URL('./src', import.meta.url).pathname
            }
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        // Vendor libraries
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom')) {
                                return 'vendor-react';
                            }
                            // Lightbox lite in separate chunk - lazy loaded only when user clicks image (4.7KB)
                            if (id.includes('yet-another-react-lightbox-lite')) {
                                return 'vendor-lightbox';
                            }
                            // Giscus comments - only used in blog pages
                            if (id.includes('@giscus/react') || id.includes('giscus')) {
                                return 'vendor-giscus';
                            }
                            if (id.includes('embla-carousel')) {
                                return 'vendor-ui';
                            }
                            if (id.includes('fuse.js') || id.includes('typeit')) {
                                return 'vendor-utils';
                            }
                        }

                        // i18n locales
                        if (id.includes('/locales/en/')) {
                            return 'i18n-en';
                        }
                        if (id.includes('/locales/es/')) {
                            return 'i18n-es';
                        }

                        // Icons
                        if (id.includes('/icons/ui/')) {
                            return 'icons-ui';
                        }
                    }
                }
            }
        },
        server: {
            watch: {
                ignored: [
                    '**/node_modules/**',
                    '**/.git/**',
                    '**/.pnpm-store/**',
                    '**/dist/**',
                    '**/build/**',
                    '**/.output/**',
                    '**/coverage/**',
                    '**/.vercel/**',
                    '**/logs/**',
                    '**/tmp/**',
                    '**/temp/**'
                ]
            }
        }
    },
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'es'],
        routing: {
            prefixDefaultLocale: true
        }
    },
    experimental: {
        clientPrerender: true
    },
    markdown: {
        syntaxHighlight: false // Disabled in favor of expressive-code
    }
});
