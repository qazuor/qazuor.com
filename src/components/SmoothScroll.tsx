import { useEffect } from 'react';
import { initLenis } from '../lib/lenis';
import { ScrollTrigger } from '../lib/gsap';

/**
 * Smooth Scroll component using Lenis
 * Integrates with GSAP ScrollTrigger
 */
export function SmoothScroll() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = initLenis();

    if (!lenis) return;

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Update ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
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
