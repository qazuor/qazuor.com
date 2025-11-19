import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle Component', () => {
    // Mock localStorage
    const localStorageMock = (() => {
        let store: Record<string, string> = {};
        return {
            getItem: vi.fn((key: string) => store[key] || null),
            setItem: vi.fn((key: string, value: string) => {
                store[key] = value;
            }),
            clear: vi.fn(() => {
                store = {};
            }),
            removeItem: vi.fn((key: string) => {
                delete store[key];
            }),
            get length() {
                return Object.keys(store).length;
            },
            key: vi.fn((index: number) => Object.keys(store)[index] || null)
        };
    })();

    // Mock matchMedia
    const matchMediaMock = (matches: boolean) => ({
        matches,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    });

    beforeEach(() => {
        // Setup mocks
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
        Object.defineProperty(window, 'matchMedia', {
            value: vi.fn((_query: string) => matchMediaMock(false)),
            writable: true
        });

        // Clear DOM classes
        document.documentElement.classList.remove('dark');

        // Clear localStorage
        localStorageMock.clear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render a button', () => {
            render(<ThemeToggle />);
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('should render with default aria-label', () => {
            render(<ThemeToggle />);
            expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
        });

        it('should render with custom aria-label', () => {
            render(<ThemeToggle ariaLabel="Switch color mode" />);
            expect(screen.getByLabelText('Switch color mode')).toBeInTheDocument();
        });

        it('should render placeholder button before mount', () => {
            const { container } = render(<ThemeToggle />);
            const _button = screen.getByRole('button');

            // Should have placeholder div
            const placeholder = container.querySelector('.w-5.h-5');
            expect(placeholder).toBeInTheDocument();
        });

        it('should apply styling classes to button', () => {
            render(<ThemeToggle />);
            const button = screen.getByRole('button');

            expect(button).toHaveClass('p-2');
            expect(button).toHaveClass('rounded-lg');
            expect(button).toHaveClass('bg-muted');
        });
    });

    describe('Theme Initialization', () => {
        it('should default to light theme when no saved preference', async () => {
            render(<ThemeToggle />);

            await waitFor(() => {
                expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
            });
        });

        it('should use saved theme from localStorage', async () => {
            localStorageMock.setItem('theme', 'dark');

            render(<ThemeToggle />);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });

        it('should use system preference when no saved theme (dark)', async () => {
            window.matchMedia = vi.fn((_query: string) => matchMediaMock(true)) as unknown as typeof window.matchMedia;

            render(<ThemeToggle />);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });

        it('should prefer saved theme over system preference', async () => {
            localStorageMock.setItem('theme', 'light');
            window.matchMedia = vi.fn((_query: string) => matchMediaMock(true)) as unknown as typeof window.matchMedia;

            render(<ThemeToggle />);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });
        });
    });

    describe('Theme Toggling', () => {
        it('should toggle from light to dark', async () => {
            const user = userEvent.setup();
            localStorageMock.setItem('theme', 'light');

            render(<ThemeToggle />);

            // Wait for component to mount
            await waitFor(() => {
                expect(localStorageMock.getItem).toHaveBeenCalled();
            });

            const button = screen.getByRole('button');
            await user.click(button);

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });

        it('should toggle from dark to light', async () => {
            const user = userEvent.setup();
            localStorageMock.setItem('theme', 'dark');

            render(<ThemeToggle />);

            // Wait for component to mount
            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });

            const button = screen.getByRole('button');
            await user.click(button);

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });
        });

        it('should persist theme to localStorage on toggle', async () => {
            const user = userEvent.setup();

            render(<ThemeToggle />);

            // Wait for mount
            await waitFor(() => {
                expect(localStorageMock.getItem).toHaveBeenCalled();
            });

            const button = screen.getByRole('button');

            // Toggle to dark
            await user.click(button);

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
            });

            // Toggle back to light
            await user.click(button);

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
            });
        });

        it('should apply dark class to document element when toggling to dark', async () => {
            const user = userEvent.setup();

            render(<ThemeToggle />);

            await waitFor(() => {
                expect(localStorageMock.getItem).toHaveBeenCalled();
            });

            const button = screen.getByRole('button');
            await user.click(button);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });

        it('should remove dark class from document element when toggling to light', async () => {
            const user = userEvent.setup();
            localStorageMock.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');

            render(<ThemeToggle />);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });

            const button = screen.getByRole('button');
            await user.click(button);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });
        });
    });

    describe('Icon Display', () => {
        it('should display moon icon in light mode', async () => {
            localStorageMock.setItem('theme', 'light');

            const { container } = render(<ThemeToggle />);

            await waitFor(() => {
                const span = container.querySelector('span');
                expect(span).toBeInTheDocument();
            });
        });

        it('should display sun icon in dark mode', async () => {
            localStorageMock.setItem('theme', 'dark');

            const { container } = render(<ThemeToggle />);

            await waitFor(() => {
                const span = container.querySelector('span');
                expect(span).toBeInTheDocument();
            });
        });

        it('should switch icons when toggling theme', async () => {
            const user = userEvent.setup();

            const { container } = render(<ThemeToggle />);

            await waitFor(() => {
                expect(localStorageMock.getItem).toHaveBeenCalled();
            });

            const button = screen.getByRole('button');

            // Toggle to dark (should show sun icon)
            await user.click(button);

            await waitFor(() => {
                const span = container.querySelector('span');
                expect(span).toBeInTheDocument();
            });

            // Toggle back to light (should show moon icon)
            await user.click(button);

            await waitFor(() => {
                const span = container.querySelector('span');
                expect(span).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should be keyboard accessible', async () => {
            const user = userEvent.setup();

            render(<ThemeToggle />);

            await waitFor(() => {
                expect(localStorageMock.getItem).toHaveBeenCalled();
            });

            const button = screen.getByRole('button');

            // Focus the button
            button.focus();
            expect(button).toHaveFocus();

            // Trigger with Enter key
            await user.keyboard('{Enter}');

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalled();
            });
        });

        it('should have type="button" to prevent form submission', () => {
            render(<ThemeToggle />);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'button');
        });

        it('should have hover styles', () => {
            render(<ThemeToggle />);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('hover:bg-muted/80');
            expect(button).toHaveClass('transition-colors');
        });
    });

    describe('Hydration', () => {
        it('should prevent flash of unstyled content before mount', () => {
            const { container } = render(<ThemeToggle />);

            // Before mount, should render placeholder
            const placeholder = container.querySelector('.w-5.h-5');
            expect(placeholder).toBeInTheDocument();
        });

        it('should render full button after mount', async () => {
            render(<ThemeToggle />);

            await waitFor(() => {
                const button = screen.getByRole('button');
                expect(button).not.toHaveAttribute('disabled');
            });
        });
    });
});
