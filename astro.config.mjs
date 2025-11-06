import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import compressor from 'astro-compressor';
import expressiveCode from 'astro-expressive-code';
import favicons from 'astro-favicons';
import min from 'astro-min';
import rehypeMermaid from 'rehype-mermaid';

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
      minify_html: true,
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
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: 'inline-svg', // Embed SVG directly in HTML for styling
          dark: true, // Use dark theme to match site
          mermaidConfig: {
            theme: 'dark',
            themeVariables: {
              primaryColor: 'oklch(0.55 0.22 270)', // Match site primary
              primaryTextColor: 'oklch(0.95 0 0)',
              primaryBorderColor: 'oklch(0.55 0.22 270)',
              lineColor: 'oklch(0.7 0.18 180)', // Match site secondary
              secondaryColor: 'oklch(0.18 0.02 270)', // Match bg-secondary-dark
              tertiaryColor: 'oklch(0.22 0.02 270)',
              background: 'oklch(0.12 0.02 270)', // Match bg-primary-dark
              mainBkg: 'oklch(0.18 0.02 270)',
              secondaryBkg: 'oklch(0.22 0.02 270)',
              textColor: 'oklch(0.95 0 0)',
              fontSize: '16px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
          },
        },
      ],
    ],
  },
});
