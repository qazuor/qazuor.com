/**
 * Theme Configuration - SINGLE SOURCE OF TRUTH
 *
 * All theme-dependent CSS variables are defined here.
 * This file is used by:
 * - BaseLayout.astro: Critical CSS inline (subset for above-the-fold)
 * - theme-generator integration: Generates complete theme CSS file
 *
 * IMPORTANT: When changing palettes, ONLY edit this file.
 * Run `pnpm dev` or `pnpm build` to regenerate CSS.
 *
 * Variable format: HSL values without wrapper (e.g., "215 28% 7%")
 * RGB format: Comma-separated (e.g., "59, 130, 246")
 * Hex format: With hash (e.g., "#3b82f6")
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/** Critical variables needed for above-the-fold (prevents FOUC) */
export interface CriticalThemeVars {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    background: string;
    foreground: string;
    primary: string;
}

/** Shadcn/ui compatible variables */
export interface ShadcnThemeVars {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    inputFieldBg: string;
}

/** Brand/accent colors in RGB format for rgba() usage */
export interface ColorRGBVars {
    colorPrimary: string;
    colorPrimaryDark: string;
    colorPrimaryFull: string;
    colorPrimaryDarkFull: string;
    colorSecondary: string;
    colorSecondaryDark: string;
    colorSecondaryFull: string;
    colorSecondaryDarkFull: string;
    colorTertiary: string;
    colorTertiaryDark: string;
    colorTertiaryFull: string;
    colorTertiaryDarkFull: string;
}

/** UI semantic colors */
export interface UIColorVars {
    colorUiInfo: string;
    colorUiInfoFull: string;
    colorUiWarning: string;
    colorUiWarningFull: string;
    colorUiError: string;
    colorUiErrorFull: string;
    colorUiSuccess: string;
    colorUiSuccessFull: string;
    colorUiTip: string;
    colorUiTipFull: string;
    colorUiQuote: string;
    colorUiQuoteFull: string;
}

/** Section background glow colors */
export interface GlowVars {
    sectionBackgroundGlowFrom: string;
    sectionBackgroundGlowVia: string;
    sectionBackgroundGlowTo: string;
}

/** Divider gradient colors */
export interface DividerVars {
    dividerPrimary: string;
    dividerSecondary: string;
    dividerAccent: string;
}

/** Testimonial section colors */
export interface TestimonialVars {
    testimonialAccent: string;
    testimonialAccentLight: string;
    testimonialAccentDark: string;
    testimonialAccentFull: string;
    testimonialAccentLightFull: string;
    testimonialText: string;
    testimonialTextSecondary: string;
    testimonialTextMuted: string;
    testimonialCardBg: string;
    testimonialCardBgTinted: string;
    testimonialFocus: string;
}

/** Timeline gradient colors */
export interface TimelineVars {
    colorTimelineBlueFrom: string;
    colorTimelineBlueTo: string;
    colorTimelineEmeraldFrom: string;
    colorTimelineEmeraldTo: string;
    colorTimelineAmberFrom: string;
    colorTimelineAmberTo: string;
    colorTimelineSteelFrom: string;
    colorTimelineSteelTo: string;
    colorTimelineCyanFrom: string;
    colorTimelineCyanTo: string;
}

/** Social icon colors */
export interface SocialIconVars {
    socialIcon: string;
    socialIconHover: string;
}

/** Mermaid diagram colors */
export interface MermaidVars {
    mermaidPrimary: string;
    mermaidSecondary: string;
    mermaidBackground: string;
    mermaidBorder: string;
    mermaidText: string;
}

/** Tooltip colors */
export interface TooltipVars {
    tooltipBg: string;
    tooltipText: string;
    tooltipBorder: string;
}

/** Syntax highlighting colors */
export interface SyntaxVars {
    syntaxKeyword: string;
    syntaxString: string;
    syntaxNumber: string;
    syntaxComment: string;
}

/** Chart colors */
export interface ChartVars {
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
}

/** Text colors in hex format (for OG images and non-CSS usage) */
export interface TextColors {
    default: string;
    muted: string;
    subtle: string;
}

