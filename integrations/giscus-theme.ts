/**
 * Astro Integration: Giscus Theme Generator
 * Automatically generates Giscus CSS theme files from theme colors
 *
 * Watches src/config/themeColors.ts and regenerates:
 * - public/styles/giscus-custom.css (dark mode)
 * - public/styles/giscus-custom-light.css (light mode)
 */

import { existsSync, mkdirSync, readFileSync, unwatchFile, watchFile, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

interface GiscusThemeOptions {
    sourceFile?: string;
    outputDir?: string;
    watch?: boolean;
}

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

interface ThemeColors {
    primary: RGBColor;
    primaryDark: RGBColor;
    secondary: RGBColor;
}

// Helper functions
const rgba = (color: RGBColor, alpha: number): string => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

const rgbToHex = (color: RGBColor): string => {
    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
};

/**
 * Loads theme colors from the source file
 */
function loadThemeColors(sourceFile: string): ThemeColors {
    try {
        const filePath = join(process.cwd(), sourceFile);
        const content = readFileSync(filePath, 'utf-8');

        // Extract oceanDepthsColors using regex
        const colorsMatch = content.match(/export const oceanDepthsColors[\s\S]*?= \{([\s\S]*?)\};/);

        if (!colorsMatch) {
            throw new Error('Could not find oceanDepthsColors export');
        }

        // Parse RGB values
        const parseRGB = (text: string, colorName: string): RGBColor => {
            const regex = new RegExp(`${colorName}:\\s*\\{\\s*r:\\s*(\\d+),\\s*g:\\s*(\\d+),\\s*b:\\s*(\\d+)\\s*\\}`);
            const match = text.match(regex);
            if (!match) {
                throw new Error(`Could not find ${colorName} in theme colors`);
            }
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10)
            };
        };

        const colorsText = colorsMatch[1];

        return {
            primary: parseRGB(colorsText, 'primary'),
            primaryDark: parseRGB(colorsText, 'primaryDark'),
            secondary: parseRGB(colorsText, 'secondary')
        };
    } catch (error) {
        console.error('❌ Error loading theme colors:', error);
        // Return default Ocean Depths colors as fallback
        return {
            primary: { r: 0, g: 119, b: 182 },
            primaryDark: { r: 0, g: 95, b: 146 },
            secondary: { r: 0, g: 180, b: 216 }
        };
    }
}

/**
 * Generate dark mode Giscus CSS
 */
