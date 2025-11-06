import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import compressor from 'astro-compressor';
import expressiveCode from 'astro-expressive-code';
import favicons from 'astro-favicons';
import min from 'astro-min';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://qazuor.com',
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
    }),
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
