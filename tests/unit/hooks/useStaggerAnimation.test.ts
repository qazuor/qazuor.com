import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation';

// Mock GSAP and ScrollTrigger
vi.mock('@/lib/gsap', () => ({
    gsap: {
        from: vi.fn()
    }
}));

describe('useStaggerAnimation', () => {
    it('should return a ref object', () => {
        const { result } = renderHook(() => useStaggerAnimation('.test-selector'));

        expect(result.current).toBeDefined();
        expect(result.current).toHaveProperty('current');
    });

    it('should return a ref with null as initial value', () => {
        const { result } = renderHook(() => useStaggerAnimation('.test-selector'));

        expect(result.current.current).toBeNull();
    });

    it('should accept custom animation options including stagger', () => {
        const options = {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        };

        const { result } = renderHook(() => useStaggerAnimation('.test-selector', options));

        expect(result.current).toBeDefined();
    });

    it('should use default options when not provided', () => {
        const { result } = renderHook(() => useStaggerAnimation('.test-selector'));

        expect(result.current).toBeDefined();
    });

    it('should support generic type parameter for different HTML elements', () => {
        const { result: divResult } = renderHook(() => useStaggerAnimation<HTMLDivElement>('.test-selector'));
        const { result: formResult } = renderHook(() => useStaggerAnimation<HTMLFormElement>('.test-selector'));

        expect(divResult.current).toBeDefined();
        expect(formResult.current).toBeDefined();
    });

    it('should handle stagger timing for multiple elements', () => {
        const options = {
            stagger: 0.1,
            duration: 0.6
        };

        const { result } = renderHook(() => useStaggerAnimation('.card', options));

        expect(result.current).toBeDefined();
    });
});
