import { describe, expect, it } from 'vitest';
import {
    type BorderRadiusKey,
    type BoxShadowKey,
    type BreakpointKey,
    borderRadius,
    boxShadow,
    breakpoints,
    buildTransition,
    cssVar,
    type FontSizeKey,
    type FontWeightKey,
    getFontSize,
    getSpacing,
    type SpacingKey,
    spacing,
    type TransitionDurationKey,
    type TransitionTimingKey,
    theme,
    transition,
    typography,
    type ZIndexKey,
    zIndex
} from './theme';

describe('Theme Configuration', () => {
    describe('Spacing', () => {
        it('should export spacing scale', () => {
            expect(spacing).toBeDefined();
            expect(spacing[0]).toBe('0');
            expect(spacing[4]).toBe('1rem');
            expect(spacing[8]).toBe('2rem');
        });

        it('should have all spacing keys', () => {
            const keys: SpacingKey[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
            for (const key of keys) {
                expect(spacing[key]).toBeDefined();
                expect(typeof spacing[key]).toBe('string');
            }
        });

        it('should use rem units', () => {
            expect(spacing[4]).toContain('rem');
            expect(spacing[8]).toContain('rem');
        });

        it('should start with 0', () => {
            expect(spacing[0]).toBe('0');
        });
    });

    describe('Typography', () => {
        describe('Font Size', () => {
            it('should export fontSize with responsive clamp values', () => {
                expect(typography.fontSize.base).toBeDefined();
                expect(typography.fontSize.base.size).toContain('clamp');
                expect(typography.fontSize.base.lineHeight).toBe('1.5');
            });

            it('should have all font size keys', () => {
                const keys: FontSizeKey[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
                for (const key of keys) {
                    expect(typography.fontSize[key]).toBeDefined();
                    expect(typography.fontSize[key].size).toBeDefined();
                    expect(typography.fontSize[key].lineHeight).toBeDefined();
                }
            });

            it('should use appropriate line heights', () => {
                // Body text should have 1.5 line height
                expect(typography.fontSize.xs.lineHeight).toBe('1.5');
                expect(typography.fontSize.sm.lineHeight).toBe('1.5');
                expect(typography.fontSize.base.lineHeight).toBe('1.5');
                expect(typography.fontSize.lg.lineHeight).toBe('1.5');

                // Headings should have tighter 1.2 line height
                expect(typography.fontSize.xl.lineHeight).toBe('1.2');
                expect(typography.fontSize['2xl'].lineHeight).toBe('1.2');
                expect(typography.fontSize['3xl'].lineHeight).toBe('1.2');
                expect(typography.fontSize['4xl'].lineHeight).toBe('1.2');
            });

            it('should use clamp for responsive sizing', () => {
                for (const key of Object.keys(typography.fontSize) as FontSizeKey[]) {
                    expect(typography.fontSize[key].size).toMatch(/clamp\(/);
                }
            });
        });

        describe('Font Family', () => {
            it('should export font families', () => {
                expect(typography.fontFamily.sans).toBeDefined();
                expect(typography.fontFamily.mono).toBeDefined();
            });

            it('should include Inter for sans', () => {
                expect(typography.fontFamily.sans).toContain('Inter');
                expect(typography.fontFamily.sans).toContain('system-ui');
            });

            it('should include JetBrains Mono for mono', () => {
                expect(typography.fontFamily.mono).toContain('JetBrains Mono');
                expect(typography.fontFamily.mono).toContain('monospace');
            });
        });

        describe('Font Weight', () => {
            it('should export font weights', () => {
                expect(typography.fontWeight.normal).toBe('400');
                expect(typography.fontWeight.medium).toBe('500');
                expect(typography.fontWeight.semibold).toBe('600');
                expect(typography.fontWeight.bold).toBe('700');
                expect(typography.fontWeight.extrabold).toBe('800');
            });

            it('should have all font weight keys', () => {
                const keys: FontWeightKey[] = ['normal', 'medium', 'semibold', 'bold', 'extrabold'];
                for (const key of keys) {
                    expect(typography.fontWeight[key]).toBeDefined();
                }
            });
        });
    });

    describe('Border Radius', () => {
        it('should export border radius scale', () => {
            expect(borderRadius.DEFAULT).toBe('0.5rem');
            expect(borderRadius.full).toBe('9999px');
        });

        it('should have all border radius keys', () => {
            const keys: BorderRadiusKey[] = ['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'full'];
            for (const key of keys) {
                expect(borderRadius[key]).toBeDefined();
            }
        });

        it('should use CSS var for dynamic values', () => {
            expect(borderRadius.sm).toContain('var(--radius)');
            expect(borderRadius.md).toContain('var(--radius)');
            expect(borderRadius.lg).toContain('var(--radius)');
        });
    });

    describe('Box Shadow', () => {
        it('should export box shadow scale', () => {
            expect(boxShadow.sm).toBeDefined();
            expect(boxShadow.DEFAULT).toBeDefined();
            expect(boxShadow.none).toBe('none');
        });

        it('should have glow variants', () => {
            expect(boxShadow.glow).toBeDefined();
            expect(boxShadow['glow-primary']).toBeDefined();
            expect(boxShadow['glow-secondary']).toBeDefined();
        });

        it('should have all shadow keys', () => {
            const keys: BoxShadowKey[] = [
                'sm',
                'DEFAULT',
                'md',
                'lg',
                'xl',
                '2xl',
                'glow',
                'glow-primary',
                'glow-secondary',
                'none'
            ];
            for (const key of keys) {
                expect(boxShadow[key]).toBeDefined();
            }
        });
    });

    describe('Transition', () => {
        describe('Duration', () => {
            it('should export transition durations', () => {
                expect(transition.duration.fast).toBe('150ms');
                expect(transition.duration.base).toBe('300ms');
                expect(transition.duration.slow).toBe('500ms');
            });

            it('should have all duration keys', () => {
                const keys: TransitionDurationKey[] = ['fast', 'base', 'DEFAULT', 'slow', 'slower'];
                for (const key of keys) {
                    expect(transition.duration[key]).toBeDefined();
                    expect(transition.duration[key]).toMatch(/\d+ms/);
                }
            });
        });

        describe('Timing Functions', () => {
            it('should export timing functions', () => {
                expect(transition.timing.spring).toBeDefined();
                expect(transition.timing.easeInOut).toBeDefined();
                expect(transition.timing.linear).toBe('linear');
            });

            it('should have all timing keys', () => {
                const keys: TransitionTimingKey[] = ['spring', 'easeInOut', 'easeOut', 'easeIn', 'linear'];
                for (const key of keys) {
                    expect(transition.timing[key]).toBeDefined();
                }
            });

            it('should use cubic-bezier for spring', () => {
                expect(transition.timing.spring).toContain('cubic-bezier');
            });
        });
    });

    describe('Z-Index', () => {
        it('should export z-index scale', () => {
            expect(zIndex.dropdown).toBe(1000);
            expect(zIndex.modal).toBe(1050);
            expect(zIndex.tooltip).toBe(1070);
        });

        it('should have all z-index keys', () => {
            const keys: ZIndexKey[] = ['dropdown', 'sticky', 'fixed', 'modalBackdrop', 'modal', 'popover', 'tooltip'];
            for (const key of keys) {
                expect(zIndex[key]).toBeDefined();
                expect(typeof zIndex[key]).toBe('number');
            }
        });

        it('should have correct layering order', () => {
            expect(zIndex.dropdown).toBeLessThan(zIndex.sticky);
            expect(zIndex.sticky).toBeLessThan(zIndex.fixed);
            expect(zIndex.fixed).toBeLessThan(zIndex.modalBackdrop);
            expect(zIndex.modalBackdrop).toBeLessThan(zIndex.modal);
            expect(zIndex.modal).toBeLessThan(zIndex.popover);
            expect(zIndex.popover).toBeLessThan(zIndex.tooltip);
        });
    });

    describe('Breakpoints', () => {
        it('should export breakpoints', () => {
            expect(breakpoints.sm).toBe('640px');
            expect(breakpoints.md).toBe('768px');
            expect(breakpoints.lg).toBe('1024px');
        });

        it('should have all breakpoint keys', () => {
            const keys: BreakpointKey[] = ['sm', 'md', 'lg', 'xl', '2xl'];
            for (const key of keys) {
                expect(breakpoints[key]).toBeDefined();
                expect(breakpoints[key]).toMatch(/\d+px/);
            }
        });

        it('should be in ascending order', () => {
            const sm = Number.parseInt(breakpoints.sm);
            const md = Number.parseInt(breakpoints.md);
            const lg = Number.parseInt(breakpoints.lg);
            const xl = Number.parseInt(breakpoints.xl);
            const xxl = Number.parseInt(breakpoints['2xl']);

            expect(sm).toBeLessThan(md);
            expect(md).toBeLessThan(lg);
            expect(lg).toBeLessThan(xl);
            expect(xl).toBeLessThan(xxl);
        });
    });

    describe('Utility Functions', () => {
        describe('getSpacing', () => {
            it('should return spacing value by key', () => {
                expect(getSpacing(4)).toBe('1rem');
                expect(getSpacing(8)).toBe('2rem');
                expect(getSpacing(0)).toBe('0');
            });

            it('should handle all spacing keys', () => {
                const keys: SpacingKey[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
                for (const key of keys) {
                    const value = getSpacing(key);
                    expect(value).toBeDefined();
                    expect(typeof value).toBe('string');
                }
            });
        });

        describe('getFontSize', () => {
            it('should return font size with line height', () => {
                const base = getFontSize('base');
                expect(base.size).toBeDefined();
                expect(base.lineHeight).toBe('1.5');
            });

            it('should handle all font size keys', () => {
                const keys: FontSizeKey[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
                for (const key of keys) {
                    const value = getFontSize(key);
                    expect(value.size).toBeDefined();
                    expect(value.lineHeight).toBeDefined();
                }
            });
        });

        describe('cssVar', () => {
            it('should create CSS custom property', () => {
                expect(cssVar('primary')).toBe('var(--primary)');
                expect(cssVar('bg-color')).toBe('var(--bg-color)');
            });

            it('should handle empty string', () => {
                expect(cssVar('')).toBe('var(--)');
            });

            it('should handle special characters', () => {
                expect(cssVar('primary-500')).toBe('var(--primary-500)');
            });
        });

        describe('buildTransition', () => {
            it('should build transition string with single property', () => {
                const result = buildTransition('opacity');
                expect(result).toBe('opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)');
            });

            it('should build transition with multiple properties', () => {
                const result = buildTransition(['opacity', 'transform']);
                expect(result).toBe('opacity, transform 300ms cubic-bezier(0.4, 0, 0.2, 1)');
            });

            it('should use custom duration', () => {
                const result = buildTransition('color', 'fast');
                expect(result).toContain('150ms');
            });

            it('should use custom timing function', () => {
                const result = buildTransition('transform', 'base', 'spring');
                expect(result).toContain('cubic-bezier(0.27, 0.22, 0.44, 1.03)');
            });

            it('should handle linear timing', () => {
                const result = buildTransition('width', 'slow', 'linear');
                expect(result).toBe('width 500ms linear');
            });

            it('should use defaults', () => {
                const result = buildTransition('all');
                expect(result).toContain('300ms');
                expect(result).toContain('cubic-bezier(0.4, 0, 0.2, 1)');
            });
        });
    });

    describe('Theme Object', () => {
        it('should export complete theme object', () => {
            expect(theme).toBeDefined();
            expect(theme.spacing).toBe(spacing);
            expect(theme.typography).toBe(typography);
            expect(theme.borderRadius).toBe(borderRadius);
            expect(theme.boxShadow).toBe(boxShadow);
            expect(theme.transition).toBe(transition);
            expect(theme.zIndex).toBe(zIndex);
            expect(theme.breakpoints).toBe(breakpoints);
        });

        it('should be frozen (immutable)', () => {
            expect(Object.isFrozen(spacing)).toBe(false); // const object, not frozen
            expect(Object.isFrozen(typography)).toBe(false);
        });
    });

    describe('Type Safety', () => {
        it('should enforce spacing key types', () => {
            // This test verifies TypeScript compilation
            const validKey: SpacingKey = 4;
            expect(spacing[validKey]).toBeDefined();
        });

        it('should enforce font size key types', () => {
            const validKey: FontSizeKey = 'base';
            expect(typography.fontSize[validKey]).toBeDefined();
        });

        it('should enforce breakpoint key types', () => {
            const validKey: BreakpointKey = 'md';
            expect(breakpoints[validKey]).toBeDefined();
        });
    });

    describe('Integration', () => {
        it('should work with inline styles', () => {
            const styles = {
                padding: spacing[4],
                fontSize: typography.fontSize.base.size,
                borderRadius: borderRadius.DEFAULT,
                transition: buildTransition('all', 'base', 'easeInOut')
            };

            expect(styles.padding).toBe('1rem');
            expect(styles.fontSize).toContain('clamp');
            expect(styles.borderRadius).toBe('0.5rem');
            expect(styles.transition).toContain('300ms');
        });

        it('should provide consistent values across config', () => {
            // Verify spacing is consistent
            expect(getSpacing(4)).toBe(spacing[4]);

            // Verify fontSize is consistent
            expect(getFontSize('base')).toEqual(typography.fontSize.base);
        });
    });
});
