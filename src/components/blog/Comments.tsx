import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';
import { GISCUS_CONFIG } from '@/config/social';
import type { Locale } from '@/i18n/ui';

interface CommentsProps {
    lang: Locale;
}

// Custom theme URLs - uses our custom CSS files for both light and dark modes
// Note: In dev, Chrome blocks this due to Private Network Access policy, but Firefox works fine
const getGiscusTheme = (isDark: boolean) => {
    const fileName = isDark ? 'giscus-custom.css' : 'giscus-custom-light.css';
    if (typeof window !== 'undefined') {
        const { hostname } = window.location;
        if (hostname === 'qazuor.com' || hostname === 'www.qazuor.com') {
            return `https://qazuor.com/styles/${fileName}`;
        }
        return `${window.location.origin}/styles/${fileName}`;
    }
    return `https://qazuor.com/styles/${fileName}`;
};

/**
 * Comments component using Giscus
 * Supports dynamic language and custom theme matching site design
 */
export function Comments({ lang }: CommentsProps) {
    // Initialize with correct theme based on current document state
    const [theme, setTheme] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            return getGiscusTheme(isDark);
        }
        return getGiscusTheme(true); // Default to dark for SSR
    });

    useEffect(() => {
        // Re-check theme on mount (in case SSR guess was wrong)
        const isDark = document.documentElement.classList.contains('dark');
        const correctTheme = getGiscusTheme(isDark);
        // setTheme only triggers re-render if value actually changed
        setTheme(correctTheme);

        // Create observer to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    const newTheme = getGiscusTheme(isDark);
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
