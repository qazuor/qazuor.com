import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Configuration options for staggered scroll-triggered animations
 */
interface StaggerAnimationOptions {
    /** Vertical translation distance in pixels (default: 0) */
    y?: number;
    /** Horizontal translation distance in pixels (default: 0) */
    x?: number;
    /** Initial opacity value (default: 0) */
    opacity?: number;
    /** Animation duration in seconds (default: 0.6) */
    duration?: number;
    /** Delay between each element's animation in seconds (default: 0.1) */
    stagger?: number;
    /** GSAP easing function (default: 'power2.out') */
    ease?: string;
    /** Delay before animation starts in seconds (default: 0) */
    delay?: number;
    /** ScrollTrigger start position (default: 'top 80%') */
    start?: string;
    /** ScrollTrigger toggle actions (default: 'play none none none') */
    toggleActions?: string;
}

/**
 * Custom hook for staggered scroll-triggered GSAP animations
 *
 * @param selector - CSS selector for the elements to animate within the container
 * @param options - GSAP animation options including stagger timing
 * @returns ref - Reference to attach to the container element
 *
 * @example
 * const ref = useStaggerAnimation('.card', { y: 20, stagger: 0.1 });
 * return (
 *   <div ref={ref}>
 *     <div className="card">Card 1</div>
 *     <div className="card">Card 2</div>
 *     <div className="card">Card 3</div>
 *   </div>
 * );
 */
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
    selector: string,
    options: StaggerAnimationOptions = {}
) {
    const containerRef = useRef<T>(null);
    const hasAnimated = useRef(false);

    const {
        y = 0,
        x = 0,
        opacity = 0,
        duration = 0.6,
        stagger = 0.1,
        ease = 'power2.out',
        delay = 0,
        start = 'top 80%',
        toggleActions = 'play none none none'
    } = options;

    useEffect(() => {
        if (!containerRef.current || hasAnimated.current) return;
        hasAnimated.current = true;

        const elements = containerRef.current.querySelectorAll(selector);
        if (elements.length === 0) return;

        gsap.from(elements, {
            opacity,
            y,
            x,
            duration,
            stagger,
            ease,
            delay,
            scrollTrigger: {
                trigger: elements[0],
                start,
                toggleActions
            }
        });
    }, [selector, y, x, opacity, duration, stagger, ease, delay, start, toggleActions]);

    return containerRef;
}
