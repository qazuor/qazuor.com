export interface Service {
    id: string;
    icon: string;
    pricing: {
        type: 'range' | 'from' | 'consultation';
        min?: number;
        max?: number;
        currency?: string;
    };
    ctaText: string;
    ctaUrl: string;
}

export const services: Service[] = [
    {
        id: 'web-apps',
        icon: '💻',
        pricing: {
            type: 'range',
            min: 2000,
            max: 8000,
            currency: 'USD'
        },
        ctaText: 'Start Your Project',
        ctaUrl: '/contact'
    },
    {
        id: 'landing-pages',
        icon: '🚀',
        pricing: {
            type: 'from',
            min: 800,
            currency: 'USD'
        },
        ctaText: 'Get Your Landing Page',
        ctaUrl: '/contact'
    },
    {
        id: 'automation-integration',
        icon: '⚡',
        pricing: {
            type: 'consultation'
        },
        ctaText: 'Automate Your Workflow',
        ctaUrl: '/contact'
    },
    {
        id: 'social-media-design',
        icon: '🎨',
        pricing: {
            type: 'from',
            min: 300,
            currency: 'USD'
        },
        ctaText: 'Design Your Brand',
        ctaUrl: '/contact'
    }
];
