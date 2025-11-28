import { useState } from 'react';
import Masonry from 'react-masonry-css';
import type { OptimizedImage } from '@/components/ui/ImageCarousel';
import { ImageLightbox } from '@/components/ui/Lightbox';

interface ProjectGalleryProps {
    images: OptimizedImage[];
    alt?: string;
}

export function ProjectGallery({ images, alt = 'Project image' }: ProjectGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // Breakpoint columns for masonry layout
    const breakpointColumns = {
        default: 3,
        1024: 2,
        640: 1
    };

    if (images.length === 0) {
        return null;
    }

    return (
        <>
            <Masonry breakpointCols={breakpointColumns} className="masonry-grid" columnClassName="masonry-grid-column">
                {images.map((image, index) => (
                    <button
                        key={image.src}
                        type="button"
                        className="masonry-item group relative cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 w-full text-left"
                        onClick={() => handleImageClick(index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleImageClick(index);
                            }
                        }}
                        aria-label={`View image ${index + 1}`}
                    >
                        <img
                            src={image.src}
                            alt={`${alt} - ${index + 1}`}
                            width={image.width}
                            height={image.height}
                            decoding="async"
                            className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                            </svg>
                        </div>
                    </button>
                ))}
            </Masonry>

            {/* Lightbox */}
            <ImageLightbox
                images={images}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                alt={alt}
            />

            <style>{`
				.masonry-grid {
					display: flex;
					margin-left: -1rem;
					width: auto;
				}

				.masonry-grid-column {
					padding-left: 1rem;
					background-clip: padding-box;
				}

				.masonry-item {
					margin-bottom: 1rem;
				}

				@media (max-width: 640px) {
					.masonry-grid {
						margin-left: -0.5rem;
					}

					.masonry-grid-column {
						padding-left: 0.5rem;
					}

					.masonry-item {
						margin-bottom: 0.5rem;
					}
				}
			`}</style>
        </>
    );
}
