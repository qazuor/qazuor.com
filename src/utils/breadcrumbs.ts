/**
 * Breadcrumb Generation Utilities
 * Generates breadcrumb data from URL paths
 */

export interface BreadcrumbItem {
    name: string;
    url?: string;
}

/**
 * Common page name translations
 * Used to convert URL slugs to readable names
 */
const PAGE_NAMES: Record<string, Record<string, string>> = {
    en: {
        home: 'Home',
        blog: 'Blog',
        projects: 'Projects',
        services: 'Services',
        goodies: 'Goodies',
        snippets: 'Snippets',
        'css-tricks': 'CSS Tricks',
        tools: 'Tools',
        'useful-links': 'Useful Links',
        about: 'About',
        contact: 'Contact',
        'web-apps': 'Web Applications',
        'landing-pages': 'Landing Pages',
        'automation-integration': 'Automation & Integration',
        'social-media-design': 'Social Media Design'
    },
    es: {
        home: 'Inicio',
        blog: 'Blog',
        projects: 'Proyectos',
        services: 'Servicios',
        goodies: 'Recursos',
        snippets: 'Snippets',
        'css-tricks': 'Trucos CSS',
        tools: 'Herramientas',
        'useful-links': 'Enlaces Útiles',
        about: 'Sobre Mí',
        contact: 'Contacto',
        'web-apps': 'Aplicaciones Web',
        'landing-pages': 'Landing Pages',
        'automation-integration': 'Automatización e Integración',
        'social-media-design': 'Diseño para Redes Sociales'
    }
};

/**
 * Convert a slug to a readable name
 */
function slugToName(slug: string, lang: string): string {
    // Check if we have a predefined translation
    const translations = PAGE_NAMES[lang] || PAGE_NAMES.en;
    if (translations[slug]) {
        return translations[slug];
    }

    // Otherwise, convert slug to title case
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Generate breadcrumb items from a URL path
 *
 * @param pathname - The current page pathname (e.g., '/en/blog/my-post')
 * @param baseUrl - The site's base URL (e.g., 'https://qazuor.com')
 * @param currentPageName - Optional custom name for the current page
 * @returns Array of breadcrumb items
 *
 * @example
 * generateBreadcrumbs('/en/blog/my-post', 'https://qazuor.com', 'My Blog Post')
 * // Returns:
 * // [
 * //   { name: 'Home', url: 'https://qazuor.com/en' },
 * //   { name: 'Blog', url: 'https://qazuor.com/en/blog' },
 * //   { name: 'My Blog Post' }
 * // ]
 */
export function generateBreadcrumbs(pathname: string, baseUrl: string, currentPageName?: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Remove leading/trailing slashes and split
    const segments = pathname.replace(/^\/|\/$/g, '').split('/');

    // If empty or just root, return home only
    if (segments.length === 0 || (segments.length === 1 && segments[0] === '')) {
        return [{ name: 'Home' }];
    }

    // First segment should be the language code
    const lang = segments[0];
    const isValidLang = lang === 'en' || lang === 'es';
    const actualLang = isValidLang ? lang : 'en';

    // Add home
    const homeUrl = isValidLang ? `${baseUrl}/${lang}` : baseUrl;
    const homeName = actualLang === 'es' ? 'Inicio' : 'Home';
    breadcrumbs.push({ name: homeName, url: homeUrl });

    // Build path progressively (skip language segment)
    let currentPath = isValidLang ? `${baseUrl}/${lang}` : baseUrl;

    const pathSegments = isValidLang ? segments.slice(1) : segments;

    for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath += `/${segment}`;

        const isLast = i === pathSegments.length - 1;

        // For the last segment, use custom name if provided
        const name = isLast && currentPageName ? currentPageName : slugToName(segment, actualLang);

        breadcrumbs.push({
            name,
            // Don't include URL for the last item (current page)
            ...(isLast ? {} : { url: currentPath })
        });
    }

    return breadcrumbs;
}

/**
 * Generate breadcrumbs for a blog post
 */
export function generateBlogBreadcrumbs(lang: string, baseUrl: string, postTitle: string): BreadcrumbItem[] {
    const homeName = lang === 'es' ? 'Inicio' : 'Home';
    const blogName = 'Blog';

    return [
        { name: homeName, url: `${baseUrl}/${lang}` },
        { name: blogName, url: `${baseUrl}/${lang}/blog` },
        { name: postTitle }
    ];
}

/**
 * Generate breadcrumbs for a project page
 */
export function generateProjectBreadcrumbs(lang: string, baseUrl: string, projectName: string): BreadcrumbItem[] {
    const homeName = lang === 'es' ? 'Inicio' : 'Home';
    const projectsName = lang === 'es' ? 'Proyectos' : 'Projects';

    return [
        { name: homeName, url: `${baseUrl}/${lang}` },
        { name: projectsName, url: `${baseUrl}/${lang}/projects` },
        { name: projectName }
    ];
}

/**
 * Generate breadcrumbs for a service page
 */
export function generateServiceBreadcrumbs(lang: string, baseUrl: string, serviceName: string): BreadcrumbItem[] {
    const homeName = lang === 'es' ? 'Inicio' : 'Home';
    const servicesName = lang === 'es' ? 'Servicios' : 'Services';

    return [
        { name: homeName, url: `${baseUrl}/${lang}` },
        { name: servicesName, url: `${baseUrl}/${lang}/services` },
        { name: serviceName }
    ];
}

/**
 * Generate breadcrumbs for goodies pages (snippets, css-tricks, tools, links)
 */
export function generateGoodiesBreadcrumbs(
    lang: string,
    baseUrl: string,
    category: string,
    itemName?: string
): BreadcrumbItem[] {
    const homeName = lang === 'es' ? 'Inicio' : 'Home';
    const goodiesName = lang === 'es' ? 'Recursos' : 'Goodies';
    const categoryName = slugToName(category, lang);

    const breadcrumbs: BreadcrumbItem[] = [
        { name: homeName, url: `${baseUrl}/${lang}` },
        { name: goodiesName, url: `${baseUrl}/${lang}/goodies` },
        { name: categoryName, url: itemName ? `${baseUrl}/${lang}/goodies/${category}` : undefined }
    ];

    if (itemName) {
        breadcrumbs.push({ name: itemName });
    }

    return breadcrumbs;
}
