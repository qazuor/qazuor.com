#!/usr/bin/env npx tsx
/**
 * Script: Generate Giscus CSS
 *
 * Generates public/styles/giscus-custom.css and giscus-custom-light.css
 * directly from src/config/themeConfig.ts (single source of truth)
 *
 * Usage: npx tsx scripts/generate-giscus-css.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { lightTheme } from '../src/config/themeConfig';

const OUTPUT_DIR = 'public/styles';

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

/**
 * Parse RGB string "r, g, b" to RGBColor object
 */
function parseRGBString(rgbString: string): RGBColor {
    const parts = rgbString.split(',').map((s) => parseInt(s.trim(), 10));
    return { r: parts[0], g: parts[1], b: parts[2] };
}

/**
 * Convert RGBColor to hex string
 */
function rgbToHex(color: RGBColor): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

// Parse theme colors from themeConfig
const themeColors = {
    primary: parseRGBString(lightTheme.colors.colorPrimary),
    primaryDark: parseRGBString(lightTheme.colors.colorPrimaryDark),
    secondary: parseRGBString(lightTheme.colors.colorSecondary),
    tertiary: parseRGBString(lightTheme.colors.colorTertiary)
};

const rgba = (color: RGBColor, alpha: number): string => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

/**
 * Generate dark mode Giscus CSS
 */
function generateDarkModeCSS(): string {
    const p = themeColors.primary;
    const pHex = rgbToHex(p);
    const pDarkHex = rgbToHex(themeColors.primaryDark);
    const sHex = rgbToHex(themeColors.secondary);

    return `/* biome-ignore-all lint/complexity/noImportantStyles: Giscus iframe requires !important to override its styles */
/*
 * Custom Giscus Theme for qazuor.com
 * Based on the site's theme color scheme
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: src/config/themeConfig.ts (via themeColors.ts)
 * Run: npx tsx scripts/generate-giscus-css.ts
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

    /* Custom colors matching theme (Primary: ${pHex}, Secondary: ${sHex}) */
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

    /* Accent colors */
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
    --color-btn-primary-selected-bg: #004d78;
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
    box-shadow: 0 4px 20px ${rgba(p, 0.1)} !important;
    transition: all 0.3s ease !important;
}

.gsc-comment-box:hover {
    border-color: ${rgba(p, 0.3)} !important;
    box-shadow: 0 8px 30px ${rgba(p, 0.15)} !important;
}

.gsc-comment-box-textarea {
    background: rgba(15, 23, 42, 0.6) !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 0.75rem !important;
    color: #e2e8f0 !important;
    transition: all 0.3s ease !important;
}

.gsc-comment-box-textarea:focus {
    border-color: ${pHex} !important;
    box-shadow:
        0 0 0 3px ${rgba(p, 0.2)},
        0 0 20px ${rgba(p, 0.15)} !important;
}

.gsc-comment-box-textarea::placeholder {
    color: #64748b !important;
}

/* Tabs styling */
.gsc-comment-box-tabs {
    background: transparent !important;
    border-bottom: 1px solid ${rgba(p, 0.15)} !important;
}

.gsc-comment-box-tab {
    color: #94a3b8 !important;
    transition: all 0.2s ease !important;
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
    box-shadow: 0 2px 10px ${rgba(p, 0.05)} !important;
    transition: all 0.3s ease !important;
}

.gsc-comment:hover {
    border-color: ${rgba(p, 0.25)} !important;
    box-shadow: 0 4px 20px ${rgba(p, 0.1)} !important;
    transform: translateY(-1px) !important;
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
    transition: all 0.2s ease !important;
}

.gsc-reactions-button:hover {
    background: ${rgba(p, 0.2)} !important;
    border-color: ${rgba(p, 0.3)} !important;
    color: ${sHex} !important;
    transform: scale(1.05) !important;
}

.gsc-social-reaction-summary-item {
    background: ${rgba(p, 0.1)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 2rem !important;
    transition: all 0.2s ease !important;
}

.gsc-social-reaction-summary-item:hover {
    background: ${rgba(p, 0.2)} !important;
    transform: scale(1.05) !important;
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
    transition: all 0.3s ease !important;
}

.gsc-comment-author-avatar:hover {
    border-color: ${sHex} !important;
    box-shadow: 0 0 15px ${rgba(p, 0.3)} !important;
}

/* Links */
.gsc-comment a {
    color: ${sHex} !important;
    transition: all 0.2s ease !important;
}

.gsc-comment a:hover {
    color: #00d4ff !important;
    text-shadow: 0 0 10px ${rgba(p, 0.3)} !important;
}

/* Login section */
.gsc-comment-box-bottom {
    border-top: 1px solid ${rgba(p, 0.15)} !important;
}

/* Sign in button styling */
.gsc-comment-box-bottom a {
    background: linear-gradient(135deg, ${pHex}, ${sHex}) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem 1rem !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 2px 10px ${rgba(p, 0.3)} !important;
}

.gsc-comment-box-bottom a:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 20px ${rgba(p, 0.4)} !important;
    filter: brightness(1.1) !important;
}

/* Timeline connector */
.gsc-timeline {
    border-left-color: ${rgba(p, 0.2)} !important;
}

/* Loading spinner */
.gsc-loading {
    color: ${pHex} !important;
}

/* Header with reactions count */
.gsc-comments > .gsc-header {
    color: #94a3b8 !important;
}

.gsc-header-title {
    color: #e2e8f0 !important;
}

/* Emoji picker */
.gsc-emoji-button {
    background: ${rgba(p, 0.1)} !important;
    border-color: ${rgba(p, 0.2)} !important;
    transition: all 0.2s ease !important;
}

.gsc-emoji-button:hover {
    background: ${rgba(p, 0.2)} !important;
    transform: scale(1.1) !important;
}

/* Upvote button */
.gsc-upvote-button {
    transition: all 0.2s ease !important;
}

.gsc-upvote-button:hover {
    color: ${sHex} !important;
}

/* Discussion metadata */
.gsc-left-header {
    color: #94a3b8 !important;
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
    transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
    background: ${rgba(p, 0.5)};
}
`;
}

