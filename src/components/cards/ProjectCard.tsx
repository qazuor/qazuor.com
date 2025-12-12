import { memo, useEffect, useRef, useState } from 'react';
import { ImageCarousel, type OptimizedImage } from '../ui/ImageCarousel';
import { ImageLightbox } from '../ui/Lightbox';

export interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
    images: OptimizedImage[];
    slug: string;
    layout?: 'default' | 'reversed';
    variant?: 'home' | 'list';
    lang?: string;
    category?: 'open-source' | 'commercial' | 'client';
    featured?: boolean;
    translations?: {
        viewProject: string;
        categories: {
            openSource: string;
            commercial: string;
            client: string;
        };
        moreTechnologies: string;
    };
}

// Category color mapping - enhanced visibility
const categoryColors = {
    'open-source': {
        shadow: 'hover:shadow-emerald-500/20',
        gradient: 'from-emerald-500/10 via-transparent to-transparent',
        badge: 'bg-emerald-600 text-white border-emerald-700'
    },
    commercial: {
        shadow: 'hover:shadow-blue-500/20',
        gradient: 'from-blue-500/10 via-transparent to-transparent',
        badge: 'bg-blue-600 text-white border-blue-700'
    },
    client: {
        shadow: 'hover:shadow-purple-500/20',
        gradient: 'from-purple-500/10 via-transparent to-transparent',
        badge: 'bg-purple-600 text-white border-purple-700'
    }
};

export const ProjectCard = memo(function ProjectCard({
    title,
    description,
    technologies,
    images,
    slug,
    layout = 'default',
    variant = 'list',
    lang = 'en',
    category = 'open-source',
    featured: _featured = false,
    translations = {
        viewProject: 'View Project',
        categories: {
            openSource: 'Open Source',
            commercial: 'Commercial',
            client: 'Client'
        },
        moreTechnologies: 'more'
    }
}: ProjectCardProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleImageClick = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const projectUrl = `/${lang}/projects/${slug}`;

    // Display max 5 technology badges
    const displayTechnologies = technologies.slice(0, 5);

    const isReversed = layout === 'reversed';
    const isHome = variant === 'home';
    const colors = categoryColors[category];

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Home variant (horizontal layout)
    if (isHome) {
        return (
            <>
                <div
                    ref={cardRef}
                    className={`grid md:grid-cols-2 h-[600px] items-stretch gap-0 transform transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    {/* Image Section */}
                    <div
                        className={`${isReversed ? 'md:order-2' : 'md:order-1'} h-full relative group overflow-hidden`}
                    >
                        <ImageCarousel images={images} onImageClick={handleImageClick} alt={title} fullHeight />
                        {/* Gradient overlay */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                        />
                    </div>

                    {/* Info Section */}
                    <div
                        className={`flex flex-col justify-center ${
                            isReversed ? 'md:order-1' : 'md:order-2'
                        } h-full bg-background px-8 py-8`}
                    >
                        <a
                            href={projectUrl}
                            className="text-left space-y-4 group cursor-pointer"
                            aria-label={`${translations.viewProject}: ${title}`}
                        >
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {title}
                            </h3>

                            <p className="text-foreground-secondary leading-relaxed">{description}</p>

                            {/* Technologies */}
                            <div className="flex flex-wrap gap-2">
                                {displayTechnologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {technologies.length > 5 && (
                                    <span className="px-3 py-1 bg-foreground/5 text-foreground-secondary rounded-full text-sm font-medium border border-foreground/10">
                                        +{technologies.length - 5} more
                                    </span>
                                )}
                            </div>

                            {/* Click indicator */}
                            <div className="inline-flex items-center gap-2 text-primary group-hover:gap-3 transition-all bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20 shadow-sm group-hover:shadow-md group-hover:border-primary/40 w-fit">
                                <span className="text-sm font-medium">View Project</span>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>

                <ImageLightbox
                    images={images}
                    initialIndex={lightboxIndex}
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    alt={title}
                />
            </>
        );
    }

    // List variant (vertical card with enhanced effects)
    return (
        <>
            <article
                ref={cardRef}
                className={`group relative h-full rounded-xl overflow-hidden transform transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                {/* Animated gradient border glow */}
                <div
                    className={`absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-md -z-10`}
                />

                {/* Card container with glassmorphism */}
                <div
                    className={`relative h-full bg-card backdrop-blur-sm border border-border rounded-xl overflow-hidden transition-all duration-500 shadow-lg ${colors.shadow} hover:shadow-2xl group-hover:scale-[1.02] transform flex flex-col`}
                >
                    {/* Category badge - improved visibility */}
                    <div className="absolute top-4 left-4 z-20">
                        <div
                            className={`px-3 py-1.5 ${colors.badge} text-xs font-semibold rounded-full border shadow-lg backdrop-blur-md`}
                        >
                            {category === 'open-source'
                                ? translations.categories.openSource
                                : category === 'commercial'
                                  ? translations.categories.commercial
                                  : translations.categories.client}
                        </div>
                    </div>

                    {/* Image section with enhanced hover */}
                    <div className="relative aspect-video overflow-hidden">
                        <div className="transform transition-transform duration-500 group-hover:scale-105">
                            <ImageCarousel images={images} onImageClick={handleImageClick} alt={title} />
                        </div>
                        {/* Gradient overlay on hover */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                        />
                    </div>

                    {/* Content section */}
                    <div className="p-6 bg-card flex flex-col flex-1">
                        <div className="flex-1">
                            {/* Title */}
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                                {title}
                            </h3>

                            {/* Description */}
                            <p className="text-foreground-secondary text-sm leading-relaxed line-clamp-3 mb-4">
                                {description}
                            </p>

                            {/* Technologies with stagger effect */}
                            <div className="flex flex-wrap gap-2">
                                {displayTechnologies.map((tech, index) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                            animation: isVisible ? 'fadeInScale 0.3s ease-out forwards' : 'none'
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {technologies.length > 5 && (
                                    <span className="px-3 py-1 bg-foreground/5 text-foreground-secondary rounded-full text-xs font-medium border border-foreground/10">
                                        +{technologies.length - 5} {translations.moreTechnologies}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* View project link - always at bottom */}
                        <a
                            href={projectUrl}
                            className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all duration-300 font-medium text-sm mt-4 w-fit"
                            aria-label={`${translations.viewProject}: ${title}`}
                        >
                            <span>{translations.viewProject}</span>
                            <svg
                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </article>

            {/* Lightbox */}
            <ImageLightbox
                images={images}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                alt={title}
            />
        </>
    );
});
