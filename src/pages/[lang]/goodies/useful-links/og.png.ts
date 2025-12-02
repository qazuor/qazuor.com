import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for useful links listing page
 * Generates: /en/goodies/useful-links/og.png, /es/goodies/useful-links/og.png
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
        title: t('usefulLinks.title', { markdown: false }),
        subtitle: t('usefulLinks.subtitle', { markdown: false }),
        type: 'link',
        tags: ['Resources', 'Docs', 'Libraries', 'Learning'],
        lang
    });
};
