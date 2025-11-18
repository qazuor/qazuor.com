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

    describe('Fallback Icon', () => {
        it('renders fallback icon for unknown iconName', () => {
            const { container } = render(<TimelineIcon iconName="non-existent-icon" />);
            const icon = container.querySelector('svg');
            expect(icon).toBeInTheDocument();
        });

        it('fallback icon has correct title', () => {
            const { container } = render(<TimelineIcon iconName="invalid" />);
            const title = container.querySelector('title');
            expect(title).toHaveTextContent('Timeline Icon');
        });

        it('fallback icon has star path', () => {
            const { container } = render(<TimelineIcon iconName="unknown" />);
            const path = container.querySelector('path');
            expect(path).toBeInTheDocument();
            expect(path).toHaveAttribute('d');
        });

        it('fallback icon applies className', () => {
            const { container } = render(<TimelineIcon iconName="invalid" className="w-12 h-12" />);
            const icon = container.querySelector('svg');
            expect(icon).toHaveClass('w-12', 'h-12');
        });
    });

    describe('Icon Rendering', () => {
        it('renders div wrapper with dangerouslySetInnerHTML for valid icons', () => {
            const { container } = render(<TimelineIcon iconName="globe" />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.tagName).toBe('DIV');
        });

        it('applies currentColor style to valid icons', () => {
            const { container } = render(<TimelineIcon iconName="cog" />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveStyle({ color: 'currentColor' });
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
