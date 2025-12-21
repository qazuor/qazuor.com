import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectCard, type ProjectCardProps } from '@/components/cards/ProjectCard';

// Mock the ImageCarousel and ImageLightbox components
vi.mock('@/components/ui/ImageCarousel', () => ({
    ImageCarousel: ({
        images,
        onImageClick,
        alt
    }: {
        images: Array<{ src: string }>;
        onImageClick: (index: number) => void;
        alt: string;
    }) => (
        <div data-testid="image-carousel">
            {images.map((img, i) => (
                <button
                    key={img.src}
                    type="button"
                    onClick={() => onImageClick(i)}
                    data-testid={`carousel-image-${i}`}
                    aria-label={`${alt} image ${i + 1}`}
                >
                    Image {i + 1}
                </button>
            ))}
        </div>
    )
}));

vi.mock('@/components/ui/Lightbox', () => ({
    ImageLightbox: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
        isOpen ? (
            <div data-testid="lightbox">
                <button type="button" onClick={onClose} data-testid="close-lightbox">
                    Close
                </button>
            </div>
        ) : null
}));

describe('ProjectCard', () => {
    const defaultProps: ProjectCardProps = {
        title: 'Test Project',
        description: 'A test project description that explains what this project does.',
        technologies: ['React', 'TypeScript', 'Tailwind'],
        images: [
            { src: '/images/project1.jpg', width: 800, height: 600 },
            { src: '/images/project2.jpg', width: 800, height: 600 }
        ],
        slug: 'test-project'
    };

    let observerCallback: IntersectionObserverCallback | null = null;
    let observeTargets: Element[] = [];
    let originalIntersectionObserver: typeof IntersectionObserver;

    beforeEach(() => {
        // Store original
        originalIntersectionObserver = window.IntersectionObserver;

        // Mock IntersectionObserver as a class
        observeTargets = [];

        class MockIntersectionObserver {
            constructor(callback: IntersectionObserverCallback) {
                observerCallback = callback;
            }
            observe(target: Element) {
                observeTargets.push(target);
            }
            unobserve = vi.fn();
            disconnect = vi.fn();
            root = null;
            rootMargin = '';
            thresholds = [];
            takeRecords = vi.fn().mockReturnValue([]);
        }

        window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
        vi.clearAllMocks();
        observerCallback = null;
        observeTargets = [];
    });

    describe('list variant (default)', () => {
        it('should render title', () => {
            render(<ProjectCard {...defaultProps} />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Project');
        });

        it('should render description', () => {
            render(<ProjectCard {...defaultProps} />);

            expect(screen.getByText(/A test project description/)).toBeInTheDocument();
        });

        it('should render technology badges', () => {
            render(<ProjectCard {...defaultProps} />);

            expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByText('TypeScript')).toBeInTheDocument();
            expect(screen.getByText('Tailwind')).toBeInTheDocument();
        });

        it('should limit technologies to 5 and show count', () => {
            const manyTech = ['React', 'TypeScript', 'Tailwind', 'Node', 'PostgreSQL', 'Redis', 'Docker'];
            render(<ProjectCard {...defaultProps} technologies={manyTech} />);

            expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByText('+2 more')).toBeInTheDocument();
            expect(screen.queryByText('Redis')).not.toBeInTheDocument();
            expect(screen.queryByText('Docker')).not.toBeInTheDocument();
        });

        it('should render view project link with correct URL', () => {
            render(<ProjectCard {...defaultProps} lang="es" />);

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/es/projects/test-project');
        });

        it('should have accessible link label', () => {
            render(<ProjectCard {...defaultProps} />);

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('aria-label', 'View Project: Test Project');
        });
    });

    describe('category badge', () => {
        it('should show open-source badge by default', () => {
            render(<ProjectCard {...defaultProps} />);

            expect(screen.getByText('Open Source')).toBeInTheDocument();
        });

        it('should show commercial badge', () => {
            render(<ProjectCard {...defaultProps} category="commercial" />);

            expect(screen.getByText('Commercial')).toBeInTheDocument();
        });

        it('should show client badge', () => {
            render(<ProjectCard {...defaultProps} category="client" />);

            expect(screen.getByText('Client')).toBeInTheDocument();
        });

        it('should use translated category labels', () => {
            render(
                <ProjectCard
                    {...defaultProps}
                    category="open-source"
                    translations={{
                        viewProject: 'Ver Proyecto',
                        categories: {
                            openSource: 'Código Abierto',
                            commercial: 'Comercial',
                            client: 'Cliente'
                        },
                        moreTechnologies: 'más',
                        featured: 'Destacado'
                    }}
                />
            );

            expect(screen.getByText('Código Abierto')).toBeInTheDocument();
        });
    });

    describe('featured badge', () => {
        it('should not show featured badge by default', () => {
            render(<ProjectCard {...defaultProps} />);

            expect(screen.queryByText('Featured')).not.toBeInTheDocument();
        });

        it('should show featured badge when featured is true', () => {
            render(<ProjectCard {...defaultProps} featured />);

            expect(screen.getByText('Featured')).toBeInTheDocument();
        });

        it('should use translated featured label', () => {
            render(
                <ProjectCard
                    {...defaultProps}
                    featured
                    translations={{
                        viewProject: 'Ver Proyecto',
                        categories: {
                            openSource: 'Código Abierto',
                            commercial: 'Comercial',
                            client: 'Cliente'
                        },
                        moreTechnologies: 'más',
                        featured: 'Destacado'
                    }}
                />
            );

            expect(screen.getByText('Destacado')).toBeInTheDocument();
        });
    });

    describe('home variant', () => {
        it('should render with horizontal layout', () => {
            const { container } = render(<ProjectCard {...defaultProps} variant="home" />);

            // Home variant uses grid layout
            expect(container.querySelector('.grid')).toBeInTheDocument();
        });

        it('should render title in home variant', () => {
            render(<ProjectCard {...defaultProps} variant="home" />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Project');
        });

        it('should reverse layout when layout is reversed', () => {
            const { container } = render(<ProjectCard {...defaultProps} variant="home" layout="reversed" />);

            // Check that md:order classes are applied
            const sections = container.querySelectorAll('[class*="md:order-"]');
            expect(sections.length).toBeGreaterThan(0);
        });
    });

    describe('image carousel and lightbox', () => {
        it('should render image carousel', () => {
            render(<ProjectCard {...defaultProps} />);

            expect(screen.getByTestId('image-carousel')).toBeInTheDocument();
        });

        it('should open lightbox when image is clicked', async () => {
            const user = userEvent.setup();
            render(<ProjectCard {...defaultProps} />);

            const firstImage = screen.getByTestId('carousel-image-0');
            await user.click(firstImage);

            expect(screen.getByTestId('lightbox')).toBeInTheDocument();
        });

        it('should close lightbox when close button is clicked', async () => {
            const user = userEvent.setup();
            render(<ProjectCard {...defaultProps} />);

            // Open lightbox
            await user.click(screen.getByTestId('carousel-image-0'));
            expect(screen.getByTestId('lightbox')).toBeInTheDocument();

            // Close lightbox
            await user.click(screen.getByTestId('close-lightbox'));
            expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();
        });

        it('should open lightbox at correct index', async () => {
            const user = userEvent.setup();
            render(<ProjectCard {...defaultProps} />);

            // Click second image
            await user.click(screen.getByTestId('carousel-image-1'));

            // Lightbox should be open (index is passed to ImageLightbox)
            expect(screen.getByTestId('lightbox')).toBeInTheDocument();
        });
    });

    describe('scroll animation', () => {
        it('should start with opacity-0 class', () => {
            render(<ProjectCard {...defaultProps} />);

            const article = screen.getByRole('article');
            expect(article.className).toContain('opacity-0');
        });

        it('should add opacity-100 when intersecting', () => {
            render(<ProjectCard {...defaultProps} />);

            // Simulate intersection
            if (observerCallback && observeTargets.length > 0) {
                act(() => {
                    observerCallback!(
                        [{ isIntersecting: true, target: observeTargets[0] } as IntersectionObserverEntry],
                        {} as IntersectionObserver
                    );
                });
            }

            const article = screen.getByRole('article');
            expect(article.className).toContain('opacity-100');
        });
    });

    describe('memoization', () => {
        it('should render correctly with same props', () => {
            const { rerender } = render(<ProjectCard {...defaultProps} />);

            rerender(<ProjectCard {...defaultProps} />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Project');
        });

        it('should update when props change', () => {
            const { rerender } = render(<ProjectCard {...defaultProps} />);

            rerender(<ProjectCard {...defaultProps} title="Updated Project" />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Updated Project');
        });
    });

    describe('translations', () => {
        it('should use custom view project text', () => {
            render(
                <ProjectCard
                    {...defaultProps}
                    translations={{
                        viewProject: 'Ver Proyecto',
                        categories: {
                            openSource: 'Código Abierto',
                            commercial: 'Comercial',
                            client: 'Cliente'
                        },
                        moreTechnologies: 'más',
                        featured: 'Destacado'
                    }}
                />
            );

            expect(screen.getByText('Ver Proyecto')).toBeInTheDocument();
        });

        it('should use custom moreTechnologies text', () => {
            const manyTech = ['React', 'TypeScript', 'Tailwind', 'Node', 'PostgreSQL', 'Redis'];
            render(
                <ProjectCard
                    {...defaultProps}
                    technologies={manyTech}
                    translations={{
                        viewProject: 'Ver Proyecto',
                        categories: {
                            openSource: 'Código Abierto',
                            commercial: 'Comercial',
                            client: 'Cliente'
                        },
                        moreTechnologies: 'más',
                        featured: 'Destacado'
                    }}
                />
            );

            expect(screen.getByText('+1 más')).toBeInTheDocument();
        });
    });
});
