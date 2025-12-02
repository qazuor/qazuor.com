import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for services listing page
 * Generates: /en/services/og.png, /es/services/og.png
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
        title: t('services.title', { markdown: false }),
        subtitle: t('services.subtitle', { markdown: false }),
        type: 'service',
        tags: ['Web Apps', 'Landing Pages', 'Automation'],
        lang
    });
};
