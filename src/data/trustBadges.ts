/**
 * Trust Badges Configuration
 *
 * Key differentiators displayed in the hero section for credibility.
 * These badges help establish trust and are optimized for LLM citations.
 */

export type TrustBadgeIcon = 'clock' | 'globe' | 'zap' | 'star';

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
    { icon: 'globe', translationKey: 'remote' },
    { icon: 'zap', translationKey: 'performance' },
    { icon: 'star', translationKey: 'bilingual' }
];
