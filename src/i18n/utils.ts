import { defaultLang, type Locale, languages, ui } from './ui';

/**
 * Get locale from URL pathname
 *
 * @example
 * ```typescript
 * getLangFromUrl(new URL('https://example.com/es/about')); // 'es'
 * getLangFromUrl(new URL('https://example.com/invalid/about')); // 'en' (default)
 * ```
 */
export function getLangFromUrl(url: URL): Locale {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) return lang as Locale;
    return defaultLang;
}

/**
 * Procesa marcadores Markdown en el texto
 * Soporta: **negrita**, *cursiva**, `código`
 */
function processMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **negrita**
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // *cursiva*
        .replace(/`(.*?)`/g, '<code>$1</code>') // `código`
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>'); // [texto](url)
}

/**
 * Elimina marcadores Markdown del texto dejando solo el contenido
 * Soporta: **negrita**, *cursiva*, `código`, [links](url)
 */
function stripMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // **negrita** → negrita
        .replace(/\*(.*?)\*/g, '$1') // *cursiva* → cursiva
        .replace(/`(.*?)`/g, '$1') // `código` → código
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // [texto](url) → texto
}

/**
 * Interpola parámetros en el texto
 * Soporta: {param}, {param:default}
 */
function interpolateParams(text: string, params?: Record<string, string | number>): string {
    if (!params) return text;

    return text.replace(/\{([^}:]+)(?::([^}]*))?\}/g, (match, key, defaultValue) => {
        const value = params[key];
        if (value !== undefined) {
            return String(value);
        }
        return defaultValue || match;
    });
}

export interface TranslationOptions {
    /** Parámetros para interpolación */
    params?: Record<string, string | number>;
    /** Procesar marcadores Markdown */
    markdown?: boolean;
    /** Valor por defecto si no se encuentra la traducción */
    fallback?: string;
}

/**
 * Get translations for a locale
 *
 * @example
 * ```typescript
 * const t = getTranslations('en');
 * t('common.title'); // Returns translated string
 * t('services.webApps.title', { markdown: true }); // Processes markdown
 * t('hero.greeting', { params: { name: 'John' } }); // Interpolates params
 * ```
 */
export function getTranslations(lang: Locale) {
    return function t(key: string, options?: TranslationOptions): string {
        const keys = key.split('.');
        let value: unknown = ui[lang];

        // Navegar por las claves anidadas
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                return options?.fallback || key; // Return fallback or key if translation not found
            }
        }

        if (typeof value !== 'string') {
            return options?.fallback || key;
        }

        let result = value;

        // 1. Primero interpolar parámetros
        if (options?.params) {
            result = interpolateParams(result, options.params);
        }

        // 2. Después procesar o eliminar Markdown
        if (options?.markdown === true) {
            result = processMarkdown(result);
        } else if (options?.markdown === false) {
            result = stripMarkdown(result);
        }
        // Si markdown no está definido, devolver el texto sin modificar

        return result;
    };
}

/**
 * Get the route path from URL, removing the locale prefix
 *
 * @example
 * ```typescript
 * getRouteFromUrl(new URL('https://example.com/es/about')); // '/about'
 * getRouteFromUrl(new URL('https://example.com/about')); // '/about'
 * ```
 */
export function getRouteFromUrl(url: URL): string {
    const pathname = url.pathname;
    const parts = pathname.split('/');
    const lang = parts[1];

    if (lang in languages) {
        parts.splice(1, 1);
    }

    return parts.join('/') || '/';
}

/**
 * Translate a path by adding the locale prefix
 *
 * @example
 * ```typescript
 * translatePath('/about', 'es'); // '/es/about'
 * translatePath('about', 'en'); // '/en/about'
 * ```
 */
export function translatePath(path: string, lang: Locale): string {
    // Remove leading slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Always add locale prefix (prefixDefaultLocale is true)
    return `/${lang}/${cleanPath}`;
}