function generateDarkModeCSS(colors: ThemeColors): string {
    const p = colors.primary;
    const pHex = rgbToHex(p);
    const pDarkHex = rgbToHex(colors.primaryDark);
    const sHex = rgbToHex(colors.secondary);

    return `/* biome-ignore-all lint/complexity/noImportantStyles: Giscus iframe requires !important to override its styles */
/*
 * Custom Giscus Theme for qazuor.com
 * Based on the site's Ocean Depths color scheme
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: src/config/themeColors.ts
 * Run: npm run generate-giscus-css (or automatic via Astro integration)
 * Generated at: ${new Date().toISOString()}
 */

/* Main container */
main {
    --color-prettylights-syntax-comment: #8b949e;
    --color-prettylights-syntax-constant: #79c0ff;
    --color-prettylights-syntax-entity: #d2a8ff;
    --color-prettylights-syntax-storage-modifier-import: #c9d1d9;
    --color-prettylights-syntax-entity-tag: #7ee787;
    --color-prettylights-syntax-keyword: #ff7b72;
    --color-prettylights-syntax-string: #a5d6ff;
    --color-prettylights-syntax-variable: #ffa657;
    --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
    --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
    --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
    --color-prettylights-syntax-carriage-return-text: #f0f6fc;
    --color-prettylights-syntax-carriage-return-bg: #b62324;
    --color-prettylights-syntax-string-regexp: #7ee787;
    --color-prettylights-syntax-markup-list: #f2cc60;
    --color-prettylights-syntax-markup-heading: #1f6feb;
    --color-prettylights-syntax-markup-italic: #c9d1d9;
    --color-prettylights-syntax-markup-bold: #c9d1d9;
    --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
    --color-prettylights-syntax-markup-deleted-bg: #67060c;
    --color-prettylights-syntax-markup-inserted-text: #aff5b4;
    --color-prettylights-syntax-markup-inserted-bg: #033a16;
    --color-prettylights-syntax-markup-changed-text: #ffdfb6;
    --color-prettylights-syntax-markup-changed-bg: #5a1e02;
    --color-prettylights-syntax-markup-ignored-text: #c9d1d9;
    --color-prettylights-syntax-markup-ignored-bg: #1158c7;
    --color-prettylights-syntax-meta-diff-range: #d2a8ff;
    --color-prettylights-syntax-sublimelinter-gutter-mark: #484f58;

    /* Custom colors matching qazuor.com Ocean Depths theme */
    --color-canvas-default: transparent;
    --color-canvas-overlay: ${rgba(p, 0.05)};
    --color-canvas-inset: ${rgba(p, 0.03)};
    --color-canvas-subtle: ${rgba(p, 0.08)};

    /* Borders */
    --color-border-default: ${rgba(p, 0.2)};
    --color-border-muted: ${rgba(p, 0.15)};
    --color-border-subtle: ${rgba(p, 0.1)};

    /* Text colors */
    --color-fg-default: #e2e8f0;
    --color-fg-muted: #94a3b8;
    --color-fg-subtle: #64748b;

    /* Accent colors - Ocean Depths theme (Primary: ${pHex}, Secondary: ${sHex}) */
    --color-accent-fg: ${sHex};
    --color-accent-emphasis: ${pHex};
    --color-accent-muted: ${rgba(p, 0.4)};
    --color-accent-subtle: ${rgba(p, 0.15)};

    /* Success colors */
    --color-success-fg: #34d399;
    --color-success-emphasis: #10b981;

    /* Attention colors */
    --color-attention-fg: #fbbf24;
    --color-attention-emphasis: #f59e0b;

    /* Danger colors */
    --color-danger-fg: #f87171;
    --color-danger-emphasis: #ef4444;

    /* Neutral colors */
    --color-neutral-muted: ${rgba(p, 0.2)};
    --color-neutral-subtle: ${rgba(p, 0.1)};

    /* Button styles */
    --color-btn-text: #e2e8f0;
    --color-btn-bg: ${rgba(p, 0.15)};
    --color-btn-border: ${rgba(p, 0.3)};
    --color-btn-hover-bg: ${rgba(p, 0.25)};
    --color-btn-hover-border: ${rgba(p, 0.4)};
    --color-btn-active-bg: ${rgba(p, 0.3)};
    --color-btn-active-border: ${rgba(p, 0.5)};

    /* Primary button */
    --color-btn-primary-text: #ffffff;
    --color-btn-primary-bg: ${pHex};
    --color-btn-primary-border: ${pHex};
    --color-btn-primary-hover-bg: ${pDarkHex};
    --color-btn-primary-hover-border: ${pDarkHex};
    --color-btn-primary-selected-bg: #004D78;
    --color-btn-primary-disabled-text: rgba(255, 255, 255, 0.5);
    --color-btn-primary-disabled-bg: ${rgba(p, 0.3)};
    --color-btn-primary-disabled-border: transparent;
}

/* Make background transparent */
.gsc-main {
    background: transparent !important;
}

/* Comment box styling */
.gsc-comment-box {
    background: ${rgba(p, 0.05)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 1rem !important;
    backdrop-filter: blur(8px);
}

.gsc-comment-box-textarea {
    background: rgba(15, 23, 42, 0.6) !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 0.75rem !important;
    color: #e2e8f0 !important;
}

.gsc-comment-box-textarea:focus {
    border-color: ${pHex} !important;
    box-shadow: 0 0 0 3px ${rgba(p, 0.2)} !important;
}

/* Tabs styling */
.gsc-comment-box-tabs {
    background: transparent !important;
    border-bottom: 1px solid ${rgba(p, 0.15)} !important;
}

.gsc-comment-box-tab {
    color: #94a3b8 !important;
}

.gsc-comment-box-tab:hover {
    color: ${sHex} !important;
}

.gsc-comment-box-tab[aria-selected="true"] {
    color: ${sHex} !important;
    border-bottom-color: ${pHex} !important;
}

/* Comments list */
.gsc-comment {
    background: ${rgba(p, 0.03)} !important;
    border: 1px solid ${rgba(p, 0.15)} !important;
    border-radius: 1rem !important;
    backdrop-filter: blur(4px);
}

.gsc-comment:hover {
    border-color: ${rgba(p, 0.25)} !important;
}

/* Reactions */
.gsc-reactions {
    background: transparent !important;
}

.gsc-reactions-button {
    background: ${rgba(p, 0.1)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 2rem !important;
    color: #94a3b8 !important;
}

.gsc-reactions-button:hover {
    background: ${rgba(p, 0.2)} !important;
    border-color: ${rgba(p, 0.3)} !important;
    color: ${sHex} !important;
}

.gsc-social-reaction-summary-item {
    background: ${rgba(p, 0.1)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 2rem !important;
}

.gsc-social-reaction-summary-item:hover {
    background: ${rgba(p, 0.2)} !important;
}

.gsc-social-reaction-summary-item-count {
    color: ${sHex} !important;
}

/* Reply section */
.gsc-reply {
    border-left: 2px solid ${rgba(p, 0.3)} !important;
}

/* Header and timestamps */
.gsc-comment-header {
    color: #94a3b8 !important;
}

.gsc-comment-author-avatar {
    border-radius: 50% !important;
    border: 2px solid ${rgba(p, 0.3)} !important;
}

/* Links */
.gsc-comment a {
    color: ${sHex} !important;
}

.gsc-comment a:hover {
    color: #00D4FF !important;
}

/* Login button */
.gsc-comment-box-bottom {
    border-top: 1px solid ${rgba(p, 0.15)} !important;
}

/* Timeline connector */
.gsc-timeline {
    border-left-color: ${rgba(p, 0.2)} !important;
}

/* Loading spinner */
.gsc-loading {
    color: ${pHex} !important;
}

/* Empty state */
.gsc-comments > .gsc-header {
    color: #94a3b8 !important;
}

/* Emoji picker */
.gsc-emoji-button {
    background: ${rgba(p, 0.1)} !important;
    border-color: ${rgba(p, 0.2)} !important;
}

.gsc-emoji-button:hover {
    background: ${rgba(p, 0.2)} !important;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: ${rgba(p, 0.05)};
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: ${rgba(p, 0.3)};
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: ${rgba(p, 0.5)};
}
`;
}

