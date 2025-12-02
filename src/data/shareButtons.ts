/**
 * Share Buttons Configuration
 *
 * Centralized configuration for social share buttons.
 * Add, remove or reorder platforms easily from here.
 */

import type { ComponentType, SVGProps } from 'react';
import {
    DiscordIcon,
    HackerNewsIcon,
    LinkedInIcon,
    MastodonIcon,
    RedditIcon,
    TelegramIcon,
    TwitterIcon,
    WhatsAppIcon
} from '@/components/icons/SocialIcons';

/**
 * Platform configuration type
 */
export interface SharePlatform {
    /** Unique identifier for the platform */
    id: string;
    /** React component for the platform icon */
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    /** Display label for accessibility and tooltips */
    label: string;
    /** Brand color for hover effects (hex format) */
    brandColor: string;
    /** Whether to show in compact mode (header) */
    showInCompact: boolean;
    /** Whether to show in full mode (share section) */
    showInFull: boolean;
    /** Order in compact mode (lower = first) */
    compactOrder: number;
    /** Order in full mode (lower = first) */
    fullOrder: number;
}

/**
 * Generate share URL for a platform
 */
export function getShareUrl(platformId: string, url: string, title: string, text?: string): string {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(text || title);

    const urlGenerators: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        discord: `https://discord.com/channels/@me?content=${encodedText}%20${encodedUrl}`,
        mastodon: `https://mastodon.social/share?text=${encodedText}%20${encodedUrl}`,
        hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`
    };

    return urlGenerators[platformId] || '';
}

/**
 * All available share platforms
 * To add a new platform:
 * 1. Create the icon in SocialIcons.tsx
 * 2. Add the platform config here
 * 3. Add the URL generator in getShareUrl above
 */
export const sharePlatforms: SharePlatform[] = [
    {
        id: 'twitter',
        Icon: TwitterIcon,
        label: 'X (Twitter)',
        brandColor: '#1DA1F2',
        showInCompact: true,
        showInFull: true,
        compactOrder: 1,
        fullOrder: 1
    },
    {
        id: 'linkedin',
        Icon: LinkedInIcon,
        label: 'LinkedIn',
        brandColor: '#0A66C2',
        showInCompact: true,
        showInFull: true,
        compactOrder: 2,
        fullOrder: 2
    },
    {
        id: 'whatsapp',
        Icon: WhatsAppIcon,
        label: 'WhatsApp',
        brandColor: '#25D366',
        showInCompact: true,
        showInFull: true,
        compactOrder: 3,
        fullOrder: 3
    },
    {
        id: 'reddit',
        Icon: RedditIcon,
        label: 'Reddit',
        brandColor: '#FF4500',
        showInCompact: true,
        showInFull: true,
        compactOrder: 4,
        fullOrder: 4
    },
    {
        id: 'telegram',
        Icon: TelegramIcon,
        label: 'Telegram',
        brandColor: '#0088cc',
        showInCompact: false,
        showInFull: true,
        compactOrder: 5,
        fullOrder: 5
    },
    {
        id: 'discord',
        Icon: DiscordIcon,
        label: 'Discord',
        brandColor: '#5865F2',
        showInCompact: false,
        showInFull: true,
        compactOrder: 6,
        fullOrder: 6
    },
    {
        id: 'mastodon',
        Icon: MastodonIcon,
        label: 'Mastodon',
        brandColor: '#6364FF',
        showInCompact: false,
        showInFull: true,
        compactOrder: 7,
        fullOrder: 7
    },
    {
        id: 'hackernews',
        Icon: HackerNewsIcon,
        label: 'Hacker News',
        brandColor: '#FF6600',
        showInCompact: false,
        showInFull: true,
        compactOrder: 8,
        fullOrder: 8
    }
];

/**
 * Get platforms for compact mode (header)
 * Sorted by compactOrder
 */
export function getCompactPlatforms(): SharePlatform[] {
    return sharePlatforms.filter((p) => p.showInCompact).sort((a, b) => a.compactOrder - b.compactOrder);
}

/**
 * Get platforms for full mode (share section)
 * Sorted by fullOrder
 */
export function getFullPlatforms(): SharePlatform[] {
    return sharePlatforms.filter((p) => p.showInFull).sort((a, b) => a.fullOrder - b.fullOrder);
}

/**
 * Generate hover class for a platform
 */
export function getPlatformHoverClass(brandColor: string): string {
    return `hover:text-[${brandColor}] hover:bg-[${brandColor}]/10`;
}
