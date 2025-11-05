import type { AstroI18nextConfig } from 'astro-i18next';

const config: AstroI18nextConfig = {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  routes: {
    es: {
      blog: 'blog',
      projects: 'proyectos',
    },
  },
  i18nextServer: {
    debug: false,
  },
  i18nextClient: {
    debug: false,
  },
};

export default config;
