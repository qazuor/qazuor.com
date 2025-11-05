import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // Redirect root path to default locale
  if (pathname === '/') {
    return context.redirect('/en', 302);
  }

  return next();
});
