import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';

describe('Card Component', () => {
    describe('Card', () => {
        it('should render children correctly', () => {
            render(<Card>Test Content</Card>);
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        it('should apply default card class without hover', () => {
            const { container } = render(<Card>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('card');
            expect(card).not.toHaveClass('card-hover');
        });

        it('should apply card-hover class when hover is true', () => {
            const { container } = render(<Card hover>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('card-hover');
            expect(card).not.toHaveClass('card');
        });

        it('should apply custom className', () => {
            const { container } = render(<Card className="custom-class">Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('custom-class');
        });

        it('should apply cursor-pointer class when onClick is provided', () => {
            const { container } = render(<Card onClick={() => {}}>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('cursor-pointer');
        });

        it('should not be interactive when onClick is not provided', () => {
            const { container } = render(<Card>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).not.toHaveAttribute('role');
            expect(card).not.toHaveAttribute('tabIndex');
        });

        it('should render as button role when onClick is provided', () => {
            render(<Card onClick={() => {}}>Content</Card>);
            const card = screen.getByRole('button');
            expect(card).toBeInTheDocument();
            expect(card).toHaveAttribute('tabIndex', '0');
        });

        it('should call onClick when clicked', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Card onClick={handleClick}>Content</Card>);
            const card = screen.getByRole('button');

            await user.click(card);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should call onClick when Enter key is pressed', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Card onClick={handleClick}>Content</Card>);
            const card = screen.getByRole('button');

            card.focus();
            await user.keyboard('{Enter}');
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should call onClick when Space key is pressed', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Card onClick={handleClick}>Content</Card>);
            const card = screen.getByRole('button');

            card.focus();
            await user.keyboard(' ');
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should not call onClick for other keys', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Card onClick={handleClick}>Content</Card>);
            const card = screen.getByRole('button');

            card.focus();
            await user.keyboard('a');
            await user.keyboard('{Escape}');
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('should combine all class modifiers correctly', () => {
            const { container } = render(
                <Card hover className="custom-class" onClick={() => {}}>
                    Content
                </Card>
            );
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('card-hover');
            expect(card).toHaveClass('cursor-pointer');
            expect(card).toHaveClass('custom-class');
        });
    });

    describe('CardHeader', () => {
        it('should render children correctly', () => {
            render(<CardHeader>Header Content</CardHeader>);
            expect(screen.getByText('Header Content')).toBeInTheDocument();
        });

        it('should apply default margin-bottom class', () => {
            const { container } = render(<CardHeader>Header</CardHeader>);
            const header = container.firstChild as HTMLElement;
            expect(header).toHaveClass('mb-4');
        });

        it('should apply custom className', () => {
            const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
            const header = container.firstChild as HTMLElement;
            expect(header).toHaveClass('mb-4');
            expect(header).toHaveClass('custom-header');
        });
    });

    describe('CardTitle', () => {
        it('should render children correctly', () => {
            render(<CardTitle>Title Text</CardTitle>);
            expect(screen.getByText('Title Text')).toBeInTheDocument();
        });

        it('should render as h3 element', () => {
            const { container } = render(<CardTitle>Title</CardTitle>);
            const title = container.querySelector('h3');
            expect(title).toBeInTheDocument();
        });

        it('should apply default styling classes', () => {
            const { container } = render(<CardTitle>Title</CardTitle>);
            const title = container.firstChild as HTMLElement;
            expect(title).toHaveClass('text-xl');
            expect(title).toHaveClass('font-semibold');
        });

        it('should apply custom className', () => {
            const { container } = render(<CardTitle className="custom-title">Title</CardTitle>);
            const title = container.firstChild as HTMLElement;
            expect(title).toHaveClass('text-xl');
            expect(title).toHaveClass('font-semibold');
            expect(title).toHaveClass('custom-title');
        });
    });

    describe('CardContent', () => {
        it('should render children correctly', () => {
            render(<CardContent>Content Text</CardContent>);
            expect(screen.getByText('Content Text')).toBeInTheDocument();
        });

        it('should apply default foreground-secondary class', () => {
            const { container } = render(<CardContent>Content</CardContent>);
            const content = container.firstChild as HTMLElement;
            expect(content).toHaveClass('text-foreground-secondary');
        });

        it('should apply custom className', () => {
            const { container } = render(<CardContent className="custom-content">Content</CardContent>);
            const content = container.firstChild as HTMLElement;
            expect(content).toHaveClass('text-foreground-secondary');
            expect(content).toHaveClass('custom-content');
        });
    });

    describe('CardFooter', () => {
        it('should render children correctly', () => {
            render(<CardFooter>Footer Content</CardFooter>);
            expect(screen.getByText('Footer Content')).toBeInTheDocument();
        });

        it('should apply default styling classes', () => {
            const { container } = render(<CardFooter>Footer</CardFooter>);
            const footer = container.firstChild as HTMLElement;
            expect(footer).toHaveClass('mt-4');
            expect(footer).toHaveClass('flex');
            expect(footer).toHaveClass('gap-2');
        });

        it('should apply custom className', () => {
            const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
            const footer = container.firstChild as HTMLElement;
            expect(footer).toHaveClass('mt-4');
            expect(footer).toHaveClass('flex');
            expect(footer).toHaveClass('gap-2');
            expect(footer).toHaveClass('custom-footer');
        });
    });

    describe('Card Composition', () => {
        it('should render complete card with all subcomponents', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                    </CardHeader>
                    <CardContent>Card body content goes here</CardContent>
                    <CardFooter>
                        <button type="button">Action 1</button>
                        <button type="button">Action 2</button>
                    </CardFooter>
                </Card>
            );

            expect(screen.getByText('Card Title')).toBeInTheDocument();
            expect(screen.getByText('Card body content goes here')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
        });

        it('should render clickable card with hover effect', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                <Card hover onClick={handleClick}>
                    <CardHeader>
                        <CardTitle>Clickable Card</CardTitle>
                    </CardHeader>
                    <CardContent>Click me!</CardContent>
                </Card>
            );

            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('card-hover');
            expect(card).toHaveClass('cursor-pointer');

            await user.click(card);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });
});
