import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';
import { GISCUS_CONFIG } from '@/config/social';
import type { Locale } from '@/i18n/ui';

interface CommentsProps {
    lang: Locale;
}

// Custom theme URLs - uses our custom CSS files for both light and dark modes
// In production: https://qazuor.com/styles/giscus-custom.css (dark) or giscus-custom-light.css (light)
// In development: uses local URLs
const getCustomThemeUrl = (isDark: boolean) => {
    const fileName = isDark ? 'giscus-custom.css' : 'giscus-custom-light.css';
    if (typeof window !== 'undefined') {
        const { hostname } = window.location;
        if (hostname === 'qazuor.com' || hostname === 'www.qazuor.com') {
            return `https://qazuor.com/styles/${fileName}`;
        }
        // For localhost/dev, use the local URL
        return `${window.location.origin}/styles/${fileName}`;
    }
    return `https://qazuor.com/styles/${fileName}`;
};

/**
 * Comments component using Giscus
 * Supports dynamic language and custom theme matching site design
 */
export function Comments({ lang }: CommentsProps) {
    const [theme, setTheme] = useState<string>('dark');

    useEffect(() => {
        // Get initial theme from document
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(getCustomThemeUrl(isDark));

        // Create observer to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    const newTheme = getCustomThemeUrl(isDark);
                    setTheme(newTheme);

                    // Also send message to Giscus iframe to update theme
                    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
                    if (iframe?.contentWindow) {
                        iframe.contentWindow.postMessage(
                            {
                                giscus: {
                                    setConfig: {
                                        theme: newTheme
                                    }
                                }
                            },
                            'https://giscus.app'
                        );
                    }
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="giscus-wrapper min-h-[300px]">
            <Giscus
                repo={GISCUS_CONFIG.repo}
                repoId={GISCUS_CONFIG.repoId}
                category={GISCUS_CONFIG.category}
                categoryId={GISCUS_CONFIG.categoryId}
                mapping={GISCUS_CONFIG.mapping}
                strict={GISCUS_CONFIG.strict}
                reactionsEnabled={GISCUS_CONFIG.reactionsEnabled}
                emitMetadata={GISCUS_CONFIG.emitMetadata}
                inputPosition={GISCUS_CONFIG.inputPosition}
                theme={theme}
                lang={lang}
                loading="lazy"
            />
        </div>
    );
}
