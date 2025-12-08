import { defineMiddleware } from 'astro:middleware';

const SUPPORTED_LOCALES = ['en', 'es'] as const;
const DEFAULT_LOCALE = 'en';
const LOCALE_COOKIE_NAME = 'preferred-locale';

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Detects the preferred locale from the Accept-Language header
 * Returns the best match from supported locales, or the default locale
 */
function detectLocaleFromHeader(acceptLanguage: string | null): SupportedLocale {
    if (!acceptLanguage) return DEFAULT_LOCALE;

    // Parse Accept-Language header (e.g., "es-ES,es;q=0.9,en;q=0.8")
    const languages = acceptLanguage
        .split(',')
        .map((lang) => {
            const [code, qValue] = lang.trim().split(';q=');
            return {
                // Get the primary language code (e.g., "es" from "es-ES")
                code: code.split('-')[0].toLowerCase(),
                // Default quality is 1.0 if not specified
                quality: qValue ? Number.parseFloat(qValue) : 1.0
            };
        })
        .sort((a, b) => b.quality - a.quality);

    // Find the first supported locale
    for (const { code } of languages) {
        if (SUPPORTED_LOCALES.includes(code as SupportedLocale)) {
            return code as SupportedLocale;
        }
    }

    return DEFAULT_LOCALE;
}

export const onRequest = defineMiddleware(async (context, next) => {
    const pathname = context.url.pathname;

    // Only handle root path redirection
    if (pathname === '/') {
        // Check if user has a saved preference (cookie)
        const cookieLocale = context.cookies.get(LOCALE_COOKIE_NAME)?.value as SupportedLocale | undefined;

        if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
            return context.redirect(`/${cookieLocale}`, 302);
        }

        // Detect from Accept-Language header
        const acceptLanguage = context.request.headers.get('accept-language');
        const detectedLocale = detectLocaleFromHeader(acceptLanguage);

        // Save preference for future visits (1 year expiry)
        context.cookies.set(LOCALE_COOKIE_NAME, detectedLocale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            httpOnly: false, // Allow JS access for language switcher
            secure: import.meta.env.PROD,
            sameSite: 'lax'
        });

        return context.redirect(`/${detectedLocale}`, 302);
    }

    return next();
});
