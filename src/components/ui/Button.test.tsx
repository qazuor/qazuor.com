import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

/**
 * Button Component Unit Tests
 * Tests rendering, interactions, and variants
 */
describe('Button Component', () => {
    describe('Rendering', () => {
        it('renders with correct text', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button')).toHaveTextContent('Click me');
        });

        it('renders as a button by default', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');
            expect(button.tagName).toBe('BUTTON');
        });

        it('renders as a link when href is provided', () => {
            render(<Button href="/test">Click me</Button>);
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/test');
            expect(link.tagName).toBe('A');
        });
    });

    describe('Interactions', () => {
        it('calls onClick handler when clicked', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(handleClick).toHaveBeenCalledOnce();
        });

        it('does not call onClick when disabled', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button onClick={handleClick} disabled>
                    Click me
                </Button>
            );

            const button = screen.getByRole('button');
            await user.click(button);

            // Button is disabled, so onClick should not be called
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Disabled state', () => {
        it('can be disabled', () => {
            render(<Button disabled>Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
        });

        it('has correct disabled classes', () => {
            render(<Button disabled>Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
        });
    });

    describe('Variants', () => {
        it('renders with primary variant by default', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn-primary');
        });

        it('renders with secondary variant', () => {
            render(<Button variant="secondary">Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn-secondary');
        });

        it('renders with ghost variant', () => {
            render(<Button variant="ghost">Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn-ghost');
        });
    });

    describe('Sizes', () => {
        it('renders with medium size by default', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-6', 'py-3', 'text-base');
        });

        it('renders with small size', () => {
            render(<Button size="sm">Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
        });

        it('renders with large size', () => {
            render(<Button size="lg">Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
        });
    });

    describe('Button types', () => {
        it('has button type by default', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'button');
        });

        it('can be a submit button', () => {
            render(<Button type="submit">Submit</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'submit');
        });

        it('can be a reset button', () => {
            render(<Button type="reset">Reset</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'reset');
        });
    });

    describe('Custom className', () => {
        it('accepts custom className', () => {
            render(<Button className="custom-class">Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
        });

        it('preserves default classes with custom className', () => {
            render(<Button className="custom-class">Click me</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn', 'btn-primary', 'custom-class');
        });
    });
});
