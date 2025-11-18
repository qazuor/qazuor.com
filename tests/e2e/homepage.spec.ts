import { expect, test } from '@playwright/test';

/**
 * Homepage E2E Tests
 * Tests basic functionality and navigation of the homepage
 */
test.describe('Homepage', () => {
    test('should load and display main content', async ({ page }) => {
        await page.goto('/');

        // Verify page title
        await expect(page).toHaveTitle(/qazuor/i);

        // Verify main content is visible
        const mainContent = page.locator('main#main-content');
        await expect(mainContent).toBeVisible();
    });

    test('should have working navigation', async ({ page }) => {
        await page.goto('/');

        // Verify navigation exists and has links
        const navLinks = page.locator('nav a');
        expect(await navLinks.count()).toBeGreaterThan(0);
    });

    test('should have accessible skip link', async ({ page }) => {
        await page.goto('/');

        // Verify skip to main content link exists
        const skipLink = page.locator('a[href="#main-content"]');
        await expect(skipLink).toBeInViewport();
    });

    test('should render hero section', async ({ page }) => {
        await page.goto('/');

        // Verify hero section is present
        const heroSection = page.locator('section').first();
        await expect(heroSection).toBeVisible();
    });
});
