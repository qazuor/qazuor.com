import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TimelineIcon } from '@/components/ui/TimelineIcon';

describe('TimelineIcon Component', () => {
    describe('Valid Icons', () => {
        it('renders academic-cap icon', () => {
            const { container } = render(<TimelineIcon iconName="academic-cap" />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it('renders briefcase icon', () => {
            const { container } = render(<TimelineIcon iconName="briefcase" />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it('renders rocket icon', () => {
            const { container } = render(<TimelineIcon iconName="rocket" />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it('renders heart icon', () => {
            const { container } = render(<TimelineIcon iconName="heart" />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it('renders star icon', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    describe('Default className', () => {
        it('applies default w-6 h-6 className', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            const icon = container.firstChild as HTMLElement;
            expect(icon).toHaveClass('w-6', 'h-6');
        });
    });

    describe('Custom className', () => {
        it('applies custom className', () => {
            const { container } = render(<TimelineIcon iconName="star" className="w-8 h-8" />);
            const icon = container.firstChild as HTMLElement;
            expect(icon).toHaveClass('w-8', 'h-8');
            expect(icon).not.toHaveClass('w-6', 'h-6');
        });

        it('applies custom className with multiple classes', () => {
            const { container } = render(<TimelineIcon iconName="briefcase" className="w-10 h-10 text-primary" />);
            const icon = container.firstChild as HTMLElement;
            expect(icon).toHaveClass('w-10', 'h-10', 'text-primary');
        });
    });

    describe('SVG Sprite Reference', () => {
        it('renders svg with use element for icons', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            const svg = container.querySelector('svg');
            const use = container.querySelector('use');
            expect(svg).toBeInTheDocument();
            expect(use).toBeInTheDocument();
        });

        it('use element has correct href', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            const use = container.querySelector('use');
            expect(use).toHaveAttribute('href', '#timeline-star');
        });

        it('svg applies className', () => {
            const { container } = render(<TimelineIcon iconName="star" className="w-12 h-12" />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('w-12', 'h-12');
        });
    });

    describe('Icon Rendering', () => {
        it('renders svg wrapper for icons', () => {
            const { container } = render(<TimelineIcon iconName="globe" />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.tagName.toLowerCase()).toBe('svg');
        });

        it('svg has accessibility attributes', () => {
            const { container } = render(<TimelineIcon iconName="cog" />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveAttribute('aria-hidden', 'true');
            expect(svg).toHaveAttribute('focusable', 'false');
            expect(svg).toHaveAttribute('role', 'img');
        });
    });

    describe('All Available Icons', () => {
        const icons = [
            'academic-cap',
            'access',
            'arrow-trending-up',
            'avature',
            'bolt',
            'briefcase',
            'broadband',
            'cog',
            'computer-desktop',
            'device-desktop',
            'dialup',
            'eye',
            'globe',
            'heart',
            'html5',
            'javascript',
            'make',
            'paint-brush',
            'paper-airplane',
            'php',
            'rocket',
            'sparkles',
            'star',
            'user-circle',
            'user-group',
            'visual-basic'
        ];

        icons.forEach((iconName) => {
            it(`renders ${iconName} icon without errors`, () => {
                const { container } = render(<TimelineIcon iconName={iconName} />);
                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });
});
