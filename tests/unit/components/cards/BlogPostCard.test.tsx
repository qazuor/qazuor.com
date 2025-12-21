import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlogPostCard, type BlogPostCardProps } from '@/components/cards/BlogPostCard';

describe('BlogPostCard', () => {
    const defaultProps: BlogPostCardProps = {
        title: 'Test Blog Post',
        excerpt: 'This is a test excerpt for the blog post card.',
        category: 'Technology',
        image: {
            src: '/images/test.jpg',
            width: 800,
            height: 600
        },
        slug: '/en/blog/test-post'
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

        // Mock window.innerWidth for desktop by default
        Object.defineProperty(window, 'innerWidth', {
            value: 1024,
            writable: true
        });
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
        vi.clearAllMocks();
        observerCallback = null;
        observeTargets = [];
    });

    describe('rendering', () => {
        it('should render title', () => {
            render(<BlogPostCard {...defaultProps} />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Blog Post');
        });

        it('should render category badge', () => {
            render(<BlogPostCard {...defaultProps} />);

            expect(screen.getByText('Technology')).toBeInTheDocument();
        });

        it('should render excerpt with HTML', () => {
            render(<BlogPostCard {...defaultProps} excerpt="<strong>Bold</strong> text" />);

            const paragraph = screen.getByText((_, element) => element?.innerHTML === '<strong>Bold</strong> text');
            expect(paragraph).toBeInTheDocument();
        });

        it('should render image with correct attributes', () => {
            const { container } = render(<BlogPostCard {...defaultProps} />);

            // Image has alt="" (decorative), so we find it by class
            const img = container.querySelector('.blog-post-card__bg-image');
            expect(img).toHaveAttribute('src', '/images/test.jpg');
            expect(img).toHaveAttribute('width', '800');
            expect(img).toHaveAttribute('height', '600');
            expect(img).toHaveAttribute('loading', 'lazy');
        });

        it('should link to the correct slug', () => {
            render(<BlogPostCard {...defaultProps} />);

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/en/blog/test-post');
        });

        it('should have accessible link label', () => {
            render(<BlogPostCard {...defaultProps} />);

            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('aria-label', 'Read Test Blog Post');
        });
    });

    describe('category styling', () => {
        it('should apply custom category color', () => {
            render(<BlogPostCard {...defaultProps} categoryColor="#ff5500" />);

            const categoryBadge = screen.getByText('Technology');
            expect(categoryBadge).toHaveStyle({ backgroundColor: '#ff5500' });
        });

        it('should use default category color when not provided', () => {
            render(<BlogPostCard {...defaultProps} />);

            const categoryBadge = screen.getByText('Technology');
            expect(categoryBadge).toHaveStyle({ backgroundColor: '#d3b19a' });
        });
    });

    describe('new badge', () => {
        it('should not show new badge by default', () => {
            render(<BlogPostCard {...defaultProps} />);

            expect(screen.queryByText('New')).not.toBeInTheDocument();
        });

        it('should show new badge when isNew is true', () => {
            render(<BlogPostCard {...defaultProps} isNew />);

            expect(screen.getByText('New')).toBeInTheDocument();
        });

        it('should use custom new label', () => {
            render(<BlogPostCard {...defaultProps} isNew newLabel="Nuevo" />);

            expect(screen.getByText('Nuevo')).toBeInTheDocument();
            expect(screen.queryByText('New')).not.toBeInTheDocument();
        });
    });

    describe('hover interaction', () => {
        it('should call onHover when mouse enters', async () => {
            const onHover = vi.fn();
            const user = userEvent.setup();

            render(<BlogPostCard {...defaultProps} onHover={onHover} />);

            const article = screen.getByRole('article');
            await user.hover(article);

            expect(onHover).toHaveBeenCalledTimes(1);
        });
    });

    describe('active state', () => {
        it('should not have active attribute on desktop', () => {
            render(<BlogPostCard {...defaultProps} isActive />);

            const article = screen.getByRole('article');
            expect(article).toHaveAttribute('data-active', 'false');
        });

        it('should have active attribute on mobile when isActive', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600 });

            render(<BlogPostCard {...defaultProps} isActive />);

            // Trigger resize
            act(() => {
                window.dispatchEvent(new Event('resize'));
            });

            const article = screen.getByRole('article');
            expect(article).toHaveAttribute('data-active', 'true');
        });
    });

    describe('mobile intersection observer', () => {
        it('should observe element on mobile', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600 });

            render(<BlogPostCard {...defaultProps} />);

            // Trigger resize to enable mobile mode
            act(() => {
                window.dispatchEvent(new Event('resize'));
            });

            expect(observeTargets.length).toBeGreaterThan(0);
        });

        it('should set visible state when intersecting on mobile', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600 });

            render(<BlogPostCard {...defaultProps} />);

            // Trigger resize
            act(() => {
                window.dispatchEvent(new Event('resize'));
            });

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
            expect(article).toHaveAttribute('data-active', 'true');
        });
    });

    describe('memoization', () => {
        it('should render correctly with same props', () => {
            const { rerender } = render(<BlogPostCard {...defaultProps} />);

            rerender(<BlogPostCard {...defaultProps} />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Blog Post');
        });

        it('should update when props change', () => {
            const { rerender } = render(<BlogPostCard {...defaultProps} />);

            rerender(<BlogPostCard {...defaultProps} title="Updated Title" />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Updated Title');
        });
    });

    describe('cleanup', () => {
        it('should remove resize listener on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

            const { unmount } = render(<BlogPostCard {...defaultProps} />);
            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

            removeEventListenerSpy.mockRestore();
        });
    });
});
