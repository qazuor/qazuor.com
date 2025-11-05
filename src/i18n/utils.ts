import { defaultLang, type Locale, ui } from './ui';

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLang;
}

export function getTranslations(lang: Locale) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = ui[lang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
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
