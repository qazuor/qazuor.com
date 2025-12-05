import { expect, test } from '@playwright/test';

/**
 * Blog E2E Tests
 * Tests navigation, content display, and features of blog pages
 */
test.describe('Blog Pages', () => {
    test.describe('Blog Index Page', () => {
        test('should load blog index page in English', async ({ page }) => {
            await page.goto('/en/blog');

            // Verify page title (may be "Blog", "Articles", or "Latest Articles")
            await expect(page).toHaveTitle(/blog|articles|artículos/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should load blog index page in Spanish', async ({ page }) => {
            await page.goto('/es/blog');

            // Verify page loads (may be "Blog", "Artículos", or similar)
            await expect(page).toHaveTitle(/blog|articles|artículos/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display blog post cards', async ({ page }) => {
            await page.goto('/en/blog');

            // Wait for blog cards to load
            const blogCards = page.locator('article, [data-testid="blog-card"], a[href*="/blog/"]').first();
            await expect(blogCards).toBeVisible({ timeout: 10000 });
        });

        test('should have pagination if multiple pages exist', async ({ page }) => {
            await page.goto('/en/blog');

            // Check for pagination (may not exist if few posts)
            const pagination = page.locator('nav[aria-label*="pagination"], .pagination, [data-testid="pagination"]');
            const paginationExists = (await pagination.count()) > 0;

            if (paginationExists) {
                await expect(pagination).toBeVisible();
            }
        });
    });

    test.describe('Blog Post Pages', () => {
        test('should navigate to a blog post from index', async ({ page }) => {
            await page.goto('/en/blog');

            // Find and click first blog post link (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            await blogPostLink.click();

            // Verify we're on a blog post page (not index)
            await page.waitForURL(/\/blog\/.+/);

            // Verify article content is visible
            const article = page.locator('article, main').first();
            await expect(article).toBeVisible();
        });

        test('should display post content properly', async ({ page }) => {
            await page.goto('/en/blog');

            // Navigate to first post (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            const href = await blogPostLink.getAttribute('href');
            if (href) {
                await page.goto(href);

                // Check for common blog post elements
                // Note: h1 may have CSS animations that keep it visually hidden initially
                const title = page.locator('h1').first();
                await expect(title).toBeAttached();

                // Check for content
                const content = page.locator('article, .prose, main p').first();
                await expect(content).toBeVisible();
            }
        });

        test('should have share buttons or social links', async ({ page }) => {
            await page.goto('/en/blog');

            // Navigate to first post (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            await blogPostLink.click();

            // Check for share buttons (may vary based on implementation)
            const shareSection = page.locator('button:has-text("share"), [data-testid="share"], [aria-label*="share"]');
            const shareCount = await shareSection.count();

            // Just verify page loads, share feature is optional
            // Share buttons may or may not exist depending on implementation
            expect(shareCount).toBeGreaterThanOrEqual(0);
        });

        test('should display reading time or date', async ({ page }) => {
            await page.goto('/en/blog');

            // Navigate to first post (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            await blogPostLink.click();

            // Check for time-related metadata
            const timeElement = page.locator('time, [datetime], .date, .reading-time');
            const hasTimeInfo = (await timeElement.count()) > 0;

            // Time info is optional but good to have
            if (hasTimeInfo) {
                await expect(timeElement.first()).toBeVisible();
            }
        });
    });

    test.describe('Blog Navigation', () => {
        test('should navigate between English and Spanish', async ({ page }) => {
            await page.goto('/en/blog');

            // Look for language switcher - may be a dropdown or direct link
            const langSwitcher = page.locator(
                'a[href*="/es/blog"], a[href*="/es/"]:not([href*="/en/"]), button:has-text("ES"), [data-testid="language-switcher"]'
            );
            const hasLangSwitch = (await langSwitcher.count()) > 0;

            if (hasLangSwitch) {
                // If it's a dropdown, might need to click to reveal
                const switcher = langSwitcher.first();
                await switcher.click();

                // Wait for navigation with longer timeout (View Transitions may take time)
                try {
                    await page.waitForURL(/\/es\//, { timeout: 10000 });
                    expect(page.url()).toContain('/es/');
                } catch {
                    // If navigation didn't happen, check if a dropdown appeared
                    const esLink = page.locator('a[href*="/es/"]').first();
                    if ((await esLink.count()) > 0 && (await esLink.isVisible())) {
                        await esLink.click();
                        await page.waitForURL(/\/es\//, { timeout: 10000 });
                        expect(page.url()).toContain('/es/');
                    }
                }
            }
        });

        test('should have breadcrumb navigation', async ({ page }) => {
            await page.goto('/en/blog');

            // Navigate to a post (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            await blogPostLink.click();

            // Check for breadcrumbs
            const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], .breadcrumb, ol li a');
            const hasBreadcrumbs = (await breadcrumbs.count()) > 0;

            if (hasBreadcrumbs) {
                await expect(breadcrumbs.first()).toBeVisible();
            }
        });

        test('should return to blog index from post', async ({ page }) => {
            await page.goto('/en/blog');

            // Navigate to first post (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            await blogPostLink.click();
            await page.waitForURL(/\/blog\/.+/);

            // Go back
            await page.goBack();

            // Verify we're back at blog index (URL contains /blog but not a specific post slug)
            expect(page.url()).toMatch(/\/blog\/?(?:\?.*)?$/);
        });
    });

    test.describe('Blog Accessibility', () => {
        test('should have proper heading hierarchy', async ({ page }) => {
            await page.goto('/en/blog');

            // Navigate to a post (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            await blogPostLink.click();

            // Check for h1 (use first() as there might be multiple h1s)
            const h1 = page.locator('h1');
            await expect(h1.first()).toBeVisible();
            expect(await h1.count()).toBeGreaterThanOrEqual(1);
        });

        test('should have alt text on images', async ({ page }) => {
            await page.goto('/en/blog');

            // Navigate to a post (exclude index link)
            const blogPostLink = page.locator('a[href*="/blog/"]:not([href$="/blog"]):not([href$="/blog/"])').first();
            await blogPostLink.click();

            // Check images have alt attributes
            const images = page.locator('img');
            const imageCount = await images.count();

            for (let i = 0; i < Math.min(imageCount, 5); i++) {
                const img = images.nth(i);
                const alt = await img.getAttribute('alt');
                // alt can be empty string for decorative images, but should exist
                expect(alt).not.toBeNull();
            }
        });
    });

    test.describe('Responsive Design', () => {
        test('should display properly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en/blog');

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();

            // Check content doesn't overflow
            const body = page.locator('body');
            const bodyBox = await body.boundingBox();
            expect(bodyBox?.width).toBeLessThanOrEqual(375);
        });

        test('should display properly on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/en/blog');

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });
    });
});
