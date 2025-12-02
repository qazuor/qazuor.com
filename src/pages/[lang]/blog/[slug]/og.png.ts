import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getEffectiveSlug } from '@/utils/blog';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for blog posts
 * Generates: /en/blog/[slug]/og.png, /es/blog/[slug]/og.png
 */

export const getStaticPaths: GetStaticPaths = async () => {
    const allBlogPosts = await getCollection('blog');

    // Generate paths for each language and each blog post
    return Object.keys(languages).flatMap((lang) =>
        allBlogPosts
            .filter((post: CollectionEntry<'blog'>) => !post.data.draft)
            .map((post: CollectionEntry<'blog'>) => ({
                params: { lang, slug: getEffectiveSlug(post) },
                props: {
                    title: post.data.title,
                    excerpt: post.data.excerpt,
                    tags: post.data.tags
                }
            }))
    );
};

interface Props {
    title: string;
    excerpt: string;
    tags: string[];
}

export const GET: APIRoute<Props> = async ({ props }) => {
    return generateOgImageResponse({
        title: props.title,
        subtitle: props.excerpt,
        type: 'blog',
        tags: props.tags
    });
};
