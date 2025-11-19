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
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:4321',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    // Visual regression testing configuration
    expect: {
        toHaveScreenshot: {
            // Maximum pixel difference ratio
            maxDiffPixelRatio: 0.02,
            // Animation stabilization
            animations: 'disabled',
            // CSS animations
            caret: 'hide'
        }
    },
    // Separate directory for visual tests
    testMatch: ['**/*.spec.ts'],
    testIgnore: ['**/node_modules/**'],
    webServer: {
        command: 'npm run dev',
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
