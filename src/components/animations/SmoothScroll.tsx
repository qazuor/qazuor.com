import { useEffect } from 'react';
import { loadScrollTrigger } from '@/lib/gsap';
import { initLenis } from '@/lib/lenis';

/**
 * Smooth Scroll component using Lenis
 * Integrates with GSAP ScrollTrigger (lazy-loaded)
 * Compatible with Astro View Transitions
 */
export function SmoothScroll() {
    useEffect(() => {
        // Initialize Lenis
        const lenis = initLenis();

        if (!lenis) return;

        let scrollTriggerInstance: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

        // Lazy load ScrollTrigger
        loadScrollTrigger().then(({ ScrollTrigger }) => {
            scrollTriggerInstance = ScrollTrigger;

            // Integrate Lenis with GSAP ScrollTrigger
            lenis.on('scroll', () => {
                ScrollTrigger.update();
            });
        });

        // Update ScrollTrigger on resize
        const handleResize = () => {
            scrollTriggerInstance?.refresh();
        };

        window.addEventListener('resize', handleResize);

        // Re-initialize after page transitions
        const handlePageTransition = () => {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                scrollTriggerInstance?.refresh();

                // Check if there's a hash in the URL - if so, scroll to that element
                const hash = window.location.hash;
                if (hash) {
                    const targetId = hash.replace('#', '');
                    const element = document.getElementById(targetId);
                    if (element) {
                        const headerOffset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        lenis?.scrollTo(offsetPosition, { immediate: true });
                        return;
                    }
                }

                // No hash or element not found - scroll to top
                lenis?.scrollTo(0, { immediate: true });
            }, 100);
        };

        document.addEventListener('page-transition-complete', handlePageTransition);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('page-transition-complete', handlePageTransition);
            lenis?.destroy();
        };
    }, []);

    return null;
}
