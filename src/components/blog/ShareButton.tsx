import { memo, useCallback, useState } from 'react';
import { CheckIcon, LinkIcon, ShareIcon } from '@/components/icons/SocialIcons';
import { getCompactPlatforms, getFullPlatforms, getShareUrl } from '@/data/shareButtons';
import type { Locale } from '@/i18n/ui';
import { canShare, copyToClipboard, sharePost } from '@/utils/share';

// Memoized platform button to avoid callback recreation for each platform
interface PlatformButtonProps {
    id: string;
    Icon: React.ComponentType<{ className?: string }>;
    label: string;
    brandColor: string;
    ariaLabel: string;
    onShare: (id: string) => void;
    variant: 'compact' | 'full';
}

const PlatformButton = memo(function PlatformButton({
    id,
    Icon,
    label,
    brandColor,
    ariaLabel,
    onShare,
    variant
}: PlatformButtonProps) {
    const handleClick = useCallback(() => {
        onShare(id);
    }, [id, onShare]);

    const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = brandColor;
            e.currentTarget.style.backgroundColor = `${brandColor}1a`;
        },
        [brandColor]
    );

    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.color = '';
        e.currentTarget.style.backgroundColor = '';
    }, []);

    if (variant === 'compact') {
        return (
            <button
                type="button"
                onClick={handleClick}
                className="p-2 text-white/70 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-base"
                style={{ '--brand-color': brandColor } as React.CSSProperties}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={ariaLabel}
                title={label}
            >
                <Icon className="w-4 h-4" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="group p-3 text-foreground-secondary rounded-xl border border-foreground/10 hover:border-transparent bg-surface/50 hover:shadow-lg transition-all duration-base hover:-translate-y-0.5"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={ariaLabel}
            title={label}
        >
            <Icon className="w-5 h-5 group-hover:scale-emphasis transition-transform" />
        </button>
    );
});

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

/**
 * Share button component with Web Share API support and fallback
 * Platform configuration is managed in src/data/shareButtons.ts
 */
export function ShareButton({ title, description, url, lang, variant = 'full' }: ShareButtonProps) {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
    const t = translations[lang];

    // Get platforms from centralized config
    const compactPlatforms = getCompactPlatforms();
    const fullPlatforms = getFullPlatforms();

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
                className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/30 transition-all duration-base hover:shadow-lg hover:shadow-white/5"
                aria-label={t.button}
            >
                <ShareIcon className="w-4 h-4 group-hover:scale-emphasis transition-transform" />
                <span>{t.button}</span>
            </button>
        );
    }

    // Compact variant without native share: show platforms configured for compact
    if (isCompact) {
        return (
            <div className="flex items-center gap-1">
                {compactPlatforms.map(({ id, Icon, label, brandColor }) => (
                    <PlatformButton
                        key={id}
                        id={id}
                        Icon={Icon}
                        label={label}
                        brandColor={brandColor}
                        ariaLabel={`${t.via} ${label}`}
                        onShare={handlePlatformShare}
                        variant="compact"
                    />
                ))}
                <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-base ${
                        copyStatus === 'copied'
                            ? 'text-[rgb(var(--color-ui-success))] bg-[rgba(var(--color-ui-success),0.2)] border-[rgba(var(--color-ui-success),0.3)]'
                            : copyStatus === 'failed'
                              ? 'text-[rgb(var(--color-ui-error))] bg-[rgba(var(--color-ui-error),0.2)] border-[rgba(var(--color-ui-error),0.3)]'
                              : 'text-white/70 border-white/10 hover:border-white/20 hover:text-primary hover:bg-primary/10'
                    }`}
                    aria-label={copyStatus === 'copied' ? t.copied : t.copyLink}
                    title={copyStatus === 'copied' ? t.copied : t.copyLink}
                    aria-live="polite"
                >
                    {copyStatus === 'copied' ? <CheckIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                </button>
            </div>
        );
    }

    // Full variant: show all platforms configured for full mode
    return (
        <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Native share button (mobile) */}
            {showNativeShare && (
                <button
                    type="button"
                    onClick={handleNativeShare}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary rounded-xl transition-all duration-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                    aria-label={t.button}
                >
                    <ShareIcon className="w-4 h-4 group-hover:scale-emphasis transition-transform" />
                    <span>{t.button}</span>
                </button>
            )}

            {/* Platform buttons */}
            <div className="flex items-center gap-2">
                {fullPlatforms.map(({ id, Icon, label, brandColor }) => (
                    <PlatformButton
                        key={id}
                        id={id}
                        Icon={Icon}
                        label={label}
                        brandColor={brandColor}
                        ariaLabel={`${t.via} ${label}`}
                        onShare={handlePlatformShare}
                        variant="full"
                    />
                ))}

                {/* Copy link button */}
                <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`group p-3 rounded-xl border transition-all duration-base hover:-translate-y-0.5 ${
                        copyStatus === 'copied'
                            ? 'text-[rgb(var(--color-ui-success))] bg-[rgba(var(--color-ui-success),0.1)] border-[rgba(var(--color-ui-success),0.3)] shadow-lg shadow-[rgba(var(--color-ui-success),0.2)]'
                            : copyStatus === 'failed'
                              ? 'text-[rgb(var(--color-ui-error))] bg-[rgba(var(--color-ui-error),0.1)] border-[rgba(var(--color-ui-error),0.3)] shadow-lg shadow-[rgba(var(--color-ui-error),0.2)]'
                              : 'text-foreground-secondary border-foreground/10 bg-surface/50 hover:text-primary hover:bg-primary/10 hover:border-primary/30 hover:shadow-lg'
                    }`}
                    aria-label={copyStatus === 'copied' ? t.copied : t.copyLink}
                    title={copyStatus === 'copied' ? t.copied : t.copyLink}
                    aria-live="polite"
                >
                    {copyStatus === 'copied' ? (
                        <CheckIcon className="w-5 h-5 group-hover:scale-emphasis transition-transform" />
                    ) : (
                        <LinkIcon className="w-5 h-5 group-hover:scale-emphasis transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
}
