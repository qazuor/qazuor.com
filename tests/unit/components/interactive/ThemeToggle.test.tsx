import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '@/components/interactive/ThemeToggle';

describe('ThemeToggle Component', () => {
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        // Mock localStorage
        localStorageMock = {};
        global.localStorage = {
            getItem: vi.fn((key: string) => localStorageMock[key] || null),
            setItem: vi.fn((key: string, value: string) => {
                localStorageMock[key] = value;
            }),
            removeItem: vi.fn((key: string) => {
                delete localStorageMock[key];
            }),
            clear: vi.fn(() => {
                localStorageMock = {};
            }),
            key: vi.fn(),
            length: 0
        } as Storage;

        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            }))
        });

        // Reset document classes
        document.documentElement.classList.remove('dark');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('renders toggle button', async () => {
            render(<ThemeToggle />);
            await waitFor(() => {
                expect(screen.getByRole('button')).toBeInTheDocument();
            });
        });

        it('applies default aria-label', async () => {
            render(<ThemeToggle />);
            await waitFor(() => {
                const button = screen.getByRole('button');
                expect(button).toHaveAttribute('aria-label', 'Toggle theme');
            });
        });

        it('applies custom aria-label', async () => {
            render(<ThemeToggle ariaLabel="Switch theme mode" />);
            await waitFor(() => {
                const button = screen.getByRole('button');
                expect(button).toHaveAttribute('aria-label', 'Switch theme mode');
            });
        });

        it('renders placeholder before mount', () => {
            render(<ThemeToggle />);
            const button = screen.getByRole('button');
            // Should have placeholder div with fixed dimensions
            const placeholder = button.querySelector('div');
            expect(placeholder).toBeInTheDocument();
            expect(placeholder).toHaveClass('w-5', 'h-5');
        });
    });

    describe('Theme Detection', () => {
        it('initializes with light theme when no preference', async () => {
            render(<ThemeToggle />);
            await waitFor(() => {
                expect(localStorage.getItem).toHaveBeenCalledWith('theme');
            });
        });

        it('loads saved theme from localStorage', async () => {
            localStorageMock['theme'] = 'dark';
            render(<ThemeToggle />);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });

        it('respects prefers-color-scheme when no saved theme', async () => {
            // Mock dark preference
            window.matchMedia = vi.fn().mockImplementation((query: string) => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            }));

            render(<ThemeToggle />);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });
    });

    describe('Theme Toggling', () => {
        it('toggles from light to dark theme', async () => {
            const user = userEvent.setup();
            render(<ThemeToggle />);

            await waitFor(() => {
                expect(screen.getByRole('button')).toBeInTheDocument();
            });

            const button = screen.getByRole('button');
            await user.click(button);

            await waitFor(() => {
                expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });

        it('toggles from dark to light theme', async () => {
            const user = userEvent.setup();
            localStorageMock['theme'] = 'dark';
            render(<ThemeToggle />);

            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });

            const button = screen.getByRole('button');
            await user.click(button);

            await waitFor(() => {
                expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });
        });

        it('persists theme preference to localStorage', async () => {
            const user = userEvent.setup();
            render(<ThemeToggle />);

            await waitFor(() => {
                expect(screen.getByRole('button')).toBeInTheDocument();
            });

            const button = screen.getByRole('button');
            await user.click(button);

            await waitFor(() => {
                expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
            });
        });

        it('toggles multiple times correctly', async () => {
            const user = userEvent.setup();
            render(<ThemeToggle />);

            await waitFor(() => {
                expect(screen.getByRole('button')).toBeInTheDocument();
            });

            const button = screen.getByRole('button');

            // First toggle: light -> dark
            await user.click(button);
            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });

            // Second toggle: dark -> light
            await user.click(button);
            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(false);
            });

            // Third toggle: light -> dark
            await user.click(button);
            await waitFor(() => {
                expect(document.documentElement.classList.contains('dark')).toBe(true);
            });
        });
    });

    describe('Styling', () => {
        it('applies correct button classes', async () => {
            render(<ThemeToggle />);
            await waitFor(() => {
                const button = screen.getByRole('button');
                expect(button).toHaveClass('p-2', 'rounded-lg', 'bg-muted');
            });
        });

        it('has hover and transition classes', async () => {
            render(<ThemeToggle />);
            await waitFor(() => {
                const button = screen.getByRole('button');
                expect(button).toHaveClass('hover:bg-muted/80', 'transition-colors');
            });
        });
    });
});
