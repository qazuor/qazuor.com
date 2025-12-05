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
    // Local cleanSlug function for use within getStaticPaths (hoisting workaround)
    const cleanSlugLocal = (slug: string) => slug.replace(/\/\d+-/, '/');

    const snippets = await getCollection('snippets');
    const paths: Array<{
        params: { lang: string; slug: string | undefined };
        props: { snippet: CollectionEntry<'snippets'> };
    }> = [];

    for (const lang of Object.keys(languages)) {
        for (const snippet of snippets) {
            paths.push({
                params: {
                    lang,
                    slug: cleanSlugLocal(snippet.slug)
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

    // Helper to get localized description
    const getDescription = (s: CollectionEntry<'snippets'>) => {
        return lang === 'es' ? s.data.description_es : s.data.description_en;
    };

    // Use language as first tag, then add other tags
    const tags = [snippet.data.language, ...(snippet.data.tags || [])].slice(0, 4);

    return generateOgImageResponse({
        title: snippet.data.name,
        subtitle: getDescription(snippet),
        type: 'snippet',
        tags,
        lang
    });
};
