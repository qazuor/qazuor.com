import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibility E2E Tests
 * Automated accessibility testing using axe-core
 * Tests for WCAG 2.1 Level AA compliance
 */
test.describe('Accessibility', () => {
    test('homepage should not have accessibility violations', async ({ page }) => {
        await page.goto('/');

        // Run axe accessibility scan
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        // Expect no violations
        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('homepage should have accessible landmarks', async ({ page }) => {
        await page.goto('/');

        // Verify main landmark exists
        const main = page.locator('main');
        await expect(main).toBeVisible();

        // Verify navigation landmark exists
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();
    });

    test('homepage should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/');

        // Verify h1 exists
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();

        // Get all headings count
        const headingsCount = await page.locator('h1, h2, h3, h4, h5, h6').count();
        expect(headingsCount).toBeGreaterThan(0);
    });

    test('all images should have alt text', async ({ page }) => {
        await page.goto('/');

        // Get all images
        const images = page.locator('img');
        const imagesCount = await images.count();

        if (imagesCount > 0) {
            // Check each image has alt attribute
            for (let i = 0; i < imagesCount; i++) {
                const img = images.nth(i);
                const hasAlt = await img.getAttribute('alt');
                expect(hasAlt).not.toBeNull();
            }
        }
    });

    test('interactive elements should be keyboard accessible', async ({ page }) => {
        await page.goto('/');

        // Get all buttons
        const buttons = page.locator('button');
        const buttonsCount = await buttons.count();

        if (buttonsCount > 0) {
            // Focus first button with keyboard
            await page.keyboard.press('Tab');

            // Check that focus is on a focusable element
            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();
        }
    });
});
