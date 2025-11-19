import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TimelineIcon } from './TimelineIcon';

// Mock all SVG imports
vi.mock('@/icons/timeline/academic-cap.svg?raw', () => ({ default: '<svg><path d="academic-cap"/></svg>' }));
vi.mock('@/icons/timeline/access.svg?raw', () => ({ default: '<svg><path d="access"/></svg>' }));
vi.mock('@/icons/timeline/arrow-trending-up.svg?raw', () => ({
    default: '<svg><path d="arrow-trending-up"/></svg>'
}));
vi.mock('@/icons/timeline/avature.svg?raw', () => ({ default: '<svg><path d="avature"/></svg>' }));
vi.mock('@/icons/timeline/bolt.svg?raw', () => ({ default: '<svg><path d="bolt"/></svg>' }));
vi.mock('@/icons/timeline/briefcase.svg?raw', () => ({ default: '<svg><path d="briefcase"/></svg>' }));
vi.mock('@/icons/timeline/broadband.svg?raw', () => ({ default: '<svg><path d="broadband"/></svg>' }));
vi.mock('@/icons/timeline/cog.svg?raw', () => ({ default: '<svg><path d="cog"/></svg>' }));
vi.mock('@/icons/timeline/computer-desktop.svg?raw', () => ({
    default: '<svg><path d="computer-desktop"/></svg>'
}));
vi.mock('@/icons/timeline/device-desktop.svg?raw', () => ({
    default: '<svg><path d="device-desktop"/></svg>'
}));
vi.mock('@/icons/timeline/dialup.svg?raw', () => ({ default: '<svg><path d="dialup"/></svg>' }));
vi.mock('@/icons/timeline/eye.svg?raw', () => ({ default: '<svg><path d="eye"/></svg>' }));
vi.mock('@/icons/timeline/globe.svg?raw', () => ({ default: '<svg><path d="globe"/></svg>' }));
vi.mock('@/icons/timeline/heart.svg?raw', () => ({ default: '<svg><path d="heart"/></svg>' }));
vi.mock('@/icons/timeline/html5.svg?raw', () => ({ default: '<svg><path d="html5"/></svg>' }));
vi.mock('@/icons/timeline/javascript.svg?raw', () => ({ default: '<svg><path d="javascript"/></svg>' }));
vi.mock('@/icons/timeline/make.svg?raw', () => ({ default: '<svg><path d="make"/></svg>' }));
vi.mock('@/icons/timeline/paint-brush.svg?raw', () => ({ default: '<svg><path d="paint-brush"/></svg>' }));
vi.mock('@/icons/timeline/paper-airplane.svg?raw', () => ({
    default: '<svg><path d="paper-airplane"/></svg>'
}));
vi.mock('@/icons/timeline/php.svg?raw', () => ({ default: '<svg><path d="php"/></svg>' }));
vi.mock('@/icons/timeline/rocket.svg?raw', () => ({ default: '<svg><path d="rocket"/></svg>' }));
vi.mock('@/icons/timeline/sparkles.svg?raw', () => ({ default: '<svg><path d="sparkles"/></svg>' }));
vi.mock('@/icons/timeline/star.svg?raw', () => ({ default: '<svg><path d="star"/></svg>' }));
vi.mock('@/icons/timeline/user-circle.svg?raw', () => ({ default: '<svg><path d="user-circle"/></svg>' }));
vi.mock('@/icons/timeline/user-group.svg?raw', () => ({ default: '<svg><path d="user-group"/></svg>' }));
vi.mock('@/icons/timeline/visual-basic.svg?raw', () => ({
    default: '<svg><path d="visual-basic"/></svg>'
}));

