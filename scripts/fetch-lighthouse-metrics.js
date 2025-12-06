/**
 * Fetch Lighthouse metrics from PageSpeed Insights API
 *
 * This script fetches real Lighthouse metrics from Google's PageSpeed Insights API
 * and saves them to a JSON file that should be committed to the repository.
 *
 * Usage:
 *   node scripts/fetch-lighthouse-metrics.js [--report-url <url>]
 *
 * Options:
 *   --report-url <url>  - Optional URL to the PageSpeed report (for linking)
 *                         Example: https://pagespeed.web.dev/analysis/https-qazuor-com-es/nmbhmjjg0u
 *
 * Environment variables:
 *   PAGESPEED_API_KEY - Optional API key for higher rate limits
 *   SITE_URL - Override the default URL to test (default: https://qazuor.com)
 *
 * The API is free to use without a key, but has rate limits.
 * With an API key, you get higher limits.
 *
 * IMPORTANT: Run this script manually in local environment, NOT during Vercel builds.
 * The generated lighthouse-metrics.json should be committed to the repository.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = join(__dirname, '../src/data/lighthouse-metrics.json');
const ENV_FILE = join(__dirname, '../.env');

// Load .env file if it exists (for local development)
function loadEnvFile() {
    if (existsSync(ENV_FILE)) {
        const envContent = readFileSync(ENV_FILE, 'utf-8');
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                const value = valueParts.join('=');
                if (key && value && !process.env[key]) {
                    process.env[key] = value;
                }
            }
        }
    }
}

loadEnvFile();

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const result = { reportUrl: null };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--report-url' && args[i + 1]) {
            result.reportUrl = args[i + 1];
            i++;
        }
    }

    return result;
}

const cliArgs = parseArgs();

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://qazuor.com';
const API_KEY = process.env.PAGESPEED_API_KEY || '';

// PageSpeed Insights API endpoint
const PSI_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

/**
 * Generate a generic PageSpeed analysis URL
 * This URL will trigger a new analysis when visited
 */
function generatePageSpeedUrl(siteUrl, strategy = 'mobile') {
    const encodedUrl = encodeURIComponent(siteUrl);
    return `https://pagespeed.web.dev/analysis?url=${encodedUrl}&form_factor=${strategy}`;
}

/**
 * Format milliseconds to human-readable string
 */
function formatTime(ms) {
    if (ms < 1000) {
        return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Format CLS score
 */
function formatCLS(value) {
    return value.toFixed(2);
}

/**
 * Format performance score
 */
function formatScore(score) {
    const percentage = Math.round(score * 100);
    return `${percentage}`;
}

/**
 * Fetch metrics from PageSpeed Insights API
 */
async function fetchMetrics(url, strategy) {
    const params = new URLSearchParams({
        url,
        strategy // 'desktop' or 'mobile'
    });

    // Request all categories
    const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
    for (const category of categories) {
        params.append('category', category);
    }

    if (API_KEY) {
        params.append('key', API_KEY);
    }

    const apiUrl = `${PSI_API_URL}?${params.toString()}`;

    console.log(`📊 Fetching ${strategy} metrics for ${url}...`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API request failed: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // Extract metrics from the response
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse.audits;
    const cats = lighthouse.categories;

    return {
        // Performance metrics
        performance: {
            score: formatScore(cats.performance.score),
            lcp: formatTime(audits['largest-contentful-paint'].numericValue),
            fcp: formatTime(audits['first-contentful-paint'].numericValue),
            cls: formatCLS(audits['cumulative-layout-shift'].numericValue),
            tbt: formatTime(audits['total-blocking-time'].numericValue),
            si: formatTime(audits['speed-index'].numericValue)
        },
        // Accessibility score
        accessibility: {
            score: formatScore(cats.accessibility.score)
        },
        // Best Practices score
        bestPractices: {
            score: formatScore(cats['best-practices'].score)
        },
        // SEO score
        seo: {
            score: formatScore(cats.seo.score)
        }
    };
}

/**
 * Get fallback metrics from existing file or defaults
 */
function getFallbackMetrics() {
    if (existsSync(OUTPUT_FILE)) {
        try {
            const existing = JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'));
            console.log('⚠️  Using cached metrics from previous run');
            return existing;
        } catch {
            // Ignore parse errors
        }
    }

    // Default fallback values
    console.log('⚠️  Using default fallback metrics');
    const defaultMetrics = {
        performance: { score: '90', lcp: '1.5s', fcp: '1.0s', cls: '0.00', tbt: '200ms', si: '1.5s' },
        accessibility: { score: '95' },
        bestPractices: { score: '100' },
        seo: { score: '100' }
    };
    return {
        desktop: defaultMetrics,
        mobile: {
            ...defaultMetrics,
            performance: { ...defaultMetrics.performance, score: '80', lcp: '2.5s', fcp: '2.0s' }
        },
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
    };
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Fetching Lighthouse metrics from PageSpeed Insights...\n');

    let metrics;

    try {
        // Fetch both desktop and mobile metrics
        // Note: Each call takes ~20-30 seconds
        const [desktop, mobile] = await Promise.all([
            fetchMetrics(SITE_URL, 'desktop'),
            fetchMetrics(SITE_URL, 'mobile')
        ]);

        // Determine the report URL to use
        // Priority: CLI argument > generate generic URL
        const reportUrl = cliArgs.reportUrl || generatePageSpeedUrl(SITE_URL, 'mobile');

        metrics = {
            desktop,
            mobile,
            lastUpdated: new Date().toISOString(),
            source: 'manual', // Changed from 'pagespeed-insights' to indicate manual execution
            url: SITE_URL,
            reportUrl
        };

        console.log('\n✅ Metrics fetched successfully!\n');
        console.log(
            'Desktop Performance:',
            desktop.performance.score,
            '| Accessibility:',
            desktop.accessibility.score,
            '| Best Practices:',
            desktop.bestPractices.score,
            '| SEO:',
            desktop.seo.score
        );
        console.log(
            'Mobile Performance:',
            mobile.performance.score,
            '| Accessibility:',
            mobile.accessibility.score,
            '| Best Practices:',
            mobile.bestPractices.score,
            '| SEO:',
            mobile.seo.score
        );
    } catch (error) {
        console.error('\n❌ Failed to fetch metrics:', error.message);
        console.log('Using fallback metrics instead...\n');
        metrics = getFallbackMetrics();
    }

    // Write metrics to JSON file
    writeFileSync(OUTPUT_FILE, JSON.stringify(metrics, null, 2));
    console.log(`\n📁 Metrics saved to: ${OUTPUT_FILE}`);

    if (metrics.reportUrl) {
        console.log(`🔗 Report URL: ${metrics.reportUrl}`);
    }

    console.log('\n💡 Remember to commit the updated lighthouse-metrics.json file!');
    console.log('   git add src/data/lighthouse-metrics.json && git commit -m "chore: update lighthouse metrics"');
}

main().catch(console.error);
