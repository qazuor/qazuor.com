/**
 * Scroll Reveal Animation Script
 * Vanilla JS replacement for GSAP scroll animations
 * Uses IntersectionObserver for 100% browser support
 */

// Configuration
const OBSERVER_OPTIONS: IntersectionObserverInit = {
    root: null,
    rootMargin: '-10% 0px -10% 0px', // Trigger slightly before element is fully visible
    threshold: 0.1
};

// Selectors for elements to animate
const ANIMATE_SELECTORS = ['.animate-on-scroll', '.stagger-item'];

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal(): void {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Make all elements visible immediately
        const elements = document.querySelectorAll(ANIMATE_SELECTORS.join(', '));
        for (const el of elements) {
            el.classList.add('is-visible');
        }
        return;
    }

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve after animation (one-time animation)
                observer.unobserve(entry.target);
            }
        }
    }, OBSERVER_OPTIONS);

    // Observe all animatable elements
    const elements = document.querySelectorAll(ANIMATE_SELECTORS.join(', '));
    for (const el of elements) {
        observer.observe(el);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
    initScrollReveal();
}

// Re-initialize after View Transitions navigation
document.addEventListener('qazuor:content-ready', initScrollReveal);

export {};