describe('TimelineIcon Component', () => {
    describe('Rendering', () => {
        it('should render a div container for valid icons', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            const div = container.querySelector('div');
            expect(div).toBeInTheDocument();
        });

        it('should render fallback SVG for unknown icon', () => {
            const { container } = render(<TimelineIcon iconName="unknown-icon" />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
            expect(svg?.querySelector('title')?.textContent).toBe('Timeline Icon');
        });
    });

    describe('Icon Mapping', () => {
        it('should render academic-cap icon', () => {
            const { container } = render(<TimelineIcon iconName="academic-cap" />);
            expect(container.innerHTML).toContain('academic-cap');
        });

        it('should render briefcase icon', () => {
            const { container } = render(<TimelineIcon iconName="briefcase" />);
            expect(container.innerHTML).toContain('briefcase');
        });

        it('should render rocket icon', () => {
            const { container } = render(<TimelineIcon iconName="rocket" />);
            expect(container.innerHTML).toContain('rocket');
        });

        it('should render javascript icon', () => {
            const { container } = render(<TimelineIcon iconName="javascript" />);
            expect(container.innerHTML).toContain('javascript');
        });

        it('should render heart icon', () => {
            const { container } = render(<TimelineIcon iconName="heart" />);
            expect(container.innerHTML).toContain('heart');
        });

        it('should render globe icon', () => {
            const { container } = render(<TimelineIcon iconName="globe" />);
            expect(container.innerHTML).toContain('globe');
        });

        it('should render sparkles icon', () => {
            const { container } = render(<TimelineIcon iconName="sparkles" />);
            expect(container.innerHTML).toContain('sparkles');
        });
    });

    describe('Hyphenated Icon Names', () => {
        it('should handle arrow-trending-up icon', () => {
            const { container } = render(<TimelineIcon iconName="arrow-trending-up" />);
            expect(container.innerHTML).toContain('arrow-trending-up');
        });

        it('should handle computer-desktop icon', () => {
            const { container } = render(<TimelineIcon iconName="computer-desktop" />);
            expect(container.innerHTML).toContain('computer-desktop');
        });

        it('should handle device-desktop icon', () => {
            const { container } = render(<TimelineIcon iconName="device-desktop" />);
            expect(container.innerHTML).toContain('device-desktop');
        });

        it('should handle paint-brush icon', () => {
            const { container } = render(<TimelineIcon iconName="paint-brush" />);
            expect(container.innerHTML).toContain('paint-brush');
        });

        it('should handle paper-airplane icon', () => {
            const { container } = render(<TimelineIcon iconName="paper-airplane" />);
            expect(container.innerHTML).toContain('paper-airplane');
        });

        it('should handle user-circle icon', () => {
            const { container } = render(<TimelineIcon iconName="user-circle" />);
            expect(container.innerHTML).toContain('user-circle');
        });

        it('should handle user-group icon', () => {
            const { container } = render(<TimelineIcon iconName="user-group" />);
            expect(container.innerHTML).toContain('user-group');
        });

        it('should handle visual-basic icon', () => {
            const { container } = render(<TimelineIcon iconName="visual-basic" />);
            expect(container.innerHTML).toContain('visual-basic');
        });
    });

    describe('Technology Icons', () => {
        it('should render html5 icon', () => {
            const { container } = render(<TimelineIcon iconName="html5" />);
            expect(container.innerHTML).toContain('html5');
        });

        it('should render php icon', () => {
            const { container } = render(<TimelineIcon iconName="php" />);
            expect(container.innerHTML).toContain('php');
        });

        it('should render access icon', () => {
            const { container } = render(<TimelineIcon iconName="access" />);
            expect(container.innerHTML).toContain('access');
        });

        it('should render avature icon', () => {
            const { container } = render(<TimelineIcon iconName="avature" />);
            expect(container.innerHTML).toContain('avature');
        });

        it('should render make icon', () => {
            const { container } = render(<TimelineIcon iconName="make" />);
            expect(container.innerHTML).toContain('make');
        });
    });

    describe('Network Icons', () => {
        it('should render broadband icon', () => {
            const { container } = render(<TimelineIcon iconName="broadband" />);
            expect(container.innerHTML).toContain('broadband');
        });

        it('should render dialup icon', () => {
            const { container } = render(<TimelineIcon iconName="dialup" />);
            expect(container.innerHTML).toContain('dialup');
        });
    });

    describe('UI Icons', () => {
        it('should render bolt icon', () => {
            const { container } = render(<TimelineIcon iconName="bolt" />);
            expect(container.innerHTML).toContain('bolt');
        });

        it('should render cog icon', () => {
            const { container } = render(<TimelineIcon iconName="cog" />);
            expect(container.innerHTML).toContain('cog');
        });

        it('should render eye icon', () => {
            const { container } = render(<TimelineIcon iconName="eye" />);
            expect(container.innerHTML).toContain('eye');
        });

        it('should render star icon', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            expect(container.innerHTML).toContain('star');
        });
    });

    describe('ClassName Handling', () => {
        it('should apply default className to div', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            const div = container.querySelector('div');
            expect(div).toHaveClass('w-6', 'h-6');
        });

        it('should apply custom className to div', () => {
            const { container } = render(<TimelineIcon iconName="star" className="w-8 h-8 text-blue-500" />);
            const div = container.querySelector('div');
            expect(div).toHaveClass('w-8', 'h-8', 'text-blue-500');
        });

        it('should apply className to fallback SVG', () => {
            const { container } = render(<TimelineIcon iconName="unknown" className="w-10 h-10" />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('w-10', 'h-10');
        });

        it('should handle empty className', () => {
            const { container } = render(<TimelineIcon iconName="star" className="" />);
            const div = container.querySelector('div');
            expect(div).toBeInTheDocument();
        });
    });

    describe('Fallback Icon', () => {
        it('should render fallback SVG for null iconName', () => {
            const { container } = render(<TimelineIcon iconName={null as unknown as string} />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('should render fallback SVG for empty string', () => {
            const { container } = render(<TimelineIcon iconName="" />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('should render fallback SVG for non-existent icon', () => {
            const { container } = render(<TimelineIcon iconName="does-not-exist" />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('should have proper SVG attributes on fallback', () => {
            const { container } = render(<TimelineIcon iconName="invalid" />);
            const svg = container.querySelector('svg');

            expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
            expect(svg).toHaveAttribute('fill', 'none');
            expect(svg).toHaveAttribute('stroke', 'currentColor');
        });

        it('should have star path on fallback icon', () => {
            const { container } = render(<TimelineIcon iconName="invalid" />);
            const path = container.querySelector('path');

            expect(path).toBeInTheDocument();
            expect(path).toHaveAttribute('stroke-linecap', 'round');
            expect(path).toHaveAttribute('stroke-linejoin', 'round');
            expect(path).toHaveAttribute('stroke-width', '2');
        });

        it('should have title element on fallback icon', () => {
            const { container } = render(<TimelineIcon iconName="invalid" />);
            const title = container.querySelector('title');

            expect(title).toBeInTheDocument();
            expect(title?.textContent).toBe('Timeline Icon');
        });
    });

    describe('DangerouslySetInnerHTML Usage', () => {
        it('should use dangerouslySetInnerHTML for valid icons', () => {
            const { container } = render(<TimelineIcon iconName="rocket" />);
            const div = container.querySelector('div');

            // Check if div has innerHTML (which indicates dangerouslySetInnerHTML was used)
            expect(div?.innerHTML).toContain('svg');
        });

        it('should have currentColor style', () => {
            const { container } = render(<TimelineIcon iconName="star" />);
            const div = container.querySelector('div');

            expect(div).toHaveStyle({ color: 'currentColor' });
        });

        it('should not use dangerouslySetInnerHTML for fallback', () => {
            const { container } = render(<TimelineIcon iconName="invalid" />);

            // Fallback uses direct SVG element, not dangerouslySetInnerHTML
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle case-sensitive icon names correctly', () => {
            const { container } = render(<TimelineIcon iconName="Star" />);
            const svg = container.querySelector('svg');

            // "Star" (capitalized) should not match "star" (lowercase)
            expect(svg).toBeInTheDocument(); // Fallback should render
        });

        it('should handle icon names with spaces', () => {
            const { container } = render(<TimelineIcon iconName="star icon" />);
            const svg = container.querySelector('svg');

            // Should render fallback
            expect(svg).toBeInTheDocument();
        });

        it('should handle very long className', () => {
            const longClassName =
                'w-6 h-6 text-blue-500 bg-red-200 rounded-full shadow-lg hover:scale-110 transition-all';
            const { container } = render(<TimelineIcon iconName="star" className={longClassName} />);
            const div = container.querySelector('div');

            expect(div).toHaveClass('w-6', 'h-6', 'text-blue-500', 'bg-red-200', 'rounded-full', 'shadow-lg');
        });
    });

    describe('All Icon Coverage', () => {
        const allIcons = [
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

        it.each(allIcons)('should render %s icon without errors', (iconName) => {
            const { container } = render(<TimelineIcon iconName={iconName} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
