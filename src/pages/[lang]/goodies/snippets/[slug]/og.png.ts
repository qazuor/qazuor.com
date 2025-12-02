import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for individual snippets
 * Generates: /en/goodies/snippets/[slug]/og.png, /es/goodies/snippets/[slug]/og.png
 */

export const getStaticPaths: GetStaticPaths = async () => {
    const snippets = await getCollection('snippets');
    const paths: Array<{
        params: { lang: string; slug: string };
        props: { snippet: CollectionEntry<'snippets'> };
    }> = [];

    for (const lang of Object.keys(languages)) {
        for (const snippet of snippets) {
            paths.push({
                params: {
                    lang,
                    slug: snippet.slug
                },
                props: { snippet }
            });
        }
    }

    return paths;
};

interface Props {
    snippet: CollectionEntry<'snippets'>;
}

export const GET: APIRoute<Props> = async ({ params, props }) => {
    const lang = (params.lang as 'en' | 'es') || 'en';
    const { snippet } = props;

    // Use language as first tag, then add other tags
    const tags = [snippet.data.language, ...(snippet.data.tags || [])].slice(0, 4);

    return generateOgImageResponse({
        title: snippet.data.title,
        subtitle: snippet.data.description,
        type: 'snippet',
        tags,
        lang
    });
};
