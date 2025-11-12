import { defaultLang, type Locale, ui } from './ui';

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLang;
}

/**
 * Procesa marcadores Markdown en el texto
 * Soporta: **negrita**, *cursiva*, `código`
 */
function processMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **negrita**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *cursiva*
    .replace(/`(.*?)`/g, '<code>$1</code>') // `código`
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>'); // [texto](url)
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

    // 2. Después procesar Markdown
    if (options?.markdown) {
      result = processMarkdown(result);
    }

    return result;
  };
}

export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname;
  const parts = pathname.split('/');
  const lang = parts[1];

  if (lang in ui) {
    parts.splice(1, 1);
  }

  return parts.join('/') || '/';
}

export function translatePath(path: string, lang: Locale): string {
  // Remove leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Always add locale prefix (prefixDefaultLocale is true)
  return `/${lang}/${cleanPath}`;
}
