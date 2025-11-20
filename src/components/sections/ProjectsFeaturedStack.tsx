import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { ProjectCardNew } from '@/components/cards/ProjectCardNew';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Project {
    title: string;
    description: string;
    slug: string;
    technologies: string[];
    images: string[];
    featured: boolean;
    order: number;
}

interface ProjectsFeaturedStackProps {
    projects: Project[];
    lang: string;
}

export function ProjectsFeaturedStack({ projects, lang }: ProjectsFeaturedStackProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (!containerRef.current || cardsRef.current.length === 0) return;

        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                // Calculate the scale based on position in stack
                const targetScale = 1 - (cardsRef.current.length - 1 - index) * 0.05;

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    pin: true,
                    pinSpacing: false,
                    end: () => `+=${(cardsRef.current.length - index) * window.innerHeight}`,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    markers: false // Set to true for debugging
                });

                // Scale down animation when next card arrives
                gsap.to(card, {
                    scale: targetScale,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top top',
                        end: () => `+=${window.innerHeight}`,
                        scrub: 0.5,
                        invalidateOnRefresh: true
                    }
                });
            });
        }, containerRef);

        return () => {
            ctx.revert();
            for (const trigger of ScrollTrigger.getAll()) {
                trigger.kill();
            }
        };
    }, []);

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
                        <ProjectCardNew
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
