export interface Service {
    id: string;
    slug: string;
    iconId: 'web-apps' | 'landing-pages' | 'automation' | 'social-design';
    themeColor: string;
    relatedServices: string[];
    pricing: {
        type: 'range' | 'from' | 'consultation';
        min?: number;
        max?: number;
        currency?: string;
    };
    ctaText: string;
    ctaUrl: string;
    meta: {
        titleKey: string;
        descriptionKey: string;
    };
}

export const services: Service[] = [
    {
        id: 'web-apps',
        slug: 'web-apps',
        iconId: 'web-apps',
        themeColor: 'var(--section-skills-bg)',
        relatedServices: ['landing-pages', 'automation-integration'],
        pricing: {
            type: 'range',
            min: 2000,
            max: 8000,
            currency: 'USD'
        },
        ctaText: 'Start Your Project',
        ctaUrl: '/contact',
        meta: {
            titleKey: 'services.webApps.meta.title',
            descriptionKey: 'services.webApps.meta.description'
        }
    },
    {
        id: 'landing-pages',
        slug: 'landing-pages',
        iconId: 'landing-pages',
        themeColor: 'var(--section-projects-bg)',
        relatedServices: ['web-apps', 'social-media-design'],
        pricing: {
            type: 'from',
            min: 800,
            currency: 'USD'
        },
        ctaText: 'Get Your Landing Page',
        ctaUrl: '/contact',
        meta: {
            titleKey: 'services.landingPages.meta.title',
            descriptionKey: 'services.landingPages.meta.description'
        }
    },
    {
        id: 'automation-integration',
        slug: 'automation-integration',
        iconId: 'automation',
        themeColor: 'var(--section-about-bg)',
        relatedServices: ['web-apps', 'landing-pages'],
        pricing: {
            type: 'consultation'
        },
        ctaText: 'Automate Your Workflow',
        ctaUrl: '/contact',
        meta: {
            titleKey: 'services.automation.meta.title',
            descriptionKey: 'services.automation.meta.description'
        }
    },
    {
        id: 'social-media-design',
        slug: 'social-media-design',
        iconId: 'social-design',
        themeColor: 'var(--section-contact-bg)',
        relatedServices: ['landing-pages', 'web-apps'],
        pricing: {
            type: 'from',
            min: 300,
            currency: 'USD'
        },
        ctaText: 'Design Your Brand',
        ctaUrl: '/contact',
        meta: {
            titleKey: 'services.socialDesign.meta.title',
            descriptionKey: 'services.socialDesign.meta.description'
        }
    }
];
