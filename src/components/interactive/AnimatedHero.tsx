import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface AnimatedHeroProps {
  title?: string;
  subtitle?: string;
}

/**
 * Example component demonstrating GSAP animations
 * This component animates in on mount using GSAP
 */
export function AnimatedHero({
  title = 'Welcome to qazuor.com',
  subtitle = 'Built with Astro, React, and GSAP',
}: AnimatedHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!heroRef.current || !titleRef.current || !subtitleRef.current) return;

    // GSAP timeline for coordinated animations
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
      .from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.5',
      ) // Start 0.5s before previous animation ends
      .from(
        heroRef.current,
        {
          scale: 0.95,
          duration: 0.6,
          ease: 'back.out',
        },
        0,
      ); // Start at the beginning

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1
          ref={titleRef}
          className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
        >
          {title}
        </h1>
        <p ref={subtitleRef} className="text-xl text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
