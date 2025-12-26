import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { getAllCategoryKeys } from '@/data/blogCategories';
import { services } from '@/data/services';
import { languages } from '@/i18n/ui';
import { getAllUniqueSlugs } from '@/utils/blog';

const SITE_URL = 'https://qazuor.com';
const LANGS = Object.keys(languages) as Array<'en' | 'es'>;

interface SitemapUrl {
    loc: string;
    lastmod?: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
    alternates?: Array<{ lang: string; href: string }>;
}

/**
 * Determines priority and changefreq based on URL path
 */
function getUrlMeta(path: string): { priority: number; changefreq: SitemapUrl['changefreq'] } {
    // Homepage - highest priority
    if (path.match(/^\/(en|es)\/?$/)) {
        return { priority: 1.0, changefreq: 'weekly' };
    }
    // Services pages - high priority
    if (path.includes('/services')) {
        return { priority: 0.9, changefreq: 'monthly' };
    }
    // Projects pages - high priority
    if (path.includes('/projects')) {
        return { priority: 0.8, changefreq: 'monthly' };
    }
    // Blog pages - medium-high priority (fresh content)
    if (path.includes('/blog')) {
        return { priority: 0.7, changefreq: 'weekly' };
    }
    // Goodies pages - medium priority
    if (path.includes('/goodies')) {
        return { priority: 0.6, changefreq: 'monthly' };
    }
    // Default for other pages
    return { priority: 0.5, changefreq: 'monthly' };
}

/**
 * Creates alternates for i18n
 */
function createAlternates(basePath: string): Array<{ lang: string; href: string }> {
    return LANGS.map((lang) => ({
        lang,
        href: `${SITE_URL}/${lang}${basePath}`
    }));
}

/**
 * Generates the complete sitemap XML
 */
export const GET: APIRoute = async () => {
    const urls: SitemapUrl[] = [];
    const now = new Date().toISOString().split('T')[0];

    // === STATIC PAGES ===

    // Homepage for each language
    for (const lang of LANGS) {
        const path = `/${lang}/`;
        const meta = getUrlMeta(path);
        urls.push({
            loc: `${SITE_URL}${path}`,
            lastmod: now,
            ...meta,
            alternates: createAlternates('/')
        });
    }

    // Services index
    for (const lang of LANGS) {
        urls.push({
            loc: `${SITE_URL}/${lang}/services/`,
            lastmod: now,
            ...getUrlMeta('/services/'),
            alternates: createAlternates('/services/')
        });
    }

    // Projects index
    for (const lang of LANGS) {
        urls.push({
            loc: `${SITE_URL}/${lang}/projects/`,
            lastmod: now,
            ...getUrlMeta('/projects/'),
            alternates: createAlternates('/projects/')
        });
    }

    // Blog index
    for (const lang of LANGS) {
        urls.push({
            loc: `${SITE_URL}/${lang}/blog/`,
            lastmod: now,
            ...getUrlMeta('/blog/'),
            alternates: createAlternates('/blog/')
        });
    }

    // Goodies index and sub-sections
    const goodiesSections = ['', '/snippets/', '/css-tricks/', '/useful-links/', '/tools/'];
    for (const section of goodiesSections) {
        for (const lang of LANGS) {
            const path = `/goodies${section}`;
            urls.push({
                loc: `${SITE_URL}/${lang}${path}`,
                lastmod: now,
                ...getUrlMeta(path),
                alternates: createAlternates(path)
            });
        }
    }

    // === DYNAMIC CONTENT ===

    // Blog posts
    const blogPosts = await getCollection('blog', (entry: CollectionEntry<'blog'>) => !entry.data.draft);
    const uniqueBlogSlugs = getAllUniqueSlugs(blogPosts);

    for (const slug of uniqueBlogSlugs) {
        const path = `/blog/${slug}/`;
        for (const lang of LANGS) {
            urls.push({
                loc: `${SITE_URL}/${lang}${path}`,
                lastmod: now,
                ...getUrlMeta(path),
                alternates: createAlternates(path)
            });
        }
    }

    // Blog categories (dynamic from blogCategories.ts)
    const categories = getAllCategoryKeys();
    for (const category of categories) {
        const path = `/blog/category/${category}/`;
        for (const lang of LANGS) {
            urls.push({
                loc: `${SITE_URL}/${lang}${path}`,
                lastmod: now,
                ...getUrlMeta('/blog/'),
                alternates: createAlternates(path)
            });
        }
    }

    // Projects
    const projects = await getCollection('projects');
    const projectSlugs = [
        ...new Set(
            projects.map(
                (project: CollectionEntry<'projects'>) => project.data.slug || project.id.replace(/-(?:en|es)$/, '')
            )
        )
    ];

    for (const slug of projectSlugs) {
        const path = `/projects/${slug}/`;
        for (const lang of LANGS) {
            urls.push({
                loc: `${SITE_URL}/${lang}${path}`,
                lastmod: now,
                ...getUrlMeta(path),
                alternates: createAlternates(path)
            });
        }
    }

    // Services (dynamic from services.ts)
    for (const service of services) {
        const path = `/services/${service.slug}/`;
        for (const lang of LANGS) {
            urls.push({
                loc: `${SITE_URL}/${lang}${path}`,
                lastmod: now,
                ...getUrlMeta(path),
                alternates: createAlternates(path)
            });
        }
    }

    // CSS Tricks
    const cssTricks = await getCollection('css-tricks');
    for (const trick of cssTricks) {
        const path = `/goodies/css-tricks/${trick.id}/`;
        for (const lang of LANGS) {
            urls.push({
                loc: `${SITE_URL}/${lang}${path}`,
                lastmod: now,
                ...getUrlMeta(path),
                alternates: createAlternates(path)
            });
        }
    }

    // Snippets
    const snippets = await getCollection('snippets');
    for (const snippet of snippets) {
        const path = `/goodies/snippets/${snippet.id}/`;
        for (const lang of LANGS) {
            urls.push({
                loc: `${SITE_URL}/${lang}${path}`,
                lastmod: now,
                ...getUrlMeta(path),
                alternates: createAlternates(path)
            });
        }
    }

    // === GENERATE XML ===

    const xmlUrls = urls
        .map((url) => {
            const alternatesXml = url.alternates
                ? url.alternates
                      .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}"/>`)
                      .join('\n')
                : '';

            return `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
${alternatesXml}
  </url>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlUrls}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
        }
    });
};
