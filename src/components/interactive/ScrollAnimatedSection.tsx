import { useEffect, useRef } from 'react';
import { loadScrollTrigger } from '@/lib/gsap';

interface ScrollAnimatedSectionProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

/**
 * Section that animates in on scroll using GSAP ScrollTrigger (lazy-loaded)
 */
export function ScrollAnimatedSection({ title, description, children }: ScrollAnimatedSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        let ctx: gsap.Context | null = null;

        // Lazy load GSAP and ScrollTrigger
        loadScrollTrigger().then(({ gsap }) => {
            if (!sectionRef.current) return;

            ctx = gsap.context(() => {
                // Title animation
                gsap.from(titleRef.current, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1
                    }
                });

                // Description animation
                gsap.from(descRef.current, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        end: 'top 45%',
                        scrub: 1
                    }
                });

                // Content animation
                if (contentRef.current) {
                    gsap.from(contentRef.current, {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 70%',
                            end: 'top 40%',
                            scrub: 1
                        }
                    });
                }
            }, sectionRef);
        });

        return () => {
            ctx?.revert();
        };
    }, []);

    return (
        <div ref={sectionRef} className="py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h2
                    ref={titleRef}
                    className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                >
                    {title}
                </h2>
                <p ref={descRef} className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    {description}
                </p>
                {children && <div ref={contentRef}>{children}</div>}
            </div>
        </div>
    );
}
