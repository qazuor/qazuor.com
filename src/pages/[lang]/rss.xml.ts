import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { languages } from '@/i18n/ui';
import { getTranslations } from '@/i18n/utils';
import { getBlogPostsForLangWithFallback, getEffectiveSlug, type SupportedLang } from '@/utils/blog';

const SITE_URL = 'https://qazuor.com';

/**
 * Generate static paths for RSS feeds in each language
 */
export function getStaticPaths() {
    return Object.keys(languages).map((lang) => ({
        params: { lang }
    }));
}

/**
 * Generate RSS feed for the specified language
 */
export async function GET(context: APIContext) {
    const lang = context.params.lang as SupportedLang;
    const t = getTranslations(lang);

    const allBlogPosts = await getCollection('blog');
    const postsWithFallback = getBlogPostsForLangWithFallback(allBlogPosts, lang)
        .filter(({ post }) => !post.data.draft)
        .sort((a, b) => b.post.data.publishDate.getTime() - a.post.data.publishDate.getTime());

    return rss({
        title: `qazuor - ${t('blog.title', { markdown: false })}`,
        description: t('blog.pageDescription', { markdown: false }),
        site: SITE_URL,
        items: postsWithFallback.map(({ post }) => ({
            title: post.data.title,
            pubDate: post.data.publishDate,
            description: post.data.excerpt,
            link: `/${lang}/blog/${getEffectiveSlug(post)}/`,
            categories: post.data.tags,
            author: post.data.author || 'qazuor'
        })),
        customData: `<language>${lang === 'es' ? 'es-AR' : 'en-US'}</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<atom:link href="${SITE_URL}/${lang}/rss.xml" rel="self" type="application/rss+xml"/>`,
        xmlns: {
            atom: 'http://www.w3.org/2005/Atom'
        }
    });
}
