import { useCallback, useState } from 'react';
import {
    CheckIcon,
    LinkedInIcon,
    LinkIcon,
    RedditIcon,
    ShareIcon,
    TelegramIcon,
    TwitterIcon,
    WhatsAppIcon
} from '@/components/icons/SocialIcons';
import type { Locale } from '@/i18n/ui';
import { canShare, copyToClipboard, getShareUrl, sharePost } from '@/utils/share';

interface ShareButtonProps {
    title: string;
    description: string;
    url: string;
    lang: Locale;
    variant?: 'compact' | 'full';
}

interface Translations {
    button: string;
    copyLink: string;
    copied: string;
    copyFailed: string;
    via: string;
}

const translations: Record<Locale, Translations> = {
    en: {
        button: 'Share',
        copyLink: 'Copy link',
        copied: 'Copied!',
        copyFailed: 'Copy failed',
        via: 'Share via'
    },
    es: {
        button: 'Compartir',
        copyLink: 'Copiar enlace',
        copied: '¡Copiado!',
        copyFailed: 'Error al copiar',
        via: 'Compartir en'
    }
};

const platforms = [
    { id: 'twitter', Icon: TwitterIcon, label: 'Twitter' },
    { id: 'linkedin', Icon: LinkedInIcon, label: 'LinkedIn' },
    { id: 'whatsapp', Icon: WhatsAppIcon, label: 'WhatsApp' },
    { id: 'telegram', Icon: TelegramIcon, label: 'Telegram' },
    { id: 'reddit', Icon: RedditIcon, label: 'Reddit' }
] as const;

/**
 * Share button component with Web Share API support and fallback
 */
export function ShareButton({ title, description, url, lang, variant = 'full' }: ShareButtonProps) {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
    const t = translations[lang];

    const handleNativeShare = useCallback(async () => {
        await sharePost({ title, text: description, url });
    }, [title, description, url]);

    const handleCopyLink = useCallback(async () => {
        const success = await copyToClipboard(url);
        setCopyStatus(success ? 'copied' : 'failed');
        setTimeout(() => setCopyStatus('idle'), 2000);
    }, [url]);

    const handlePlatformShare = useCallback(
        (platformId: string) => {
            const shareUrl = getShareUrl(platformId, url, title, description);
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
            }
        },
        [url, title, description]
    );

    const isCompact = variant === 'compact';
    const showNativeShare = canShare();

    // Compact variant: single button that uses native share on mobile
    if (isCompact && showNativeShare) {
        return (
            <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground-secondary hover:text-primary bg-foreground/5 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label={t.button}
            >
                <ShareIcon className="w-4 h-4" />
                <span>{t.button}</span>
            </button>
        );
    }

    // Full variant or compact without native share: show platform buttons
    return (
        <div className={`flex flex-wrap items-center gap-2 ${isCompact ? '' : 'justify-center'}`}>
            {/* Native share button (mobile) */}
            {showNativeShare && (
                <button
                    type="button"
                    onClick={handleNativeShare}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg transition-colors shadow-sm"
                    aria-label={t.button}
                >
                    <ShareIcon className="w-4 h-4" />
                    <span>{t.button}</span>
                </button>
            )}

            {/* Platform buttons */}
            <div className="flex items-center gap-1">
                {!showNativeShare && <span className="text-sm text-foreground-secondary mr-2">{t.via}:</span>}

                {platforms.map(({ id, Icon, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => handlePlatformShare(id)}
                        className="p-2 text-foreground-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        aria-label={`${t.via} ${label}`}
                        title={label}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                ))}

                {/* Copy link button */}
                <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`p-2 rounded-lg transition-colors ${
                        copyStatus === 'copied'
                            ? 'text-green-500 bg-green-500/10'
                            : copyStatus === 'failed'
                              ? 'text-red-500 bg-red-500/10'
                              : 'text-foreground-secondary hover:text-primary hover:bg-primary/10'
                    }`}
                    aria-label={copyStatus === 'copied' ? t.copied : t.copyLink}
                    title={copyStatus === 'copied' ? t.copied : t.copyLink}
                    aria-live="polite"
                >
                    {copyStatus === 'copied' ? <CheckIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
