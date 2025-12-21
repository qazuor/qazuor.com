import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImageCarousel, type OptimizedImage } from '@/components/ui/ImageCarousel';

// Mock embla-carousel-react
const mockScrollTo = vi.fn();
const mockScrollPrev = vi.fn();
const mockScrollNext = vi.fn();
const mockSelectedScrollSnap = vi.fn().mockReturnValue(0);
const mockCanScrollPrev = vi.fn().mockReturnValue(false);
const mockCanScrollNext = vi.fn().mockReturnValue(true);
const mockOn = vi.fn();
const mockOff = vi.fn();

vi.mock('embla-carousel-react', () => ({
    default: vi.fn(() => [
        vi.fn(), // emblaRef
        {
            scrollTo: mockScrollTo,
            scrollPrev: mockScrollPrev,
            scrollNext: mockScrollNext,
            selectedScrollSnap: mockSelectedScrollSnap,
            canScrollPrev: mockCanScrollPrev,
            canScrollNext: mockCanScrollNext,
            on: mockOn,
            off: mockOff
        }
    ])
}));

describe('ImageCarousel', () => {
    const singleImage: OptimizedImage[] = [{ src: '/images/test1.jpg', width: 800, height: 600 }];

    const multipleImages: OptimizedImage[] = [
        { src: '/images/test1.jpg', width: 800, height: 600 },
        { src: '/images/test2.jpg', width: 800, height: 600 },
        { src: '/images/test3.jpg', width: 800, height: 600 }
    ];

    describe('empty state', () => {
        it('should render empty state when no images', () => {
            render(<ImageCarousel images={[]} />);

            expect(screen.getByText('No images available')).toBeInTheDocument();
        });
    });

    describe('single image', () => {
        it('should render single image without carousel', () => {
            render(<ImageCarousel images={singleImage} alt="Test image" />);

            const button = screen.getByRole('button', { name: 'View Test image' });
            expect(button).toBeInTheDocument();
        });

        it('should render image with correct attributes', () => {
            const { container } = render(<ImageCarousel images={singleImage} alt="Test image" />);

            const mainImage = container.querySelector('img[alt="Test image"]');
            expect(mainImage).toHaveAttribute('src', '/images/test1.jpg');
            expect(mainImage).toHaveAttribute('width', '800');
            expect(mainImage).toHaveAttribute('height', '600');
        });

        it('should call onImageClick when clicked', () => {
            const onImageClick = vi.fn();
            render(<ImageCarousel images={singleImage} onImageClick={onImageClick} />);

            const button = screen.getByRole('button');
            fireEvent.click(button);

            expect(onImageClick).toHaveBeenCalledWith(0);
        });

        it('should have lazy loading on background image', () => {
            const { container } = render(<ImageCarousel images={singleImage} />);

            const backgroundImage = container.querySelector('img[aria-hidden="true"]');
            expect(backgroundImage).toHaveAttribute('loading', 'lazy');
        });
    });

    describe('multiple images (carousel)', () => {
        it('should render carousel with navigation dots', () => {
            render(<ImageCarousel images={multipleImages} />);

            const tablist = screen.getByRole('tablist', { name: 'Image navigation' });
            expect(tablist).toBeInTheDocument();

            const tabs = screen.getAllByRole('tab');
            expect(tabs).toHaveLength(3);
        });

        it('should have first dot selected by default', () => {
            render(<ImageCarousel images={multipleImages} />);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
            expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
        });

        it('should hide dots when showDots is false', () => {
            render(<ImageCarousel images={multipleImages} showDots={false} />);

            expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
        });

        it('should call scrollTo when clicking a dot', () => {
            render(<ImageCarousel images={multipleImages} />);

            const tabs = screen.getAllByRole('tab');
            fireEvent.click(tabs[2]);

            expect(mockScrollTo).toHaveBeenCalledWith(2);
        });

        it('should have accessible labels for dots', () => {
            render(<ImageCarousel images={multipleImages} />);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-label', 'Go to image 1');
            expect(tabs[1]).toHaveAttribute('aria-label', 'Go to image 2');
            expect(tabs[2]).toHaveAttribute('aria-label', 'Go to image 3');
        });

        it('should render image buttons with accessible labels', () => {
            render(<ImageCarousel images={multipleImages} />);

            expect(screen.getByRole('button', { name: 'View image 1 of 3' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'View image 2 of 3' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'View image 3 of 3' })).toBeInTheDocument();
        });

        it('should call onImageClick with correct index', () => {
            const onImageClick = vi.fn();
            render(<ImageCarousel images={multipleImages} onImageClick={onImageClick} />);

            const secondImage = screen.getByRole('button', { name: 'View image 2 of 3' });
            fireEvent.click(secondImage);

            expect(onImageClick).toHaveBeenCalledWith(1);
        });

        it('should render images with custom alt text', () => {
            const { container } = render(<ImageCarousel images={multipleImages} alt="Custom alt" />);

            const images = container.querySelectorAll('img[alt^="Custom alt"]');
            // Each image in carousel has "Custom alt {index}"
            expect(images.length).toBeGreaterThan(0);
        });
    });

    describe('rounded corners', () => {
        it('should apply default rounded corners', () => {
            const { container } = render(<ImageCarousel images={singleImage} />);

            const button = container.querySelector('button');
            expect(button?.className).toContain('rounded-xl');
        });

        it('should apply left rounded corners', () => {
            const { container } = render(<ImageCarousel images={singleImage} roundedCorners="left" />);

            const button = container.querySelector('button');
            expect(button?.className).toContain('rounded-l-2xl');
        });

        it('should apply right rounded corners', () => {
            const { container } = render(<ImageCarousel images={singleImage} roundedCorners="right" />);

            const button = container.querySelector('button');
            expect(button?.className).toContain('rounded-r-2xl');
        });

        it('should apply no rounded corners', () => {
            const { container } = render(<ImageCarousel images={singleImage} roundedCorners="none" />);

            const button = container.querySelector('button');
            expect(button?.className).not.toContain('rounded');
        });

        it('should apply top-md-left rounded corners', () => {
            const { container } = render(<ImageCarousel images={singleImage} roundedCorners="top-md-left" />);

            const button = container.querySelector('button');
            expect(button?.className).toContain('rounded-t-2xl');
            expect(button?.className).toContain('md:rounded-l-2xl');
        });
    });

    describe('full height mode', () => {
        it('should apply full height classes when fullHeight is true', () => {
            const { container } = render(<ImageCarousel images={singleImage} fullHeight />);

            const button = container.querySelector('button');
            expect(button?.className).toContain('h-full');
        });

        it('should use aspect-video when fullHeight is false', () => {
            const { container } = render(<ImageCarousel images={singleImage} fullHeight={false} />);

            const button = container.querySelector('button');
            expect(button?.className).toContain('aspect-video');
        });
    });

    describe('arrow navigation', () => {
        it('should show next arrow when can scroll next', () => {
            mockCanScrollNext.mockReturnValue(true);

            render(<ImageCarousel images={multipleImages} />);

            expect(screen.getByRole('button', { name: 'Next image' })).toBeInTheDocument();
        });

        it('should not show prev arrow when at beginning', () => {
            mockCanScrollPrev.mockReturnValue(false);

            render(<ImageCarousel images={multipleImages} />);

            expect(screen.queryByRole('button', { name: 'Previous image' })).not.toBeInTheDocument();
        });

        it('should call scrollNext when clicking next arrow', () => {
            mockCanScrollNext.mockReturnValue(true);

            render(<ImageCarousel images={multipleImages} />);

            const nextButton = screen.getByRole('button', { name: 'Next image' });
            fireEvent.click(nextButton);

            expect(mockScrollNext).toHaveBeenCalled();
        });

        it('should call scrollPrev when clicking prev arrow', () => {
            mockCanScrollPrev.mockReturnValue(true);

            render(<ImageCarousel images={multipleImages} />);

            const prevButton = screen.getByRole('button', { name: 'Previous image' });
            fireEvent.click(prevButton);

            expect(mockScrollPrev).toHaveBeenCalled();
        });
    });
});
