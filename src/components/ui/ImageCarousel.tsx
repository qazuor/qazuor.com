import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

export interface ImageCarouselProps {
    images: string[];
    onImageClick?: (index: number) => void;
    showDots?: boolean;
    alt?: string;
    fullHeight?: boolean;
}

export function ImageCarousel({
    images,
    onImageClick,
    showDots = true,
    alt = 'Project image',
    fullHeight = false
}: ImageCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (images.length === 0) {
        return (
            <div className="aspect-video bg-foreground/5 rounded-lg flex items-center justify-center">
                <span className="text-foreground-secondary">No images available</span>
            </div>
        );
    }

    // Single image - no carousel needed
    if (images.length === 1) {
        return (
            <button
                type="button"
                onClick={() => onImageClick?.(0)}
                className={`relative w-full group cursor-pointer ${fullHeight ? 'h-full' : ''}`}
                aria-label={`View ${alt}`}
            >
                <img
                    src={images[0]}
                    alt={alt}
                    className={`w-full h-full object-cover ${fullHeight ? '' : 'rounded-lg'}`}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
        );
    }

    return (
        <div className={`relative ${fullHeight ? 'h-full' : ''}`}>
            {/* Carousel */}
            <div className={`overflow-hidden rounded-lg ${fullHeight ? 'h-full' : ''}`} ref={emblaRef}>
                <div className={`flex ${fullHeight ? 'h-full' : ''}`}>
                    {images.map((image, index) => (
                        <div key={image} className={`flex-[0_0_100%] min-w-0 ${fullHeight ? 'h-full' : ''}`}>
                            <button
                                type="button"
                                onClick={() => onImageClick?.(index)}
                                className={`relative w-full group cursor-pointer ${fullHeight ? 'h-full' : ''}`}
                                aria-label={`View image ${index + 1} of ${images.length}`}
                            >
                                <img
                                    src={image}
                                    alt={`${alt} ${index + 1}`}
                                    className={`w-full h-full object-cover ${fullHeight ? '' : 'aspect-video'}`}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
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
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            {showDots && images.length > 1 && (
                <div
                    className={`flex gap-2 justify-center ${fullHeight ? 'absolute bottom-4 left-0 right-0 z-10' : 'mt-4'}`}
                    role="tablist"
                    aria-label="Image navigation"
                >
                    {images.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === selectedIndex ? 'bg-primary w-6' : 'bg-foreground/30 hover:bg-foreground/50'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                            aria-selected={index === selectedIndex}
                            role="tab"
                        />
                    ))}
                </div>
            )}

            {/* Optional: Arrow Navigation for Desktop */}
            {images.length > 1 && (
                <>
                    {canScrollPrev && (
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollPrev()}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors hidden md:block"
                            aria-label="Previous image"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}
                    {canScrollNext && (
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollNext()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors hidden md:block"
                            aria-label="Next image"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
