import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TimelineCard } from '@/components/interactive/TimelineCard';

describe('TimelineCard', () => {
    const mockItem = {
        id: 1,
        year: '2024',
        title: 'Senior Developer',
        subtitle: 'Tech Company',
        content: 'Leading a team of developers working on exciting projects.',
        color: 'blue',
        colorHex: '#3b82f6',
        icon: 'briefcase',
        iconUseItemColor: true
    };

    describe('rendering', () => {
        it('should render title with correct text', () => {
            render(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Senior Developer');
        });

        it('should render content text', () => {
            render(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            expect(screen.getByText('Leading a team of developers working on exciting projects.')).toBeInTheDocument();
        });

        it('should apply title color from item colorHex', () => {
            render(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            const title = screen.getByRole('heading', { level: 3 });
            expect(title).toHaveStyle({ color: '#3b82f6' });
        });
    });

    describe('responsive behavior', () => {
        it('should use desktop styles when isMobile is false', () => {
            const { container } = render(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            const card = container.firstChild as HTMLElement;
            expect(card).toHaveStyle({ width: '500px', height: '110px', padding: '14px 18px' });
        });

        it('should use mobile styles when isMobile is true', () => {
            const { container } = render(<TimelineCard item={mockItem} popoverWidth={400} isMobile={true} />);

            const card = container.firstChild as HTMLElement;
            expect(card).toHaveStyle({ width: '400px', height: '95px', padding: '10px 14px' });
        });
    });

    describe('styling', () => {
        it('should have backdrop blur and shadow classes', () => {
            const { container } = render(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('backdrop-blur-sm');
            expect(card).toHaveClass('shadow-2xl');
            expect(card).toHaveClass('rounded-lg');
        });

        it('should apply correct width from props', () => {
            const { container } = render(<TimelineCard item={mockItem} popoverWidth={600} isMobile={false} />);

            const card = container.firstChild as HTMLElement;
            expect(card).toHaveStyle({ width: '600px' });
        });
    });

    describe('content handling', () => {
        it('should handle long content with line clamp', () => {
            const longItem = {
                ...mockItem,
                content:
                    'This is a very long content that spans multiple lines and should be clamped to avoid overflow. It contains a lot of text that describes the position in great detail with many interesting facts.'
            };

            render(<TimelineCard item={longItem} popoverWidth={500} isMobile={false} />);

            const content = screen.getByText(/This is a very long content/);
            expect(content).toHaveClass('line-clamp-3');
        });

        it('should handle empty content', () => {
            const emptyItem = {
                ...mockItem,
                content: ''
            };

            const { container } = render(<TimelineCard item={emptyItem} popoverWidth={500} isMobile={false} />);

            // Should still render without errors
            expect(container.firstChild).toBeInTheDocument();
        });

        it('should handle special characters in title', () => {
            const specialItem = {
                ...mockItem,
                title: 'Developer & Designer <Script>'
            };

            render(<TimelineCard item={specialItem} popoverWidth={500} isMobile={false} />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Developer & Designer <Script>');
        });
    });

    describe('memoization', () => {
        it('should render correctly with same props (memo test)', () => {
            const { rerender } = render(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            // Re-render with same props
            rerender(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            // Should still render correctly
            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Senior Developer');
        });

        it('should update when props change', () => {
            const { rerender } = render(<TimelineCard item={mockItem} popoverWidth={500} isMobile={false} />);

            const updatedItem = {
                ...mockItem,
                title: 'Lead Developer'
            };

            rerender(<TimelineCard item={updatedItem} popoverWidth={500} isMobile={false} />);

            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Lead Developer');
        });
    });
});
