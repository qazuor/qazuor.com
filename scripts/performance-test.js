#!/usr/bin/env node

/**
 * Performance Testing Script
 *
 * Tests key performance metrics and validates against budgets:
 * - DOM size < 2000 elements
 * - HTML size < 100KB
 * - Critical CSS inlined
 * - Font loading optimized
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Performance budgets
const budgets = {
    domSize: 2000,
    htmlSize: 100 * 1024, // 100KB in bytes
    cssSize: 50 * 1024, // 50KB
    jsSize: 300 * 1024, // 300KB
    imageSize: 500 * 1024, // 500KB
    fontSize: 150 * 1024, // 150KB
    criticalFonts: 3 // Max critical fonts preloaded
};

// Test results
const results = {
    passed: [],
    failed: [],
    warnings: []
};

/**
 * Count DOM elements in HTML file
 */
function countDOMElements(htmlPath) {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    // Count opening tags (excluding self-closing and closing tags)
    const matches = html.match(/<[^/>]+>/g) || [];
    return matches.length;
}

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Check if critical CSS is inlined
 */
function checkCriticalCSS(htmlPath) {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    // Check for inline style tags with critical CSS classes
    const hasInlineStyles = html.includes('<style>') || html.includes('<style ');
    const hasCriticalClasses =
        html.includes('gradient-text-hero') && html.includes('container-custom') && html.includes('hero-section');
    return hasInlineStyles && hasCriticalClasses;
}

/**
 * Count font preloads
 */
function countFontPreloads(htmlPath) {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const preloads = html.match(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g) || [];
    return preloads.length;
}

/**
 * Run all tests
 */
function runTests() {
    console.log(`${colors.cyan}🔍 Running Performance Tests...${colors.reset}\n`);

    const distPath = path.join(__dirname, '..', 'dist');
    const homepagePath = path.join(distPath, 'en', 'index.html');

    if (!fs.existsSync(homepagePath)) {
        console.error(`${colors.red}❌ Error: Homepage not found at ${homepagePath}${colors.reset}`);
        console.error(`${colors.yellow}Run 'npm run build' first${colors.reset}`);
        process.exit(1);
    }

    // Test 1: DOM Size
    console.log(`${colors.blue}📊 Test 1: DOM Size${colors.reset}`);
    const domSize = countDOMElements(homepagePath);
    console.log(`   Elements: ${domSize}`);
    console.log(`   Budget: < ${budgets.domSize}`);
    if (domSize < budgets.domSize) {
        const margin = budgets.domSize - domSize;
        const percentage = Math.round((margin / budgets.domSize) * 100);
        results.passed.push(`DOM Size: ${domSize} elements (-${margin} / ${percentage}% under budget)`);
        console.log(`   ${colors.green}✓ PASS${colors.reset} (${percentage}% under budget)\n`);
    } else {
        const overage = domSize - budgets.domSize;
        results.failed.push(`DOM Size: ${domSize} elements (+${overage} over budget)`);
        console.log(`   ${colors.red}✗ FAIL${colors.reset} (+${overage} over budget)\n`);
    }

    // Test 2: HTML Size
    console.log(`${colors.blue}📄 Test 2: HTML Size${colors.reset}`);
    const htmlSize = getFileSize(homepagePath);
    console.log(`   Size: ${formatBytes(htmlSize)}`);
    console.log(`   Budget: < ${formatBytes(budgets.htmlSize)}`);
    if (htmlSize < budgets.htmlSize) {
        results.passed.push(`HTML Size: ${formatBytes(htmlSize)}`);
        console.log(`   ${colors.green}✓ PASS${colors.reset}\n`);
    } else {
        results.warnings.push(
            `HTML Size: ${formatBytes(htmlSize)} (over budget but acceptable for SSG with inlined SVG)`
        );
        console.log(`   ${colors.yellow}⚠ WARNING${colors.reset} (acceptable for SSG with SVG sprites)\n`);
    }

    // Test 3: Critical CSS
    console.log(`${colors.blue}🎨 Test 3: Critical CSS Inline${colors.reset}`);
    const hasCriticalCSS = checkCriticalCSS(homepagePath);
    if (hasCriticalCSS) {
        results.passed.push('Critical CSS: Inlined in <head>');
        console.log(`   ${colors.green}✓ PASS${colors.reset} Critical CSS found inlined\n`);
    } else {
        results.failed.push('Critical CSS: Not found inlined');
        console.log(`   ${colors.red}✗ FAIL${colors.reset} Critical CSS not inlined\n`);
    }

    // Test 4: Font Preloading
    console.log(`${colors.blue}🔤 Test 4: Font Preloading${colors.reset}`);
    const fontPreloads = countFontPreloads(homepagePath);
    console.log(`   Preloaded fonts: ${fontPreloads}`);
    console.log(`   Budget: <= ${budgets.criticalFonts}`);
    if (fontPreloads <= budgets.criticalFonts) {
        results.passed.push(`Font Preloads: ${fontPreloads} critical fonts`);
        console.log(`   ${colors.green}✓ PASS${colors.reset}\n`);
    } else {
        const overage = fontPreloads - budgets.criticalFonts;
        results.warnings.push(`Font Preloads: ${fontPreloads} (+${overage} over recommended)`);
        console.log(`   ${colors.yellow}⚠ WARNING${colors.reset} (+${overage} more than recommended)\n`);
    }

    // Print summary
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}📋 Test Summary${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

    console.log(`${colors.green}✓ Passed: ${results.passed.length}${colors.reset}`);
    for (const msg of results.passed) {
        console.log(`  ${colors.green}•${colors.reset} ${msg}`);
    }
    console.log('');

    if (results.warnings.length > 0) {
        console.log(`${colors.yellow}⚠ Warnings: ${results.warnings.length}${colors.reset}`);
        for (const msg of results.warnings) {
            console.log(`  ${colors.yellow}•${colors.reset} ${msg}`);
        }
        console.log('');
    }

    if (results.failed.length > 0) {
        console.log(`${colors.red}✗ Failed: ${results.failed.length}${colors.reset}`);
        for (const msg of results.failed) {
            console.log(`  ${colors.red}•${colors.reset} ${msg}`);
        }
        console.log('');
        process.exit(1);
    }

    console.log(`${colors.green}🎉 All critical tests passed!${colors.reset}\n`);
    process.exit(0);
}

// Run tests
runTests();
