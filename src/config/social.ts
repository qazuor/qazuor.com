/**
 * Social features configuration
 * Giscus comments and share functionality
 */

/**
 * Giscus configuration for blog comments
 * @see https://giscus.app/
 */
export const GISCUS_CONFIG = {
    repo: 'qazuor/qazuor.com' as const,
    repoId: 'R_kgDOP2JtLg',
    category: 'Blog Comments',
    categoryId: 'DIC_kwDOP2JtLs4CzSS3',
    mapping: 'pathname' as const,
    strict: '0' as const,
    reactionsEnabled: '1' as const,
    emitMetadata: '0' as const,
    inputPosition: 'top' as const
} as const;

/**
 * Share platforms configuration
 */
export const SHARE_PLATFORMS = [
    { id: 'twitter', labelKey: 'social.share.twitter' },
    { id: 'linkedin', labelKey: 'social.share.linkedin' },
    { id: 'whatsapp', labelKey: 'social.share.whatsapp' },
    { id: 'telegram', labelKey: 'social.share.telegram' },
    { id: 'reddit', labelKey: 'social.share.reddit' },
    { id: 'copy', labelKey: 'social.share.copyLink' }
] as const;

export type SharePlatformId = (typeof SHARE_PLATFORMS)[number]['id'];
