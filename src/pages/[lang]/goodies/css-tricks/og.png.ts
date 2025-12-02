import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for CSS tricks listing page
 * Generates: /en/goodies/css-tricks/og.png, /es/goodies/css-tricks/og.png
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
        title: t('cssTricks.title', { markdown: false }),
        subtitle: t('cssTricks.subtitle', { markdown: false }),
        type: 'css-trick',
        tags: ['CSS', 'Animations', 'Layouts', 'Effects'],
        lang
    });
};
