import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for goodies main page
 * Generates: /en/goodies/og.png, /es/goodies/og.png
 */

export const getStaticPaths: GetStaticPaths = () => {
    return Object.keys(languages).map((lang) => ({
        params: { lang }
    }));
};

export const GET: APIRoute = async ({ params }) => {
    const lang = (params.lang as 'en' | 'es') || 'en';
    const t = getTranslations(lang);

    return generateOgImageResponse({
        title: t('goodies.title', { markdown: false }),
        subtitle: t('goodies.subtitle', { markdown: false }),
        type: 'goodies',
        tags: ['Snippets', 'CSS Tricks', 'Tools', 'Links'],
        lang
    });
};
