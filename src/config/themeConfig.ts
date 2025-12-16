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
// LIGHT THEME - Deep Ocean
// ============================================

export const lightTheme: ThemeConfig = {
    critical: {
        bgPrimary: '180 20% 99%',
        bgSecondary: '185 25% 96%',
        bgTertiary: '185 22% 92%',
        textPrimary: '200 45% 8%',
        textSecondary: '195 35% 18%',
        textMuted: '190 25% 32%',
        background: '185 25% 96%',
        foreground: '200 45% 8%',
        primary: '192 95% 32%'
    },
    shadcn: {
        background: '185 25% 96%',
        foreground: '200 45% 8%',
        card: '0 0% 100%',
        cardForeground: '200 45% 8%',
        popover: '0 0% 100%',
        popoverForeground: '200 45% 8%',
        primary: '192 95% 32%',
        primaryForeground: '0 0% 100%',
        secondary: '175 75% 35%',
        secondaryForeground: '0 0% 100%',
        muted: '185 18% 88%',
        mutedForeground: '190 25% 32%',
        accent: '160 85% 32%',
        accentForeground: '0 0% 100%',
        destructive: '0 84.2% 60.2%',
        destructiveForeground: '0 0% 98%',
        border: '190 20% 78%',
        input: '185 18% 90%',
        ring: '192 95% 32%',
        inputFieldBg: 'rgba(0, 0, 0, 0.04)'
    },
    colors: {
        colorPrimary: '6, 136, 168',
        colorPrimaryDark: '5, 108, 133',
        colorPrimaryFull: 'rgb(6, 136, 168)',
        colorPrimaryDarkFull: 'rgb(5, 108, 133)',
        colorSecondary: '15, 158, 142',
        colorSecondaryDark: '11, 128, 115',
        colorSecondaryFull: 'rgb(15, 158, 142)',
        colorSecondaryDarkFull: 'rgb(11, 128, 115)',
        colorTertiary: '18, 140, 64',
        colorTertiaryDark: '16, 112, 52',
        colorTertiaryFull: 'rgb(18, 140, 64)',
        colorTertiaryDarkFull: 'rgb(16, 112, 52)'
    },
    ui: {
        colorUiInfo: '6, 136, 168',
        colorUiInfoFull: 'rgb(6, 136, 168)',
        colorUiWarning: '180, 98, 5',
        colorUiWarningFull: 'rgb(180, 98, 5)',
        colorUiError: '185, 28, 28',
        colorUiErrorFull: 'rgb(185, 28, 28)',
        colorUiSuccess: '18, 140, 64',
        colorUiSuccessFull: 'rgb(18, 140, 64)',
        colorUiTip: '6, 136, 168',
        colorUiTipFull: 'rgb(6, 136, 168)',
        colorUiQuote: '15, 158, 142',
        colorUiQuoteFull: 'rgb(15, 158, 142)'
    },
    glow: {
        sectionBackgroundGlowFrom: '#0688a8',
        sectionBackgroundGlowVia: '#e8f6f8',
        sectionBackgroundGlowTo: '#0891b2'
    },
    dividers: {
        dividerPrimary: '#0688a8',
        dividerSecondary: '#0f9e8e',
        dividerAccent: '#128c40'
    },
    testimonials: {
        testimonialAccent: '6, 136, 168',
        testimonialAccentLight: '15, 158, 142',
        testimonialAccentDark: '5, 108, 133',
        testimonialAccentFull: '#0688a8',
        testimonialAccentLightFull: '#0f9e8e',
        testimonialText: '10, 18, 32',
        testimonialTextSecondary: '22, 35, 52',
        testimonialTextMuted: '45, 58, 78',
        testimonialCardBg: '255, 255, 255',
        testimonialCardBgTinted: '232, 246, 248',
        testimonialFocus: '6, 136, 168'
    },
    timeline: {
        colorTimelineBlueFrom: '#0688a8',
        colorTimelineBlueTo: '#056c85',
        colorTimelineEmeraldFrom: '#0f9e8e',
        colorTimelineEmeraldTo: '#0b8073',
        colorTimelineAmberFrom: '#b46205',
        colorTimelineAmberTo: '#8f4e04',
        colorTimelineSteelFrom: '#0891b2',
        colorTimelineSteelTo: '#0688a8',
        colorTimelineCyanFrom: '#128c40',
        colorTimelineCyanTo: '#107034'
    },
    socialIcons: {
        socialIcon: '55, 65, 81',
        socialIconHover: '6, 136, 168'
    },
    mermaid: {
        mermaidPrimary: '#0688a8',
        mermaidSecondary: '#0f9e8e',
        mermaidBackground: '#f0f9fa',
        mermaidBorder: '#b8e0e6',
        mermaidText: '#0a1220'
    },
    tooltips: {
        tooltipBg: '16, 62, 78',
        tooltipText: '243, 244, 246',
        tooltipBorder: '16, 62, 78'
    },
    syntax: {
        syntaxKeyword: '192 95% 32%',
        syntaxString: '160 85% 32%',
        syntaxNumber: '35 90% 38%',
        syntaxComment: '190 20% 42%'
    },
    charts: {
        chart1: '192 95% 32%',
        chart2: '175 75% 35%',
        chart3: '160 85% 32%',
        chart4: '200 88% 30%',
        chart5: '150 78% 35%'
    },
    textColors: {
        default: '#0a1220',
        muted: '#056c85',
        subtle: '#0688a8'
    }
};

