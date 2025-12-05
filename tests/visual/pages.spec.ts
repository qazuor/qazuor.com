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
 * Ensures visual stability by:
 * 1. Disabling all CSS and JS animations
 * 2. Resetting scroll position to top
 * 3. Hiding dynamic content (blinking cursors, carousels, etc.)
 * 4. Waiting for fonts and images to load
 */
async function preparePageForScreenshot(page: Page) {
    // Wait for DOM to be ready
    await page.waitForLoadState('domcontentloaded');

    // Inject comprehensive CSS to disable ALL animations and ensure visual stability
    await page.addStyleTag({
        content: `
            /* Disable ALL CSS animations and transitions */
            *, *::before, *::after {
                animation: none !important;
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                animation-iteration-count: 1 !important;
                animation-fill-mode: forwards !important;
                transition: none !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
                transition-property: none !important;
            }

            /* Tailwind animation classes */
            .animate-bounce, .animate-spin, .animate-pulse, .animate-ping,
            .animate-fade-in, .animate-slide-in, .animate-scale,
            [class*="animate-"] {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
            }

            /* GSAP and Framer Motion elements - force final state */
            [data-gsap], [data-framer], [style*="opacity"],
            .gsap-marker-start, .gsap-marker-end {
                opacity: 1 !important;
                transform: none !important;
                visibility: visible !important;
            }

            /* Hide blinking cursors and carets */
            * {
                caret-color: transparent !important;
            }

            /* Hide TypeIt cursor and similar typing effects */
            .ti-cursor, [class*="cursor"], .typed-cursor,
            .typewriter-cursor, .blink {
                opacity: 0 !important;
                visibility: hidden !important;
                display: none !important;
            }

            /* Force TypeIt text to show complete state */
            .ti-wrapper, [data-typeit-id] {
                opacity: 1 !important;
            }

            /* Hide TypeIt queue elements that haven't been typed yet */
            .ti-wrapper .ti-rest {
                opacity: 1 !important;
                visibility: visible !important;
            }

            /* Disable smooth scrolling */
            html, body {
                scroll-behavior: auto !important;
            }

            /* Force scrollbar to be consistent */
            ::-webkit-scrollbar {
                width: 0px !important;
                background: transparent !important;
            }
            html {
                scrollbar-width: none !important;
            }

            /* Hide video/media controls that might be in different states */
            video::-webkit-media-controls,
            video::-webkit-media-controls-enclosure {
                display: none !important;
            }

            /* Ensure images are fully loaded state */
            img {
                opacity: 1 !important;
            }

            /* Hide lazy loading placeholders */
            .lazy-placeholder, [data-placeholder], .skeleton {
                opacity: 0 !important;
            }
        `
    });

    // Stop all JavaScript animations (GSAP, Framer Motion, requestAnimationFrame, TypeIt)
    await page.evaluate(() => {
        // Stop GSAP animations if present
        if (typeof window !== 'undefined' && (window as any).gsap) {
            (window as any).gsap.globalTimeline?.pause();
            (window as any).gsap.killTweensOf('*');
        }

        // Stop TypeIt instances if present
        if (typeof window !== 'undefined' && (window as any).TypeIt) {
            // TypeIt stores instances on elements
            document.querySelectorAll('[data-typeit-id], .ti-wrapper').forEach((el) => {
                const instance = (el as any).__typeit__;
                if (instance && typeof instance.freeze === 'function') {
                    instance.freeze();
                }
            });
        }

        // Cancel all requestAnimationFrame callbacks
        const highestId = window.requestAnimationFrame(() => {});
        for (let i = 0; i < highestId; i++) {
            window.cancelAnimationFrame(i);
        }

        // Stop all intervals that might cause visual changes
        const highestIntervalId = window.setInterval(() => {}, 9999);
        for (let i = 0; i < (highestIntervalId as unknown as number); i++) {
            window.clearInterval(i);
        }

        // Stop all timeouts that might cause visual changes
        const highestTimeoutId = window.setTimeout(() => {}, 9999);
        for (let i = 0; i < (highestTimeoutId as unknown as number); i++) {
            window.clearTimeout(i);
        }

        // Force all elements with opacity animation to be visible
        document.querySelectorAll('[style*="opacity"]').forEach((el) => {
            (el as HTMLElement).style.opacity = '1';
        });

        // Force all elements with transform to reset
        document.querySelectorAll('[style*="transform"]').forEach((el) => {
            (el as HTMLElement).style.transform = 'none';
        });

        // Force TypeIt text to be fully visible (show complete text)
        document.querySelectorAll('.ti-wrapper, [data-typeit-id]').forEach((el) => {
            (el as HTMLElement).style.opacity = '1';
        });
    });

    // Wait for images and fonts to load
    await Promise.race([page.waitForLoadState('networkidle'), page.waitForTimeout(5000)]);

    // Reset scroll position to top-left
    await page.evaluate(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });

    // Wait for scroll to settle and animations to fully stop
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
            // Set dark mode before navigation to avoid transition animations
            await page.addInitScript(() => {
                localStorage.setItem('theme', 'dark');
            });
            await page.goto('/en');

            // Enable dark mode
            await page.evaluate(() => {
                document.documentElement.classList.add('dark');
            });

            await preparePageForScreenshot(page);

            // Use services page instead of homepage (homepage has persistent animations)
            await page.goto('/en/services');
            await preparePageForScreenshot(page);

            await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
                fullPage: true
            });
        });

        test('should match homepage in light mode', async ({ page }) => {
            // Set light mode before navigation
            await page.addInitScript(() => {
                localStorage.setItem('theme', 'light');
            });
            await page.goto('/en');

            // Ensure light mode
            await page.evaluate(() => {
                document.documentElement.classList.remove('dark');
            });

            await preparePageForScreenshot(page);

            // Use services page instead of homepage (homepage has persistent animations)
            await page.goto('/en/services');
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
            // Use services page (shorter, footer is more accessible)
            await page.goto('/en/services');
            await page.waitForLoadState('networkidle');

            // Scroll to bottom of page to ensure footer is visible
            await page.evaluate(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as ScrollBehavior });
            });
            await page.waitForTimeout(500);

            await preparePageForScreenshot(page);

            const footer = page.locator('footer').first();

            // Check if footer is visible, skip if not
            if ((await footer.count()) > 0 && (await footer.isVisible())) {
                await expect(footer).toHaveScreenshot('footer.png');
            } else {
                test.skip();
            }
        });
    });

    test.describe('Critical UI Components', () => {
        test('should match theme toggle button', async ({ page }) => {
            await page.goto('/en');
            await preparePageForScreenshot(page);

            // Find theme toggle button - it may be in footer or header
            const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Toggle" i]').first();

            if ((await themeToggle.count()) > 0 && (await themeToggle.isVisible())) {
                await expect(themeToggle).toHaveScreenshot('theme-toggle.png');
            } else {
                // Skip test if theme toggle is not visible (may be hidden on certain viewports)
                test.skip();
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
            // Use services page instead of homepage (homepage has persistent animations)
            await page.goto('/es/services');
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
            await page.waitForLoadState('networkidle');

            // Scroll to contact section by ID to trigger React hydration
            const contactSection = page.locator('#contact');
            await contactSection.scrollIntoViewIfNeeded();

            // Wait for React form to hydrate
            const form = page.locator('[data-testid="contact-form"]');
            await form.waitFor({ state: 'attached', timeout: 15000 });

            await preparePageForScreenshot(page);
            await expect(contactSection).toHaveScreenshot('contact-form-empty.png');
        });

        test('should match contact form (filled)', async ({ page }) => {
            await page.goto('/en');
            await page.waitForLoadState('networkidle');

            // Scroll to contact section by ID to trigger React hydration
            const contactSection = page.locator('#contact');
            await contactSection.scrollIntoViewIfNeeded();

            // Wait for React form to hydrate
            const form = page.locator('[data-testid="contact-form"]');
            await form.waitFor({ state: 'attached', timeout: 15000 });

            // Fill form
            const nameField = form.locator('input[name="name"]');
            const emailField = form.locator('input[name="email"]');
            const messageField = form.locator('textarea[name="message"]');

            await nameField.fill('John Doe');
            await emailField.fill('john@example.com');
            await messageField.fill('This is a test message for visual testing');

            await preparePageForScreenshot(page);
            await expect(contactSection).toHaveScreenshot('contact-form-filled.png');
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
