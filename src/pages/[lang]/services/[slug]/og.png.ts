import type { APIRoute, GetStaticPaths } from 'astro';
import { services } from '@/data/services';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for individual services
 * Generates: /en/services/web-apps/og.png, /es/services/landing-pages/og.png, etc.
 */

// Map service ID to translation key
const serviceKeyMap: Record<string, string> = {
    'web-apps': 'webApps',
    'landing-pages': 'landingPages',
    'automation-integration': 'automation',
    'social-media-design': 'socialDesign'
};

export const getStaticPaths: GetStaticPaths = () => {
    const paths = [];

    for (const lang of Object.keys(languages)) {
        for (const service of services) {
            paths.push({
                params: {
                    lang,
                    slug: service.slug
                },
                props: {
                    serviceId: service.id,
                    metaTitleKey: service.meta.titleKey,
                    metaDescriptionKey: service.meta.descriptionKey
                }
            });
        }
    }

    return paths;
};

interface Props {
    serviceId: string;
    metaTitleKey: string;
    metaDescriptionKey: string;
}

export const GET: APIRoute<Props> = async ({ params, props }) => {
    const lang = (params.lang as 'en' | 'es') || 'en';
    const t = getTranslations(lang);
    const serviceKey = serviceKeyMap[props.serviceId];

    // Get translated title and description
    const title = t(props.metaTitleKey, { markdown: false });
    const description = t(props.metaDescriptionKey, { markdown: false });

    // Get first 4 features as tags
    const tags: string[] = [];
    for (let i = 0; i < 4; i++) {
        const feature = t(`services.${serviceKey}.features.${i}`, { markdown: false });
        if (feature && !feature.includes(`services.${serviceKey}.features.${i}`)) {
            // Truncate long features
            tags.push(feature.length > 30 ? `${feature.slice(0, 27)}...` : feature);
        }
    }

    return generateOgImageResponse({
        title,
        subtitle: description,
        type: 'service',
        tags: tags.slice(0, 4),
        lang
    });
};
