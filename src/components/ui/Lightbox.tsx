import { useCallback, useEffect, useRef, useState } from 'react';
import type { OptimizedImage } from './ImageCarousel';

export interface LightboxProps {
    images: OptimizedImage[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    alt?: string;
}

// Minimal loading indicator while lightbox loads
function LightboxLoader() {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            role="dialog"
            aria-modal="true"
            aria-label="Loading image viewer"
        >
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
    );
}

// Type for the dynamically loaded Lightbox component (lite version API)
type LightboxComponentType = React.ComponentType<{
    slides: Array<{ src: string; width?: number; height?: number; alt?: string }>;
    index: number | undefined;
    setIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
    controller?: { closeOnPullUp?: boolean; closeOnPullDown?: boolean };
}>;

/**
 * Lazy-loaded Lightbox component using the lite version (4.7KB vs 30KB)
 * Only loads when user clicks an image
 */
export function ImageLightbox({ images, initialIndex, isOpen, onClose, alt = 'Project image' }: LightboxProps) {
    const [Lightbox, setLightbox] = useState<LightboxComponentType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // Lite version uses index state: undefined = closed, number = open at that index
    const [lightboxIndex, setLightboxIndex] = useState<number | undefined>(undefined);

    // Use ref to track loading state without re-creating callback
    const loadingRef = useRef(false);
    const loadedRef = useRef(false);

    // Reset state on View Transitions navigation
    useEffect(() => {
        const handleContentReady = () => {
            // Reset refs so lightbox can be loaded again on new page
            loadingRef.current = false;
            loadedRef.current = false;
            setLightbox(null);
            setIsLoading(false);
            setLightboxIndex(undefined);
        };

        // Listen for custom event fired after View Transitions DOM swap
        document.addEventListener('qazuor:content-ready', handleContentReady);

        return () => {
            document.removeEventListener('qazuor:content-ready', handleContentReady);
        };
    }, []);

    const loadLightbox = useCallback(async () => {
        // Use refs to prevent multiple loads without re-creating callback
        if (loadedRef.current || loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            // Dynamic imports - uses the lite version (4.7KB vs 30KB)
            const [lightboxModule] = await Promise.all([
                import('yet-another-react-lightbox-lite'),
                import('yet-another-react-lightbox-lite/styles.css')
            ]);
            loadedRef.current = true;
            setLightbox(() => lightboxModule.default as unknown as LightboxComponentType);
        } catch (error) {
            console.error('Failed to load lightbox:', error);
        } finally {
            loadingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    // Load the library when lightbox is opened
    useEffect(() => {
        if (isOpen && !Lightbox) {
            loadLightbox();
        }
    }, [isOpen, Lightbox, loadLightbox]);

    // Sync external isOpen prop with internal index state
    useEffect(() => {
        if (isOpen) {
            setLightboxIndex(initialIndex);
        } else {
            setLightboxIndex(undefined);
        }
    }, [isOpen, initialIndex]);

    // Handle index changes from the lightbox (including close)
    const handleSetIndex = useCallback(
        (newIndex: React.SetStateAction<number | undefined>) => {
            const resolvedIndex = typeof newIndex === 'function' ? newIndex(lightboxIndex) : newIndex;
            setLightboxIndex(resolvedIndex);
            // If index becomes undefined, the lightbox is closing
            if (resolvedIndex === undefined) {
                onClose();
            }
        },
        [lightboxIndex, onClose]
    );

    // Don't render anything until user opens the lightbox
    if (!isOpen) {
        return null;
    }

    // Show loading spinner while library loads
    if (isLoading || !Lightbox) {
        return <LightboxLoader />;
    }

    // Transform images to lightbox format
    const slides = images.map((image, index) => ({
        src: image.src,
        width: image.width,
        height: image.height,
        alt: `${alt} ${index + 1}`
    }));

    return (
        <Lightbox
            slides={slides}
            index={lightboxIndex}
            setIndex={handleSetIndex}
            controller={{
                closeOnPullUp: true,
                closeOnPullDown: true
            }}
        />
    );
}
