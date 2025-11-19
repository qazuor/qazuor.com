import { expect, type Page, test } from '@playwright/test';

/**
 * Visual Regression Tests
 *
 * These tests capture screenshots of critical pages and compare them against
 * baseline images to detect unintended visual changes.
 *
 * To update baselines: npx playwright test --update-snapshots
 */

/**
 * Helper function to prepare page for visual regression testing
 * Disables infinite animations and waits for page stability
 */
async function preparePageForScreenshot(page: Page) {
    await page.waitForLoadState('networkidle');

    // Disable infinite animations that prevent screenshot stability
    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
            .animate-bounce, .animate-spin, .animate-pulse {
                animation: none !important;
            }
        `
    });

    // Wait for any remaining transitions to complete
    await page.waitForTimeout(500);
}

test.describe('Visual Regression - Critical Pages', () => {
    test.describe('Homepage', () => {
        test('should match homepage visual snapshot (desktop)', async ({ page }) => {
            await page.goto('/en');

            // Wait for page to be fully loaded
            await preparePageForScreenshot(page);

            // Take full page screenshot
            await expect(page).toHaveScreenshot('homepage-desktop.png', {
                fullPage: true
            });
        });

        test('should match homepage hero section', async ({ page }) => {
            await page.goto('/en');
            await preparePageForScreenshot(page);

            // Screenshot of hero section only
            const heroSection = page.locator('section').first();
            await expect(heroSection).toHaveScreenshot('homepage-hero.png');
        });

        test('should match homepage visual snapshot (mobile)', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('homepage-mobile.png', {
                fullPage: true
            });
        });

        test('should match homepage visual snapshot (tablet)', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/en');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('homepage-tablet.png', {
                fullPage: true
            });
        });
    });

    test.describe('Services Pages', () => {
        test('should match services index (desktop)', async ({ page }) => {
            await page.goto('/en/services');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('services-index-desktop.png', {
                fullPage: true
            });
        });

        test('should match web-apps service page', async ({ page }) => {
            await page.goto('/en/services/web-apps');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('service-web-apps.png', {
                fullPage: true
            });
        });

        test('should match landing-pages service page', async ({ page }) => {
            await page.goto('/en/services/landing-pages');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('service-landing-pages.png', {
                fullPage: true
            });
        });

        test('should match automation service page', async ({ page }) => {
            await page.goto('/en/services/automation-integration');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('service-automation.png', {
                fullPage: true
            });
        });

        test('should match social-media service page', async ({ page }) => {
            await page.goto('/en/services/social-media-design');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('service-social-media.png', {
                fullPage: true
            });
        });
    });

    test.describe('Theme Variations', () => {
        test('should match homepage in dark mode', async ({ page }) => {
            await page.goto('/en');

            // Enable dark mode
            await page.evaluate(() => {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            });

            await preparePageForScreenshot(page); // Wait for theme transition

            await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
                fullPage: true
            });
        });

        test('should match homepage in light mode', async ({ page }) => {
            await page.goto('/en');

            // Ensure light mode
            await page.evaluate(() => {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            });

            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('homepage-light-mode.png', {
                fullPage: true
            });
        });

        test('should match services page in dark mode', async ({ page }) => {
            await page.goto('/en/services');

            await page.evaluate(() => {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            });

            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('services-dark-mode.png', {
                fullPage: true
            });
        });
    });

    test.describe('Interactive Components', () => {
        test('should match navigation menu (desktop)', async ({ page }) => {
            await page.goto('/en');
            await preparePageForScreenshot(page);

            const nav = page.locator('nav').first();
            await expect(nav).toHaveScreenshot('navigation-desktop.png');
        });

        test('should match navigation menu (mobile)', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en');
            await preparePageForScreenshot(page);

            const nav = page.locator('nav').first();
            await expect(nav).toHaveScreenshot('navigation-mobile.png');
        });

        test('should match footer', async ({ page }) => {
            await page.goto('/en');
            await preparePageForScreenshot(page);

            const footer = page.locator('footer').first();
            await footer.scrollIntoViewIfNeeded();
            await expect(footer).toHaveScreenshot('footer.png');
        });
    });

    test.describe('Critical UI Components', () => {
        test('should match theme toggle button', async ({ page }) => {
            await page.goto('/en');
            await preparePageForScreenshot(page);

            // Find theme toggle button
            const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Toggle" i]').first();

            if ((await themeToggle.count()) > 0) {
                await expect(themeToggle).toHaveScreenshot('theme-toggle.png');
            }
        });

        test('should match skip to content link', async ({ page }) => {
            await page.goto('/en');

            const skipLink = page.locator('a[href="#main-content"]').first();
            if ((await skipLink.count()) > 0) {
                await expect(skipLink).toHaveScreenshot('skip-link.png');
            }
        });
    });

    test.describe('Language Variations', () => {
        test('should match homepage in Spanish', async ({ page }) => {
            await page.goto('/es');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('homepage-spanish.png', {
                fullPage: true
            });
        });

        test('should match services page in Spanish', async ({ page }) => {
            await page.goto('/es/services');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('services-spanish.png', {
                fullPage: true
            });
        });
    });

    test.describe('Responsive Breakpoints', () => {
        const viewports = [
            { name: 'mobile-small', width: 320, height: 568 },
            { name: 'mobile-medium', width: 375, height: 667 },
            { name: 'mobile-large', width: 414, height: 896 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'desktop-small', width: 1024, height: 768 },
            { name: 'desktop-medium', width: 1440, height: 900 },
            { name: 'desktop-large', width: 1920, height: 1080 }
        ];

        for (const viewport of viewports) {
            test(`should match homepage at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
                page
            }) => {
                await page.setViewportSize({
                    width: viewport.width,
                    height: viewport.height
                });

                await page.goto('/en');
                await preparePageForScreenshot(page);

                // Only screenshot above the fold for different viewports
                await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
                    fullPage: false // Only visible viewport
                });
            });
        }
    });

    test.describe('Error States', () => {
        test('should match 404 page', async ({ page }) => {
            // Navigate to non-existent page
            const response = await page.goto('/en/non-existent-page-12345');

            // Should be 404 or redirect
            if (response && (response.status() === 404 || response.status() >= 400)) {
                await preparePageForScreenshot(page);
                await expect(page).toHaveScreenshot('404-page.png', {
                    fullPage: true
                });
            }
        });
    });
});

