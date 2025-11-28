import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { ProjectCard } from '@/components/cards/ProjectCard';
import type { OptimizedImage } from '@/components/ui/ImageCarousel';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Project {
    title: string;
    description: string;
    slug: string;
    technologies: string[];
    images: OptimizedImage[];
    featured: boolean;
    order: number;
}

interface ProjectsFeaturedStackProps {
    projects: Project[];
    lang: string;
}

/**
 * Detects if the current device is mobile
 */
function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;

    // Check multiple indicators for mobile
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;

    return isMobileUA || (isTouchDevice && isSmallScreen);
}

/**
 * Detects if the current browser is Firefox
 */
function isFirefox(): boolean {
    if (typeof window === 'undefined') return false;
    return navigator.userAgent.toLowerCase().includes('firefox');
}

export function ProjectsFeaturedStack({ projects, lang }: ProjectsFeaturedStackProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const [animationFailed, setAnimationFailed] = useState(false);

    useEffect(() => {
        // Detect mobile device
        const mobile = isMobileDevice();

        if (!containerRef.current || cardsRef.current.length === 0) return;

        try {
            const ctx = gsap.context(() => {
                cardsRef.current.forEach((card, index) => {
                    if (!card) return;

                    // Calculate the scale based on position in stack
                    const targetScale = 1 - (cardsRef.current.length - 1 - index) * 0.05;

                    // Mobile-first configuration
                    const scrollTriggerConfig: ScrollTrigger.Vars = {
                        trigger: card,
                        start: 'top top',
                        pin: true,
                        pinSpacing: false,
                        end: () => `+=${(cardsRef.current.length - index) * window.innerHeight}`,
                        invalidateOnRefresh: true,
                        markers: false, // Set to true for debugging
                        // Mobile-specific optimizations
                        ...(mobile && {
                            // Disable anticipatePin on mobile to prevent layout issues
                            anticipatePin: 0,
                            // Use simpler pinning on mobile
                            pinType: 'fixed',
                            // Reduce scrub smoothness on mobile for better performance
                            scrub: 1
                        }),
                        // Desktop-specific optimizations
                        ...(!mobile && {
                            anticipatePin: 1,
                            scrub: 0.5
                        })
                    };

                    // Create ScrollTrigger with mobile-optimized config
                    ScrollTrigger.create(scrollTriggerConfig);

                    // Scale down animation when next card arrives
                    gsap.to(card, {
                        scale: targetScale,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top top',
                            end: () => `+=${window.innerHeight}`,
                            scrub: mobile ? 1 : 0.5,
                            invalidateOnRefresh: true
                        }
                    });
                });

                // Firefox mobile-specific fix
                if (mobile && isFirefox()) {
                    // Force a refresh after a short delay to ensure proper layout
                    setTimeout(() => {
                        ScrollTrigger.refresh();
                    }, 100);
                }
            }, containerRef);

            return () => {
                ctx.revert();
                for (const trigger of ScrollTrigger.getAll()) {
                    trigger.kill();
                }
            };
        } catch (error) {
            // Log error for debugging (only in development)
            if (import.meta.env.DEV) {
                console.error('Failed to initialize GSAP ScrollTrigger:', error);
            }
            // Enable fallback mode
            setAnimationFailed(true);
        }
    }, []);

    // Fallback render: simple stacked layout without animations
    if (animationFailed) {
        return (
            <div className="relative space-y-8 px-5 py-16">
                {projects.map((project, index) => (
                    <div
                        key={project.slug}
                        className="w-full max-w-[1600px] mx-auto"
                        style={{
                            minHeight: '600px',
                            opacity: 1,
                            transform: 'none'
                        }}
                    >
                        <ProjectCard
                            title={project.title}
                            description={project.description}
                            technologies={project.technologies}
                            images={project.images}
                            slug={project.slug}
                            layout={index % 2 === 0 ? 'default' : 'reversed'}
                            variant="home"
                            lang={lang}
                        />
                    </div>
                ))}
            </div>
        );
    }

    // Normal render with animations
    return (
        <div ref={containerRef} className="relative">
            {projects.map((project, index) => (
                <div
                    key={project.slug}
                    ref={(el) => {
                        if (el) cardsRef.current[index] = el;
                    }}
                    className="h-screen flex items-center justify-center w-full px-5"
                    style={{ zIndex: index + 1 }}
                >
                    <div className="h-[600px] w-[80vw] max-w-[1600px]">
                        <ProjectCard
                            title={project.title}
                            description={project.description}
                            technologies={project.technologies}
                            images={project.images}
                            slug={project.slug}
                            layout={index % 2 === 0 ? 'default' : 'reversed'}
                            variant="home"
                            lang={lang}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
