import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E and Visual Regression testing
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    // No default testDir - specified in package.json scripts (e2e or visual)
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 4,
    reporter: 'html',
    // Global test timeout - 3 minutes for visual tests with full-page screenshots
    timeout: 180000,
    // Global timeout for the entire test run (10 minutes)
    globalTimeout: process.env.CI ? 600000 : 0,
    use: {
        baseURL: 'http://localhost:4321',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    // Visual regression testing configuration
    expect: {
        // Timeout for expect assertions (including screenshots) - 2 minutes
        timeout: 120000,
        toHaveScreenshot: {
            // Maximum pixel difference ratio (increased for pages with animations)
            // 10% tolerance handles TypeIt, GSAP, and other dynamic content
            maxDiffPixelRatio: 0.1,
            // Animation stabilization
            animations: 'disabled',
            // Hide text cursor
            caret: 'hide',
            // Maximum absolute number of different pixels (for small elements)
            maxDiffPixels: 500,
            // Threshold for color difference (0-1, where 0 is strict)
            // 0.2 allows for anti-aliasing and font rendering differences
            threshold: 0.2
        }
    },
    // Separate directory for visual tests
    testMatch: ['**/*.spec.ts'],
    testIgnore: ['**/node_modules/**'],
    webServer: {
        // Use preview (production build) for faster, more stable tests
        command: process.env.USE_DEV_SERVER ? 'npm run dev' : 'npm run preview',
        url: 'http://localhost:4321',
        reuseExistingServer: !process.env.CI,
        timeout: 120000
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        }
    ]
});
