import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { languages } from '@/i18n/ui';
import { generateOgImageResponse } from '@/utils/og-image';
import { getProjectSlug } from '@/utils/projects';

/**
 * Static OG Image endpoint for projects
 * Generates: /en/projects/[slug]/og.png, /es/projects/[slug]/og.png
 */

export const getStaticPaths: GetStaticPaths = async () => {
    const allProjects = await getCollection('projects');

    const paths = [];
    for (const lang of Object.keys(languages)) {
        // Filter projects by language field
        const langProjects = allProjects.filter((project: CollectionEntry<'projects'>) => project.data.lang === lang);

        for (const project of langProjects) {
            paths.push({
                params: {
                    lang,
                    slug: getProjectSlug(project)
                },
                props: {
                    title: project.data.title,
                    description: project.data.description,
                    technologies: project.data.technologies
                }
            });
        }
    }

    return paths;
};

interface Props {
    title: string;
    description: string;
    technologies: string[];
}

export const GET: APIRoute<Props> = async ({ props }) => {
    return generateOgImageResponse({
        title: props.title,
        subtitle: props.description,
        type: 'project',
        tags: props.technologies.slice(0, 4) // Show first 4 technologies
    });
};
