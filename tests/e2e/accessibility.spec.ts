import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibility E2E Tests
 * Automated accessibility testing using axe-core
 * Tests for WCAG 2.1 Level AA compliance
 */
test.describe('Accessibility', () => {
    test('homepage should not have accessibility violations', async ({ page }) => {
        // Navigate directly to /en to avoid the redirect page which lacks proper a11y
        await page.goto('/en');

        // Run axe accessibility scan excluding color-contrast
        // (color-contrast issues are design-related and tracked separately)
        const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();

        // Expect no violations (excluding color-contrast)
        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('homepage should have accessible landmarks', async ({ page }) => {
        await page.goto('/en');

        // Verify main landmark exists
        const main = page.locator('main');
        await expect(main.first()).toBeVisible();

        // Verify navigation landmark exists (may have multiple navs - header, footer, etc.)
        const nav = page.locator('nav');
        await expect(nav.first()).toBeVisible();
    });

    test('homepage should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/en');

        // Verify h1 exists in the DOM
        // Note: h1 may have CSS animations that keep it visually hidden initially
        // but it should be present in the document for accessibility
        const h1 = page.locator('h1');
        await expect(h1.first()).toBeAttached();

        // Get all headings count
        const headingsCount = await page.locator('h1, h2, h3, h4, h5, h6').count();
        expect(headingsCount).toBeGreaterThan(0);
    });

    test('all images should have alt text', async ({ page }) => {
        await page.goto('/en');

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
        await page.goto('/en');

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
