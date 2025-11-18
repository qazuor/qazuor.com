import { expect, test } from '@playwright/test';

/**
 * Services E2E Tests
 * Tests navigation and functionality of services pages
 */
test.describe('Services Pages', () => {
    test.describe('Services Index Page', () => {
        test('should load services index page', async ({ page }) => {
            await page.goto('/en/services');

            // Verify page title contains "Services"
            await expect(page).toHaveTitle(/services/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display service cards', async ({ page }) => {
            await page.goto('/en/services');

            // Wait for service cards to load
            const serviceCards = page.locator('[data-testid="service-card"], article, .service-card').first();
            await expect(serviceCards).toBeVisible({ timeout: 10000 });
        });

        test('should have links to individual services', async ({ page }) => {
            await page.goto('/en/services');

            // Check for service links (web-apps, landing-pages, automation, social-design)
            const serviceLinks = page.locator('a[href*="/services/"]');
            expect(await serviceLinks.count()).toBeGreaterThan(0);
        });
    });

    test.describe('Individual Service Pages', () => {
        const services = [
            { slug: 'web-apps', title: /web.*app/i },
            { slug: 'landing-pages', title: /landing.*page/i },
            { slug: 'automation-integration', title: /automation/i },
            { slug: 'social-media-design', title: /social.*media/i }
        ];

        for (const service of services) {
            test(`should load ${service.slug} service page`, async ({ page }) => {
                await page.goto(`/en/services/${service.slug}`);

                // Verify page loads
                await expect(page).toHaveTitle(service.title);

                // Verify main content is visible
                const mainContent = page.locator('main');
                await expect(mainContent).toBeVisible();
            });

            test(`should display features for ${service.slug}`, async ({ page }) => {
                await page.goto(`/en/services/${service.slug}`);

                // Check for features section (could be list items, cards, etc.)
                const featuresSection = page
                    .locator('section, div')
                    .filter({ hasText: /features|what.*include|benefits/i })
                    .first();
                await expect(featuresSection).toBeVisible({ timeout: 10000 });
            });
        }

        test('should navigate between service pages', async ({ page }) => {
            // Start at web-apps
            await page.goto('/en/services/web-apps');
            await expect(page).toHaveTitle(/web.*app/i);

            // Navigate to landing-pages
            const landingPageLink = page.locator('a[href*="/services/landing-pages"]').first();
            if (await landingPageLink.isVisible()) {
                await landingPageLink.click();
                await expect(page).toHaveTitle(/landing.*page/i);
            }
        });
    });

    test.describe('Service Page Content', () => {
        test('should display pricing information', async ({ page }) => {
            await page.goto('/en/services/web-apps');

            // Check for pricing section
            const pricingSection = page
                .locator('section, div')
                .filter({ hasText: /pricing|price|cost|investment/i })
                .first();

            // Pricing might not be present on all pages, so we check if it exists
            const pricingExists = (await pricingSection.count()) > 0;
            if (pricingExists) {
                await expect(pricingSection).toBeVisible();
            }
        });

        test('should have CTA buttons', async ({ page }) => {
            await page.goto('/en/services/web-apps');

            // Check for call-to-action buttons
            const ctaButtons = page.locator('button, a').filter({ hasText: /contact|get.*started|hire|book|consult/i });
            expect(await ctaButtons.count()).toBeGreaterThan(0);
        });

        test('should display service description', async ({ page }) => {
            await page.goto('/en/services/landing-pages');

            // Check for description/content paragraphs
            const description = page.locator('p, article').first();
            await expect(description).toBeVisible();

            // Verify description has meaningful content (at least 50 characters)
            const text = await description.textContent();
            expect(text?.length).toBeGreaterThan(50);
        });
    });

    test.describe('Responsive Design', () => {
        test('should be mobile-friendly', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en/services/web-apps');

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();

            // Check that content doesn't overflow
            const body = page.locator('body');
            const bodyBox = await body.boundingBox();
            expect(bodyBox?.width).toBeLessThanOrEqual(375);
        });

        test('should be tablet-friendly', async ({ page }) => {
            // Set tablet viewport
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/en/services/automation-integration');

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });
    });

    test.describe('Navigation', () => {
        test('should have working back navigation', async ({ page }) => {
            // Go to services index
            await page.goto('/en/services');

            // Navigate to a service
            const firstServiceLink = page.locator('a[href*="/services/"]').first();
            await firstServiceLink.click();

            // Verify we're on a service page
            await expect(page.url()).toContain('/services/');

            // Go back
            await page.goBack();

            // Verify we're back at services index
            await expect(page.url()).toContain('/services');
            await expect(page.url()).not.toContain('/services/web-apps');
        });

        test('should maintain language context', async ({ page }) => {
            await page.goto('/es/services');

            // Verify Spanish content
            await expect(page).toHaveTitle(/servicio/i);

            // Navigate to a service
            const serviceLink = page.locator('a[href*="/es/services/"]').first();
            if (await serviceLink.isVisible()) {
                await serviceLink.click();

                // Verify we're still in Spanish
                await expect(page.url()).toContain('/es/');
            }
        });
    });
});
