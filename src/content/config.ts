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
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        publishDate: z.date(),
        tags: z.array(z.string()),
        author: z.string().default('qazuor'),
        readTime: z.string(),
        draft: z.boolean().default(false),
        image: z.string().optional()
    })
});

// Testimonials collection schema
const testimonialsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        role: z.string(),
        company: z.string(),
        content: z.string(),
        avatar: z.string().optional(),
        linkedinUrl: z.string().url().optional(),
        featured: z.boolean().default(false),
        source: z.enum(['linkedin', 'email', 'other']).default('other'),
        date: z.date(),
        order: z.number().default(999)
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
        demo: z.boolean().default(false),
        iframeUrl: z.string().url().optional(),
        order: z.number().default(999)
    })
});

export const collections = {
    projects: projectsCollection,
    blog: blogCollection,
    testimonials: testimonialsCollection,
    tools: toolsCollection
};
