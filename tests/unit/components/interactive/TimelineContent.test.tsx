import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TimelineItem } from '@/components/interactive/hooks/useTimelineAnimation';
import TimelineContent from '@/components/interactive/TimelineContent';

// Mock the TimelineCard component
vi.mock('@/components/interactive/TimelineCard', () => ({
    TimelineCard: ({ item, isMobile }: { item: TimelineItem; isMobile: boolean }) => (
        <div data-testid="timeline-card" data-mobile={isMobile}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
        </div>
    )
}));

// Mock TimelineIcon
vi.mock('@/components/ui', () => ({
    TimelineIcon: ({ iconName, className }: { iconName: string; className: string }) => (
        <span data-testid={`icon-${iconName}`} className={className}>
            {iconName}
        </span>
    )
}));

describe('TimelineContent', () => {
    const mockItems: TimelineItem[] = [
        {
            id: 1,
            year: '2020',
            title: 'First Event',
            subtitle: 'Category 1',
            content: 'Description of first event',
            color: 'from-blue-500 to-blue-600',
            colorHex: '#3b82f6',
            icon: 'briefcase',
            iconUseItemColor: true
        },
        {
            id: 2,
            year: '2021',
            title: 'Second Event',
            subtitle: 'Category 2',
            content: 'Description of second event',
            color: 'from-green-500 to-green-600',
            colorHex: '#22c55e',
            icon: 'code',
            iconUseItemColor: false
        },
        {
            id: 3,
            year: '2022',
            title: 'Third Event',
            subtitle: 'Category 3',
            content: 'Description of third event',
            color: 'from-purple-500 to-purple-600',
            colorHex: '#a855f7',
            icon: 'rocket',
            iconUseItemColor: true
        }
    ];

    let originalIntersectionObserver: typeof IntersectionObserver;

    beforeEach(() => {
        // Store original
        originalIntersectionObserver = window.IntersectionObserver;

        // Mock IntersectionObserver
        class MockIntersectionObserver {
            // biome-ignore lint/complexity/noUselessConstructor: Required for IntersectionObserver interface
            constructor(_callback: IntersectionObserverCallback) {}
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
            root = null;
            rootMargin = '';
            thresholds = [];
            takeRecords = vi.fn().mockReturnValue([]);
        }

        window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

        // Mock window.innerWidth for desktop
        Object.defineProperty(window, 'innerWidth', {
            value: 1024,
            writable: true,
            configurable: true
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('rendering', () => {
        it('should render timeline section with correct aria-label', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            const section = screen.getByRole('region', { hidden: true }) || screen.getByLabelText('Timeline');
            expect(section).toBeInTheDocument();
        });

        it('should render all timeline years', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByText('2020')).toBeInTheDocument();
            expect(screen.getByText('2021')).toBeInTheDocument();
            expect(screen.getByText('2022')).toBeInTheDocument();
        });

        it('should render timeline icons', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByTestId('icon-briefcase')).toBeInTheDocument();
            expect(screen.getByTestId('icon-code')).toBeInTheDocument();
            expect(screen.getByTestId('icon-rocket')).toBeInTheDocument();
        });

        it('should render item counter', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            expect(screen.getByText('1 / 3')).toBeInTheDocument();
        });
    });

    describe('navigation controls', () => {
        it('should render previous button with English label', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
        });

        it('should render next button with English label', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
        });

        it('should render play/pause button', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
        });

        it('should render Spanish labels when lang is es', () => {
            render(<TimelineContent lang="es" timelineItems={mockItems} />);

            expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Reproducir' })).toBeInTheDocument();
        });
    });

    describe('navigation interactions', () => {
        it('should navigate to next item when clicking next button', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            expect(screen.getByText('1 / 3')).toBeInTheDocument();

            const nextButton = screen.getByRole('button', { name: 'Next' });
            fireEvent.click(nextButton);

            expect(screen.getByText('2 / 3')).toBeInTheDocument();
        });

        it('should navigate to previous item when clicking previous button', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            // First go to next
            const nextButton = screen.getByRole('button', { name: 'Next' });
            fireEvent.click(nextButton);

            expect(screen.getByText('2 / 3')).toBeInTheDocument();

            // Then go back
            const prevButton = screen.getByRole('button', { name: 'Previous' });
            fireEvent.click(prevButton);

            expect(screen.getByText('1 / 3')).toBeInTheDocument();
        });
    });

    describe('autoplay', () => {
        it('should show pause label when autoplay is active', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            const playButton = screen.getByRole('button', { name: 'Play' });
            fireEvent.click(playButton);

            expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
        });

        it('should have aria-pressed attribute on play/pause button', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            const playButton = screen.getByRole('button', { name: 'Play' });
            expect(playButton).toHaveAttribute('aria-pressed', 'false');

            fireEvent.click(playButton);

            const pauseButton = screen.getByRole('button', { name: 'Pause' });
            expect(pauseButton).toHaveAttribute('aria-pressed', 'true');
        });
    });

    describe('progress dots', () => {
        it('should render progress dots for each item', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            const tabs = screen.getAllByRole('tab');
            expect(tabs).toHaveLength(3);
        });

        it('should mark first dot as selected initially', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
            expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
        });

        it('should navigate to item when clicking progress dot', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            const tabs = screen.getAllByRole('tab');
            fireEvent.click(tabs[2]); // Click third dot

            expect(screen.getByText('3 / 3')).toBeInTheDocument();
            expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
        });

        it('should have accessible label for progress dots', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-label', 'Go to item 1: 2020');
            expect(tabs[1]).toHaveAttribute('aria-label', 'Go to item 2: 2021');
            expect(tabs[2]).toHaveAttribute('aria-label', 'Go to item 3: 2022');
        });

        it('should have Spanish labels for progress dots', () => {
            render(<TimelineContent lang="es" timelineItems={mockItems} />);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-label', 'Ir al elemento 1: 2020');
        });
    });

    describe('timeline card', () => {
        it('should render selected item content', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            // The first item should be selected, and its title should be visible
            // (The TimelineCard component renders the item content)
            expect(screen.getByText('First Event')).toBeInTheDocument();
        });
    });

    describe('timeline item buttons', () => {
        it('should have accessible labels for timeline items', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByRole('button', { name: '2020: First Event' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '2021: Second Event' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '2022: Third Event' })).toBeInTheDocument();
        });

        it('should mark selected item with aria-current', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            const firstButton = screen.getByRole('button', { name: '2020: First Event' });
            expect(firstButton).toHaveAttribute('aria-current', 'true');
        });

        it('should navigate when clicking timeline item', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            act(() => {
                vi.advanceTimersByTime(400);
            });

            const thirdButton = screen.getByRole('button', { name: '2022: Third Event' });
            fireEvent.click(thirdButton);

            expect(screen.getByText('3 / 3')).toBeInTheDocument();
        });
    });

    describe('tablist', () => {
        it('should have tablist role for progress dots', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByRole('tablist')).toBeInTheDocument();
        });

        it('should have accessible label for tablist', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Timeline progress');
        });
    });

    describe('group role', () => {
        it('should have group role for timeline navigation', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            expect(screen.getByRole('group', { name: 'Timeline navigation' })).toBeInTheDocument();
        });
    });

    describe('keyboard focus', () => {
        it('should have tabIndex 0 for keyboard focus', () => {
            render(<TimelineContent lang="en" timelineItems={mockItems} />);

            const section = screen.getByLabelText('Timeline');
            expect(section).toHaveAttribute('tabindex', '0');
        });
    });
});
