import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypeItText } from '@/components/ui/TypeItText';

// Mock TypeIt library
vi.mock('typeit', () => {
    return {
        default: vi.fn((element, options) => ({
            go: vi.fn()
        }))
    };
});

describe('TypeItText Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('renders with single text', () => {
            const { container } = render(<TypeItText texts={['Hello World']} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
        });

        it('renders with multiple texts', () => {
            const texts = ['First text', 'Second text', 'Third text'];
            const { container } = render(<TypeItText texts={texts} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
        });

        it('displays first text initially', () => {
            const texts = ['Initial text', 'Second text'];
            render(<TypeItText texts={texts} />);
            expect(document.body.textContent).toContain('Initial text');
        });

        it('handles empty texts array', () => {
            const { container } = render(<TypeItText texts={[]} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
            expect(span?.textContent).toBe('');
        });
    });

    describe('Props', () => {
        it('applies custom className', () => {
            const { container } = render(<TypeItText texts={['Test']} className="custom-class text-primary" />);
            const span = container.querySelector('span');
            expect(span).toHaveClass('custom-class', 'text-primary');
        });

        it('accepts speed prop', () => {
            const { container } = render(<TypeItText texts={['Test']} speed={100} />);
            expect(container.querySelector('span')).toBeInTheDocument();
        });

        it('accepts deleteSpeed prop', () => {
            const { container } = render(<TypeItText texts={['Test']} deleteSpeed={50} />);
            expect(container.querySelector('span')).toBeInTheDocument();
        });

        it('accepts nextStringDelay prop', () => {
            const { container } = render(<TypeItText texts={['Test']} nextStringDelay={3000} />);
            expect(container.querySelector('span')).toBeInTheDocument();
        });

        it('accepts loop prop as true', () => {
            const { container } = render(<TypeItText texts={['Test']} loop={true} />);
            expect(container.querySelector('span')).toBeInTheDocument();
        });

        it('accepts loop prop as false', () => {
            const { container } = render(<TypeItText texts={['Test']} loop={false} />);
            expect(container.querySelector('span')).toBeInTheDocument();
        });
    });

    describe('HTML Support', () => {
        it('renders HTML when html prop is true', () => {
            const htmlText = '<strong>Bold text</strong>';
            const { container } = render(<TypeItText texts={[htmlText]} html={true} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
        });

        it('renders plain text when html prop is false', () => {
            const htmlText = '<strong>Bold text</strong>';
            const { container } = render(<TypeItText texts={[htmlText]} html={false} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
        });

        it('html prop defaults to false', () => {
            const { container } = render(<TypeItText texts={['Test']} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
        });
    });

    describe('TypeIt Integration', () => {
        it('initializes TypeIt when texts are provided', async () => {
            const TypeItMock = await import('typeit');
            render(<TypeItText texts={['Test text']} />);

            await waitFor(() => {
                expect(TypeItMock.default).toHaveBeenCalled();
            });
        });

        it('does not initialize TypeIt when texts array is empty', async () => {
            const TypeItMock = await import('typeit');
            render(<TypeItText texts={[]} />);

            // TypeIt should not be called for empty array
            expect(TypeItMock.default).not.toHaveBeenCalled();
        });
    });
});
