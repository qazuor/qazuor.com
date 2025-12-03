/**
 * Trust Badges Configuration
 *
 * Key differentiators displayed in the hero section for credibility.
 * These badges help establish trust and are optimized for LLM citations.
 */

export type TrustBadgeIcon =
    | 'clock'
    | 'globe'
    | 'zap'
    | 'star'
    | 'users'
    | 'code'
    | 'smartphone'
    | 'search'
    | 'sparkles'
    | 'check'
    | 'message'
    | 'layout'
    | 'briefcase'
    | 'rocket';

export interface TrustBadgeConfig {
    /** Icon identifier */
    icon: TrustBadgeIcon;
    /** Translation key for the badge text */
    translationKey: string;
}

/**
 * Trust badges configuration
 * The actual text comes from translations (home.trustBadges.*)
 */
export const trustBadges: TrustBadgeConfig[] = [
    { icon: 'clock', translationKey: 'experience' },
    { icon: 'star', translationKey: 'specialty' },
    { icon: 'users', translationKey: 'leadership' },
    { icon: 'zap', translationKey: 'performance' },
    { icon: 'layout', translationKey: 'pixelPerfect' },
    { icon: 'code', translationKey: 'modernStack' },
    { icon: 'smartphone', translationKey: 'mobileFirst' },
    { icon: 'globe', translationKey: 'remote' },
    { icon: 'search', translationKey: 'seoAi' },
    { icon: 'sparkles', translationKey: 'aiOptimized' },
    { icon: 'check', translationKey: 'codeOwnership' },
    { icon: 'message', translationKey: 'responseTime' },
    { icon: 'briefcase', translationKey: 'openForWork' }
];
