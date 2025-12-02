import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for snippets listing page
 * Generates: /en/goodies/snippets/og.png, /es/goodies/snippets/og.png
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
        title: t('snippets.title', { markdown: false }),
        subtitle: t('snippets.subtitle', { markdown: false }),
        type: 'snippet',
        tags: ['TypeScript', 'JavaScript', 'React', 'Node.js'],
        lang
    });
};
