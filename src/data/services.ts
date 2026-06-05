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

/**
 * Service decision-outcome groupings for the services hub.
 *
 * The hub organizes services by the **outcome the visitor is trying to reach**
 * (per SPEC-001 Phase 4 task 4.1), not by category. Each grouping has a
 * headline (the visitor's goal), a short intro, and the service IDs that
 * fit that goal.
 */
export type ServiceGroupingId =
    | 'web-app-or-landing'
    | 'optimize-existing'
    | 'automate-something'
    | 'ongoing-design-support';

export interface ServiceGrouping {
    /** Stable identifier (kebab-case). */
    readonly id: ServiceGroupingId;
    /** I18n key for the grouping headline (the visitor's goal). */
    readonly headlineKey: string;
    /** I18n key for the short fit description shown under the headline. */
    readonly fitKey: string;
    /** Service IDs that belong to this grouping. Order matters (rendered). */
    readonly serviceIds: readonly string[];
}

/**
 * The decision-outcome groupings used by the services hub.
 *
 * Each grouping answers the question a visitor is actually asking when they
 * land on the services page. The `fitKey` text is a short "best when you…"
 * that scopes the grouping so the visitor can self-select.
 */
export const serviceGroupings: readonly ServiceGrouping[] = [
    {
        id: 'web-app-or-landing',
        headlineKey: 'services.hub.groupings.webAppOrLanding.headline',
        fitKey: 'services.hub.groupings.webAppOrLanding.fit',
        serviceIds: ['web-apps', 'landing-pages']
    },
    {
        id: 'optimize-existing',
        headlineKey: 'services.hub.groupings.optimizeExisting.headline',
        fitKey: 'services.hub.groupings.optimizeExisting.fit',
        serviceIds: ['web-optimization']
    },
    {
        id: 'automate-something',
        headlineKey: 'services.hub.groupings.automateSomething.headline',
        fitKey: 'services.hub.groupings.automateSomething.fit',
        serviceIds: ['automation-integration']
    },
    {
        id: 'ongoing-design-support',
        headlineKey: 'services.hub.groupings.ongoingDesignSupport.headline',
        fitKey: 'services.hub.groupings.ongoingDesignSupport.fit',
        serviceIds: ['social-media-design']
    }
] as const;

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
    /**
     * SPEC-001 Phase 4 — "Who this is for" section on the service detail
     * page. Each entry is a short bullet that names an audience segment.
     * 2-3 entries per service is the recommended density.
     */
    whoItIsFor: readonly string[];
    /**
     * SPEC-001 Phase 4 — "Problems solved" section on the service detail
     * page. Each entry is a specific, recognizable problem this service
     * addresses. 3-5 entries per service is the recommended density.
     */
    problemsSolved: readonly string[];
    /**
     * SPEC-001 Phase 4 — Optional explicit override of related work slugs.
     * When provided, the service detail page renders exactly these slugs
     * (matched against `src/content/work/`) in the "Related work" section.
     *
     * If absent, the service detail page derives related work from the
     * `work` content collection by filtering entries whose `services[]`
     * array includes this service's ID.
     */
    relatedWorkSlugs?: readonly string[];
    /**
     * SPEC-001 Phase 4 — Service-specific final CTA copy and target.
     * The CTA appears at the bottom of the service detail page in
     * place of the generic "Contact" button.
     */
    detailCta: {
        /** i18n key for the CTA label (e.g. `services.webApps.detailCta.label`). */
        labelKey: string;
        /** i18n key for the CTA title (large heading above the button). */
        titleKey: string;
        /**
         * Target URL. When `useServiceParam` is true the link is rendered as
         * `/{lang}/contact?service={id}` so the contact form can pre-select
         * the service. When false the link goes to the bare contact path.
         */
        useServiceParam: boolean;
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
        whoItIsFor: [
            'Founders launching an MVP who need a senior pair of hands without a full-time hire',
            'Teams shipping a product feature that needs real architecture, not a duct-tape prototype',
            'Agencies and studios that need a reliable senior contractor for complex builds'
        ],
        problemsSolved: [
            'Stuck between a slow in-house team and an over-priced agency',
            'Existing codebase that needs a senior eye before the next round of features',
            'A feature spec that is half-written and needs someone to drive it to ship',
            'Authentication, data modeling, and API design that the team keeps avoiding'
        ],
        detailCta: {
            labelKey: 'services.webApps.detailCta.label',
            titleKey: 'services.webApps.detailCta.title',
            useServiceParam: true
        },
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
        whoItIsFor: [
            'Founders and marketers launching a product, campaign, or feature',
            'Agencies that need a senior frontend partner to deliver high-converting pages on tight timelines',
            'Businesses that need a fast, SEO-clean static site instead of a slow CMS'
        ],
        problemsSolved: [
            'Current site is slow, scores poorly on Core Web Vitals, and is hurting SEO',
            'Launching a campaign next week and the in-house team is overloaded',
            'Conversion rate is flat and the page needs a senior rewrite, not a redesign',
            'CMS-based site is too heavy for a one-page focused goal'
        ],
        detailCta: {
            labelKey: 'services.landingPages.detailCta.label',
            titleKey: 'services.landingPages.detailCta.title',
            useServiceParam: true
        },
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
        whoItIsFor: [
            'Operations and RevOps leads who are tired of copy-paste between SaaS tools',
            'Small teams whose engineers should be building product, not babysitting Zapier chains',
            'Companies whose CRM, billing, and product are out of sync and the manual reconciliation is breaking things'
        ],
        problemsSolved: [
            'Data is split across tools and the team spends hours each week reconciling it by hand',
            'Customer-facing workflows stall because the back-office system cannot keep up',
            'Third-party APIs need to talk to each other and the off-the-shelf connectors do not exist',
            'Webhook chains that should be simple are silently dropping events'
        ],
        detailCta: {
            labelKey: 'services.automation.detailCta.label',
            titleKey: 'services.automation.detailCta.title',
            useServiceParam: true
        },
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
        whoItIsFor: [
            'Founders and small teams that need a steady stream of on-brand visual content',
            'Marketers who want a designer who understands systems, not just one-off posts',
            'Brands whose feed looks inconsistent because every post was made by a different person'
        ],
        problemsSolved: [
            'No internal designer, and agency turnaround is too slow for the content calendar',
            'Templates and visual identity drift over time, so the feed stops looking like the brand',
            'Need a designer who can ship platform-native assets, not just resized square images',
            'Brand assets live in five different files and nothing matches anymore'
        ],
        detailCta: {
            labelKey: 'services.socialDesign.detailCta.label',
            titleKey: 'services.socialDesign.detailCta.title',
            useServiceParam: true
        },
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
        whoItIsFor: [
            'Teams whose site is functional but slow, and that slowness is starting to cost conversions',
            'Marketers and SEO leads who know the technical debt is hurting rankings but cannot get engineering prioritized on it',
            'Companies launching a new site that needs a senior Lighthouse pass before it goes public'
        ],
        problemsSolved: [
            'Lighthouse scores in the 50-70 range, dragging rankings and conversion',
            'A slow LCP / CLS that nobody on the team has time to diagnose and fix',
            'Image and asset pipeline that ships 2MB hero images on a 50ms connection',
            'SEO basics missing: structured data, canonicals, sitemap, robots'
        ],
        detailCta: {
            labelKey: 'services.webOptimization.detailCta.label',
            titleKey: 'services.webOptimization.detailCta.title',
            useServiceParam: true
        },
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
        whoItIsFor: [
            'Content-driven businesses and publishers who need WordPress without the bloat',
            'Small e-commerce teams who want a WooCommerce build that does not fall over under load',
            'Teams stuck with a fragile theme or plugin and need a senior to stabilize and ship'
        ],
        problemsSolved: [
            'Existing WordPress site is slow, plugin-heavy, and breaking every update',
            'Need a custom theme or plugin that does not exist in any marketplace',
            'Migrating from another CMS without losing SEO, content, or design fidelity',
            'WooCommerce store that is technically online but conversion is flat'
        ],
        detailCta: {
            labelKey: 'services.wordpress.detailCta.label',
            titleKey: 'services.wordpress.detailCta.title',
            useServiceParam: true
        },
        meta: {
            titleKey: 'services.wordpress.meta.title',
            descriptionKey: 'services.wordpress.meta.description'
        }
    }
];

/**
 * Look up a service by its `id`. Returns `undefined` if not found.
 *
 * @param id - Service identifier (e.g., `web-apps`).
 * @returns The matching service, or `undefined`.
 */
export function getServiceById(id: string): Service | undefined {
    return services.find((s) => s.id === id);
}

/**
 * Look up a service by its URL `slug`. Returns `undefined` if not found.
 *
 * @param slug - Service URL slug (e.g., `web-apps`).
 * @returns The matching service, or `undefined`.
 */
export function getServiceBySlug(slug: string): Service | undefined {
    return services.find((s) => s.slug === slug);
}
