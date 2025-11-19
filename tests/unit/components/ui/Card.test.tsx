import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

describe('Card Component', () => {
    describe('Card', () => {
        it('renders children correctly', () => {
            render(<Card>Test Content</Card>);
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        it('applies default card class', () => {
            const { container } = render(<Card>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('card');
        });

        it('applies hover class when hover prop is true', () => {
            const { container } = render(<Card hover>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('card-hover');
        });

        it('applies custom className', () => {
            const { container } = render(<Card className="custom-class">Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('custom-class');
        });

        it('applies cursor-pointer when onClick is provided', () => {
            const { container } = render(<Card onClick={() => {}}>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('cursor-pointer');
        });

        it('calls onClick when clicked', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Card onClick={handleClick}>Clickable Card</Card>);

            const card = screen.getByRole('button');
            await user.click(card);

            expect(handleClick).toHaveBeenCalledOnce();
        });

        it('has role="button" when onClick is provided', () => {
            const { container } = render(<Card onClick={() => {}}>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveAttribute('role', 'button');
        });

        it('has tabIndex=0 when onClick is provided', () => {
            const { container } = render(<Card onClick={() => {}}>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveAttribute('tabIndex', '0');
        });

        it('calls onClick when Enter key is pressed', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Card onClick={handleClick}>Keyboard Accessible Card</Card>);

            const card = screen.getByRole('button');
            card.focus();
            await user.keyboard('{Enter}');

            expect(handleClick).toHaveBeenCalledOnce();
        });

        it('calls onClick when Space key is pressed', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Card onClick={handleClick}>Keyboard Accessible Card</Card>);

            const card = screen.getByRole('button');
            card.focus();
            await user.keyboard(' ');

            expect(handleClick).toHaveBeenCalledOnce();
        });

        it('does not have interactive props when onClick is not provided', () => {
            const { container } = render(<Card>Non-interactive Card</Card>);
            const card = container.firstChild as HTMLElement;

            expect(card).not.toHaveAttribute('role');
            expect(card).not.toHaveAttribute('tabIndex');
            expect(card).not.toHaveClass('cursor-pointer');
        });
    });

    describe('CardHeader', () => {
        it('renders children correctly', () => {
            render(<CardHeader>Header Content</CardHeader>);
            expect(screen.getByText('Header Content')).toBeInTheDocument();
        });

        it('applies default margin bottom class', () => {
            const { container } = render(<CardHeader>Header</CardHeader>);
            const header = container.firstChild as HTMLElement;
            expect(header).toHaveClass('mb-4');
        });

        it('applies custom className', () => {
            const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
            const header = container.firstChild as HTMLElement;
            expect(header).toHaveClass('custom-header');
            expect(header).toHaveClass('mb-4'); // Keeps default class
        });
    });

    describe('CardTitle', () => {
        it('renders children correctly', () => {
            render(<CardTitle>Title Text</CardTitle>);
            expect(screen.getByText('Title Text')).toBeInTheDocument();
        });

        it('renders as h3 element', () => {
            render(<CardTitle>Title</CardTitle>);
            const title = screen.getByText('Title');
            expect(title.tagName).toBe('H3');
        });

        it('applies default text styling classes', () => {
            const { container } = render(<CardTitle>Title</CardTitle>);
            const title = container.firstChild as HTMLElement;
            expect(title).toHaveClass('text-xl', 'font-semibold');
        });

        it('applies custom className', () => {
            const { container } = render(<CardTitle className="custom-title">Title</CardTitle>);
            const title = container.firstChild as HTMLElement;
            expect(title).toHaveClass('custom-title');
            expect(title).toHaveClass('text-xl', 'font-semibold'); // Keeps default classes
        });
    });

    describe('CardContent', () => {
        it('renders children correctly', () => {
            render(<CardContent>Content Text</CardContent>);
            expect(screen.getByText('Content Text')).toBeInTheDocument();
        });

        it('applies default text color class', () => {
            const { container } = render(<CardContent>Content</CardContent>);
            const content = container.firstChild as HTMLElement;
            expect(content).toHaveClass('text-foreground-secondary');
        });

        it('applies custom className', () => {
            const { container } = render(<CardContent className="custom-content">Content</CardContent>);
            const content = container.firstChild as HTMLElement;
            expect(content).toHaveClass('custom-content');
            expect(content).toHaveClass('text-foreground-secondary'); // Keeps default class
        });
    });

    describe('CardFooter', () => {
        it('renders children correctly', () => {
            render(<CardFooter>Footer Content</CardFooter>);
            expect(screen.getByText('Footer Content')).toBeInTheDocument();
        });

        it('applies default layout classes', () => {
            const { container } = render(<CardFooter>Footer</CardFooter>);
            const footer = container.firstChild as HTMLElement;
            expect(footer).toHaveClass('mt-4', 'flex', 'gap-2');
        });

        it('applies custom className', () => {
            const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
            const footer = container.firstChild as HTMLElement;
            expect(footer).toHaveClass('custom-footer');
            expect(footer).toHaveClass('mt-4', 'flex', 'gap-2'); // Keeps default classes
        });
    });

    describe('Card Composition', () => {
        it('renders complete card with all subcomponents', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                    </CardHeader>
                    <CardContent>Card content goes here</CardContent>
                    <CardFooter>
                        <button type="button">Action</button>
                    </CardFooter>
                </Card>
            );

            expect(screen.getByText('Card Title')).toBeInTheDocument();
            expect(screen.getByText('Card content goes here')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
        });

        it('renders clickable card with hover effect', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();

            render(
                <Card hover onClick={handleClick}>
                    <CardHeader>
                        <CardTitle>Clickable Card</CardTitle>
                    </CardHeader>
                    <CardContent>Click me!</CardContent>
                </Card>
            );

            const card = screen.getByText('Click me!').closest('div.card-hover');
            expect(card).toBeInTheDocument();
            expect(card).not.toBeNull();

            if (card) await user.click(card);
            expect(handleClick).toHaveBeenCalledOnce();
        });
    });
});
