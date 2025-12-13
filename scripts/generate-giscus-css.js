#!/usr/bin/env node

/**
 * Generate Giscus CSS theme files from centralized theme colors
 *
 * This script generates:
 * - public/styles/giscus-custom.css (dark mode)
 * - public/styles/giscus-custom-light.css (light mode)
 *
 * Run with: npm run generate-giscus-css
 *
 * The colors are pulled from src/config/themeColors.ts
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Theme colors - Ocean Depths palette
// These should match src/config/themeColors.ts
const THEME_COLORS = {
    primary: { r: 0, g: 119, b: 182 }, // #0077B6 Ocean Blue
    primaryDark: { r: 0, g: 95, b: 146 }, // #005F92
    secondary: { r: 0, g: 180, b: 216 } // #00B4D8 Cyan
};

// Helper functions
const rgb = (color) => `${color.r}, ${color.g}, ${color.b}`;
const rgba = (color, alpha) => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

/**
 * Generate dark mode Giscus CSS
 */
function generateDarkModeCSS() {
    const p = THEME_COLORS.primary;

    return `/* biome-ignore-all lint/complexity/noImportantStyles: Giscus iframe requires !important to override its styles */
/*
 * Custom Giscus Theme for qazuor.com
 * Based on the site's Ocean Depths color scheme
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: src/config/themeColors.ts
 * Run: npm run generate-giscus-css
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

    /* Accent colors - Ocean Depths theme (Primary: #0077B6, Secondary: #00B4D8) */
    --color-accent-fg: #00B4D8;
    --color-accent-emphasis: #0077B6;
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
    --color-btn-primary-bg: #0077B6;
    --color-btn-primary-border: #0077B6;
    --color-btn-primary-hover-bg: #005F92;
    --color-btn-primary-hover-border: #005F92;
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
    border-color: #0077B6 !important;
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
    color: #00B4D8 !important;
}

.gsc-comment-box-tab[aria-selected="true"] {
    color: #00B4D8 !important;
    border-bottom-color: #0077B6 !important;
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
    color: #00B4D8 !important;
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
    color: #00B4D8 !important;
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
    color: #00B4D8 !important;
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
    color: #0077B6 !important;
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
function generateLightModeCSS() {
    const p = THEME_COLORS.primary;

    return `/* biome-ignore-all lint/complexity/noImportantStyles: Giscus iframe requires !important to override its styles */
/*
 * Custom Giscus Theme for qazuor.com - Light Mode
 * Based on the site's Ocean Depths color scheme
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: src/config/themeColors.ts
 * Run: npm run generate-giscus-css
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

    /* Accent colors - Ocean Depths theme (Primary: #0077B6, Secondary: #00B4D8) */
    --color-accent-fg: #0077B6;
    --color-accent-emphasis: #00B4D8;
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
    --color-btn-primary-bg: #0077B6;
    --color-btn-primary-border: #0077B6;
    --color-btn-primary-hover-bg: #005F92;
    --color-btn-primary-hover-border: #005F92;
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
    border-color: #0077B6 !important;
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
    color: #005F92 !important;
}

.gsc-comment-box-tab[aria-selected="true"] {
    color: #005F92 !important;
    border-bottom-color: #0077B6 !important;
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
    color: #005F92 !important;
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
    color: #005F92 !important;
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
    color: #005F92 !important;
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
    color: #0077B6 !important;
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
 * Main function to generate all Giscus CSS files
 */
function generateGiscusCSS() {
    const publicStylesDir = join(__dirname, '../public/styles');

    try {
        // Generate dark mode CSS
        const darkCSS = generateDarkModeCSS();
        const darkPath = join(publicStylesDir, 'giscus-custom.css');
        writeFileSync(darkPath, darkCSS, 'utf8');
        console.log('✅ Generated: public/styles/giscus-custom.css (dark mode)');

        // Generate light mode CSS
        const lightCSS = generateLightModeCSS();
        const lightPath = join(publicStylesDir, 'giscus-custom-light.css');
        writeFileSync(lightPath, lightCSS, 'utf8');
        console.log('✅ Generated: public/styles/giscus-custom-light.css (light mode)');

        console.log('\n🎨 Giscus CSS files generated successfully!');
        console.log('   Theme: Ocean Depths (Primary: #0077B6, Secondary: #00B4D8)');
    } catch (error) {
        console.error('❌ Error generating Giscus CSS:', error);
        process.exit(1);
    }
}

// Run the generator
generateGiscusCSS();
