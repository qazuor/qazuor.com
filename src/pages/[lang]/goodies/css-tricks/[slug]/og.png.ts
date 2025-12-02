import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for individual CSS tricks
 * Generates: /en/goodies/css-tricks/[slug]/og.png, /es/goodies/css-tricks/[slug]/og.png
 */

export const getStaticPaths: GetStaticPaths = async () => {
    const tricks = await getCollection('css-tricks');
    const paths: Array<{
        params: { lang: string; slug: string };
        props: { trick: CollectionEntry<'css-tricks'> };
    }> = [];

    for (const lang of Object.keys(languages)) {
        for (const trick of tricks) {
            paths.push({
                params: {
                    lang,
                    slug: trick.slug
                },
                props: { trick }
            });
        }
    }

    return paths;
};

interface Props {
    trick: CollectionEntry<'css-tricks'>;
}

export const GET: APIRoute<Props> = async ({ params, props }) => {
    const lang = (params.lang as 'en' | 'es') || 'en';
    const { trick } = props;

    return generateOgImageResponse({
        title: trick.data.title,
        subtitle: trick.data.description,
        type: 'css-trick',
        tags: trick.data.tags?.slice(0, 4) || [],
        lang
    });
};
