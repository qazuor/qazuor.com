import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

interface ScrollAnimationOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  start?: string;
  toggleActions?: string;
}

/**
 * Custom hook for scroll-triggered GSAP animations
 *
 * @param selector - CSS selector for the element(s) to animate within the container
 * @param options - GSAP animation options
 * @returns ref - Reference to attach to the container element
 *
 * @example
 * const ref = useScrollAnimation('.title', { y: 30, duration: 0.8 });
 * return <div ref={ref}><h1 className="title">Hello</h1></div>
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  selector: string,
  options: ScrollAnimationOptions = {},
) {
  const containerRef = useRef<T>(null);
  const hasAnimated = useRef(false);

  const {
    y = 0,
    x = 0,
    opacity = 0,
    duration = 0.8,
    ease = 'power3.out',
    delay = 0,
    start = 'top 80%',
    toggleActions = 'play none none none',
  } = options;

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const element = containerRef.current.querySelector(selector);
    if (!element) return;

    gsap.from(element, {
      opacity,
      y,
      x,
      duration,
      ease,
      delay,
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions,
      },
    });
  }, [selector, y, x, opacity, duration, ease, delay, start, toggleActions]);

  return containerRef;
}
