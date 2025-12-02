import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';
import { GISCUS_CONFIG } from '@/config/social';
import type { Locale } from '@/i18n/ui';

interface CommentsProps {
    lang: Locale;
}

/**
 * Comments component using Giscus
 * Supports dynamic language and theme sync with site toggle
 */
export function Comments({ lang }: CommentsProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        // Get initial theme from document
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');

        // Create observer to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    setTheme(isDark ? 'dark' : 'light');

                    // Also send message to Giscus iframe to update theme
                    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
                    if (iframe?.contentWindow) {
                        iframe.contentWindow.postMessage(
                            {
                                giscus: {
                                    setConfig: {
                                        theme: isDark ? 'dark' : 'light'
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
