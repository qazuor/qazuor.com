import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

export interface OptimizedImage {
    src: string;
    width: number;
    height: number;
}

export interface ImageCarouselProps {
    images: OptimizedImage[];
    onImageClick?: (index: number) => void;
    showDots?: boolean;
    alt?: string;
    fullHeight?: boolean;
    /** Which corners to round: 'all' | 'left' | 'right' | 'none' | 'top-md-left' | 'top-md-right' */
    roundedCorners?: 'all' | 'left' | 'right' | 'none' | 'top-md-left' | 'top-md-right';
}

// Helper to get rounded corner classes based on position
const getRoundedClasses = (corners: 'all' | 'left' | 'right' | 'none' | 'top-md-left' | 'top-md-right'): string => {
    switch (corners) {
        case 'left':
            return 'rounded-l-2xl';
        case 'right':
            return 'rounded-r-2xl';
        case 'top-md-left':
            return 'rounded-t-2xl md:rounded-none md:rounded-l-2xl';
        case 'top-md-right':
            return 'rounded-t-2xl md:rounded-none md:rounded-r-2xl';
        case 'none':
            return '';
        case 'all':
        default:
            return 'rounded-xl';
    }
};

export function ImageCarousel({
    images,
    onImageClick,
    showDots = true,
    alt = 'Project image',
    fullHeight = false,
    roundedCorners = 'all'
}: ImageCarouselProps) {
    const roundedClass = getRoundedClasses(roundedCorners);
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
                className={`relative w-full group cursor-pointer overflow-hidden ${fullHeight ? 'h-full' : 'aspect-video'} ${fullHeight ? roundedClass : roundedClass}`}
                aria-label={`View ${alt}`}
            >
                {/* Blurred background image - saturated for vibrant colors */}
                <img
                    src={images[0].src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-70 saturate-150"
                    loading="lazy"
                />
                {/* Theme-adaptive overlay for contrast */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 dark:from-black/20 dark:via-black/10 dark:to-black/30 ${roundedClass}`}
                />
                {/* Subtle inner shadow for depth */}
                <div
                    className={`absolute inset-0 shadow-[inset_0_2px_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.3)] ${roundedClass}`}
                />
                {/* Main image container with responsive padding */}
                <div className="relative z-10 w-full h-full p-2 sm:p-3 md:p-4 lg:p-5">
                    <img
                        src={images[0].src}
                        alt={alt}
                        width={images[0].width}
                        height={images[0].height}
                        decoding="async"
                        className="w-full h-full object-contain rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                </div>
                {/* Hover overlay with zoom icon */}
                <div
                    className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-20 flex items-center justify-center ${roundedClass}`}
                >
                    <div className="w-16 h-16 rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-2xl ring-2 ring-white/50">
                        <svg
                            className="w-7 h-7 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                        </svg>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <div className={`relative ${fullHeight ? 'h-full' : ''}`}>
            {/* Carousel */}
            <div className={`overflow-hidden ${roundedClass} ${fullHeight ? 'h-full' : ''}`} ref={emblaRef}>
                <div className={`flex ${fullHeight ? 'h-full' : ''}`}>
                    {images.map((image, index) => (
                        <div key={image.src} className={`flex-[0_0_100%] min-w-0 ${fullHeight ? 'h-full' : ''}`}>
                            <button
                                type="button"
                                onClick={() => onImageClick?.(index)}
                                className={`relative w-full group cursor-pointer overflow-hidden ${fullHeight ? 'h-full' : 'aspect-video'}`}
                                aria-label={`View image ${index + 1} of ${images.length}`}
                            >
                                {/* Blurred background image - saturated for vibrant colors */}
                                <img
                                    src={image.src}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-70 saturate-150"
                                    loading="lazy"
                                />
                                {/* Theme-adaptive overlay for contrast */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 dark:from-black/20 dark:via-black/10 dark:to-black/30 ${roundedClass}`}
                                />
                                {/* Subtle inner shadow for depth */}
                                <div
                                    className={`absolute inset-0 shadow-[inset_0_2px_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.3)] ${roundedClass}`}
                                />
                                {/* Main image container with responsive padding */}
                                <div className="relative z-10 w-full h-full p-2 sm:p-3 md:p-4 lg:p-5">
                                    <img
                                        src={image.src}
                                        alt={`${alt} ${index + 1}`}
                                        width={image.width}
                                        height={image.height}
                                        decoding="async"
                                        className="w-full h-full object-contain rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 group-hover:scale-[1.02]"
                                        loading="lazy"
                                    />
                                </div>
                                {/* Hover overlay with zoom icon */}
                                <div
                                    className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-20 flex items-center justify-center ${roundedClass}`}
                                >
                                    <div className="w-16 h-16 rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-2xl ring-2 ring-white/50">
                                        <svg
                                            className="w-7 h-7 text-white drop-shadow-lg"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            {showDots && images.length > 1 && (
                <div
                    className={`flex gap-2 justify-center ${fullHeight ? 'absolute bottom-6 left-0 right-0 z-10' : 'mt-4'}`}
                    role="tablist"
                    aria-label="Image navigation"
                >
                    <div className="flex gap-2.5 bg-black/50 dark:bg-black/60 backdrop-blur-lg px-4 py-2.5 rounded-full shadow-2xl ring-1 ring-white/20">
                        {images.map((image, index) => (
                            <button
                                key={image.src}
                                type="button"
                                onClick={() => scrollTo(index)}
                                className={`h-2.5 rounded-full transition-all shadow-md ${
                                    index === selectedIndex
                                        ? 'bg-white w-7 shadow-white/30'
                                        : 'bg-white/60 hover:bg-white/90 w-2.5'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                                aria-selected={index === selectedIndex}
                                role="tab"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Optional: Arrow Navigation for Desktop */}
            {images.length > 1 && (
                <>
                    {canScrollPrev && (
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollPrev()}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 dark:bg-black/70 hover:bg-black/80 dark:hover:bg-black/90 backdrop-blur-lg text-white p-3 rounded-full transition-all hidden md:flex items-center justify-center shadow-2xl ring-2 ring-white/40 hover:ring-white/60 hover:scale-110"
                            aria-label="Previous image"
                        >
                            <svg
                                className="w-6 h-6 drop-shadow-lg"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {canScrollNext && (
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollNext()}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 dark:bg-black/70 hover:bg-black/80 dark:hover:bg-black/90 backdrop-blur-lg text-white p-3 rounded-full transition-all hidden md:flex items-center justify-center shadow-2xl ring-2 ring-white/40 hover:ring-white/60 hover:scale-110"
                            aria-label="Next image"
                        >
                            <svg
                                className="w-6 h-6 drop-shadow-lg"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