/**
 * Generate light mode Giscus CSS
 */
function generateLightModeCSS(): string {
    const p = themeColors.primary;
    const pHex = rgbToHex(p);
    const pDarkHex = rgbToHex(themeColors.primaryDark);
    const sHex = rgbToHex(themeColors.secondary);

    return `/* biome-ignore-all lint/complexity/noImportantStyles: Giscus iframe requires !important to override its styles */
/*
 * Custom Giscus Theme for qazuor.com - Light Mode
 * Based on the site's theme color scheme
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: src/config/themeConfig.ts (via themeColors.ts)
 * Run: npx tsx scripts/generate-giscus-css.ts
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

    /* Custom colors matching theme - Light Mode (Primary: ${pHex}, Secondary: ${sHex}) */
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

    /* Accent colors */
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
    --color-btn-primary-selected-bg: #004d78;
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
    box-shadow: 0 4px 20px ${rgba(p, 0.08)} !important;
    transition: all 0.3s ease !important;
}

.gsc-comment-box:hover {
    border-color: ${rgba(p, 0.3)} !important;
    box-shadow: 0 8px 30px ${rgba(p, 0.12)} !important;
}

.gsc-comment-box-textarea {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 0.75rem !important;
    color: #1e293b !important;
    transition: all 0.3s ease !important;
}

.gsc-comment-box-textarea:focus {
    border-color: ${pHex} !important;
    box-shadow:
        0 0 0 3px ${rgba(p, 0.15)},
        0 0 20px ${rgba(p, 0.1)} !important;
}

.gsc-comment-box-textarea::placeholder {
    color: #94a3b8 !important;
}

/* Tabs styling */
.gsc-comment-box-tabs {
    background: transparent !important;
    border-bottom: 1px solid ${rgba(p, 0.15)} !important;
}

.gsc-comment-box-tab {
    color: #475569 !important;
    transition: all 0.2s ease !important;
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
    box-shadow: 0 2px 10px ${rgba(p, 0.04)} !important;
    transition: all 0.3s ease !important;
}

.gsc-comment:hover {
    border-color: ${rgba(p, 0.25)} !important;
    box-shadow: 0 4px 20px ${rgba(p, 0.08)} !important;
    transform: translateY(-1px) !important;
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
    transition: all 0.2s ease !important;
}

.gsc-reactions-button:hover {
    background: ${rgba(p, 0.15)} !important;
    border-color: ${rgba(p, 0.3)} !important;
    color: ${pDarkHex} !important;
    transform: scale(1.05) !important;
}

.gsc-social-reaction-summary-item {
    background: ${rgba(p, 0.08)} !important;
    border: 1px solid ${rgba(p, 0.2)} !important;
    border-radius: 2rem !important;
    transition: all 0.2s ease !important;
}

.gsc-social-reaction-summary-item:hover {
    background: ${rgba(p, 0.15)} !important;
    transform: scale(1.05) !important;
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
    transition: all 0.3s ease !important;
}

.gsc-comment-author-avatar:hover {
    border-color: ${pHex} !important;
    box-shadow: 0 0 15px ${rgba(p, 0.2)} !important;
}

/* Links */
.gsc-comment a {
    color: ${pDarkHex} !important;
    transition: all 0.2s ease !important;
}

.gsc-comment a:hover {
    color: #004d78 !important;
    text-shadow: 0 0 10px ${rgba(p, 0.2)} !important;
}

/* Login section */
.gsc-comment-box-bottom {
    border-top: 1px solid ${rgba(p, 0.15)} !important;
}

/* Sign in button styling */
.gsc-comment-box-bottom a {
    background: linear-gradient(135deg, ${pHex}, ${sHex}) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem 1rem !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 2px 10px ${rgba(p, 0.25)} !important;
}

.gsc-comment-box-bottom a:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 20px ${rgba(p, 0.35)} !important;
    filter: brightness(1.1) !important;
}

/* Timeline connector */
.gsc-timeline {
    border-left-color: ${rgba(p, 0.2)} !important;
}

/* Loading spinner */
.gsc-loading {
    color: ${pHex} !important;
}

/* Header with reactions count */
.gsc-comments > .gsc-header {
    color: #475569 !important;
}

.gsc-header-title {
    color: #1e293b !important;
}

/* Emoji picker */
.gsc-emoji-button {
    background: ${rgba(p, 0.08)} !important;
    border-color: ${rgba(p, 0.2)} !important;
    transition: all 0.2s ease !important;
}

.gsc-emoji-button:hover {
    background: ${rgba(p, 0.15)} !important;
    transform: scale(1.1) !important;
}

/* Upvote button */
.gsc-upvote-button {
    transition: all 0.2s ease !important;
}

.gsc-upvote-button:hover {
    color: ${pHex} !important;
}

/* Discussion metadata */
.gsc-left-header {
    color: #475569 !important;
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
    transition: background 0.2s ease;
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

function main() {
    const projectRoot = process.cwd();
    const outputDirPath = join(projectRoot, OUTPUT_DIR);

    // Ensure output directory exists
    if (!existsSync(outputDirPath)) {
        mkdirSync(outputDirPath, { recursive: true });
    }

    let darkChanged = false;
    let lightChanged = false;

    // Generate dark mode CSS
    const darkCSS = generateDarkModeCSS();
    const darkPath = join(outputDirPath, 'giscus-custom.css');

    if (existsSync(darkPath)) {
        const existing = readFileSync(darkPath, 'utf-8');
        darkChanged = stripHeader(existing) !== stripHeader(darkCSS);
    } else {
        darkChanged = true;
    }

    if (darkChanged) {
        writeFileSync(darkPath, darkCSS, 'utf-8');
    }

    // Generate light mode CSS
    const lightCSS = generateLightModeCSS();
    const lightPath = join(outputDirPath, 'giscus-custom-light.css');

    if (existsSync(lightPath)) {
        const existing = readFileSync(lightPath, 'utf-8');
        lightChanged = stripHeader(existing) !== stripHeader(lightCSS);
    } else {
        lightChanged = true;
    }

    if (lightChanged) {
        writeFileSync(lightPath, lightCSS, 'utf-8');
    }

    // Output result for the integration to parse
    if (darkChanged || lightChanged) {
        console.log('CHANGED');
        console.log(`Primary: ${rgbToHex(themeColors.primary)}`);
        console.log(`Secondary: ${rgbToHex(themeColors.secondary)}`);
    } else {
        console.log('UNCHANGED');
    }
}

main();