/** Complete theme configuration */
export interface ThemeConfig {
    critical: CriticalThemeVars;
    shadcn: ShadcnThemeVars;
    colors: ColorRGBVars;
    ui: UIColorVars;
    glow: GlowVars;
    dividers: DividerVars;
    testimonials: TestimonialVars;
    timeline: TimelineVars;
    socialIcons: SocialIconVars;
    mermaid: MermaidVars;
    tooltips: TooltipVars;
    syntax: SyntaxVars;
    charts: ChartVars;
    /** Text colors in hex format (for OG images, non-CSS usage) */
    textColors: TextColors;
}

// ============================================
// LIGHT THEME - Ocean Depths
// ============================================

export const lightTheme: ThemeConfig = {
    critical: {
        bgPrimary: '219 21% 96%',
        bgSecondary: '219 21% 94%',
        bgTertiary: '219 21% 92%',
        textPrimary: '215 25% 15%',
        textSecondary: '215 20% 22%',
        textMuted: '215 15% 28%',
        background: '219 21% 94%',
        foreground: '215 25% 15%',
        primary: '200 100% 36%'
    },
    shadcn: {
        background: '219 21% 94%',
        foreground: '215 25% 15%',
        card: '220 20% 96%',
        cardForeground: '215 25% 15%',
        popover: '220 20% 98%',
        popoverForeground: '215 25% 15%',
        primary: '200 100% 36%',
        primaryForeground: '0 0% 100%',
        secondary: '190 100% 42%',
        secondaryForeground: '215 25% 15%',
        muted: '215 15% 88%',
        mutedForeground: '215 15% 28%',
        accent: '200 100% 36%',
        accentForeground: '0 0% 100%',
        destructive: '0 84.2% 60.2%',
        destructiveForeground: '0 0% 98%',
        border: '215 15% 82%',
        input: '215 15% 90%',
        ring: '200 100% 36%',
        inputFieldBg: 'rgba(0, 0, 0, 0.07)'
    },
    colors: {
        colorPrimary: '0, 119, 182',
        colorPrimaryDark: '0, 95, 146',
        colorPrimaryFull: 'rgb(0, 119, 182)',
        colorPrimaryDarkFull: 'rgb(0, 95, 146)',
        colorSecondary: '0, 180, 216',
        colorSecondaryDark: '0, 150, 180',
        colorSecondaryFull: 'rgb(0, 180, 216)',
        colorSecondaryDarkFull: 'rgb(0, 150, 180)',
        colorTertiary: '255, 107, 107',
        colorTertiaryDark: '229, 90, 90',
        colorTertiaryFull: 'rgb(255, 107, 107)',
        colorTertiaryDarkFull: 'rgb(229, 90, 90)'
    },
    ui: {
        colorUiInfo: '59, 130, 246',
        colorUiInfoFull: 'rgb(59, 130, 246)',
        colorUiWarning: '245, 158, 11',
        colorUiWarningFull: 'rgb(245, 158, 11)',
        colorUiError: '239, 68, 68',
        colorUiErrorFull: 'rgb(239, 68, 68)',
        colorUiSuccess: '16, 185, 129',
        colorUiSuccessFull: 'rgb(16, 185, 129)',
        colorUiTip: '59, 130, 246',
        colorUiTipFull: 'rgb(59, 130, 246)',
        colorUiQuote: '6, 182, 212',
        colorUiQuoteFull: 'rgb(6, 182, 212)'
    },
    glow: {
        sectionBackgroundGlowFrom: '#295ca3',
        sectionBackgroundGlowVia: '#d3d8de',
        sectionBackgroundGlowTo: '#3980c6'
    },
    dividers: {
        dividerPrimary: '#0077B6',
        dividerSecondary: '#00B4D8',
        dividerAccent: '#48CAE4'
    },
    testimonials: {
        testimonialAccent: '6, 182, 212',
        testimonialAccentLight: '56, 189, 248',
        testimonialAccentDark: '8, 145, 178',
        testimonialAccentFull: '#06b6d4',
        testimonialAccentLightFull: '#38bdf8',
        testimonialText: '15, 23, 42',
        testimonialTextSecondary: '30, 41, 59',
        testimonialTextMuted: '51, 65, 85',
        testimonialCardBg: '255, 255, 255',
        testimonialCardBgTinted: '240, 249, 255',
        testimonialFocus: '59, 130, 246'
    },
    timeline: {
        colorTimelineBlueFrom: '#2563eb',
        colorTimelineBlueTo: '#1d4ed8',
        colorTimelineEmeraldFrom: '#059669',
        colorTimelineEmeraldTo: '#047857',
        colorTimelineAmberFrom: '#d97706',
        colorTimelineAmberTo: '#b45309',
        colorTimelineSteelFrom: '#2563eb',
        colorTimelineSteelTo: '#1d4ed8',
        colorTimelineCyanFrom: '#0891b2',
        colorTimelineCyanTo: '#0e7490'
    },
    socialIcons: {
        socialIcon: '75, 85, 99',
        socialIconHover: '17, 24, 39'
    },
    mermaid: {
        mermaidPrimary: '#3b82f6',
        mermaidSecondary: '#0891b2',
        mermaidBackground: '#f1f5f9',
        mermaidBorder: '#e2e8f0',
        mermaidText: '#1f2937'
    },
    tooltips: {
        tooltipBg: '31, 41, 55',
        tooltipText: '243, 244, 246',
        tooltipBorder: '31, 41, 55'
    },
    syntax: {
        syntaxKeyword: '215 70% 50%',
        syntaxString: '120 40% 45%',
        syntaxNumber: '40 70% 45%',
        syntaxComment: '215 15% 45%'
    },
    charts: {
        chart1: '200 100% 36%',
        chart2: '200 60% 45%',
        chart3: '190 50% 55%',
        chart4: '43 74% 66%',
        chart5: '27 87% 67%'
    },
    textColors: {
        default: '#1e293b',
        muted: '#475569',
        subtle: '#64748b'
    }
};

