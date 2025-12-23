import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { getAllUniqueSlugs, getBlogPostBySlugWithFallback, type SupportedLang } from '@/utils/blog';
import { generateOgImageResponse } from '@/utils/og-image';

/**
 * Static OG Image endpoint for blog posts
 * Generates: /en/blog/[slug]/og.png, /es/blog/[slug]/og.png
 * Uses fallback to Spanish if English version doesn't exist
 */

export const getStaticPaths: GetStaticPaths = async () => {
    const allBlogPosts = await getCollection('blog');

    // Get all unique slugs from published posts
    const uniqueSlugs = getAllUniqueSlugs(allBlogPosts);

    // Generate paths for each language and each unique slug
    const paths = [];
    for (const lang of Object.keys(languages)) {
        for (const slug of uniqueSlugs) {
            const postResult = getBlogPostBySlugWithFallback(allBlogPosts, slug, lang as SupportedLang);

            if (postResult) {
                paths.push({
                    params: { lang, slug },
                    props: {
                        title: postResult.post.data.title,
                        excerpt: postResult.post.data.excerpt,
                        tags: postResult.post.data.tags
                    }
                });
            }
        }
    }

    return paths;
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
