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
                // Scroll to top on page change
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