// ============================================
// DARK THEME - Slate Steel (GitHub Dark Style)
// ============================================

export const darkTheme: ThemeConfig = {
    critical: {
        bgPrimary: '215 28% 7%',
        bgSecondary: '215 23% 11%',
        bgTertiary: '215 19% 13%',
        textPrimary: '210 15% 95%',
        textSecondary: '215 12% 75%',
        textMuted: '215 10% 55%',
        background: '215 28% 7%',
        foreground: '210 15% 95%',
        primary: '215 80% 60%'
    },
    shadcn: {
        background: '215 28% 7%',
        foreground: '210 15% 95%',
        card: '215 23% 11%',
        cardForeground: '210 15% 95%',
        popover: '215 23% 11%',
        popoverForeground: '210 15% 95%',
        primary: '215 80% 60%',
        primaryForeground: '215 28% 7%',
        secondary: '185 70% 45%',
        secondaryForeground: '210 15% 95%',
        muted: '215 16% 15%',
        mutedForeground: '215 12% 70%',
        accent: '185 70% 50%',
        accentForeground: '215 28% 7%',
        destructive: '0 62.8% 30.6%',
        destructiveForeground: '0 0% 98%',
        border: '215 16% 22%',
        input: '215 16% 15%',
        ring: '215 80% 60%',
        inputFieldBg: 'rgba(255, 255, 255, 0.08)'
    },
    colors: {
        colorPrimary: '59, 130, 246',
        colorPrimaryDark: '37, 99, 235',
        colorPrimaryFull: 'rgb(59, 130, 246)',
        colorPrimaryDarkFull: 'rgb(37, 99, 235)',
        colorSecondary: '148, 163, 184',
        colorSecondaryDark: '100, 116, 139',
        colorSecondaryFull: 'rgb(148, 163, 184)',
        colorSecondaryDarkFull: 'rgb(100, 116, 139)',
        colorTertiary: '6, 182, 212',
        colorTertiaryDark: '8, 145, 178',
        colorTertiaryFull: 'rgb(6, 182, 212)',
        colorTertiaryDarkFull: 'rgb(8, 145, 178)'
    },
    ui: {
        colorUiInfo: '96, 165, 250',
        colorUiInfoFull: 'rgb(96, 165, 250)',
        colorUiWarning: '251, 191, 36',
        colorUiWarningFull: 'rgb(251, 191, 36)',
        colorUiError: '248, 113, 113',
        colorUiErrorFull: 'rgb(248, 113, 113)',
        colorUiSuccess: '52, 211, 153',
        colorUiSuccessFull: 'rgb(52, 211, 153)',
        colorUiTip: '96, 165, 250',
        colorUiTipFull: 'rgb(96, 165, 250)',
        colorUiQuote: '34, 211, 238',
        colorUiQuoteFull: 'rgb(34, 211, 238)'
    },
    glow: {
        sectionBackgroundGlowFrom: '#3b82f6',
        sectionBackgroundGlowVia: '#1c2128',
        sectionBackgroundGlowTo: '#06b6d4'
    },
    dividers: {
        dividerPrimary: '#3b82f6',
        dividerSecondary: '#60a5fa',
        dividerAccent: '#06b6d4'
    },
    testimonials: {
        testimonialAccent: '59, 130, 246',
        testimonialAccentLight: '6, 182, 212',
        testimonialAccentDark: '37, 99, 235',
        testimonialAccentFull: 'rgb(59, 130, 246)',
        testimonialAccentLightFull: 'rgb(6, 182, 212)',
        testimonialText: '243, 244, 246',
        testimonialTextSecondary: '209, 213, 219',
        testimonialTextMuted: '156, 163, 175',
        testimonialCardBg: '22, 27, 34',
        testimonialCardBgTinted: '13, 17, 23',
        testimonialFocus: '96, 165, 250'
    },
    timeline: {
        colorTimelineBlueFrom: '#60a5fa',
        colorTimelineBlueTo: '#3b82f6',
        colorTimelineEmeraldFrom: '#34d399',
        colorTimelineEmeraldTo: '#10b981',
        colorTimelineAmberFrom: '#fbbf24',
        colorTimelineAmberTo: '#f59e0b',
        colorTimelineSteelFrom: '#60a5fa',
        colorTimelineSteelTo: '#3b82f6',
        colorTimelineCyanFrom: '#22d3ee',
        colorTimelineCyanTo: '#06b6d4'
    },
    socialIcons: {
        socialIcon: '156, 163, 175',
        socialIconHover: '229, 231, 235'
    },
    mermaid: {
        mermaidPrimary: '#10b981',
        mermaidSecondary: '#22d3ee',
        mermaidBackground: '#1e293b',
        mermaidBorder: '#334155',
        mermaidText: '#f3f4f6'
    },
    tooltips: {
        tooltipBg: '55, 65, 81',
        tooltipText: '229, 231, 235',
        tooltipBorder: '55, 65, 81'
    },
    syntax: {
        syntaxKeyword: '215 70% 65%',
        syntaxString: '120 40% 70%',
        syntaxNumber: '40 70% 70%',
        syntaxComment: '215 15% 55%'
    },
    charts: {
        chart1: '215 80% 60%',
        chart2: '185 70% 50%',
        chart3: '10 80% 65%',
        chart4: '185 60% 45%',
        chart5: '215 55% 50%'
    },
    textColors: {
        default: '#e2e8f0',
        muted: '#94a3b8',
        subtle: '#64748b'
    }
};

