import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import normalizeTrailingSlash from '@reunmedia/astro-normalize-trailing-slash';
import compressor from 'astro-compressor';
import expressiveCode from 'astro-expressive-code';
import favicons from 'astro-favicons';
import min from 'astro-min';
import subsites from 'astro-subsites';
import { defineConfig } from 'astro/config';
import { pluginLanguageBadge } from 'expressive-code-language-badge';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'always',
  integrations: [
    // 1. Frameworks first
    react(),
    tailwind({
      applyBaseStyles: false,
    }),

    // 2. Content & Features
    expressiveCode({
      themes: ['dracula', 'github-light'],
      defaultProps: {
        showLineNumbers: true,
        wrap: true,
      },
      plugins: [
        pluginLanguageBadge({
          textTransform: 'lowercase',
          excludeLanguages: ['json', 'css', 'bash'],
          languageMap: {
            cpp: 'C++',
            csharp: 'C#',
            ts: 'TypeScript',
            js: 'JavaScript',
          },
        }),
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
          borderColor: '#0f3460',
        },
      },
    }),
    mdx(),
    favicons({
      appName: 'qazuor',
      appShortName: 'qazuor',
      appDescription: 'Portfolio & Technical Blog - Full Stack Developer',
      lang: 'en',
      background: '#0f172a',
      theme_color: '#3b82f6',
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
        },
      },
    }),
    subsites(),
    normalizeTrailingSlash(),

    // 3. Optimization - Minify first
    min({
      minify_css: true,
      minify_js: true,
      minify_html: false, // Disabled to preserve code blocks (Mermaid diagrams)
      keep_comments: false,
    }),

    // 4. Compression - ALWAYS LAST
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],
  vite: {
    assetsInclude: ['**/*.woff', '**/*.woff2'],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  experimental: {
    clientPrerender: true,
  },
  markdown: {
    syntaxHighlight: false, // Disabled in favor of expressive-code
  },
});
