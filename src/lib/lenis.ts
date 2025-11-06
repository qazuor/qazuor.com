import Lenis from '@studio-freight/lenis';

let lenisInstance: Lenis | null = null;

/**
 * Initialize Lenis smooth scroll
 */
export function initLenis() {
  if (typeof window === 'undefined') return null;

  // Create Lenis instance
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Request animation frame loop
  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

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
    ...options,
  });
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
