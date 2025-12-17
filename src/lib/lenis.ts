import Lenis from '@studio-freight/lenis';

let lenisInstance: Lenis | null = null;
// MF-012: Store RAF ID for visibility optimization
let rafId: number | null = null;

/**
 * Initialize Lenis smooth scroll
 */
export function initLenis() {
    if (typeof window === 'undefined') return null;

    // Create Lenis instance
    // MF-006: Reduced touchMultiplier from 2 to 1.0 for better mobile scroll behavior
    lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.0
    });

    // MF-012: Request animation frame loop with visibility check
    function raf(time: number) {
        // Skip RAF when tab is hidden to save battery
        if (document.hidden) {
            rafId = requestAnimationFrame(raf);
            return;
        }
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // MF-012: Pause/resume RAF on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!document.hidden && !rafId) {
            rafId = requestAnimationFrame(raf);
        }
    });

    return lenisInstance;
}

/**
 * Get Lenis instance
 */
export function getLenis() {
    return lenisInstance;
}

/**
 * Scroll to specific target
 */
export function scrollTo(target: string | number | HTMLElement, options = {}) {
    if (!lenisInstance) return;

    lenisInstance.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        ...options
    });
}

/**
 * Stop Lenis smooth scroll (pause)
 */
export function stopLenis() {
    if (lenisInstance) {
        lenisInstance.stop();
    }
}

/**
 * Start Lenis smooth scroll (resume)
 */
export function startLenis() {
    if (lenisInstance) {
        lenisInstance.start();
    }
}

/**
 * Destroy Lenis instance
 */
export function destroyLenis() {
    if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
    }
}
