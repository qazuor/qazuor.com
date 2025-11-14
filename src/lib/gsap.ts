import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins and configure only on client
let gsapConfigured = false;
if (typeof window !== 'undefined' && !gsapConfigured) {
  gsap.registerPlugin(ScrollTrigger);

  // Default GSAP configuration
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.8,
  });

  // Configure ScrollTrigger to prevent excessive API calls
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  });

  gsapConfigured = true;
}

interface AnimationOptions {
  scrollTrigger?: object;
  [key: string]: unknown;
}

/**
 * Common animation utilities
 */
export const animations = {
  /**
   * Fade in element from bottom
   */
  fadeIn: (element: string | Element, options: AnimationOptions = {}) => {
    return gsap.from(element, {
      y: 50,
      opacity: 0,
      duration: 1,
      ...options,
    });
  },

  /**
   * Fade in elements with stagger
   */
  fadeInStagger: (elements: string | NodeListOf<Element>, options: AnimationOptions = {}) => {
    return gsap.from(elements, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ...options,
    });
  },

  /**
   * Scroll-triggered fade in
   */
  fadeInOnScroll: (element: string | Element, options: AnimationOptions = {}) => {
    return gsap.from(element, {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1,
        ...options.scrollTrigger,
      },
      ...options,
    });
  },

  /**
   * Simple scroll parallax effect for elements
   */
  parallax: (element: string | Element, yDistance = 100, options: AnimationOptions = {}) => {
    return gsap.to(element, {
      y: yDistance,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        ...options.scrollTrigger,
      },
      ...options,
    });
  },

  /**
   * Scale animation
   */
  scaleIn: (element: string | Element, options: AnimationOptions = {}) => {
    return gsap.from(element, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      ...options,
    });
  },
};

export { gsap, ScrollTrigger };
