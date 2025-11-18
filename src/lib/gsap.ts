/**
 * GSAP Lazy Loading Utilities
 *
 * This module provides lazy loading for GSAP and its plugins to reduce initial bundle size.
 * GSAP is only loaded when explicitly requested via the loader functions.
 */

// Track if GSAP has been initialized to avoid duplicate configurations
let gsapInitialized = false;

/**
 * Lazy load GSAP core library
 * @returns Promise resolving to GSAP instance
 */
export async function loadGSAP() {
    const gsapModule = await import('gsap');
    const gsap = gsapModule.default;

    // Apply default configuration only once
    if (!gsapInitialized && typeof window !== 'undefined') {
        gsap.defaults({
            ease: 'power3.out',
            duration: 0.8
        });
        gsapInitialized = true;
    }

    return gsap;
}

/**
 * Lazy load GSAP ScrollTrigger plugin
 * @returns Promise resolving to { gsap, ScrollTrigger }
 */
export async function loadScrollTrigger() {
    const [gsapModule, scrollTriggerModule] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);

    const gsap = gsapModule.default;
    const { ScrollTrigger } = scrollTriggerModule;

    // Register plugin and configure
    if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Configure ScrollTrigger to prevent excessive API calls
        ScrollTrigger.config({
            autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
        });

        // Apply default GSAP config if not already done
        if (!gsapInitialized) {
            gsap.defaults({
                ease: 'power3.out',
                duration: 0.8
            });
            gsapInitialized = true;
        }
    }

    return { gsap, ScrollTrigger };
}

/**
 * Lazy load GSAP ScrollToPlugin
 * @returns Promise resolving to { gsap, ScrollToPlugin }
 */
export async function loadScrollToPlugin() {
    const [gsapModule, scrollToModule] = await Promise.all([import('gsap'), import('gsap/ScrollToPlugin')]);

    const gsap = gsapModule.default;
    const { ScrollToPlugin } = scrollToModule;

    if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);

        if (!gsapInitialized) {
            gsap.defaults({
                ease: 'power3.out',
                duration: 0.8
            });
            gsapInitialized = true;
        }
    }

    return { gsap, ScrollToPlugin };
}

interface AnimationOptions {
    scrollTrigger?: object;
    [key: string]: unknown;
}

/**
 * Common animation utilities using lazy-loaded GSAP
 * Each animation function loads GSAP on-demand
 */
export const animations = {
    /**
     * Fade in element from bottom
     */
    fadeIn: async (element: string | Element, options: AnimationOptions = {}) => {
        const gsap = await loadGSAP();
        return gsap.from(element, {
            y: 50,
            opacity: 0,
            duration: 1,
            ...options
        });
    },

    /**
     * Fade in elements with stagger
     */
    fadeInStagger: async (elements: string | NodeListOf<Element>, options: AnimationOptions = {}) => {
        const gsap = await loadGSAP();
        return gsap.from(elements, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ...options
        });
    },

    /**
     * Scroll-triggered fade in
     */
    fadeInOnScroll: async (element: string | Element, options: AnimationOptions = {}) => {
        const { gsap } = await loadScrollTrigger();
        return gsap.from(element, {
            y: 100,
            opacity: 0,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1,
                ...options.scrollTrigger
            },
            ...options
        });
    },

    /**
     * Simple scroll parallax effect for elements
     */
    parallax: async (element: string | Element, yDistance = 100, options: AnimationOptions = {}) => {
        const { gsap } = await loadScrollTrigger();
        return gsap.to(element, {
            y: yDistance,
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                ...options.scrollTrigger
            },
            ...options
        });
    },

    /**
     * Scale animation
     */
    scaleIn: async (element: string | Element, options: AnimationOptions = {}) => {
        const gsap = await loadGSAP();
        return gsap.from(element, {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            ...options
        });
    }
};
