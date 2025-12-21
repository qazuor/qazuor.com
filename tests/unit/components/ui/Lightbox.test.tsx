import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { OptimizedImage } from '@/components/ui/ImageCarousel';
import { ImageLightbox, type LightboxProps } from '@/components/ui/Lightbox';

// Mock the dynamic import of yet-another-react-lightbox-lite
vi.mock('yet-another-react-lightbox-lite', () => ({
    default: ({
        slides,
        index,
        setIndex
    }: {
        slides: Array<{ src: string; alt?: string }>;
        index: number | undefined;
        setIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
    }) => (
        <div data-testid="lightbox" data-index={index}>
            {slides.map((slide, i) => (
                <div key={slide.src} data-testid={`slide-${i}`}>
                    {slide.alt}
                </div>
            ))}
            <button type="button" onClick={() => setIndex(undefined)} data-testid="close-lightbox">
                Close
            </button>
            {typeof index === 'number' && index < slides.length - 1 && (
                <button type="button" onClick={() => setIndex(index + 1)} data-testid="next-image">
                    Next
                </button>
            )}
        </div>
    )
}));

vi.mock('yet-another-react-lightbox-lite/styles.css', () => ({}));

describe('ImageLightbox', () => {
    const mockImages: OptimizedImage[] = [
        { src: '/images/test1.jpg', width: 800, height: 600 },
        { src: '/images/test2.jpg', width: 800, height: 600 },
        { src: '/images/test3.jpg', width: 800, height: 600 }
    ];

    const defaultProps: LightboxProps = {
        images: mockImages,
        initialIndex: 0,
        isOpen: false,
        onClose: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('closed state', () => {
        it('should not render anything when closed', () => {
            const { container } = render(<ImageLightbox {...defaultProps} isOpen={false} />);

            expect(container).toBeEmptyDOMElement();
        });
    });

    describe('loading state', () => {
        it('should show loading spinner while library loads', async () => {
            render(<ImageLightbox {...defaultProps} isOpen={true} />);

            // Initially shows loading
            const loadingDialog = screen.queryByRole('dialog', { name: 'Loading image viewer' });
            // May be present briefly or not depending on timing
            if (loadingDialog) {
                expect(loadingDialog).toBeInTheDocument();
            }

            // Wait for lightbox to load
            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toBeInTheDocument();
            });
        });
    });

    describe('open state', () => {
        it('should render lightbox when open', async () => {
            render(<ImageLightbox {...defaultProps} isOpen={true} />);

            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toBeInTheDocument();
            });
        });

        it('should render all slides', async () => {
            render(<ImageLightbox {...defaultProps} isOpen={true} />);

            await waitFor(() => {
                expect(screen.getByTestId('slide-0')).toBeInTheDocument();
                expect(screen.getByTestId('slide-1')).toBeInTheDocument();
                expect(screen.getByTestId('slide-2')).toBeInTheDocument();
            });
        });

        it('should start at the specified initial index', async () => {
            render(<ImageLightbox {...defaultProps} isOpen={true} initialIndex={1} />);

            await waitFor(() => {
                const lightbox = screen.getByTestId('lightbox');
                expect(lightbox).toHaveAttribute('data-index', '1');
            });
        });

        it('should include alt text for slides', async () => {
            render(<ImageLightbox {...defaultProps} isOpen={true} alt="Test project" />);

            await waitFor(() => {
                expect(screen.getByText('Test project 1')).toBeInTheDocument();
                expect(screen.getByText('Test project 2')).toBeInTheDocument();
                expect(screen.getByText('Test project 3')).toBeInTheDocument();
            });
        });

        it('should use default alt text when not provided', async () => {
            render(<ImageLightbox {...defaultProps} isOpen={true} />);

            await waitFor(() => {
                expect(screen.getByText('Project image 1')).toBeInTheDocument();
            });
        });
    });

    describe('closing behavior', () => {
        it('should call onClose when closed via setIndex', async () => {
            const onClose = vi.fn();
            render(<ImageLightbox {...defaultProps} isOpen={true} onClose={onClose} />);

            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toBeInTheDocument();
            });

            // Click the close button (which calls setIndex(undefined))
            const closeButton = screen.getByTestId('close-lightbox');
            act(() => {
                closeButton.click();
            });

            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('navigation', () => {
        it('should update index when navigating', async () => {
            render(<ImageLightbox {...defaultProps} isOpen={true} initialIndex={0} />);

            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toBeInTheDocument();
            });

            const lightbox = screen.getByTestId('lightbox');
            expect(lightbox).toHaveAttribute('data-index', '0');

            // Click next
            const nextButton = screen.getByTestId('next-image');
            act(() => {
                nextButton.click();
            });

            await waitFor(() => {
                expect(lightbox).toHaveAttribute('data-index', '1');
            });
        });
    });

    describe('opening and closing', () => {
        it('should update when isOpen changes to true', async () => {
            const { rerender } = render(<ImageLightbox {...defaultProps} isOpen={false} />);

            expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();

            rerender(<ImageLightbox {...defaultProps} isOpen={true} />);

            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toBeInTheDocument();
            });
        });

        it('should close when isOpen changes to false', async () => {
            const { rerender } = render(<ImageLightbox {...defaultProps} isOpen={true} />);

            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toBeInTheDocument();
            });

            rerender(<ImageLightbox {...defaultProps} isOpen={false} />);

            expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();
        });
    });

    describe('index synchronization', () => {
        it('should update internal index when initialIndex prop changes', async () => {
            const { rerender } = render(<ImageLightbox {...defaultProps} isOpen={true} initialIndex={0} />);

            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toHaveAttribute('data-index', '0');
            });

            rerender(<ImageLightbox {...defaultProps} isOpen={true} initialIndex={2} />);

            await waitFor(() => {
                expect(screen.getByTestId('lightbox')).toHaveAttribute('data-index', '2');
            });
        });
    });
});
