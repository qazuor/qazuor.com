import { defineCollection, z } from 'astro:content';

// Projects collection schema
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    demoUrl: z.string().url().optional(),
    codeUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    publishDate: z.date(),
    order: z.number().default(999),
  }),
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
    image: z.string().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