// ============================================
// CSS GENERATION FUNCTIONS
// ============================================

/**
 * Converts camelCase to kebab-case CSS variable name
 */
function toKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generates CSS variables from a flat object
 */
function generateVarsFromObject(obj: Record<string, string>, prefix = ''): string {
    return Object.entries(obj)
        .map(([key, value]) => {
            const varName = prefix ? `--${prefix}-${toKebabCase(key)}` : `--${toKebabCase(key)}`;
            return `    ${varName}: ${value};`;
        })
        .join('\n');
}

/**
 * Generates critical CSS for inline injection in <head>
 * Only includes variables needed for above-the-fold content
 */
export function generateCriticalCSS(): string {
    return `
            /* Critical Theme Variables - Generated from themeConfig.ts */
            /* Light Mode (base) */
            :root {
                --bg-primary: ${lightTheme.critical.bgPrimary};
                --bg-secondary: ${lightTheme.critical.bgSecondary};
                --bg-tertiary: ${lightTheme.critical.bgTertiary};
                --text-primary: ${lightTheme.critical.textPrimary};
                --text-secondary: ${lightTheme.critical.textSecondary};
                --text-muted: ${lightTheme.critical.textMuted};
                --background: ${lightTheme.critical.background};
                --foreground: ${lightTheme.critical.foreground};
                --primary: ${lightTheme.critical.primary};
                color-scheme: light;
            }

            /* Dark Mode */
            html.dark {
                --bg-primary: ${darkTheme.critical.bgPrimary};
                --bg-secondary: ${darkTheme.critical.bgSecondary};
                --bg-tertiary: ${darkTheme.critical.bgTertiary};
                --text-primary: ${darkTheme.critical.textPrimary};
                --text-secondary: ${darkTheme.critical.textSecondary};
                --text-muted: ${darkTheme.critical.textMuted};
                --background: ${darkTheme.critical.background};
                --foreground: ${darkTheme.critical.foreground};
                --primary: ${darkTheme.critical.primary};
                color-scheme: dark;
            }`;
}