test.describe('Visual Regression - Component States', () => {
    test.describe('Form States', () => {
        test('should match contact form (empty)', async ({ page }) => {
            await page.goto('/en');

            // Scroll to contact form
            const contactSection = page
                .locator('section')
                .filter({ hasText: /contact/i })
                .first();
            await contactSection.scrollIntoViewIfNeeded();

            await expect(contactSection).toHaveScreenshot('contact-form-empty.png');
        });

        test('should match contact form (filled)', async ({ page }) => {
            await page.goto('/en');

            // Fill form
            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            const messageField = page.locator('textarea').first();

            if ((await nameField.count()) > 0) {
                await nameField.scrollIntoViewIfNeeded();
                await nameField.fill('John Doe');
                await emailField.fill('john@example.com');
                await messageField.fill('This is a test message');

                const contactSection = page
                    .locator('section')
                    .filter({ hasText: /contact/i })
                    .first();
                await expect(contactSection).toHaveScreenshot('contact-form-filled.png');
            }
        });
    });

    test.describe('Command Palette States', () => {
        test('should match command palette (open)', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            const commandPalette = page.locator('[role="dialog"], .command-palette').first();

            if (await commandPalette.isVisible()) {
                await expect(commandPalette).toHaveScreenshot('command-palette-open.png');
            }
        });

        test('should match command palette (with search results)', async ({ page }) => {
            await page.goto('/en');

            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Type search query
            const searchInput = page.locator('input[type="text"], input[type="search"]').first();
            await searchInput.fill('services');
            await page.waitForTimeout(500);

            const commandPalette = page.locator('[role="dialog"], .command-palette').first();

            if (await commandPalette.isVisible()) {
                await expect(commandPalette).toHaveScreenshot('command-palette-search.png');
            }
        });
    });
});
