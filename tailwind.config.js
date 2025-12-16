import { tailwindColorScales } from './src/config/themeConfig.ts';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // ===========================================
                // COLOR SCALES - Generated from themeConfig.ts
                // To change colors, edit src/config/themeConfig.ts
                // ===========================================
                primary: tailwindColorScales.primary,
                secondary: tailwindColorScales.secondary,
                tertiary: tailwindColorScales.tertiary,
                accent: tailwindColorScales.accent,
                // Aliases for legacy code
                emerald: tailwindColorScales.primary,
                teal: tailwindColorScales.tertiary,
                cyan: tailwindColorScales.tertiary,
                background: {
                    DEFAULT: 'hsl(var(--background))',
                    secondary: 'oklch(var(--bg-secondary) / <alpha-value>)',
                    tertiary: 'oklch(var(--bg-tertiary) / <alpha-value>)'
                },
                foreground: {
                    DEFAULT: 'hsl(var(--foreground))',
                    muted: 'oklch(var(--text-muted) / <alpha-value>)',
                    secondary: 'oklch(var(--text-secondary) / <alpha-value>)'
                },
                success: 'oklch(0.70 0.18 150 / <alpha-value>)',
                warning: 'oklch(0.75 0.20 80 / <alpha-value>)',
                error: 'oklch(0.60 0.25 20 / <alpha-value>)',
                syntax: {
                    keyword: 'oklch(0.65 0.20 330 / <alpha-value>)',
                    string: 'oklch(0.75 0.15 90 / <alpha-value>)',
                    number: 'oklch(0.70 0.18 40 / <alpha-value>)',
                    comment: 'oklch(0.55 0.05 210 / <alpha-value>)'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace']
            },
            fontSize: {
                xs: [
                    'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
                    {
                        lineHeight: '1.5'
                    }
                ],
                sm: [
                    'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
                    {
                        lineHeight: '1.5'
                    }
                ],
                base: [
                    'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
                    {
                        lineHeight: '1.5'
                    }
                ],
                lg: [
                    'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
                    {
                        lineHeight: '1.5'
                    }
                ],
                xl: [
                    'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
                    {
                        lineHeight: '1.2'
                    }
                ],
                '2xl': [
                    'clamp(2rem, 1.6rem + 2vw, 3rem)',
                    {
                        lineHeight: '1.2'
                    }
                ],
                '3xl': [
                    'clamp(2.5rem, 2rem + 2.5vw, 4rem)',
                    {
                        lineHeight: '1.2'
                    }
                ],
                '4xl': [
                    'clamp(3rem, 2.5rem + 2.5vw, 5rem)',
                    {
                        lineHeight: '1.2'
                    }
                ]
            },
            spacing: {
                1: '0.25rem',
                2: '0.5rem',
                3: '0.75rem',
                4: '1rem',
                5: '1.25rem',
                6: '1.5rem',
                8: '2rem',
                10: '2.5rem',
                12: '3rem',
                16: '4rem',
                20: '5rem',
                24: '6rem',
                32: '8rem'
            },
            borderRadius: {
                sm: 'calc(var(--radius) - 4px)',
                DEFAULT: '0.5rem',
                md: 'calc(var(--radius) - 2px)',
                lg: 'var(--radius)',
                xl: '1rem',
                '2xl': '1.5rem',
                full: '9999px'
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                glow: '0 0 20px rgb(16 185 129 / 0.3)',
                'glow-primary': '0 0 20px oklch(0.55 0.22 160 / 0.3)',
                'glow-secondary': '0 0 20px oklch(0.70 0.18 160 / 0.3)',
                dropdown: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -1px rgb(0 0 0 / 0.05)'
            },
            transitionDuration: {
                fast: '150ms',
                base: '300ms',
                DEFAULT: '300ms',
                slow: '500ms',
                slower: '700ms'
            },
            transitionTimingFunction: {
                spring: 'cubic-bezier(0.27, 0.22, 0.44, 1.03)'
            },
            keyframes: {
                slideInDropdown: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-8px) translateX(0)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0) translateX(0)'
                    }
                },
                slideInDropdownCentered: {
                    '0%': {
                        opacity: '0',
                        translate: '0 -8px'
                    },
                    '100%': {
                        opacity: '1',
                        translate: '0 0'
                    }
                }
            },
            animation: {
                slideInDropdown: 'slideInDropdown 550ms cubic-bezier(0.17, 0.67, 0.51, 1)',
                slideInDropdownCentered: 'slideInDropdownCentered 550ms cubic-bezier(0.17, 0.67, 0.51, 1)'
            },
            backgroundImage: {
                // Radial gradient that works with from-*/via-*/to-* modifiers
                'gradient-radial':
                    'radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to))'
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
};