/**
 * Generate light mode Giscus CSS
 */
function generateLightModeCSS(colors: ThemeColors): string {
    const p = colors.primary;
    const pHex = rgbToHex(p);
    const pDarkHex = rgbToHex(colors.primaryDark);
    const sHex = rgbToHex(colors.secondary);

    return `/* biome-ignore-all lint/complexity/noImportantStyles: Giscus iframe requires !important to override its styles */
/*
 * Custom Giscus Theme for qazuor.com - Light Mode
 * Based on the site's Ocean Depths color scheme
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: src/config/themeColors.ts
 * Run: npm run generate-giscus-css (or automatic via Astro integration)
 * Generated at: ${new Date().toISOString()}
 */

/* Main container */
main {
    --color-prettylights-syntax-comment: #6e7781;
    --color-prettylights-syntax-constant: #0550ae;
    --color-prettylights-syntax-entity: #8250df;
    --color-prettylights-syntax-storage-modifier-import: #24292f;
    --color-prettylights-syntax-entity-tag: #116329;
    --color-prettylights-syntax-keyword: #cf222e;
    --color-prettylights-syntax-string: #0a3069;
    --color-prettylights-syntax-variable: #953800;
    --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
    --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
    --color-prettylights-syntax-invalid-illegal-bg: #82071e;
    --color-prettylights-syntax-carriage-return-text: #f6f8fa;
    --color-prettylights-syntax-carriage-return-bg: #cf222e;
    --color-prettylights-syntax-string-regexp: #116329;
    --color-prettylights-syntax-markup-list: #3b2300;
    --color-prettylights-syntax-markup-heading: #0550ae;
    --color-prettylights-syntax-markup-italic: #24292f;
    --color-prettylights-syntax-markup-bold: #24292f;
    --color-prettylights-syntax-markup-deleted-text: #82071e;
    --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
    --color-prettylights-syntax-markup-inserted-text: #116329;
    --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
    --color-prettylights-syntax-markup-changed-text: #953800;
    --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
    --color-prettylights-syntax-markup-ignored-text: #eaeef2;
    --color-prettylights-syntax-markup-ignored-bg: #0550ae;
    --color-prettylights-syntax-meta-diff-range: #8250df;
    --color-prettylights-syntax-sublimelinter-gutter-mark: #8c959f;

    /* Custom colors matching qazuor.com Ocean Depths theme - Light Mode */
    --color-canvas-default: transparent;
    --color-canvas-overlay: ${rgba(p, 0.03)};
    --color-canvas-inset: ${rgba(p, 0.02)};
    --color-canvas-subtle: ${rgba(p, 0.05)};

    /* Borders */
    --color-border-default: ${rgba(p, 0.25)};
    --color-border-muted: ${rgba(p, 0.2)};
    --color-border-subtle: ${rgba(p, 0.15)};

    /* Text colors */
    --color-fg-default: #1e293b;
    --color-fg-muted: #475569;
    --color-fg-subtle: #64748b;

    /* Accent colors - Ocean Depths theme (Primary: ${pHex}, Secondary: ${sHex}) */
    --color-accent-fg: ${pHex};
    --color-accent-emphasis: ${sHex};
    --color-accent-muted: ${rgba(p, 0.3)};
    --color-accent-subtle: ${rgba(p, 0.1)};

    /* Success colors */
    --color-success-fg: #059669;
    --color-success-emphasis: #10b981;

    /* Attention colors */
    --color-attention-fg: #d97706;
    --color-attention-emphasis: #f59e0b;

    /* Danger colors */
    --color-danger-fg: #dc2626;
    --color-danger-emphasis: #ef4444;

    /* Neutral colors */
    --color-neutral-muted: ${rgba(p, 0.15)};
    --color-neutral-subtle: ${rgba(p, 0.08)};

    /* Button styles */
    --color-btn-text: #1e293b;
    --color-btn-bg: ${rgba(p, 0.1)};
    --color-btn-border: ${rgba(p, 0.25)};
    --color-btn-hover-bg: ${rgba(p, 0.15)};
    --color-btn-hover-border: ${rgba(p, 0.35)};
    --color-btn-active-bg: ${rgba(p, 0.2)};
    --color-btn-active-border: ${rgba(p, 0.4)};

    /* Primary button */
    --color-btn-primary-text: #ffffff;
    --color-btn-primary-bg: ${pHex};
    --color-btn-primary-border: ${pHex};
    --color-btn-primary-hover-bg: ${pDarkHex};
    --color-btn-primary-hover-border: ${pDarkHex};
    --color-btn-primary-selected-bg: #004D78;
    --color-btn-primary-disabled-text: rgba(255, 255, 255, 0.5);
    --color-btn-primary-disabled-bg: ${rgba(p, 0.3)};
    --color-btn-primary-disabled-border: transparent;
}

/* Make background transparent */
.gsc-main {
    background: transparent !important;
}

/* Comment box styling */
.gsc-comment-box {
    background: ${rgba(p, 0.03)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 1rem !important;
    backdrop-filter: blur(8px);
}

.gsc-comment-box-textarea {
    background: rgba(255, 255, 255, 0.8) !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 0.75rem !important;
    color: #1e293b !important;
}

.gsc-comment-box-textarea:focus {
    border-color: ${pHex} !important;
    box-shadow: 0 0 0 3px ${rgba(p, 0.15)} !important;
}

/* Tabs styling */
.gsc-comment-box-tabs {
    background: transparent !important;
    border-bottom: 1px solid ${rgba(p, 0.15)} !important;
}

.gsc-comment-box-tab {
    color: #475569 !important;
}

.gsc-comment-box-tab:hover {
    color: ${pDarkHex} !important;
}

.gsc-comment-box-tab[aria-selected="true"] {
    color: ${pDarkHex} !important;
    border-bottom-color: ${pHex} !important;
}

/* Comments list */
.gsc-comment {
    background: ${rgba(p, 0.02)} !important;
    border: 1px solid ${rgba(p, 0.15)} !important;
    border-radius: 1rem !important;
    backdrop-filter: blur(4px);
}

.gsc-comment:hover {
    border-color: ${rgba(p, 0.25)} !important;
}

/* Reactions */
.gsc-reactions {
    background: transparent !important;
}

.gsc-reactions-button {
    background: ${rgba(p, 0.08)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 2rem !important;
    color: #475569 !important;
}

.gsc-reactions-button:hover {
    background: ${rgba(p, 0.15)} !important;
    border-color: ${rgba(p, 0.3)} !important;
    color: ${pDarkHex} !important;
}

.gsc-social-reaction-summary-item {
    background: ${rgba(p, 0.08)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 2rem !important;
}

.gsc-social-reaction-summary-item:hover {
    background: ${rgba(p, 0.15)} !important;
}

.gsc-social-reaction-summary-item-count {
    color: ${pDarkHex} !important;
}

/* Reply section */
.gsc-reply {
    border-left: 2px solid ${rgba(p, 0.25)} !important;
}

/* Header and timestamps */
.gsc-comment-header {
    color: #475569 !important;
}

.gsc-comment-author-avatar {
    border-radius: 50% !important;
    border: 2px solid ${rgba(p, 0.25)} !important;
}

/* Links */
.gsc-comment a {
    color: ${pDarkHex} !important;
}

.gsc-comment a:hover {
    color: #004D78 !important;
}

/* Login button */
.gsc-comment-box-bottom {
    border-top: 1px solid ${rgba(p, 0.15)} !important;
}

/* Timeline connector */
.gsc-timeline {
    border-left-color: ${rgba(p, 0.2)} !important;
}

/* Loading spinner */
.gsc-loading {
    color: ${pHex} !important;
}

/* Empty state */
.gsc-comments > .gsc-header {
    color: #475569 !important;
}

/* Emoji picker */
.gsc-emoji-button {
    background: ${rgba(p, 0.08)} !important;
    border-color: ${rgba(p, 0.2)} !important;
}

.gsc-emoji-button:hover {
    background: ${rgba(p, 0.15)} !important;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: ${rgba(p, 0.03)};
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: ${rgba(p, 0.2)};
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: ${rgba(p, 0.35)};
}
`;
}

