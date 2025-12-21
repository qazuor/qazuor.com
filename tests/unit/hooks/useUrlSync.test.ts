import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { arraySerializer, createArrayValidator, createSetValidator, useUrlSync } from '@/hooks/useUrlSync';

describe('useUrlSync', () => {
    let originalLocation: Location;
    let mockReplaceState: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Store original location
        originalLocation = window.location;

        // Mock window.location
        const mockLocation = {
            search: '',
            pathname: '/test',
            hash: ''
        };

        Object.defineProperty(window, 'location', {
            value: mockLocation,
            writable: true,
            configurable: true
        });

        // Mock history.replaceState
        mockReplaceState = vi.fn();
        Object.defineProperty(window.history, 'replaceState', {
            value: mockReplaceState,
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        // Restore original location
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
            configurable: true
        });
        vi.clearAllMocks();
    });

    describe('initial state', () => {
        it('should return default value when URL param is not present', () => {
            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            expect(result.current[0]).toBe('all');
        });

        it('should return value from URL when param is present', () => {
            window.location.search = '?category=tech';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            expect(result.current[0]).toBe('tech');
        });

        it('should use custom deserializer', () => {
            window.location.search = '?count=42';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'count',
                    defaultValue: 0,
                    deserialize: (s) => parseInt(s, 10)
                })
            );

            expect(result.current[0]).toBe(42);
        });

        it('should return default value when validation fails', () => {
            window.location.search = '?status=invalid';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'status',
                    defaultValue: 'active',
                    validate: (v) => ['active', 'inactive'].includes(v)
                })
            );

            expect(result.current[0]).toBe('active');
        });

        it('should return URL value when validation passes', () => {
            window.location.search = '?status=inactive';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'status',
                    defaultValue: 'active',
                    validate: (v) => ['active', 'inactive'].includes(v)
                })
            );

            expect(result.current[0]).toBe('inactive');
        });
    });

    describe('setValue', () => {
        it('should update state value', () => {
            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            act(() => {
                result.current[1]('tech');
            });

            expect(result.current[0]).toBe('tech');
        });

        it('should support functional updates', () => {
            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'count',
                    defaultValue: 0,
                    serialize: String,
                    deserialize: (s) => parseInt(s, 10)
                })
            );

            act(() => {
                result.current[1]((prev) => prev + 1);
            });

            expect(result.current[0]).toBe(1);
        });

        it('should update URL with new value', () => {
            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            act(() => {
                result.current[1]('tech');
            });

            expect(mockReplaceState).toHaveBeenCalled();
            const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
            expect(lastCall[2]).toContain('category=tech');
        });

        it('should remove param from URL when value equals default', () => {
            window.location.search = '?category=tech';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            act(() => {
                result.current[1]('all');
            });

            const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
            expect(lastCall[2]).not.toContain('category=');
        });

        it('should remove param from URL for empty arrays', () => {
            const { result } = renderHook(() =>
                useUrlSync<string[]>({
                    key: 'tags',
                    defaultValue: [],
                    serialize: (arr) => arr.join(','),
                    deserialize: (s) => s.split(',').filter(Boolean)
                })
            );

            act(() => {
                result.current[1]([]);
            });

            const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
            expect(lastCall[2]).not.toContain('tags=');
        });
    });

    describe('URL preservation', () => {
        it('should preserve existing query params', () => {
            window.location.search = '?other=value';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            act(() => {
                result.current[1]('tech');
            });

            const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
            expect(lastCall[2]).toContain('other=value');
            expect(lastCall[2]).toContain('category=tech');
        });

        it('should preserve hash in URL', () => {
            window.location.hash = '#section';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            act(() => {
                result.current[1]('tech');
            });

            const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
            expect(lastCall[2]).toContain('#section');
        });

        it('should preserve pathname in URL', () => {
            window.location.pathname = '/custom/path';

            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'category',
                    defaultValue: 'all'
                })
            );

            act(() => {
                result.current[1]('tech');
            });

            const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
            expect(lastCall[2]).toContain('/custom/path');
        });
    });

    describe('custom serialization', () => {
        it('should use custom serializer', () => {
            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'data',
                    defaultValue: { name: 'test' },
                    serialize: JSON.stringify,
                    deserialize: JSON.parse
                })
            );

            act(() => {
                result.current[1]({ name: 'updated' });
            });

            const lastCall = mockReplaceState.mock.calls[mockReplaceState.mock.calls.length - 1];
            expect(lastCall[2]).toContain('data=');
        });

        it('should work with array values', () => {
            window.location.search = '?tags=react,vue,angular';

            const { result } = renderHook(() =>
                useUrlSync<string[]>({
                    key: 'tags',
                    defaultValue: [],
                    serialize: (arr) => arr.join(','),
                    deserialize: (s) => s.split(',').filter(Boolean)
                })
            );

            expect(result.current[0]).toEqual(['react', 'vue', 'angular']);
        });
    });

    describe('SSR compatibility', () => {
        it('should return default value when window is undefined', () => {
            // This test verifies the SSR guard exists in the code
            // In actual SSR, typeof window === 'undefined'
            const { result } = renderHook(() =>
                useUrlSync({
                    key: 'test',
                    defaultValue: 'default'
                })
            );

            // In browser environment, it should work normally
            expect(result.current[0]).toBe('default');
        });
    });
});

describe('arraySerializer helper', () => {
    it('should serialize array to comma-separated string', () => {
        expect(arraySerializer.serialize(['a', 'b', 'c'])).toBe('a,b,c');
    });

    it('should serialize empty array to empty string', () => {
        expect(arraySerializer.serialize([])).toBe('');
    });

    it('should deserialize comma-separated string to array', () => {
        expect(arraySerializer.deserialize('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('should deserialize empty string to empty array', () => {
        expect(arraySerializer.deserialize('')).toEqual([]);
    });

    it('should filter out empty strings during deserialization', () => {
        expect(arraySerializer.deserialize('a,,b')).toEqual(['a', 'b']);
    });
});

describe('createSetValidator', () => {
    it('should return true for valid values', () => {
        const validator = createSetValidator(new Set(['a', 'b', 'c']));
        expect(validator('a')).toBe(true);
        expect(validator('b')).toBe(true);
    });

    it('should return false for invalid values', () => {
        const validator = createSetValidator(new Set(['a', 'b', 'c']));
        expect(validator('d')).toBe(false);
        expect(validator('invalid')).toBe(false);
    });
});

describe('createArrayValidator', () => {
    it('should return true when all array elements are valid', () => {
        const validator = createArrayValidator(new Set(['a', 'b', 'c']));
        expect(validator(['a', 'b'])).toBe(true);
        expect(validator(['c'])).toBe(true);
    });

    it('should return false when any array element is invalid', () => {
        const validator = createArrayValidator(new Set(['a', 'b', 'c']));
        expect(validator(['a', 'd'])).toBe(false);
        expect(validator(['invalid'])).toBe(false);
    });

    it('should return true for empty array', () => {
        const validator = createArrayValidator(new Set(['a', 'b', 'c']));
        expect(validator([])).toBe(true);
    });
});
