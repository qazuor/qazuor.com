/**
 * Projects Data
 * Example/showcase projects
 *
 * Note: Replace with real projects when available
 */

export interface Project {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export const exampleProjects: Project[] = [
  {
    title: 'E-Commerce Platform',
    description:
      'A modern e-commerce platform built with Astro, React, and Stripe. Features include product catalog, shopping cart, and secure checkout.',
    tags: ['Astro', 'React', 'Stripe', 'Tailwind'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    title: 'Task Management App',
    description:
      'Full-stack task management application with real-time updates, team collaboration, and project tracking capabilities.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    title: 'Portfolio Generator',
    description:
      'Automated portfolio generator that creates beautiful, responsive portfolios from JSON configuration files.',
    tags: ['Astro', 'TypeScript', 'GSAP', 'i18n'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    title: 'Weather Dashboard',
    description:
      'Real-time weather dashboard with interactive maps, forecasts, and weather alerts for multiple locations.',
    tags: ['React', 'OpenWeather API', 'Charts.js', 'Leaflet'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    title: 'Blog CMS',
    description:
      'Headless CMS specifically designed for technical blogs with Markdown support, syntax highlighting, and SEO optimization.',
    tags: ['Astro', 'MDX', 'Content Collections', 'Prism'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    title: 'Analytics Platform',
    description:
      'Privacy-focused analytics platform that provides detailed insights without tracking user data across sites.',
    tags: ['TypeScript', 'Node.js', 'MongoDB', 'Chart.js'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
];
