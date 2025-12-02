import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for tools listing page
 * Generates: /en/goodies/tools/og.png, /es/goodies/tools/og.png
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
        title: t('tools.title', { markdown: false }),
        subtitle: t('tools.subtitle', { markdown: false }),
        type: 'tool',
        tags: ['Development', 'Productivity', 'Design', 'DevOps'],
        lang
    });
};
