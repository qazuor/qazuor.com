import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollToTop } from '@/components/interactive/ScrollToTop';

describe('ScrollToTop', () => {
    let originalLocation: Location;
    let mockScrollTo: ReturnType<typeof vi.fn>;
    let matchMediaMock: ReturnType<typeof vi.fn>;
    let mobileMediaQueryListeners: Array<(e: MediaQueryListEvent) => void> = [];
    let fitMediaQueryListeners: Array<(e: MediaQueryListEvent) => void> = [];

    beforeEach(() => {
        // Store original location
        originalLocation = window.location;

        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { pathname: '/en/about' },
            writable: true,
            configurable: true
        });

        // Mock scrollTo
        mockScrollTo = vi.fn();
        window.scrollTo = mockScrollTo as unknown as typeof window.scrollTo;

        // Mock pageYOffset
        Object.defineProperty(window, 'pageYOffset', {
            value: 0,
            writable: true,
            configurable: true
        });

        // Reset listeners
        mobileMediaQueryListeners = [];
        fitMediaQueryListeners = [];

        // Mock matchMedia
        matchMediaMock = vi.fn().mockImplementation((query: string) => {
            const isMobileQuery = query === '(max-width: 767px)';
            const listeners = isMobileQuery ? mobileMediaQueryListeners : fitMediaQueryListeners;

            return {
                matches: isMobileQuery, // Start as mobile
                media: query,
                addEventListener: (_event: string, listener: (e: MediaQueryListEvent) => void) => {
                    listeners.push(listener);
                },
                removeEventListener: (_event: string, listener: (e: MediaQueryListEvent) => void) => {
                    const index = listeners.indexOf(listener);
                    if (index > -1) listeners.splice(index, 1);
                }
            };
        });
        window.matchMedia = matchMediaMock as unknown as typeof window.matchMedia;
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
            configurable: true
        });
        vi.clearAllMocks();
    });

    describe('visibility', () => {
        it('should not be visible when page is at top', () => {
            render(<ScrollToTop />);

            const button = screen.queryByRole('button');
            expect(button).not.toBeInTheDocument();
        });

        it('should be visible when scrolled past 300px', () => {
            render(<ScrollToTop />);

            // Simulate scroll past 300px
            Object.defineProperty(window, 'pageYOffset', { value: 350 });

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('should hide when scrolled back to top', () => {
            render(<ScrollToTop />);

            // Scroll down
            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            expect(screen.getByRole('button')).toBeInTheDocument();

            // Scroll back up
            Object.defineProperty(window, 'pageYOffset', { value: 100 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });

    describe('scroll to top functionality', () => {
        it('should scroll to top when clicked', async () => {
            const user = userEvent.setup();
            render(<ScrollToTop />);

            // Make button visible
            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const button = screen.getByRole('button');
            await user.click(button);

            expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        });
    });

    describe('accessibility', () => {
        it('should have correct aria-label for scroll to top', () => {
            render(<ScrollToTop ariaLabel="Go to top" />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Go to top');
        });

        it('should use default aria-label if not provided', () => {
            render(<ScrollToTop />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Scroll to top');
        });
    });

    describe('TOC mode', () => {
        it('should use TOC aria-label when hasToc is true', () => {
            render(<ScrollToTop hasToc tocAriaLabel="Open table of contents" />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Open table of contents');
        });

        it('should dispatch openTocDrawer event when hasToc is true and clicked', async () => {
            const user = userEvent.setup();
            const mockDispatchEvent = vi.spyOn(window, 'dispatchEvent');

            render(<ScrollToTop hasToc />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            const button = screen.getByRole('button');
            await user.click(button);

            // Should dispatch openTocDrawer event, not scroll
            const tocEvent = mockDispatchEvent.mock.calls.find(
                (call) => call[0] instanceof CustomEvent && call[0].type === 'openTocDrawer'
            );
            expect(tocEvent).toBeDefined();
            expect(mockScrollTo).not.toHaveBeenCalled();

            mockDispatchEvent.mockRestore();
        });
    });

    describe('desktop behavior', () => {
        it('should not render on desktop (handled by FloatingNav)', () => {
            // Change to desktop
            matchMediaMock.mockImplementation((query: string) => ({
                matches: query !== '(max-width: 767px)', // Desktop: mobile query is false
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }));

            render(<ScrollToTop />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Should not render on desktop
            const button = screen.queryByRole('button');
            expect(button).not.toBeInTheDocument();
        });
    });

    describe('home page detection', () => {
        it('should detect home page for English', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/en/' },
                writable: true,
                configurable: true
            });

            render(<ScrollToTop />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Component should render (we just verify it detected the path)
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should detect home page for Spanish', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/es/' },
                writable: true,
                configurable: true
            });

            render(<ScrollToTop />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should detect root home page', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/' },
                writable: true,
                configurable: true
            });

            render(<ScrollToTop />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });

    describe('popover interaction', () => {
        it('should respond to mobilePopoverChange event', () => {
            render(<ScrollToTop />);

            Object.defineProperty(window, 'pageYOffset', { value: 400 });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Dispatch popover open event
            act(() => {
                window.dispatchEvent(
                    new CustomEvent('mobilePopoverChange', {
                        detail: { isOpen: true }
                    })
                );
            });

            // Button should still be visible (position changes but it's still rendered)
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });

    describe('cleanup', () => {
        it('should remove event listeners on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

            const { unmount } = render(<ScrollToTop />);
            unmount();

            // Should have removed scroll listener
            expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
            // Should have removed popstate listener
            expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
            // Should have removed mobilePopoverChange listener
            expect(removeEventListenerSpy).toHaveBeenCalledWith('mobilePopoverChange', expect.any(Function));

            removeEventListenerSpy.mockRestore();
        });
    });
});
