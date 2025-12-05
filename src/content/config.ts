import { defineCollection, z } from 'astro:content';

// Projects collection schema
const projectsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(), // Short description for cards
            longDescription: z.string().optional(), // Long description for individual page (markdown)
            slug: z.string().optional(), // Auto-generated from title if not provided
            lang: z.enum(['en', 'es']), // Language of the content
            category: z.enum(['open-source', 'commercial', 'client']),
            tags: z.array(z.string()), // Used for tags/labels
            technologies: z.array(z.string()), // Used for filtering
            images: z.array(image()), // Array of local images (relative paths from content file)
            mainImage: image().optional(), // Main image (defaults to images[0])
            githubUrl: z.string().url().optional(), // For open-source projects
            demoUrl: z.string().url().optional(), // For open-source projects
            publicUrl: z.string().url().optional(), // For client/commercial projects
            featured: z.boolean().default(false),
            publishDate: z.date(),
            order: z.number().default(999)
        })
});

// Blog collection schema
const blogCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            excerpt: z.string(),
            publishDate: z.date(),
            tags: z.array(z.string()),
            author: z.string().default('qazuor'),
            readTime: z.string(),
            draft: z.boolean().default(false),
            slug: z.string().optional(), // Custom slug (uses filename if not provided)
            image: image().optional(), // Local image (relative path from content file)
            category: z.string().optional(), // Category for card badge
            // Series support for multi-part articles
            series: z
                .object({
                    id: z.string(), // Unique series identifier: "hospeda"
                    name: z.string(), // Display name: "Hospeda: Building a tourism portal"
                    part: z.number() // Part number: 1, 2, 3...
                })
                .optional()
        })
});

// Testimonials collection schema
const testimonialsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            role: z.string(),
            company: z.string(),
            content: z.string(),
            avatar: image().optional(), // Local image (auto-generated from avatarUrl during build)
            avatarUrl: z.string().url().optional(), // External URL - will be downloaded during build
            linkedinUrl: z.string().url().optional(),
            featured: z.boolean().default(false),
            source: z.enum(['linkedin', 'email', 'other']).default('other'),
            date: z.date()
        })
});

// Tools collection schema
const toolsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        featured: z.boolean().default(false),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
        createdAt: z.date(),
        updatedAt: z.date(),
        siteUrl: z.string().url(),
        repoUrl: z.string().url(),
        icon: z.string(),
        order: z.number().default(999)
    })
});

// Snippets collection schema
// Code is now in the MDX body for proper syntax highlighting
const snippetsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(), // Display name in English
        description_en: z.string(),
        description_es: z.string(),
        language: z.enum([
            'typescript',
            'javascript',
            'css',
            'html',
            'bash',
            'python',
            'sql',
            'json',
            'yaml',
            'markdown',
            'other'
        ]),
        tags: z.array(z.string()),
        featured: z.boolean().default(false),
        createdAt: z.date(),
        updatedAt: z.date().optional()
    })
});

// CSS Tricks collection schema (mini blog posts)
const cssTricksCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(), // Short hook/problem description
        tags: z.array(z.string()),
        featured: z.boolean().default(false),
        browserSupport: z.array(z.string()).optional(), // e.g., ['Chrome 105+', 'Firefox 110+']
        createdAt: z.date(),
        updatedAt: z.date().optional(),
        order: z.number().default(999)
    })
});

// Useful Links collection schema
const usefulLinksCollection = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        description_en: z.string(),
        description_es: z.string(),
        url: z.string().url(),
        category: z.enum([
            'ai',
            'docs',
            'react-components',
            'animations',
            'libraries',
            'icons',
            'illustrations',
            'inspiration',
            'tools',
            'youtube'
        ]),
        tags: z.array(z.string()).optional()
    })
});

export const collections = {
    projects: projectsCollection,
    blog: blogCollection,
    testimonials: testimonialsCollection,
    tools: toolsCollection,
    snippets: snippetsCollection,
    'css-tricks': cssTricksCollection,
    'useful-links': usefulLinksCollection
};
