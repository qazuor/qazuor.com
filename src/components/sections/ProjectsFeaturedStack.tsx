import { useCallback, useEffect, useRef } from 'react';
import { ProjectCard } from '@/components/cards/ProjectCard';
import type { OptimizedImage } from '@/components/ui/ImageCarousel';

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
 * Featured Projects Stack Component
 * Vanilla JS implementation of ScrollTrigger-like center pinning effect
 *
 * Behavior:
 * - Each card pins at the center of the viewport when it arrives
 * - While pinned, the next card scrolls up from below
 * - When the next card reaches center, it pins and covers the previous
 * - After the last card is pinned and you keep scrolling, all cards scroll away together
 */
export function ProjectsFeaturedStack({ projects, lang }: ProjectsFeaturedStackProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    const updateCardPositions = useCallback(() => {
        if (!containerRef.current || cardsRef.current.length === 0) return;

        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const cardHeight = 600; // Height of the card content
        const centerOffset = (viewportHeight - cardHeight) / 2; // Position to center card vertically

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = scrollY + containerRect.top;

        // Each card gets 100vh of scroll distance for its "pinned" phase
        const scrollPerCard = viewportHeight;
        const totalScrollDistance = projects.length * scrollPerCard;

        cardsRef.current.forEach((card, index) => {
            if (!card) return;

            const cardWrapper = card.querySelector('[data-card-wrapper]') as HTMLElement;
            if (!cardWrapper) return;

            // Calculate when this card should start and end pinning
            const cardPinStart = containerTop + index * scrollPerCard;
            const cardPinEnd = containerTop + totalScrollDistance;

            if (scrollY < cardPinStart) {
                // Before this card's pin point - card is below viewport, scrolling up naturally
                cardWrapper.style.position = 'absolute';
                cardWrapper.style.top = `${index * scrollPerCard + centerOffset}px`;
                cardWrapper.style.transform = 'none';
            } else if (scrollY >= cardPinStart && scrollY < cardPinEnd) {
                // Card is in pinned phase - fixed at center
                cardWrapper.style.position = 'fixed';
                cardWrapper.style.top = `${centerOffset}px`;
                cardWrapper.style.transform = 'none';
            } else {
                // After all cards have been shown - scroll away together
                const overscroll = scrollY - cardPinEnd;
                cardWrapper.style.position = 'absolute';
                cardWrapper.style.top = `${totalScrollDistance + centerOffset - overscroll}px`;
                cardWrapper.style.transform = 'none';
            }
        });
    }, [projects.length]);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateCardPositions();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial calculation
        updateCardPositions();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateCardPositions);

        // Re-initialize on view transitions
        document.addEventListener('qazuor:content-ready', updateCardPositions);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateCardPositions);
            document.removeEventListener('qazuor:content-ready', updateCardPositions);
        };
    }, [updateCardPositions]);

    // Container height: each card needs 100vh of scroll space, plus extra for the exit
    const containerHeight = (projects.length + 1) * 100;

    return (
        <div ref={containerRef} className="relative" style={{ height: `${containerHeight}vh` }}>
            {projects.map((project, index) => (
                <div
                    key={project.slug}
                    ref={(el) => {
                        if (el) cardsRef.current[index] = el;
                    }}
                    className="absolute inset-x-0"
                    style={{ zIndex: index + 1 }}
                >
                    <div data-card-wrapper className="flex items-center justify-center px-5 w-full">
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
                </div>
            ))}
        </div>
    );
}
