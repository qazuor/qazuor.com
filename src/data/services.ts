export interface ServiceComparison {
    timeline: {
        minWeeks: number;
        maxWeeks?: number;
    };
    priceRange: {
        type: 'range' | 'from' | 'consultation';
        min?: number;
        max?: number;
        currency?: string;
    };
    maintenance: 'recommended' | 'optional' | 'not-needed';
    complexity: 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high' | 'low-high';
    bestForKey: string;
}

export interface Service {
    id: string;
    slug: string;
    iconId: 'web-apps' | 'landing-pages' | 'automation' | 'social-design' | 'web-optimization' | 'wordpress';
    themeColor: string;
    relatedServices: string[];
    pricing: {
        type: 'range' | 'from' | 'consultation';
        min?: number;
        max?: number;
        currency?: string;
    };
    comparison: ServiceComparison;
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
            type: 'from',
            min: 800,
            currency: 'USD'
        },
        comparison: {
            timeline: { minWeeks: 4 },
            priceRange: { type: 'from', min: 800, currency: 'USD' },
            maintenance: 'recommended',
            complexity: 'high',
            bestForKey: 'customSolutions'
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
            min: 300,
            currency: 'USD'
        },
        comparison: {
            timeline: { minWeeks: 1 },
            priceRange: { type: 'from', min: 300, currency: 'USD' },
            maintenance: 'optional',
            complexity: 'low-medium',
            bestForKey: 'marketingSeo'
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
        comparison: {
            timeline: { minWeeks: 1, maxWeeks: 4 },
            priceRange: { type: 'consultation' },
            maintenance: 'recommended',
            complexity: 'medium-high',
            bestForKey: 'efficiency'
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
            type: 'consultation'
        },
        comparison: {
            timeline: { minWeeks: 1 },
            priceRange: { type: 'consultation' },
            maintenance: 'not-needed',
            complexity: 'low',
            bestForKey: 'brandPresence'
        },
        ctaText: 'Design Your Brand',
        ctaUrl: '/contact',
        meta: {
            titleKey: 'services.socialDesign.meta.title',
            descriptionKey: 'services.socialDesign.meta.description'
        }
    },
    {
        id: 'web-optimization',
        slug: 'web-optimization',
        iconId: 'web-optimization',
        themeColor: 'var(--section-hero-bg)',
        relatedServices: ['landing-pages', 'web-apps'],
        pricing: {
            type: 'from',
            min: 200,
            currency: 'USD'
        },
        comparison: {
            timeline: { minWeeks: 1 },
            priceRange: { type: 'from', min: 200, currency: 'USD' },
            maintenance: 'recommended',
            complexity: 'medium',
            bestForKey: 'seoPerformance'
        },
        ctaText: 'Optimize Your Site',
        ctaUrl: '/contact',
        meta: {
            titleKey: 'services.webOptimization.meta.title',
            descriptionKey: 'services.webOptimization.meta.description'
        }
    },
    {
        id: 'wordpress',
        slug: 'wordpress',
        iconId: 'wordpress',
        themeColor: 'var(--section-blog-bg)',
        relatedServices: ['landing-pages', 'web-optimization'],
        pricing: {
            type: 'from',
            min: 400,
            currency: 'USD'
        },
        comparison: {
            timeline: { minWeeks: 2 },
            priceRange: { type: 'from', min: 400, currency: 'USD' },
            maintenance: 'recommended',
            complexity: 'low-high',
            bestForKey: 'blogsEcommerce'
        },
        ctaText: 'Start Your WordPress Project',
        ctaUrl: '/contact',
        meta: {
            titleKey: 'services.wordpress.meta.title',
            descriptionKey: 'services.wordpress.meta.description'
        }
    }
];
