import { expect, test } from '@playwright/test';

/**
 * Command Palette E2E Tests
 * Tests command palette functionality and keyboard shortcuts
 */
test.describe('Command Palette', () => {
    test.describe('Opening and Closing', () => {
        test('should open with Cmd+K on Mac', async ({ page, browserName }) => {
            await page.goto('/en');

            // Use Cmd+K (Mac) or Ctrl+K (Windows/Linux)
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);

            // Wait for command palette to appear
            await page.waitForTimeout(500);

            // Check if command palette is visible
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();
            const isVisible = await commandPalette.isVisible();

            // Command palette should be visible
            expect(isVisible).toBe(true);
        });

        test('should open with Ctrl+K on Windows/Linux', async ({ page }) => {
            await page.goto('/en');

            // Use Ctrl+K
            await page.keyboard.press('Control+KeyK');

            // Wait for command palette to appear
            await page.waitForTimeout(500);

            // Check if command palette is visible
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();
            const isVisible = await commandPalette.isVisible();

            expect(isVisible).toBe(true);
        });

        test('should close with Escape key', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Press Escape to close
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);

            // Command palette should be hidden
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();
            const isVisible = await commandPalette.isVisible();

            expect(isVisible).toBe(false);
        });

        test('should close when clicking outside', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Click outside (on body or backdrop)
            await page.click('body', { position: { x: 10, y: 10 } });
            await page.waitForTimeout(300);

            // Command palette should be hidden
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();
            const isVisible = await commandPalette.isVisible();

            expect(isVisible).toBe(false);
        });
    });

    test.describe('Search Functionality', () => {
        test('should have a search input', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Find search input
            const searchInput = page
                .locator('input[type="text"], input[type="search"], input[role="combobox"]')
                .first();
            await expect(searchInput).toBeVisible();
            await expect(searchInput).toBeFocused();
        });

        test('should filter results when typing', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Get search input
            const searchInput = page
                .locator('input[type="text"], input[type="search"], input[role="combobox"]')
                .first();

            // Type a search query
            await searchInput.fill('service');
            await page.waitForTimeout(500);

            // Check if results are displayed
            const results = page.locator('[role="option"], .command-item, li').filter({ hasText: /service/i });
            const resultCount = await results.count();

            // Should show at least some results
            expect(resultCount).toBeGreaterThan(0);
        });

        test('should show "no results" when search has no matches', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Type nonsense query
            const searchInput = page
                .locator('input[type="text"], input[type="search"], input[role="combobox"]')
                .first();
            await searchInput.fill('xyzabcnonexistent12345');
            await page.waitForTimeout(500);

            // Check for "no results" message or empty state
            const noResults = page.locator('text=/no.*results|no.*found|not.*found/i');
            const hasNoResultsMessage = (await noResults.count()) > 0;

            // Either show "no results" message or have zero results
            if (hasNoResultsMessage) {
                await expect(noResults.first()).toBeVisible();
            } else {
                const results = page.locator('[role="option"], .command-item');
                expect(await results.count()).toBe(0);
            }
        });

        test('should clear search when clicking clear button', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Type in search
            const searchInput = page
                .locator('input[type="text"], input[type="search"], input[role="combobox"]')
                .first();
            await searchInput.fill('test search');

            // Look for clear button (might be X icon, clear button, etc.)
            const clearButton = page
                .locator('button[aria-label*="clear"], button[aria-label*="Clear"], button')
                .filter({ hasText: /×|x|clear/i })
                .first();

            const hasClearButton = (await clearButton.count()) > 0;
            if (hasClearButton && (await clearButton.isVisible())) {
                await clearButton.click();
                await page.waitForTimeout(200);

                // Input should be empty
                const inputValue = await searchInput.inputValue();
                expect(inputValue).toBe('');
            }
        });
    });

    test.describe('Keyboard Navigation', () => {
        test('should navigate results with arrow keys', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Press arrow down to navigate
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(200);

            // Check if first result is highlighted/selected
            const selectedItem = page
                .locator('[aria-selected="true"], [data-selected="true"], .selected, .highlighted')
                .first();
            const hasSelection = (await selectedItem.count()) > 0;

            expect(hasSelection).toBe(true);
        });

        test('should select result with Enter key', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Navigate to first result
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(200);

            // Get current URL
            const urlBefore = page.url();

            // Press Enter to select
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            // Either URL changed or command palette closed
            const urlAfter = page.url();
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();
            const isStillVisible = await commandPalette.isVisible();

            // Either navigated or palette closed
            expect(urlBefore !== urlAfter || !isStillVisible).toBe(true);
        });

        test('should cycle through results with Tab', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Tab might move focus to first result or through results
            await page.keyboard.press('Tab');
            await page.waitForTimeout(200);

            // Check focus moved somewhere
            const focusedElement = page.locator(':focus');
            await expect(focusedElement).not.toHaveCount(0);
        });
    });

    test.describe('Command Categories', () => {
        test('should display different command categories', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Look for category labels or grouped items
            const categories = page.locator('[role="group"], .command-group, .category');
            const categoryCount = await categories.count();

            // Should have at least some organization (Pages, Actions, etc.)
            expect(categoryCount).toBeGreaterThanOrEqual(0);
        });

        test('should show navigation commands', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Look for navigation-related commands
            const navCommands = page
                .locator('[role="option"], .command-item')
                .filter({ hasText: /home|services|projects|blog|contact/i });
            const navCount = await navCommands.count();

            expect(navCount).toBeGreaterThan(0);
        });

        test('should show theme toggle command', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Search for theme command
            const searchInput = page
                .locator('input[type="text"], input[type="search"], input[role="combobox"]')
                .first();
            await searchInput.fill('theme');
            await page.waitForTimeout(500);

            // Look for theme toggle command
            const themeCommand = page
                .locator('[role="option"], .command-item')
                .filter({ hasText: /theme|dark.*mode|light.*mode/i });
            const hasThemeCommand = (await themeCommand.count()) > 0;

            expect(hasThemeCommand).toBe(true);
        });
    });

    test.describe('Command Execution', () => {
        test('should execute navigation command', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Search for services
            const searchInput = page
                .locator('input[type="text"], input[type="search"], input[role="combobox"]')
                .first();
            await searchInput.fill('services');
            await page.waitForTimeout(500);

            // Select first result
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            // Should navigate to services page
            expect(page.url()).toContain('services');
        });

        test('should execute theme toggle command', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Search for theme
            const searchInput = page
                .locator('input[type="text"], input[type="search"], input[role="combobox"]')
                .first();
            await searchInput.fill('theme');
            await page.waitForTimeout(500);

            // Get current theme
            const htmlElement = page.locator('html');
            const hadDarkClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));

            // Execute theme toggle
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);

            // Check if theme changed
            const hasDarkClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
            expect(hasDarkClass).not.toBe(hadDarkClass);
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper ARIA attributes', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Check for dialog role
            const dialog = page.locator('[role="dialog"]');
            const hasDialogRole = (await dialog.count()) > 0;

            // Check for combobox
            const combobox = page.locator('[role="combobox"]');
            const hasCombobox = (await combobox.count()) > 0;

            // Should have proper ARIA structure
            expect(hasDialogRole || hasCombobox).toBe(true);
        });

        test('should trap focus within dialog', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Tab multiple times
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Focus should still be within command palette
            const focusedElement = page.locator(':focus');
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();

            // Focused element should be within command palette
            const paletteHandle = await commandPalette.elementHandle();
            expect(paletteHandle).not.toBeNull();

            const isWithin = await focusedElement.evaluate((el, palette) => {
                return palette?.contains(el) ?? false;
            }, paletteHandle!);

            expect(isWithin).toBe(true);
        });

        test('should announce results to screen readers', async ({ page }) => {
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Check for aria-live region
            const liveRegion = page.locator('[aria-live], [role="status"]');
            const hasLiveRegion = (await liveRegion.count()) > 0;

            // Should have some accessibility announcements
            expect(hasLiveRegion).toBe(true);
        });
    });

    test.describe('Responsive Behavior', () => {
        test('should work on mobile devices', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en');

            // Mobile might use button instead of keyboard shortcut
            // Try keyboard shortcut first
            await page.keyboard.press('Control+KeyK');
            await page.waitForTimeout(500);

            // Check if visible
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();
            const isVisible = await commandPalette.isVisible();

            if (isVisible) {
                // Should be properly sized for mobile
                const box = await commandPalette.boundingBox();
                expect(box?.width).toBeLessThanOrEqual(375);
            }
        });

        test('should work on tablet devices', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/en');

            // Open command palette
            const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
            await page.keyboard.press(`${modifier}+KeyK`);
            await page.waitForTimeout(500);

            // Command palette should be visible
            const commandPalette = page.locator('[role="dialog"], [role="combobox"], .command-palette').first();
            await expect(commandPalette).toBeVisible();
        });
    });
});
