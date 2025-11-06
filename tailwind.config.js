/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors - Purple/Teal Scheme (OKLch)
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          50: 'oklch(0.95 0.05 270 / <alpha-value>)',
          100: 'oklch(0.90 0.08 270 / <alpha-value>)',
          200: 'oklch(0.80 0.12 270 / <alpha-value>)',
          300: 'oklch(0.70 0.16 270 / <alpha-value>)',
          400: 'oklch(0.60 0.20 270 / <alpha-value>)',
          500: 'oklch(0.55 0.22 270 / <alpha-value>)', // Default
          600: 'oklch(0.50 0.24 270 / <alpha-value>)',
          700: 'oklch(0.45 0.22 270 / <alpha-value>)',
          800: 'oklch(0.35 0.18 270 / <alpha-value>)',
          900: 'oklch(0.25 0.12 270 / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          50: 'oklch(0.95 0.04 180 / <alpha-value>)',
          100: 'oklch(0.90 0.08 180 / <alpha-value>)',
          200: 'oklch(0.85 0.12 180 / <alpha-value>)',
          300: 'oklch(0.78 0.15 180 / <alpha-value>)',
          400: 'oklch(0.72 0.17 180 / <alpha-value>)',
          500: 'oklch(0.70 0.18 180 / <alpha-value>)', // Default
          600: 'oklch(0.65 0.18 180 / <alpha-value>)',
          700: 'oklch(0.55 0.16 180 / <alpha-value>)',
          800: 'oklch(0.45 0.14 180 / <alpha-value>)',
          900: 'oklch(0.35 0.10 180 / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          50: 'oklch(0.95 0.05 330 / <alpha-value>)',
          100: 'oklch(0.90 0.08 330 / <alpha-value>)',
          200: 'oklch(0.82 0.12 330 / <alpha-value>)',
          300: 'oklch(0.75 0.16 330 / <alpha-value>)',
          400: 'oklch(0.68 0.18 330 / <alpha-value>)',
          500: 'oklch(0.65 0.20 330 / <alpha-value>)', // Default
          600: 'oklch(0.60 0.22 330 / <alpha-value>)',
          700: 'oklch(0.52 0.20 330 / <alpha-value>)',
          800: 'oklch(0.42 0.16 330 / <alpha-value>)',
          900: 'oklch(0.32 0.12 330 / <alpha-value>)',
        },
        // Background Colors
        background: {
          DEFAULT: 'oklch(var(--bg-primary) / <alpha-value>)',
          primary: 'oklch(var(--bg-primary) / <alpha-value>)',
          secondary: 'oklch(var(--bg-secondary) / <alpha-value>)',
          tertiary: 'oklch(var(--bg-tertiary) / <alpha-value>)',
        },
        // Text Colors
        foreground: {
          DEFAULT: 'oklch(var(--text-primary) / <alpha-value>)',
          primary: 'oklch(var(--text-primary) / <alpha-value>)',
          secondary: 'oklch(var(--text-secondary) / <alpha-value>)',
          muted: 'oklch(var(--text-muted) / <alpha-value>)',
        },
        // Functional Colors
        success: 'oklch(0.70 0.18 150 / <alpha-value>)',
        warning: 'oklch(0.75 0.20 80 / <alpha-value>)',
        error: 'oklch(0.60 0.25 20 / <alpha-value>)',
        // Syntax Highlighting
        syntax: {
          keyword: 'oklch(0.65 0.20 330 / <alpha-value>)',
          string: 'oklch(0.75 0.15 90 / <alpha-value>)',
          number: 'oklch(0.70 0.18 40 / <alpha-value>)',
          comment: 'oklch(0.55 0.05 270 / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.5' }],
        sm: ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', { lineHeight: '1.5' }],
        base: ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.5' }],
        lg: ['clamp(1.125rem, 1rem + 0.625vw, 1.5rem)', { lineHeight: '1.5' }],
        xl: ['clamp(1.5rem, 1.3rem + 1vw, 2rem)', { lineHeight: '1.2' }],
        '2xl': ['clamp(2rem, 1.6rem + 2vw, 3rem)', { lineHeight: '1.2' }],
        '3xl': ['clamp(2.5rem, 2rem + 2.5vw, 4rem)', { lineHeight: '1.2' }],
        '4xl': ['clamp(3rem, 2.5rem + 2.5vw, 5rem)', { lineHeight: '1.2' }],
      },
      spacing: {
        1: '0.25rem', // 4px
        2: '0.5rem', // 8px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        8: '2rem', // 32px
        10: '2.5rem', // 40px
        12: '3rem', // 48px
        16: '4rem', // 64px
        20: '5rem', // 80px
        24: '6rem', // 96px
        32: '8rem', // 128px
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        glow: '0 0 20px rgb(22 242 179 / 0.3)',
        'glow-primary': '0 0 20px oklch(0.55 0.22 270 / 0.3)',
        'glow-secondary': '0 0 20px oklch(0.70 0.18 180 / 0.3)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        DEFAULT: '300ms',
        slow: '500ms',
        slower: '700ms',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.27, 0.22, 0.44, 1.03)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
