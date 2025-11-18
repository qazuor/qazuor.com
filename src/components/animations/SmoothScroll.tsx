import { useEffect } from 'react';
import { loadScrollTrigger } from '@/lib/gsap';
import { initLenis } from '@/lib/lenis';

/**
 * Smooth Scroll component using Lenis
 * Integrates with GSAP ScrollTrigger (lazy-loaded)
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

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            lenis?.destroy();
        };
    }, []);

    return null;
}
