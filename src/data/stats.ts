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
        id: 'linesOfCode',
        value: 1,
        suffix: 'M+',
        labelKey: 'stats.linesOfCode.label',
        descriptionKey: 'stats.linesOfCode.description'
    },
    {
        id: 'technologies',
        value: 15,
        suffix: '+',
        labelKey: 'stats.technologies.label',
        descriptionKey: 'stats.technologies.description'
    },
    {
        id: 'mentored',
        value: 30,
        suffix: '+',
        labelKey: 'stats.mentored.label',
        descriptionKey: 'stats.mentored.description'
    },
    {
        id: 'passion',
        value: 24,
        suffix: '/7',
        labelKey: 'stats.passion.label',
        descriptionKey: 'stats.passion.description'
    },
    {
        id: 'coffees',
        value: 0,
        prefix: '∞',
        labelKey: 'stats.coffees.label',
        descriptionKey: 'stats.coffees.description'
    }
];
