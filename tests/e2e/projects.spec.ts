import { expect, test } from '@playwright/test';

/**
 * Projects E2E Tests
 * Tests navigation and functionality of projects pages
 */
test.describe('Projects Pages', () => {
    test.describe('Projects Index Page', () => {
        test('should load projects index page in English', async ({ page }) => {
            await page.goto('/en/projects');

            // Verify page title
            await expect(page).toHaveTitle(/projects/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should load projects index page in Spanish', async ({ page }) => {
            await page.goto('/es/projects');

            // Verify page title (proyectos in Spanish)
            await expect(page).toHaveTitle(/proyectos/i);

            // Verify main content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display project cards', async ({ page }) => {
            await page.goto('/en/projects');

            // Wait for project cards to load
            const projectCards = page
                .locator('article, [data-testid="project-card"], a[href*="/projects/"], .project-card')
                .first();
            await expect(projectCards).toBeVisible({ timeout: 10000 });
        });

        test('should have filter options if available', async ({ page }) => {
            await page.goto('/en/projects');

            // Check for filters (optional feature)
            const filters = page.locator(
                'button:has-text("filter"), [data-testid="filter"], select, .filters, [role="tablist"]'
            );
            const hasFilters = (await filters.count()) > 0;

            // Filters are optional
            if (hasFilters) {
                await expect(filters.first()).toBeVisible();
            }
        });
    });

    test.describe('Individual Project Pages', () => {
        test('should navigate to a project from index', async ({ page }) => {
            await page.goto('/en/projects');

            // Find and click first project link
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Verify we're on a project page (not index)
            await page.waitForURL(/\/projects\/.+/);
            expect(page.url()).toMatch(/\/projects\/.+/);

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display project details', async ({ page }) => {
            await page.goto('/en/projects');

            // Navigate to first project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Check for project title
            const title = page.locator('h1').first();
            await expect(title).toBeVisible();

            // Check for description/content
            const content = page.locator('article, .prose, main p, .description').first();
            await expect(content).toBeVisible();
        });

        test('should display technology stack', async ({ page }) => {
            await page.goto('/en/projects');

            // Navigate to first project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Check for tech stack (badges, tags, or list)
            const techStack = page.locator('.tech-stack, [data-testid="technologies"], .technologies, .tags, .badges');
            const hasTechStack = (await techStack.count()) > 0;

            if (hasTechStack) {
                await expect(techStack.first()).toBeVisible();
            }
        });

        test('should have project links (live demo, github)', async ({ page }) => {
            await page.goto('/en/projects');

            // Navigate to first project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Check for external links
            const projectLinks = page.locator('a[href*="github"], a[target="_blank"], a:has-text("demo")');
            const hasLinks = (await projectLinks.count()) > 0;

            // External links are optional
            if (hasLinks) {
                await expect(projectLinks.first()).toBeVisible();
            }
        });

        test('should display project images', async ({ page }) => {
            await page.goto('/en/projects');

            // Navigate to first project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Check for images
            const images = page.locator('img');
            const hasImages = (await images.count()) > 0;

            if (hasImages) {
                await expect(images.first()).toBeVisible();
            }
        });
    });

    test.describe('Project Navigation', () => {
        test('should return to projects index', async ({ page }) => {
            // First visit homepage to establish browser history
            await page.goto('/en');
            await page.waitForLoadState('networkidle');

            // Then navigate to projects
            await page.goto('/en/projects');
            await page.waitForLoadState('networkidle');

            // Navigate to first project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            if ((await projectLink.count()) > 0) {
                await projectLink.click();
                await page.waitForLoadState('networkidle');

                // Go back
                await page.goBack();
                await page.waitForLoadState('networkidle');

                // Verify we're back at projects index
                expect(page.url()).toContain('/projects');
            }
        });

        test('should maintain language context', async ({ page }) => {
            await page.goto('/es/projects');

            // Navigate to first project
            const projectLink = page.locator('a[href*="/es/projects/"]').first();
            if ((await projectLink.count()) > 0) {
                await projectLink.click();

                // Verify we're still in Spanish
                expect(page.url()).toContain('/es/');
            }
        });

        test('should have breadcrumb navigation', async ({ page }) => {
            await page.goto('/en/projects');

            // Navigate to a project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Check for breadcrumbs
            const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], .breadcrumb, ol li a');
            const hasBreadcrumbs = (await breadcrumbs.count()) > 0;

            if (hasBreadcrumbs) {
                await expect(breadcrumbs.first()).toBeVisible();
            }
        });
    });

    test.describe('Project Filters', () => {
        test('should filter projects by technology if available', async ({ page }) => {
            await page.goto('/en/projects');

            // Look for filter buttons
            const filterButtons = page.locator('button[data-filter], [role="tab"], .filter-btn');
            const hasFilters = (await filterButtons.count()) > 0;

            if (hasFilters) {
                // Click a filter
                await filterButtons.first().click();

                // Verify projects are still visible (may be filtered)
                const projectCards = page.locator('article, [data-testid="project-card"]').first();
                await expect(projectCards).toBeVisible({ timeout: 5000 });
            }
        });
    });

    test.describe('Responsive Design', () => {
        test('should display properly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en/projects');

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();

            // Check content doesn't overflow
            const body = page.locator('body');
            const bodyBox = await body.boundingBox();
            expect(bodyBox?.width).toBeLessThanOrEqual(375);
        });

        test('should display project page properly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en/projects');

            // Navigate to first project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });

        test('should display properly on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/en/projects');

            // Verify content is visible
            const mainContent = page.locator('main');
            await expect(mainContent).toBeVisible();
        });
    });

    test.describe('Project Accessibility', () => {
        test('should have proper heading hierarchy', async ({ page }) => {
            await page.goto('/en/projects');

            // Navigate to a project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

            // Check for h1 (use first() as there might be multiple h1s)
            const h1 = page.locator('h1');
            await expect(h1.first()).toBeVisible();
            expect(await h1.count()).toBeGreaterThanOrEqual(1);
        });

        test('should have alt text on images', async ({ page }) => {
            await page.goto('/en/projects');

            // Navigate to a project
            const projectLink = page.locator('a[href*="/projects/"]').first();
            await projectLink.click();

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
});