// ============================================
// DARK THEME - Deep Ocean
// ============================================

export const darkTheme: ThemeConfig = {
    critical: {
        bgPrimary: '195 50% 4%',
        bgSecondary: '195 45% 7%',
        bgTertiary: '195 40% 10%',
        textPrimary: '185 20% 95%',
        textSecondary: '185 15% 75%',
        textMuted: '185 10% 55%',
        background: '195 50% 4%',
        foreground: '185 20% 95%',
        primary: '187 85% 53%'
    },
    shadcn: {
        background: '195 50% 4%',
        foreground: '185 20% 95%',
        card: '195 45% 7%',
        cardForeground: '185 20% 95%',
        popover: '195 45% 7%',
        popoverForeground: '185 20% 95%',
        primary: '187 85% 53%',
        primaryForeground: '195 50% 4%',
        secondary: '172 66% 50%',
        secondaryForeground: '195 50% 4%',
        muted: '195 35% 12%',
        mutedForeground: '185 15% 70%',
        accent: '158 64% 52%',
        accentForeground: '195 50% 4%',
        destructive: '0 62.8% 30.6%',
        destructiveForeground: '0 0% 98%',
        border: '195 30% 20%',
        input: '195 35% 15%',
        ring: '187 85% 53%',
        inputFieldBg: 'rgba(255, 255, 255, 0.08)'
    },
    colors: {
        colorPrimary: '6, 182, 212',
        colorPrimaryDark: '8, 145, 178',
        colorPrimaryFull: 'rgb(6, 182, 212)',
        colorPrimaryDarkFull: 'rgb(8, 145, 178)',
        colorSecondary: '45, 212, 191',
        colorSecondaryDark: '20, 184, 166',
        colorSecondaryFull: 'rgb(45, 212, 191)',
        colorSecondaryDarkFull: 'rgb(20, 184, 166)',
        colorTertiary: '34, 197, 94',
        colorTertiaryDark: '22, 163, 74',
        colorTertiaryFull: 'rgb(34, 197, 94)',
        colorTertiaryDarkFull: 'rgb(22, 163, 74)'
    },
    ui: {
        colorUiInfo: '6, 182, 212',
        colorUiInfoFull: 'rgb(6, 182, 212)',
        colorUiWarning: '251, 191, 36',
        colorUiWarningFull: 'rgb(251, 191, 36)',
        colorUiError: '248, 113, 113',
        colorUiErrorFull: 'rgb(248, 113, 113)',
        colorUiSuccess: '34, 197, 94',
        colorUiSuccessFull: 'rgb(34, 197, 94)',
        colorUiTip: '6, 182, 212',
        colorUiTipFull: 'rgb(6, 182, 212)',
        colorUiQuote: '45, 212, 191',
        colorUiQuoteFull: 'rgb(45, 212, 191)'
    },
    glow: {
        sectionBackgroundGlowFrom: '#06b6d4',
        sectionBackgroundGlowVia: '#0c1a1f',
        sectionBackgroundGlowTo: '#0891b2'
    },
    dividers: {
        dividerPrimary: '#06b6d4',
        dividerSecondary: '#2dd4bf',
        dividerAccent: '#22c55e'
    },
    testimonials: {
        testimonialAccent: '6, 182, 212',
        testimonialAccentLight: '45, 212, 191',
        testimonialAccentDark: '8, 145, 178',
        testimonialAccentFull: 'rgb(6, 182, 212)',
        testimonialAccentLightFull: 'rgb(45, 212, 191)',
        testimonialText: '243, 244, 246',
        testimonialTextSecondary: '209, 213, 219',
        testimonialTextMuted: '156, 163, 175',
        testimonialCardBg: '12, 26, 31',
        testimonialCardBgTinted: '8, 20, 25',
        testimonialFocus: '6, 182, 212'
    },
    timeline: {
        colorTimelineBlueFrom: '#06b6d4',
        colorTimelineBlueTo: '#0891b2',
        colorTimelineEmeraldFrom: '#2dd4bf',
        colorTimelineEmeraldTo: '#14b8a6',
        colorTimelineAmberFrom: '#fbbf24',
        colorTimelineAmberTo: '#f59e0b',
        colorTimelineSteelFrom: '#22d3ee',
        colorTimelineSteelTo: '#06b6d4',
        colorTimelineCyanFrom: '#22c55e',
        colorTimelineCyanTo: '#16a34a'
    },
    socialIcons: {
        socialIcon: '156, 163, 175',
        socialIconHover: '6, 182, 212'
    },
    mermaid: {
        mermaidPrimary: '#06b6d4',
        mermaidSecondary: '#2dd4bf',
        mermaidBackground: '#0c1a1f',
        mermaidBorder: '#164e63',
        mermaidText: '#f3f4f6'
    },
    tooltips: {
        tooltipBg: '22, 78, 99',
        tooltipText: '240, 246, 252',
        tooltipBorder: '22, 78, 99'
    },
    syntax: {
        syntaxKeyword: '187 85% 53%',
        syntaxString: '158 64% 52%',
        syntaxNumber: '38 92% 50%',
        syntaxComment: '185 10% 55%'
    },
    charts: {
        chart1: '187 85% 53%',
        chart2: '172 66% 50%',
        chart3: '158 64% 52%',
        chart4: '195 80% 55%',
        chart5: '145 70% 50%'
    },
    textColors: {
        default: '#f0f6fc',
        muted: '#06b6d4',
        subtle: '#0891b2'
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

// ============================================
// TAILWIND COLOR SCALE GENERATION
// ============================================

/**
 * Lightness values for generating color scales (50-900)
 * Based on Tailwind's default color palette distribution
 */
const SCALE_LIGHTNESS: Record<string, number> = {
    50: 0.97,
    100: 0.93,
    200: 0.85,
    300: 0.75,
    400: 0.65,
    500: 0.55,
    600: 0.45,
    700: 0.35,
    800: 0.25,
    900: 0.18
};

/**
 * Parse RGB string "r, g, b" to individual values
 */
function parseRGB(rgbString: string): { r: number; g: number; b: number } {
    const parts = rgbString.split(',').map((s) => parseInt(s.trim(), 10));
    return { r: parts[0], g: parts[1], b: parts[2] };
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Generate OKLCH color scale from RGB base color
 * Returns object with keys 50-900 for Tailwind
 */
function generateOklchScale(rgbString: string): Record<string, string> {
    const { r, g, b } = parseRGB(rgbString);
    const { h, s } = rgbToHsl(r, g, b);

    // Convert hue to OKLCH hue (approximately the same)
    const oklchHue = h;
    // Adjust chroma based on saturation (rough conversion)
    const baseChroma = (s / 100) * 0.25;

    const scale: Record<string, string> = {};

    for (const [step, lightness] of Object.entries(SCALE_LIGHTNESS)) {
        // Reduce chroma at extreme lightness values for more natural colors
        let chroma = baseChroma;
        if (lightness > 0.9) {
            chroma *= 0.3;
        } else if (lightness > 0.8) {
            chroma *= 0.5;
        } else if (lightness < 0.25) {
            chroma *= 0.6;
        }

        scale[step] = `oklch(${lightness.toFixed(2)} ${chroma.toFixed(3)} ${oklchHue} / <alpha-value>)`;
    }

    return scale;
}

/**
 * Tailwind color scale type
 */
export interface TailwindColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    DEFAULT: string;
    foreground: string;
}

/**
 * Generated Tailwind color scales from theme config
 * Import this in tailwind.config.js
 */
export const tailwindColorScales = {
    primary: {
        ...generateOklchScale(darkTheme.colors.colorPrimary),
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
    },
    secondary: {
        ...generateOklchScale(darkTheme.colors.colorSecondary),
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
    },
    tertiary: {
        ...generateOklchScale(darkTheme.colors.colorTertiary),
        DEFAULT: 'rgb(var(--color-tertiary))',
        foreground: '#ffffff'
    },
    accent: {
        ...generateOklchScale(darkTheme.colors.colorTertiary), // accent = tertiary
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
    }
} as const;