/**
 * Generates complete theme CSS for the generated-theme.css file
 */
export function generateFullThemeCSS(): string {
    const timestamp = new Date().toISOString();

    const generateThemeBlock = (theme: ThemeConfig, selector: string): string => {
        const isRoot = selector === ':root';

        return `${selector} {
    /* ===========================================
     * Core Background & Text
     * =========================================== */
    --bg-primary: ${theme.critical.bgPrimary};
    --bg-secondary: ${theme.critical.bgSecondary};
    --bg-tertiary: ${theme.critical.bgTertiary};
    --text-primary: ${theme.critical.textPrimary};
    --text-secondary: ${theme.critical.textSecondary};
    --text-muted: ${theme.critical.textMuted};

    /* ===========================================
     * Shadcn/ui Variables
     * =========================================== */
    --background: ${theme.shadcn.background};
    --foreground: ${theme.shadcn.foreground};
    --card: ${theme.shadcn.card};
    --card-foreground: ${theme.shadcn.cardForeground};
    --popover: ${theme.shadcn.popover};
    --popover-foreground: ${theme.shadcn.popoverForeground};
    --primary: ${theme.shadcn.primary};
    --primary-foreground: ${theme.shadcn.primaryForeground};
    --secondary: ${theme.shadcn.secondary};
    --secondary-foreground: ${theme.shadcn.secondaryForeground};
    --muted: ${theme.shadcn.muted};
    --muted-foreground: ${theme.shadcn.mutedForeground};
    --accent: ${theme.shadcn.accent};
    --accent-foreground: ${theme.shadcn.accentForeground};
    --destructive: ${theme.shadcn.destructive};
    --destructive-foreground: ${theme.shadcn.destructiveForeground};
    --border: ${theme.shadcn.border};
    --input: ${theme.shadcn.input};
    --ring: ${theme.shadcn.ring};
    --input-field-bg: ${theme.shadcn.inputFieldBg};
    --chart-1: ${theme.charts.chart1};
    --chart-2: ${theme.charts.chart2};
    --chart-3: ${theme.charts.chart3};
    --chart-4: ${theme.charts.chart4};
    --chart-5: ${theme.charts.chart5};

    /* ===========================================
     * Brand Colors (RGB for rgba() usage)
     * =========================================== */
    --color-primary: ${theme.colors.colorPrimary};
    --color-primary-dark: ${theme.colors.colorPrimaryDark};
    --color-primary-full: ${theme.colors.colorPrimaryFull};
    --color-primary-dark-full: ${theme.colors.colorPrimaryDarkFull};
    --color-secondary: ${theme.colors.colorSecondary};
    --color-secondary-dark: ${theme.colors.colorSecondaryDark};
    --color-secondary-full: ${theme.colors.colorSecondaryFull};
    --color-secondary-dark-full: ${theme.colors.colorSecondaryDarkFull};
    --color-tertiary: ${theme.colors.colorTertiary};
    --color-tertiary-dark: ${theme.colors.colorTertiaryDark};
    --color-tertiary-full: ${theme.colors.colorTertiaryFull};
    --color-tertiary-dark-full: ${theme.colors.colorTertiaryDarkFull};

    /* ===========================================
     * UI Semantic Colors
     * =========================================== */
    --color-ui-info: ${theme.ui.colorUiInfo};
    --color-ui-info-full: ${theme.ui.colorUiInfoFull};
    --color-ui-warning: ${theme.ui.colorUiWarning};
    --color-ui-warning-full: ${theme.ui.colorUiWarningFull};
    --color-ui-error: ${theme.ui.colorUiError};
    --color-ui-error-full: ${theme.ui.colorUiErrorFull};
    --color-ui-success: ${theme.ui.colorUiSuccess};
    --color-ui-success-full: ${theme.ui.colorUiSuccessFull};
    --color-ui-tip: ${theme.ui.colorUiTip};
    --color-ui-tip-full: ${theme.ui.colorUiTipFull};
    --color-ui-quote: ${theme.ui.colorUiQuote};
    --color-ui-quote-full: ${theme.ui.colorUiQuoteFull};

    /* ===========================================
     * Section Background Glow
     * =========================================== */
    --section-background-glow-from: ${theme.glow.sectionBackgroundGlowFrom};
    --section-background-glow-via: ${theme.glow.sectionBackgroundGlowVia};
    --section-background-glow-to: ${theme.glow.sectionBackgroundGlowTo};

    /* ===========================================
     * Divider Gradients
     * =========================================== */
    --divider-primary: ${theme.dividers.dividerPrimary};
    --divider-secondary: ${theme.dividers.dividerSecondary};
    --divider-accent: ${theme.dividers.dividerAccent};

    /* ===========================================
     * Testimonial Section
     * =========================================== */
    --testimonial-accent: ${theme.testimonials.testimonialAccent};
    --testimonial-accent-light: ${theme.testimonials.testimonialAccentLight};
    --testimonial-accent-dark: ${theme.testimonials.testimonialAccentDark};
    --testimonial-accent-full: ${theme.testimonials.testimonialAccentFull};
    --testimonial-accent-light-full: ${theme.testimonials.testimonialAccentLightFull};
    --testimonial-text: ${theme.testimonials.testimonialText};
    --testimonial-text-secondary: ${theme.testimonials.testimonialTextSecondary};
    --testimonial-text-muted: ${theme.testimonials.testimonialTextMuted};
    --testimonial-card-bg: ${theme.testimonials.testimonialCardBg};
    --testimonial-card-bg-tinted: ${theme.testimonials.testimonialCardBgTinted};
    --testimonial-focus: ${theme.testimonials.testimonialFocus};

    /* ===========================================
     * Timeline Gradients
     * =========================================== */
    --color-timeline-blue-from: ${theme.timeline.colorTimelineBlueFrom};
    --color-timeline-blue-to: ${theme.timeline.colorTimelineBlueTo};
    --color-timeline-emerald-from: ${theme.timeline.colorTimelineEmeraldFrom};
    --color-timeline-emerald-to: ${theme.timeline.colorTimelineEmeraldTo};
    --color-timeline-amber-from: ${theme.timeline.colorTimelineAmberFrom};
    --color-timeline-amber-to: ${theme.timeline.colorTimelineAmberTo};
    --color-timeline-steel-from: ${theme.timeline.colorTimelineSteelFrom};
    --color-timeline-steel-to: ${theme.timeline.colorTimelineSteelTo};
    --color-timeline-cyan-from: ${theme.timeline.colorTimelineCyanFrom};
    --color-timeline-cyan-to: ${theme.timeline.colorTimelineCyanTo};

    /* ===========================================
     * Social Icons
     * =========================================== */
    --social-icon: ${theme.socialIcons.socialIcon};
    --social-icon-hover: ${theme.socialIcons.socialIconHover};

    /* ===========================================
     * Mermaid Diagrams
     * =========================================== */
    --mermaid-primary: ${theme.mermaid.mermaidPrimary};
    --mermaid-secondary: ${theme.mermaid.mermaidSecondary};
    --mermaid-background: ${theme.mermaid.mermaidBackground};
    --mermaid-border: ${theme.mermaid.mermaidBorder};
    --mermaid-text: ${theme.mermaid.mermaidText};

    /* ===========================================
     * Tooltips
     * =========================================== */
    --tooltip-bg: ${theme.tooltips.tooltipBg};
    --tooltip-text: ${theme.tooltips.tooltipText};
    --tooltip-border: ${theme.tooltips.tooltipBorder};

    /* ===========================================
     * Syntax Highlighting
     * =========================================== */
    --syntax-keyword: ${theme.syntax.syntaxKeyword};
    --syntax-string: ${theme.syntax.syntaxString};
    --syntax-number: ${theme.syntax.syntaxNumber};
    --syntax-comment: ${theme.syntax.syntaxComment};
}`;
    };

    return `/**
 * Auto-generated Theme Variables
 * Generated at: ${timestamp}
 * Source: src/config/themeConfig.ts
 *
 * DO NOT EDIT THIS FILE MANUALLY
 * Changes will be overwritten on next build/dev
 *
 * To change themes, edit src/config/themeConfig.ts
 */

${generateThemeBlock(lightTheme, ':root')}

${generateThemeBlock(darkTheme, '.dark')}
`;
}

// Re-export for backwards compatibility with existing criticalThemeConfig.ts
export { generateCriticalCSS as generateCriticalThemeCSS };
