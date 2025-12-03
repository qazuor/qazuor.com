import { useEffect, useState } from 'react';
import arrowUpIcon from '@/icons/ui/arrow-up.svg?raw';
import { scrollTo } from '@/lib/lenis';

interface ScrollToTopProps {
    ariaLabel?: string;
}

export function ScrollToTop({ ariaLabel = 'Scroll to top' }: ScrollToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // MF-007: Use Lenis scrollTo to avoid conflict with smooth scroll
    const scrollToTop = () => {
        scrollTo(0, { duration: 1.2 });
    };

    return (
        <>
            {isVisible && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    data-scroll-to-top="true"
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:bg-primary-600 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label={ariaLabel}
                >
                    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                    <span dangerouslySetInnerHTML={{ __html: arrowUpIcon }} />
                </button>
            )}
        </>
    );
}
