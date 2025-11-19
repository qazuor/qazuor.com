import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TypeItText } from './TypeItText';

// Mock TypeIt library
interface TypeItInstance {
    go: () => TypeItInstance;
    destroy: () => void;
}

vi.mock('typeit', () => {
    const TypeItMockClass = vi.fn().mockImplementation(function (
        this: TypeItInstance,
        element: HTMLElement,
        options: { html?: boolean; strings?: string[] }
    ) {
        // Simulate typing animation by setting innerHTML
        if (element && options?.strings && options.strings.length > 0) {
            element.innerHTML = options.html
                ? options.strings[0]
                : options.strings[0].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // Return instance methods
        this.go = vi.fn(() => this);
        this.destroy = vi.fn();
        return this;
    });

    return {
        default: TypeItMockClass
    };
});

describe('TypeItText Component', () => {
    const defaultTexts = ['Hello World', 'Welcome', 'TypeIt Test'];

    describe('Rendering', () => {
        it('should render span element', () => {
            const { container } = render(<TypeItText texts={defaultTexts} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
        });

        it('should render with default first text', () => {
            render(<TypeItText texts={defaultTexts} />);
            expect(screen.getByText('Hello World')).toBeInTheDocument();
        });

        it('should render empty span when texts array is empty', () => {
            const { container } = render(<TypeItText texts={[]} />);
            const span = container.querySelector('span');
            expect(span).toBeInTheDocument();
            expect(span?.textContent).toBe('');
        });

        it('should apply custom className', () => {
            const { container } = render(<TypeItText texts={defaultTexts} className="custom-class" />);
            const span = container.querySelector('span');
            expect(span).toHaveClass('custom-class');
        });
    });

    describe('TypeIt Integration', () => {
        it('should initialize TypeIt with correct texts', async () => {
            render(<TypeItText texts={defaultTexts} />);

            await waitFor(() => {
                const content = screen.getByText('Hello World');
                expect(content).toBeInTheDocument();
            });
        });

        it('should pass custom speed to TypeIt', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} speed={100} />);

            expect(TypeItMock).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ speed: 100 }));
        });

        it('should pass custom deleteSpeed to TypeIt', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} deleteSpeed={50} />);

            expect(TypeItMock).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({ deleteSpeed: 50 })
            );
        });

        it('should pass custom nextStringDelay to TypeIt', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} nextStringDelay={3000} />);

            expect(TypeItMock).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({ nextStringDelay: 3000 })
            );
        });

        it('should enable loop when loop prop is true', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} loop={true} />);

            expect(TypeItMock).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ loop: true }));
        });

        it('should disable loop when loop prop is false', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} loop={false} />);

            expect(TypeItMock).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ loop: false }));
        });

        it('should have breakLines set to false', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} />);

            expect(TypeItMock).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({ breakLines: false })
            );
        });

        it('should have waitUntilVisible enabled', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} />);

            expect(TypeItMock).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({ waitUntilVisible: true })
            );
        });
    });

    describe('HTML Rendering', () => {
        it('should render plain text when html prop is false', () => {
            render(<TypeItText texts={['<strong>Bold</strong>']} html={false} />);

            // Should escape HTML
            const content = screen.getByText('<strong>Bold</strong>');
            expect(content).toBeInTheDocument();
        });

        it('should render HTML when html prop is true', async () => {
            render(<TypeItText texts={['<strong>Bold</strong>']} html={true} />);

            await waitFor(() => {
                const strong = screen.getByText('Bold');
                expect(strong.tagName).toBe('STRONG');
            });
        });

        it('should use dangerouslySetInnerHTML when html is true', () => {
            const { container } = render(<TypeItText texts={['<em>Italic</em>']} html={true} />);

            const innerSpan = container.querySelector('span > span');
            expect(innerSpan).toBeInTheDocument();
        });

        it('should NOT use dangerouslySetInnerHTML when html is false', () => {
            const { container } = render(<TypeItText texts={['Plain text']} html={false} />);

            // Should only have one span (the outer one)
            const spans = container.querySelectorAll('span');
            expect(spans).toHaveLength(1);
        });
    });

    describe('Edge Cases', () => {
        it('should handle single text in array', () => {
            render(<TypeItText texts={['Single text']} />);
            expect(screen.getByText('Single text')).toBeInTheDocument();
        });

        it('should handle empty string in texts', () => {
            const { container } = render(<TypeItText texts={['']} />);
            const span = container.querySelector('span');
            expect(span?.textContent).toBe('');
        });

        it('should handle very long text', () => {
            const longText = 'A'.repeat(1000);
            render(<TypeItText texts={[longText]} />);

            const content = screen.getByText(longText);
            expect(content).toBeInTheDocument();
        });

        it('should handle special characters', () => {
            const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            render(<TypeItText texts={[specialChars]} />);

            expect(screen.getByText(specialChars)).toBeInTheDocument();
        });

        it('should handle unicode characters', () => {
            const unicode = '你好世界 🌍 مرحبا';
            render(<TypeItText texts={[unicode]} />);

            expect(screen.getByText(unicode)).toBeInTheDocument();
        });
    });

    describe('Defaults', () => {
        it('should use default speed of 50', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} />);

            expect(TypeItMock).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ speed: 50 }));
        });

        it('should use default deleteSpeed of 30', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} />);

            expect(TypeItMock).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({ deleteSpeed: 30 })
            );
        });

        it('should use default nextStringDelay of 2000', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} />);

            expect(TypeItMock).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({ nextStringDelay: 2000 })
            );
        });

        it('should use default loop of true', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} />);

            expect(TypeItMock).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ loop: true }));
        });

        it('should use default html of false', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(<TypeItText texts={defaultTexts} />);

            expect(TypeItMock).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ html: false }));
        });

        it('should use default className of empty string', () => {
            const { container } = render(<TypeItText texts={defaultTexts} />);
            const span = container.querySelector('span');

            // Should not have any classes
            expect(span?.className).toBe('');
        });
    });

    describe('Integration Scenarios', () => {
        it('should work with all custom props combined', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            render(
                <TypeItText
                    texts={['First', 'Second', 'Third']}
                    speed={75}
                    deleteSpeed={25}
                    nextStringDelay={1500}
                    loop={false}
                    html={true}
                    className="typing-animation"
                />
            );

            expect(TypeItMock).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({
                    strings: ['First', 'Second', 'Third'],
                    speed: 75,
                    deleteSpeed: 25,
                    nextStringDelay: 1500,
                    loop: false,
                    html: true,
                    breakLines: false,
                    waitUntilVisible: true
                })
            );
        });

        it('should handle re-initialization on texts change', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            const { rerender } = render(<TypeItText texts={['Initial']} />);

            expect(TypeItMock).toHaveBeenCalledTimes(1);

            // Change texts
            rerender(<TypeItText texts={['Updated']} />);

            expect(TypeItMock).toHaveBeenCalledTimes(2);
        });

        it('should handle re-initialization on speed change', async () => {
            const TypeItModule = await import('typeit');
            const TypeItMock = vi.mocked(TypeItModule).default;

            const { rerender } = render(<TypeItText texts={defaultTexts} speed={50} />);

            expect(TypeItMock).toHaveBeenCalledTimes(1);

            // Change speed
            rerender(<TypeItText texts={defaultTexts} speed={100} />);

            expect(TypeItMock).toHaveBeenCalledTimes(2);
        });
    });
});
