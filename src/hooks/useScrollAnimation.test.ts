import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useScrollAnimation } from './useScrollAnimation';

// Mock GSAP and ScrollTrigger
vi.mock('../lib/gsap', () => ({
    gsap: {
        from: vi.fn()
    }
}));

describe('useScrollAnimation', () => {
    it('should return a ref object', () => {
        const { result } = renderHook(() => useScrollAnimation('.test-selector'));

        expect(result.current).toBeDefined();
        expect(result.current).toHaveProperty('current');
    });

    it('should return a ref with null as initial value', () => {
        const { result } = renderHook(() => useScrollAnimation('.test-selector'));

        expect(result.current.current).toBeNull();
    });

    it('should accept custom animation options', () => {
        const options = {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        };

        const { result } = renderHook(() => useScrollAnimation('.test-selector', options));

        expect(result.current).toBeDefined();
    });

    it('should use default options when not provided', () => {
        const { result } = renderHook(() => useScrollAnimation('.test-selector'));

        expect(result.current).toBeDefined();
    });

    it('should support generic type parameter for different HTML elements', () => {
        const { result: divResult } = renderHook(() => useScrollAnimation<HTMLDivElement>('.test-selector'));
        const { result: formResult } = renderHook(() => useScrollAnimation<HTMLFormElement>('.test-selector'));

        expect(divResult.current).toBeDefined();
        expect(formResult.current).toBeDefined();
    });
});
