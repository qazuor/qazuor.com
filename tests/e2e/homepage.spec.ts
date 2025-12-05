import { expect, test } from '@playwright/test';

/**
 * Homepage E2E Tests
 * Tests basic functionality and navigation of the homepage
 * Note: Navigate to /en directly to avoid redirect page
 */
test.describe('Homepage', () => {
    test('should load and display main content', async ({ page }) => {
        await page.goto('/en');

        // Verify page title contains name or brand
        await expect(page).toHaveTitle(/leandro|asrilevich|full.?stack/i);

        // Verify main content is visible
        const mainContent = page.locator('main#main-content');
        await expect(mainContent).toBeVisible();
    });

    test('should have working navigation', async ({ page }) => {
        await page.goto('/en');

        // Wait for page to fully load
        await page.waitForLoadState('networkidle');

        // Verify navigation exists and has links
        const navLinks = page.locator('nav a');
        expect(await navLinks.count()).toBeGreaterThan(0);
    });

    test('should have accessible skip link', async ({ page }) => {
        await page.goto('/en');

        // Verify skip to main content link exists (may be visually hidden until focused)
        const skipLink = page.locator('a[href="#main-content"]');
        await expect(skipLink).toBeAttached();

        // Focus the skip link to make it visible
        await skipLink.focus();
        await expect(skipLink).toBeVisible();
    });

    test('should render hero section', async ({ page }) => {
        await page.goto('/en');

        // Verify hero section is present
        const heroSection = page.locator('section').first();
        await expect(heroSection).toBeVisible();
    });
});