/**
 * Strip header comment from CSS for comparison
 */
function stripHeader(content: string): string {
    return content.replace(/\/\*[\s\S]*?\*\/\n*/m, '').trim();
}

/**
 * Main Giscus theme integration
 */
export default function giscusTheme(options: GiscusThemeOptions = {}): AstroIntegration {
    const { sourceFile = 'src/config/themeColors.ts', outputDir = 'public/styles', watch = true } = options;

    let projectRoot: string;

    return {
        name: 'giscus-theme',
        hooks: {
            'astro:config:setup': async ({ config, command }) => {
                projectRoot = fileURLToPath(config.root);

                // Generate CSS on setup
                generateGiscusCSS();

                // Watch for changes in development
                if (command === 'dev' && watch) {
                    const watchPath = join(projectRoot, sourceFile);

                    console.log('🎨 Giscus theme integration initialized');
                    console.log(`📁 Watching: ${sourceFile}`);
                    console.log(`📄 Output: ${outputDir}/giscus-custom*.css`);

                    // Setup file watcher
                    let timeout: NodeJS.Timeout | null = null;

                    watchFile(watchPath, { interval: 500 }, () => {
                        // Debounce rapid file changes
                        if (timeout) clearTimeout(timeout);

                        timeout = setTimeout(() => {
                            console.log('🔄 Theme colors changed, regenerating Giscus CSS...');
                            try {
                                generateGiscusCSS();
                                console.log('✅ Giscus CSS regenerated successfully');
                            } catch (error) {
                                console.error('❌ Error regenerating Giscus CSS:', error);
                            }
                        }, 200);
                    });

                    // Cleanup on server stop
                    process.on('SIGINT', () => {
                        unwatchFile(watchPath);
                    });
                    process.on('SIGTERM', () => {
                        unwatchFile(watchPath);
                    });
                }
            },

            'astro:build:start': () => {
                // Regenerate CSS before build
                generateGiscusCSS();
            }
        }
    };

    function generateGiscusCSS() {
        try {
            const outputDirPath = join(projectRoot, outputDir);

            // Ensure output directory exists
            if (!existsSync(outputDirPath)) {
                mkdirSync(outputDirPath, { recursive: true });
            }

            // Load theme colors
            const colors = loadThemeColors(sourceFile);

            // Generate dark mode CSS
            const darkCSS = generateDarkModeCSS(colors);
            const darkPath = join(outputDirPath, 'giscus-custom.css');

            // Check if dark mode content changed
            let darkChanged = true;
            if (existsSync(darkPath)) {
                const existing = readFileSync(darkPath, 'utf-8');
                darkChanged = stripHeader(existing) !== stripHeader(darkCSS);
            }

            if (darkChanged) {
                writeFileSync(darkPath, darkCSS, 'utf-8');
                console.log('✅ Generated: giscus-custom.css (dark mode)');
            }

            // Generate light mode CSS
            const lightCSS = generateLightModeCSS(colors);
            const lightPath = join(outputDirPath, 'giscus-custom-light.css');

            // Check if light mode content changed
            let lightChanged = true;
            if (existsSync(lightPath)) {
                const existing = readFileSync(lightPath, 'utf-8');
                lightChanged = stripHeader(existing) !== stripHeader(lightCSS);
            }

            if (lightChanged) {
                writeFileSync(lightPath, lightCSS, 'utf-8');
                console.log('✅ Generated: giscus-custom-light.css (light mode)');
            }

            if (!darkChanged && !lightChanged) {
                console.log('⏭️  Giscus CSS unchanged, skipping write');
            } else {
                const pHex = rgbToHex(colors.primary);
                const sHex = rgbToHex(colors.secondary);
                console.log(`   🎨 Theme: Ocean Depths (Primary: ${pHex}, Secondary: ${sHex})`);
            }
        } catch (error) {
            console.error('❌ Failed to generate Giscus CSS:', error);
            throw error;
        }
    }
}
