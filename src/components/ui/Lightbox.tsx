import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { OptimizedImage } from './ImageCarousel';

export interface LightboxProps {
    images: OptimizedImage[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    alt?: string;
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose, alt = 'Project image' }: LightboxProps) {
    // Transform OptimizedImage array to lightbox format
    const slides = images.map((image, index) => ({
        src: image.src,
        width: image.width,
        height: image.height,
        alt: `${alt} ${index + 1}`
    }));

    return (
        <Lightbox
            open={isOpen}
            close={onClose}
            index={initialIndex}
            slides={slides}
            carousel={{
                finite: true
            }}
            render={{
                buttonPrev: images.length > 1 ? undefined : () => null,
                buttonNext: images.length > 1 ? undefined : () => null
            }}
        />
    );
}
