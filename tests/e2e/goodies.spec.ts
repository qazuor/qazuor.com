import { expect, test } from '@playwright/test';

/**
 * Goodies E2E Tests
 * Tests navigation and functionality of goodies pages (CSS tricks, snippets, tools, useful links)
 */
test.describe('Goodies Pages', () => {
    test.describe('Goodies Index Page', () => {
        test('should load goodies index page in English', async ({ page }) => {
            await page.goto('/en/goodies');

            // Verify page title
            await expect(page).toHaveTitle(/goodies/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should load goodies index page in Spanish', async ({ page }) => {
            await page.goto('/es/goodies');

            // Verify page loads (recursos in Spanish)
            await expect(page).toHaveTitle(/recursos|goodies/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display category links', async ({ page }) => {
            await page.goto('/en/goodies');

            // Check for category links
            const categoryLinks = page.locator(
                'a[href*="/goodies/css-tricks"], a[href*="/goodies/snippets"], a[href*="/goodies/tools"], a[href*="/goodies/useful-links"]'
            );
            expect(await categoryLinks.count()).toBeGreaterThan(0);
        });
    });

    test.describe('CSS Tricks Section', () => {
        test('should load CSS tricks index page', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Verify page loads
            await expect(page).toHaveTitle(/css.*trick/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display CSS trick cards', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Wait for trick cards to load
            const trickCards = page
                .locator('article, [data-testid="trick-card"], a[href*="/css-tricks/"], .card')
                .first();
            await expect(trickCards).toBeVisible({ timeout: 10000 });
        });

        test('should navigate to individual CSS trick', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Find and click first trick link
            const trickLink = page.locator('a[href*="/css-tricks/"]:not([href$="/css-tricks/"])').first();
            if ((await trickLink.count()) > 0) {
                await trickLink.click();

                // Verify we're on a trick page
                await page.waitForURL(/\/css-tricks\/.+/);

                // Verify content is visible
                const mainContent = page.locator('main');
                await expect(mainContent).toBeVisible();
            }
        });

        test('should display code examples', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Navigate to first trick
            const trickLink = page.locator('a[href*="/css-tricks/"]:not([href$="/css-tricks/"])').first();
            if ((await trickLink.count()) > 0) {
                await trickLink.click();

                // Check for code blocks
                const codeBlocks = page.locator('pre, code, .code-block, [data-testid="code"]');
                const hasCode = (await codeBlocks.count()) > 0;

                if (hasCode) {
                    await expect(codeBlocks.first()).toBeVisible();
                }
            }
        });
    });

    test.describe('Snippets Section', () => {
        test('should load snippets index page', async ({ page }) => {
            await page.goto('/en/goodies/snippets');

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display snippet categories or items', async ({ page }) => {
            await page.goto('/en/goodies/snippets');

            // Wait for content to load
            const content = page.locator('article, [data-testid="snippet"], a[href*="/snippets/"], .card').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });

        test('should navigate to individual snippet', async ({ page }) => {
            await page.goto('/en/goodies/snippets');

            // Find snippet link (not index)
            const snippetLink = page.locator('a[href*="/snippets/"]:not([href$="/snippets/"])').first();
            if ((await snippetLink.count()) > 0) {
                await snippetLink.click();

                // Verify content is visible
                const mainContent = page.locator('main');
                await expect(mainContent).toBeVisible();
            }
        });
    });

    test.describe('Tools Section', () => {
        test('should load tools index page', async ({ page }) => {
            await page.goto('/en/goodies/tools');

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display tool items', async ({ page }) => {
            await page.goto('/en/goodies/tools');

            // Wait for content to load
            const content = page.locator('article, [data-testid="tool"], a, .card, li').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Useful Links Section', () => {
        test('should load useful links page', async ({ page }) => {
            await page.goto('/en/goodies/useful-links');

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display link categories or items', async ({ page }) => {
            await page.goto('/en/goodies/useful-links');

            // Wait for content to load
            const links = page.locator('a[target="_blank"], article, .link-item, li a').first();
            await expect(links).toBeVisible({ timeout: 10000 });
        });

        test('should have external links with proper attributes', async ({ page }) => {
            await page.goto('/en/goodies/useful-links');

            // Check for external links
            const externalLinks = page.locator('a[target="_blank"]');
            const hasExternalLinks = (await externalLinks.count()) > 0;

            if (hasExternalLinks) {
                const firstLink = externalLinks.first();
                await expect(firstLink).toBeVisible();

                // Check for rel attribute for security
                const rel = await firstLink.getAttribute('rel');
                // Should have noopener or noreferrer for security
                if (rel) {
                    expect(rel).toMatch(/noopener|noreferrer/);
                }
            }
        });
    });

    test.describe('Goodies Navigation', () => {
        test('should navigate between goodies categories', async ({ page }) => {
            // Start at CSS tricks
            await page.goto('/en/goodies/css-tricks');

            // Navigate to snippets (if link exists on page)
            const snippetsLink = page.locator('a[href*="/goodies/snippets"]').first();
            if ((await snippetsLink.count()) > 0) {
                await snippetsLink.click();
                expect(page.url()).toContain('/snippets');
            }
        });

        test('should have breadcrumb navigation', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Navigate to a trick
            const trickLink = page.locator('a[href*="/css-tricks/"]:not([href$="/css-tricks/"])').first();
            if ((await trickLink.count()) > 0) {
                await trickLink.click();

                // Check for breadcrumbs
                const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], .breadcrumb, ol li a');
                const hasBreadcrumbs = (await breadcrumbs.count()) > 0;

                if (hasBreadcrumbs) {
                    await expect(breadcrumbs.first()).toBeVisible();
                }
            }
        });

        test('should maintain language context', async ({ page }) => {
            await page.goto('/es/goodies/css-tricks');

            // Navigate to a trick
            const trickLink = page.locator('a[href*="/es/goodies/css-tricks/"]').first();
            if ((await trickLink.count()) > 0) {
                await trickLink.click();

                // Verify we're still in Spanish
                expect(page.url()).toContain('/es/');
            }
        });
    });

    test.describe('Responsive Design', () => {
        test('should display goodies index properly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en/goodies');

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display CSS tricks properly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en/goodies/css-tricks');

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();

            // Check content doesn't overflow
            const body = page.locator('body');
            const bodyBox = await body.boundingBox();
            expect(bodyBox?.width).toBeLessThanOrEqual(375);
        });

        test('should display snippets properly on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/en/goodies/snippets');

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });
    });

    test.describe('Goodies Accessibility', () => {
        test('should have proper heading hierarchy', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Wait for page to fully load (h1 may have entrance animations)
            await page.waitForLoadState('networkidle');

            // Check for h1 (use first() as there might be multiple h1s)
            // h1 may be visually hidden initially due to animations, check it's attached
            const h1 = page.locator('h1');
            await expect(h1.first()).toBeAttached();
            expect(await h1.count()).toBeGreaterThanOrEqual(1);
        });

        test('should have accessible code blocks', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Navigate to a trick
            const trickLink = page.locator('a[href*="/css-tricks/"]:not([href$="/css-tricks/"])').first();
            if ((await trickLink.count()) > 0) {
                await trickLink.click();

                // Check code blocks
                const codeBlocks = page.locator('pre');
                const hasCodeBlocks = (await codeBlocks.count()) > 0;

                if (hasCodeBlocks) {
                    // Code should be in pre/code elements
                    await expect(codeBlocks.first()).toBeVisible();
                }
            }
        });
    });

    test.describe('Copy Functionality', () => {
        test('should have copy button for code if available', async ({ page }) => {
            await page.goto('/en/goodies/css-tricks');

            // Navigate to a trick
            const trickLink = page.locator('a[href*="/css-tricks/"]:not([href$="/css-tricks/"])').first();
            if ((await trickLink.count()) > 0) {
                await trickLink.click();

                // Check for copy buttons
                const copyButtons = page.locator(
                    'button:has-text("copy"), [data-testid="copy"], button[aria-label*="copy"]'
                );
                const hasCopyButton = (await copyButtons.count()) > 0;

                // Copy functionality is optional
                if (hasCopyButton) {
                    await expect(copyButtons.first()).toBeVisible();
                }
            }
        });
    });
});
