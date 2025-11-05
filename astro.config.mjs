import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import astroI18next from 'astro-i18next';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    astroI18next(),
  ],
  experimental: {
    clientPrerender: true,
  },
});
