import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from '@/hooks/useTheme';

describe('useTheme', () => {
    let originalClassList: DOMTokenList;
    let originalMutationObserver: typeof MutationObserver;
    let mockClassList: {
        contains: ReturnType<typeof vi.fn>;
        toggle: ReturnType<typeof vi.fn>;
    };
    let mockObserve: ReturnType<typeof vi.fn>;
    let mockDisconnect: ReturnType<typeof vi.fn>;
    let mutationCallback: MutationCallback | null = null;

    beforeEach(() => {
        // Store originals
        originalClassList = document.documentElement.classList;
        originalMutationObserver = window.MutationObserver;

        // Create mock classList
        mockClassList = {
            contains: vi.fn().mockReturnValue(false),
            toggle: vi.fn()
        };

        // Replace classList on documentElement
        Object.defineProperty(document.documentElement, 'classList', {
            value: mockClassList,
            configurable: true
        });

        // Mock localStorage
        const localStorageMock = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn()
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            configurable: true
        });

        // Mock MutationObserver as a class
        mockObserve = vi.fn();
        mockDisconnect = vi.fn();

        class MockMutationObserver {
            constructor(callback: MutationCallback) {
                mutationCallback = callback;
            }
            observe = mockObserve;
            disconnect = mockDisconnect;
            takeRecords = vi.fn().mockReturnValue([]);
        }

        window.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;
    });

    afterEach(() => {
        // Restore originals
        Object.defineProperty(document.documentElement, 'classList', {
            value: originalClassList,
            configurable: true
        });
        window.MutationObserver = originalMutationObserver;
        vi.clearAllMocks();
        mutationCallback = null;
    });

    describe('initial state', () => {
        it('should return isDark as false when dark class is not present', () => {
            mockClassList.contains.mockReturnValue(false);
            const { result } = renderHook(() => useTheme());

            expect(result.current.isDark).toBe(false);
        });

        it('should return isDark as true when dark class is present', () => {
            mockClassList.contains.mockReturnValue(true);
            const { result } = renderHook(() => useTheme());

            expect(result.current.isDark).toBe(true);
        });

        it('should return a toggleTheme function', () => {
            const { result } = renderHook(() => useTheme());

            expect(typeof result.current.toggleTheme).toBe('function');
        });
    });

    describe('MutationObserver setup', () => {
        it('should call observe on MutationObserver on mount', () => {
            renderHook(() => useTheme());

            expect(mockObserve).toHaveBeenCalledTimes(1);
        });

        it('should observe document.documentElement for attribute changes', () => {
            renderHook(() => useTheme());

            expect(mockObserve).toHaveBeenCalledWith(document.documentElement, {
                attributes: true
            });
        });

        it('should disconnect observer on unmount', () => {
            const { unmount } = renderHook(() => useTheme());

            unmount();

            expect(mockDisconnect).toHaveBeenCalledTimes(1);
        });
    });

    describe('toggleTheme', () => {
        it('should toggle dark class on documentElement', () => {
            mockClassList.contains.mockReturnValue(false);
            const { result } = renderHook(() => useTheme());

            act(() => {
                result.current.toggleTheme();
            });

            expect(mockClassList.toggle).toHaveBeenCalledWith('dark');
        });

        it('should save light theme to localStorage when switching from dark', () => {
            mockClassList.contains.mockReturnValue(true);
            const { result } = renderHook(() => useTheme());

            act(() => {
                result.current.toggleTheme();
            });

            expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
        });

        it('should save dark theme to localStorage when switching from light', () => {
            mockClassList.contains.mockReturnValue(false);
            const { result } = renderHook(() => useTheme());

            act(() => {
                result.current.toggleTheme();
            });

            expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
        });

        it('should update isDark state after toggle', () => {
            mockClassList.contains.mockReturnValue(false);
            const { result } = renderHook(() => useTheme());

            expect(result.current.isDark).toBe(false);

            act(() => {
                result.current.toggleTheme();
            });

            expect(result.current.isDark).toBe(true);
        });
    });

    describe('mutation observer callback', () => {
        it('should update isDark when class attribute changes', () => {
            mockClassList.contains.mockReturnValue(false);
            const { result } = renderHook(() => useTheme());

            expect(result.current.isDark).toBe(false);

            // Simulate class change
            mockClassList.contains.mockReturnValue(true);

            act(() => {
                if (mutationCallback) {
                    mutationCallback([{ attributeName: 'class' } as MutationRecord], {} as MutationObserver);
                }
            });

            expect(result.current.isDark).toBe(true);
        });

        it('should not update state when non-class attribute changes', () => {
            mockClassList.contains.mockReturnValue(false);
            const { result } = renderHook(() => useTheme());

            const initialIsDark = result.current.isDark;

            act(() => {
                if (mutationCallback) {
                    mutationCallback([{ attributeName: 'id' } as MutationRecord], {} as MutationObserver);
                }
            });

            expect(result.current.isDark).toBe(initialIsDark);
        });
    });

    describe('callback stability', () => {
        it('should update toggleTheme callback when isDark changes', () => {
            mockClassList.contains.mockReturnValue(false);
            const { result, rerender } = renderHook(() => useTheme());

            const firstToggle = result.current.toggleTheme;

            // Toggle theme to change isDark
            act(() => {
                result.current.toggleTheme();
            });

            rerender();

            const secondToggle = result.current.toggleTheme;

            // Callback should be different because it depends on isDark
            expect(firstToggle).not.toBe(secondToggle);
        });
    });
});
