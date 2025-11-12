import React, { useMemo } from 'react';
import type { TranslationOptions } from '../../i18n/utils';
import { getLangFromUrl, getTranslations } from '../../i18n/utils';

interface TranslatedTextProps extends TranslationOptions {
  /** Clave de traducción */
  textKey: string;
  /** Elemento HTML a renderizar */
  as?: React.ElementType;
  /** Clases CSS adicionales */
  className?: string;
  /** Props adicionales del elemento */
  elementProps?: Record<string, unknown>;
  /** Si se debe renderizar como HTML (cuando hay markdown) */
  dangerouslySetInnerHTML?: boolean;
}

/**
 * Componente para renderizar texto traducido con soporte para Markdown y parámetros
 *
 * @example
 * ```tsx
 * // Texto simple
 * <TranslatedText textKey="nav.home" />
 *
 * // Con Markdown
 * <TranslatedText
 *   textKey="hero.title"
 *   markdown={true}
 *   as="h1"
 *   className="text-4xl font-bold"
 * />
 *
 * // Con parámetros
 * <TranslatedText
 *   textKey="welcome.message"
 *   params={{ name: "Juan", count: 5 }}
 *   markdown={true}
 * />
 * ```
 */
export function TranslatedText({
  textKey,
  params,
  markdown = false,
  fallback,
  as: Element = 'span',
  className,
  elementProps = {},
  dangerouslySetInnerHTML = false,
  ...rest
}: TranslatedTextProps) {
  // Función para obtener idioma actual
  const getCurrentLang = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      // Extraer idioma de la URL actual
      const url = new URL(window.location.href);
      return getLangFromUrl(url);
    }
    return 'en' as const; // Fallback para SSR
  }, []);

  const translatedText = useMemo(() => {
    const lang = getCurrentLang();
    const t = getTranslations(lang);
    return t(textKey, { params, markdown, fallback });
  }, [textKey, params, markdown, fallback, getCurrentLang]);

  // Si hay markdown o HTML, usar dangerouslySetInnerHTML
  const shouldUseHTML = markdown || dangerouslySetInnerHTML;

  if (shouldUseHTML) {
    return React.createElement(Element, {
      className,
      dangerouslySetInnerHTML: { __html: translatedText },
      ...elementProps,
      ...rest,
    });
  }

  return React.createElement(
    Element,
    {
      className,
      ...elementProps,
      ...rest,
    },
    translatedText,
  );
}

/**
 * Hook para obtener la función de traducción en React components
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const t = useTranslations();
 *
 *   const title = t('hero.title', {
 *     markdown: true,
 *     params: { name: 'Usuario' }
 *   });
 *
 *   return <h1 dangerouslySetInnerHTML={{ __html: title }} />;
 * }
 * ```
 */
export function useTranslations() {
  const getCurrentLang = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      return getLangFromUrl(url);
    }
    return 'en' as const;
  }, []);

  return useMemo(() => {
    const lang = getCurrentLang();
    return getTranslations(lang);
  }, [getCurrentLang]);
}
