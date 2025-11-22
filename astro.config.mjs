import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import normalizeTrailingSlash from '@reunmedia/astro-normalize-trailing-slash';
import compressor from 'astro-compressor';
import expressiveCode from 'astro-expressive-code';
import favicons from 'astro-favicons';
import lighthouse from 'astro-lighthouse';
import subsites from 'astro-subsites';
import { defineConfig } from 'astro/config';
import { pluginLanguageBadge } from 'expressive-code-language-badge';
import colorInterpolation from './integrations/color-interpolation.ts';
import searchIndex from './integrations/search-index.ts';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    output: 'static',

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
            sourceFile: 'src/data/colors.ts',
            outputFile: 'src/styles/generated-colors.css',
            steps: 5,
            watch: true
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
                    excludeLanguages: ['json', 'css', 'bash'],
                    languageMap: {
                        cpp: 'C++',
                        csharp: 'C#',
                        ts: 'TypeScript',
                        js: 'JavaScript'
                    }
                })
            ],
            styleOverrides: {
                languageBadge: {
                    // Prominent badge style with border
                    fontSize: '0.85rem',
                    fontColor: '#e6f3ff',
                    fontWeight: '600',
                    background: '#1a1a2e',
                    borderRadius: '0.5rem',
                    opacity: '0.95',
                    borderWidth: '2px',
                    borderColor: '#0f3460'
                }
            }
        }),
        mdx(),
        favicons({
            input: {
                favicons: ['public/favicon.svg', 'public/avatar.png']
            },
            appName: 'qazuor',
            appShortName: 'qazuor',
            appDescription: 'Portfolio & Technical Blog - Full Stack Developer',
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
            }
        }),
        subsites(),
        normalizeTrailingSlash(),

        // 4. Compression - ALWAYS LAST
        compressor({
            gzip: true,
            brotli: true
        })
    ],
    vite: {
        assetsInclude: ['**/*.woff', '**/*.woff2'],
        resolve: {
            alias: {
                '@': new URL('./src', import.meta.url).pathname
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
