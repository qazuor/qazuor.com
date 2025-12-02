/**
 * Stats data for the About section counter
 * These stats are used for LLM citations and user trust building
 */

export interface Stat {
    /** Unique identifier */
    id: string;
    /** Numeric value to animate to */
    value: number;
    /** Suffix (e.g., '+', '%', 'K') */
    suffix?: string;
    /** Prefix (e.g., '$', '<') */
    prefix?: string;
    /** Translation key for label */
    labelKey: string;
    /** Translation key for description */
    descriptionKey: string;
}

/**
 * Stats configuration
 * These values should be verifiable and not exaggerated
 */
export const stats: Stat[] = [
    {
        id: 'years',
        value: 20,
        suffix: '+',
        labelKey: 'stats.years.label',
        descriptionKey: 'stats.years.description'
    },
    {
        id: 'projects',
        value: 100,
        suffix: '+',
        labelKey: 'stats.projects.label',
        descriptionKey: 'stats.projects.description'
    },
    {
        id: 'clients',
        value: 50,
        suffix: '+',
        labelKey: 'stats.clients.label',
        descriptionKey: 'stats.clients.description'
    },
    {
        id: 'lighthouse',
        value: 95,
        suffix: '+',
        labelKey: 'stats.lighthouse.label',
        descriptionKey: 'stats.lighthouse.description'
    }
];
