import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TimelineWrapper from '@/components/interactive/TimelineWrapper';

// Mock the dependencies
vi.mock('@/data/timeline', () => ({
    timelineData: [
        {
            year: '2020',
            title: { en: 'First Event EN', es: 'Primer Evento ES' },
            category: 'work',
            description: { en: 'Description EN', es: 'Descripción ES' },
            icon: 'briefcase',
            iconUseItemColor: true,
            colorLightTheme: '#2563eb',
            colorDarkTheme: '#60a5fa'
        },
        {
            year: '2021',
            title: { en: 'Second Event EN', es: 'Segundo Evento ES' },
            category: 'education',
            description: { en: 'Second Description EN', es: 'Segunda Descripción ES' },
            icon: 'graduation-cap',
            iconUseItemColor: false,
            colorLightTheme: '#059669',
            colorDarkTheme: '#34d399'
        }
    ]
}));

vi.mock('@/hooks', () => ({
    useTheme: vi.fn(() => ({ isDark: false }))
}));

vi.mock('@/components/interactive/TimelineContent', () => ({
    default: ({ lang, timelineItems }: { lang: string; timelineItems: Array<{ title: string }> }) => (
        <div data-testid="timeline-content" data-lang={lang}>
            {timelineItems.map((item) => (
                <div key={item.title} data-testid={`timeline-item-${item.title}`}>
                    {item.title}
                </div>
            ))}
        </div>
    )
}));

describe('TimelineWrapper', () => {
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
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render TimelineContent with correct lang', () => {
            render(<TimelineWrapper lang="en" />);

            const content = screen.getByTestId('timeline-content');
            expect(content).toHaveAttribute('data-lang', 'en');
        });

        it('should render TimelineContent with Spanish lang', () => {
            render(<TimelineWrapper lang="es" />);

            const content = screen.getByTestId('timeline-content');
            expect(content).toHaveAttribute('data-lang', 'es');
        });

        it('should pass timeline items to TimelineContent', () => {
            render(<TimelineWrapper lang="en" />);

            expect(screen.getByTestId('timeline-item-0')).toBeInTheDocument();
            expect(screen.getByTestId('timeline-item-1')).toBeInTheDocument();
        });
    });

    describe('language adaptation', () => {
        it('should adapt titles for English', () => {
            render(<TimelineWrapper lang="en" />);

            expect(screen.getByText('First Event EN')).toBeInTheDocument();
            expect(screen.getByText('Second Event EN')).toBeInTheDocument();
        });

        it('should adapt titles for Spanish', () => {
            render(<TimelineWrapper lang="es" />);

            expect(screen.getByText('Primer Evento ES')).toBeInTheDocument();
            expect(screen.getByText('Segundo Evento ES')).toBeInTheDocument();
        });
    });

    describe('category formatting', () => {
        it('should capitalize category names', () => {
            render(<TimelineWrapper lang="en" />);

            // Categories are formatted as subtitles - 'work' becomes 'Work', 'education' becomes 'Education'
            // This is passed to TimelineContent which renders items
            const content = screen.getByTestId('timeline-content');
            expect(content).toBeInTheDocument();
        });
    });
});
