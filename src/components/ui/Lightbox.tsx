import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export interface LightboxProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    alt?: string;
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose, alt = 'Project image' }: LightboxProps) {
    // Transform string array to lightbox format
    const slides = images.map((src, index) => ({
        src,
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
