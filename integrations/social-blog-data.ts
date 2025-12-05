import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SocialPlatforms {
    linkedin: boolean;
    twitter: boolean;
    facebook: boolean;
    instagram: boolean;
    bluesky: boolean;
    mastodon: boolean;
    threads: boolean;
    reddit: boolean;
    hackernews: boolean;
    devto: boolean;
}

interface SocialMetadata {
    suggestedTitle?: string;
    suggestedExcerpt?: string;
    image?: string;
    hashtags?: string[];
    publishOnDate?: string;
    platforms?: Partial<SocialPlatforms>;
}

interface SeriesInfo {
    id: string;
    name: string;
    part: number;
}

interface BlogPostData {
    slug: string;
    title: string;
    excerpt: string;
    url: string;
    publishDate: string;
    category?: string;
    tags: string[];
    image?: string;
    readTime: string;
    author: string;
    series?: SeriesInfo;
    social?: SocialMetadata;
}

interface SocialBlogDataOutput {
    generatedAt: string;
    siteUrl: string;
    totalPosts: number;
    posts: BlogPostData[];
}

interface SocialBlogDataOptions {
    /** Output file path relative to project root. Default: 'socialNetworksBlogData.json' */
    outputFile?: string;
    /** Site URL for generating full URLs. Default: uses Astro site config */
    siteUrl?: string;
    /** Enable verbose logging. Default: false */
    verbose?: boolean;
}

const DEFAULT_PLATFORMS: SocialPlatforms = {
    linkedin: true,
    twitter: true,
    facebook: false,
    instagram: false,
    bluesky: true,
    mastodon: false,
    threads: false,
    reddit: false,
    hackernews: false,
    devto: false
};

export default function socialBlogDataIntegration(options: SocialBlogDataOptions = {}): AstroIntegration {
    const { outputFile = 'socialNetworksBlogData.json', verbose = false } = options;

    const log = (message: string) => {
        if (verbose) {
            console.log(`📱 [social-blog-data] ${message}`);
        }
    };

    return {
        name: 'social-blog-data',
        hooks: {
            'astro:build:done': async ({ dir }) => {
                log('Generating social blog data...');

                const projectRoot = join(__dirname, '..');
                const blogDir = join(projectRoot, 'src/content/blog');

                // Get site URL from Astro config or options
                const siteUrl = options.siteUrl || 'https://qazuor.com';

                // Determine output paths:
                // 1. public/ for local dev server
                // 2. dist output (dir) for production build
                const publicPath = join(projectRoot, outputFile);
                const distPath = join(fileURLToPath(dir), outputFile.replace('public/', ''));

                if (!existsSync(blogDir)) {
                    console.warn('⚠️ [social-blog-data] Blog directory not found:', blogDir);
                    return;
                }

                const blogFiles = readdirSync(blogDir).filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

                log(`Found ${blogFiles.length} blog files`);

                const posts: BlogPostData[] = [];

                for (const file of blogFiles) {
                    const filePath = join(blogDir, file);
                    const content = readFileSync(filePath, 'utf-8');
                    const { data: frontmatter } = matter(content);

                    // Skip draft posts
                    if (frontmatter.draft === true) {
                        log(`Skipping draft: ${file}`);
                        continue;
                    }

                    // Extract slug from frontmatter or filename
                    const slug = frontmatter.slug || file.replace(/\.(md|mdx)$/, '');

                    // Build post data
                    const postData: BlogPostData = {
                        slug,
                        title: frontmatter.title,
                        excerpt: frontmatter.excerpt,
                        url: `${siteUrl}/es/blog/${slug}`,
                        publishDate: formatDate(frontmatter.publishDate),
                        category: frontmatter.category,
                        tags: frontmatter.tags || [],
                        readTime: frontmatter.readTime,
                        author: frontmatter.author || 'qazuor'
                    };

                    // Add image if present
                    if (frontmatter.image) {
                        // Handle relative image paths
                        const imagePath =
                            typeof frontmatter.image === 'string'
                                ? frontmatter.image
                                : frontmatter.image.src || frontmatter.image;
                        postData.image = imagePath;
                    }

                    // Add series info if present
                    if (frontmatter.series) {
                        postData.series = {
                            id: frontmatter.series.id,
                            name: frontmatter.series.name,
                            part: frontmatter.series.part
                        };
                    }

                    // Add social metadata if present
                    if (frontmatter.social) {
                        postData.social = {
                            suggestedTitle: frontmatter.social.suggestedTitle,
                            suggestedExcerpt: frontmatter.social.suggestedExcerpt,
                            image: frontmatter.social.image,
                            hashtags: frontmatter.social.hashtags,
                            publishOnDate: frontmatter.social.publishOnDate
                                ? formatDate(frontmatter.social.publishOnDate)
                                : undefined,
                            platforms: frontmatter.social.platforms
                                ? { ...DEFAULT_PLATFORMS, ...frontmatter.social.platforms }
                                : DEFAULT_PLATFORMS
                        };
                    } else {
                        // Provide default social metadata
                        postData.social = {
                            platforms: DEFAULT_PLATFORMS
                        };
                    }

                    posts.push(postData);
                    log(`Processed: ${slug}`);
                }

                // Sort posts by publish date (newest first)
                posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

                const output: SocialBlogDataOutput = {
                    generatedAt: new Date().toISOString(),
                    siteUrl,
                    totalPosts: posts.length,
                    posts
                };

                // Write output files
                const jsonOutput = JSON.stringify(output, null, 2);

                // Write to public/ (for dev server and future builds)
                writeFileSync(publicPath, jsonOutput, 'utf-8');
                log(`Written to ${publicPath}`);

                // Write to dist output (for current production build)
                writeFileSync(distPath, jsonOutput, 'utf-8');
                log(`Written to ${distPath}`);

                console.log(`✅ [social-blog-data] Generated ${outputFile} with ${posts.length} posts (public + dist)`);
            }
        }
    };
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
function formatDate(date: Date | string): string {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
        return new Date(date).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
}
