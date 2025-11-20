import { useState } from 'react';
import { ImageCarousel } from '../ui/ImageCarousel';
import { ImageLightbox } from '../ui/Lightbox';

export interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
    images: string[];
    slug: string;
    layout?: 'default' | 'reversed';
    variant?: 'home' | 'list';
    lang?: string;
}

export function ProjectCardNew({
    title,
    description,
    technologies,
    images,
    slug,
    layout = 'default',
    variant = 'list',
    lang = 'en'
}: ProjectCardProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const handleInfoClick = () => {
        window.location.href = `/${lang}/projects/${slug}`;
    };

    // Display max 5 technology badges
    const displayTechnologies = technologies.slice(0, 5);

    const isReversed = layout === 'reversed';

    // Determine if it's home variant for styling
    const isHome = variant === 'home';

    return (
        <>
            <div
                className={`grid ${
                    isHome ? 'md:grid-cols-2 h-[600px] items-stretch gap-0' : 'md:grid-cols-2 lg:grid-cols-1 gap-6'
                } ${isReversed && isHome ? 'md:grid-cols-2' : ''}`}
            >
                {/* Image Section */}
                <div className={`${isReversed && isHome ? 'md:order-2' : 'md:order-1'} ${isHome ? 'h-full' : ''}`}>
                    <ImageCarousel images={images} onImageClick={handleImageClick} alt={title} fullHeight={isHome} />
                </div>

                {/* Info Section */}
                <div
                    className={`flex flex-col justify-center ${
                        isReversed && isHome ? 'md:order-1' : 'md:order-2'
                    } ${isHome ? 'h-full bg-background px-8 py-8' : ''}`}
                >
                    <button
                        type="button"
                        onClick={handleInfoClick}
                        className="text-left space-y-4 group cursor-pointer"
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
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>

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
}
