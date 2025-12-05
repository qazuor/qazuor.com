import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatusMessage } from '@/components/forms/StatusMessage';

// Mock the SVG imports
vi.mock('@/icons/ui/check-circle.svg?raw', () => ({
    default: '<svg data-testid="check-icon"></svg>'
}));
vi.mock('@/icons/ui/x-circle.svg?raw', () => ({
    default: '<svg data-testid="x-icon"></svg>'
}));

describe('StatusMessage Component', () => {
    describe('Success State', () => {
        it('should render success message', () => {
            render(<StatusMessage type="success" message="Operation completed!" />);
            expect(screen.getByText('Operation completed!')).toBeInTheDocument();
        });

        it('should have success styling classes', () => {
            const { container } = render(<StatusMessage type="success" message="Success!" />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveClass('bg-success/10');
            expect(wrapper).toHaveClass('border-success/20');
            expect(wrapper).toHaveClass('text-success');
        });

        it('should render success icon', () => {
            const { container } = render(<StatusMessage type="success" message="Success!" />);
            const iconSpan = container.querySelector('span');
            expect(iconSpan?.innerHTML).toContain('check-icon');
        });
    });

    describe('Error State', () => {
        it('should render error message', () => {
            render(<StatusMessage type="error" message="Something went wrong!" />);
            expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
        });

        it('should have error styling classes', () => {
            const { container } = render(<StatusMessage type="error" message="Error!" />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveClass('bg-error/10');
            expect(wrapper).toHaveClass('border-error/20');
            expect(wrapper).toHaveClass('text-error');
        });

        it('should render error icon', () => {
            const { container } = render(<StatusMessage type="error" message="Error!" />);
            const iconSpan = container.querySelector('span');
            expect(iconSpan?.innerHTML).toContain('x-icon');
        });
    });

    describe('Common Structure', () => {
        it('should render as a flex container', () => {
            const { container } = render(<StatusMessage type="success" message="Test" />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('items-start');
            expect(wrapper).toHaveClass('gap-3');
        });

        it('should have padding and border', () => {
            const { container } = render(<StatusMessage type="success" message="Test" />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveClass('p-4');
            expect(wrapper).toHaveClass('border');
            expect(wrapper).toHaveClass('rounded-lg');
        });

        it('should render message in a paragraph', () => {
            render(<StatusMessage type="success" message="Test message" />);
            const paragraph = screen.getByText('Test message');
            expect(paragraph.tagName).toBe('P');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty message', () => {
            const { container } = render(<StatusMessage type="success" message="" />);
            const paragraph = container.querySelector('p');
            expect(paragraph).toBeInTheDocument();
            expect(paragraph?.textContent).toBe('');
        });

        it('should handle long message', () => {
            const longMessage = 'A'.repeat(500);
            render(<StatusMessage type="error" message={longMessage} />);
            expect(screen.getByText(longMessage)).toBeInTheDocument();
        });

        it('should handle special characters in message', () => {
            const specialMessage = '<script>alert("xss")</script> & "quotes" \'single\'';
            render(<StatusMessage type="success" message={specialMessage} />);
            expect(screen.getByText(specialMessage)).toBeInTheDocument();
        });
    });
});
