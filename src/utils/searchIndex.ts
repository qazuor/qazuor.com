import { getCollection } from 'astro:content';
import type { SearchableItem } from '@/types/search';
import { getEffectiveSlug } from '@/utils/blog';

/**
 * Generates search index from Astro collections at build time
 * This function is called during the build process to create a searchable index
 * of all content from projects, blog, and tools collections.
 */
export async function generateSearchIndex(): Promise<SearchableItem[]> {
    const searchIndex: SearchableItem[] = [];

    try {
        // Get all collections
        const [projects, blog, tools] = await Promise.all([
            getCollection('projects'),
            getCollection('blog'),
            getCollection('tools')
        ]);

        // Process projects
        for (const project of projects) {
            const item: SearchableItem = {
                id: project.id,
                title: project.data.title,
                description: project.data.description,
                tags: project.data.tags,
                category: 'projects',
                url: `/projects/${project.slug}`,
                type: 'content',
                publishDate: project.data.publishDate,
                featured: project.data.featured
            };
            searchIndex.push(item);
        }

        // Process blog posts
        for (const post of blog) {
            const item: SearchableItem = {
                id: post.id,
                title: post.data.title,
                description: post.data.excerpt,
                tags: post.data.tags,
                category: 'blog',
                url: `/blog/${getEffectiveSlug(post)}`,
                type: 'content',
                publishDate: post.data.publishDate,
                featured: false // Blog posts don't have featured field
            };
            searchIndex.push(item);
        }

        // Process tools
        for (const tool of tools) {
            const item: SearchableItem = {
                id: tool.id,
                title: tool.data.title,
                description: tool.data.description,
                tags: tool.data.tags,
                category: 'tools',
                url: `/goodies/${tool.slug}`,
                type: 'content',
                publishDate: tool.data.createdAt,
                featured: tool.data.featured
            };
            searchIndex.push(item);
        }

        // Sort by relevance (featured first, then by date)
        searchIndex.sort((a, b) => {
            // Featured items first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;

            // Then by date (newest first)
            if (a.publishDate && b.publishDate) {
                return b.publishDate.getTime() - a.publishDate.getTime();
            }

            // Fallback to alphabetical
            return a.title.localeCompare(b.title);
        });

        return searchIndex;
    } catch (error) {
        console.error('❌ Error generating search index:', error);
        throw error;
    }
}

/**
 * Pre-built search index for use in components
 * This will be populated during build time
 */
export let searchIndex: SearchableItem[] = [];

/**
 * Initialize search index (called during build)
 */
export async function initializeSearchIndex() {
    searchIndex = await generateSearchIndex();
}
