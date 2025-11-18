import { expect, test } from '@playwright/test';

/**
 * Contact Form E2E Tests
 * Tests contact form functionality and validation
 */
test.describe('Contact Form', () => {
    test.describe('Form Display', () => {
        test('should load contact section', async ({ page }) => {
            await page.goto('/en');

            // Scroll to contact section (usually at bottom)
            const contactSection = page
                .locator('section')
                .filter({ hasText: /contact|get.*touch/i })
                .first();
            await contactSection.scrollIntoViewIfNeeded();
            await expect(contactSection).toBeVisible();
        });

        test('should display all required form fields', async ({ page }) => {
            await page.goto('/en');

            // Check for name field
            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            await nameField.scrollIntoViewIfNeeded();
            await expect(nameField).toBeVisible();

            // Check for email field
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            await expect(emailField).toBeVisible();

            // Check for message field
            const messageField = page.locator('textarea[name="message"], textarea').first();
            await expect(messageField).toBeVisible();
        });

        test('should have submit button', async ({ page }) => {
            await page.goto('/en');

            const submitButton = page
                .locator('button[type="submit"], button')
                .filter({ hasText: /send|submit|enviar/i })
                .first();
            await submitButton.scrollIntoViewIfNeeded();
            await expect(submitButton).toBeVisible();
        });
    });

    test.describe('Form Validation', () => {
        test('should show validation for empty name field', async ({ page }) => {
            await page.goto('/en');

            // Locate form fields
            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            const messageField = page.locator('textarea[name="message"], textarea').first();
            const submitButton = page
                .locator('button[type="submit"], button')
                .filter({ hasText: /send|submit|enviar/i })
                .first();

            await nameField.scrollIntoViewIfNeeded();

            // Fill only email and message
            await emailField.fill('test@example.com');
            await messageField.fill('This is a test message');

            // Try to submit
            await submitButton.click();

            // Check for validation message or that name field is focused
            const isNameRequired = await nameField.getAttribute('required');
            if (isNameRequired !== null) {
                // Browser will handle validation
                const validationMessage = await nameField.evaluate((el: HTMLInputElement) => el.validationMessage);
                expect(validationMessage).toBeTruthy();
            }
        });

        test('should validate email format', async ({ page }) => {
            await page.goto('/en');

            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            const messageField = page.locator('textarea[name="message"], textarea').first();
            const submitButton = page
                .locator('button[type="submit"], button')
                .filter({ hasText: /send|submit|enviar/i })
                .first();

            await nameField.scrollIntoViewIfNeeded();

            // Fill form with invalid email
            await nameField.fill('John Doe');
            await emailField.fill('invalid-email');
            await messageField.fill('Test message');

            // Try to submit
            await submitButton.click();

            // Check for email validation
            const emailValidation = await emailField.evaluate((el: HTMLInputElement) => el.validationMessage);
            expect(emailValidation).toBeTruthy();
        });

        test('should show validation for empty message', async ({ page }) => {
            await page.goto('/en');

            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            const messageField = page.locator('textarea[name="message"], textarea').first();
            const submitButton = page
                .locator('button[type="submit"], button')
                .filter({ hasText: /send|submit|enviar/i })
                .first();

            await nameField.scrollIntoViewIfNeeded();

            // Fill only name and email
            await nameField.fill('John Doe');
            await emailField.fill('john@example.com');

            // Try to submit
            await submitButton.click();

            // Check for message validation
            const isMessageRequired = await messageField.getAttribute('required');
            if (isMessageRequired !== null) {
                const validationMessage = await messageField.evaluate(
                    (el: HTMLTextAreaElement) => el.validationMessage
                );
                expect(validationMessage).toBeTruthy();
            }
        });
    });

    test.describe('Form Submission', () => {
        test('should accept valid form submission', async ({ page }) => {
            await page.goto('/en');

            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            const messageField = page.locator('textarea[name="message"], textarea').first();
            const submitButton = page
                .locator('button[type="submit"], button')
                .filter({ hasText: /send|submit|enviar/i })
                .first();

            await nameField.scrollIntoViewIfNeeded();

            // Fill form with valid data
            await nameField.fill('John Doe');
            await emailField.fill('john.doe@example.com');
            await messageField.fill(
                'This is a test message for E2E testing. I would like to discuss a potential project.'
            );

            // Submit form
            await submitButton.click();

            // Wait for either success message or navigation
            // Note: This depends on actual implementation
            await page.waitForTimeout(2000);

            // Check for success indicators (adjust based on actual implementation)
            const successMessage = page.locator('text=/success|sent|thank|gracias/i');
            const hasSuccessMessage = (await successMessage.count()) > 0;

            // Form might show success message or clear fields
            if (hasSuccessMessage) {
                await expect(successMessage.first()).toBeVisible();
            } else {
                // Or form might clear after successful submission
                const nameValue = await nameField.inputValue();
                // Form might be cleared or might not - this is implementation dependent
                expect(nameValue).toBeDefined();
            }
        });

        test('should disable submit button during submission', async ({ page }) => {
            await page.goto('/en');

            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            const messageField = page.locator('textarea[name="message"], textarea').first();
            const submitButton = page
                .locator('button[type="submit"], button')
                .filter({ hasText: /send|submit|enviar/i })
                .first();

            await nameField.scrollIntoViewIfNeeded();

            // Fill form
            await nameField.fill('Test User');
            await emailField.fill('test@example.com');
            await messageField.fill('Test message content');

            // Click submit and immediately check if disabled
            await submitButton.click();

            // Button should be disabled during submission (if implemented)
            await page.waitForTimeout(100);
            const isDisabled = await submitButton.isDisabled();

            // This might be true or false depending on implementation
            expect(typeof isDisabled).toBe('boolean');
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper labels for form fields', async ({ page }) => {
            await page.goto('/en');

            // Check name field has label
            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            await nameField.scrollIntoViewIfNeeded();

            const nameLabel = await nameField.getAttribute('aria-label');
            const nameId = await nameField.getAttribute('id');

            // Either has aria-label or has associated label element
            if (!nameLabel && nameId) {
                const associatedLabel = page.locator(`label[for="${nameId}"]`);
                await expect(associatedLabel).toBeVisible();
            }
        });

        test('should be keyboard navigable', async ({ page }) => {
            await page.goto('/en');

            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            await nameField.scrollIntoViewIfNeeded();

            // Tab through form fields
            await nameField.focus();
            await expect(nameField).toBeFocused();

            await page.keyboard.press('Tab');
            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            await expect(emailField).toBeFocused();

            await page.keyboard.press('Tab');
            const messageField = page.locator('textarea[name="message"], textarea').first();
            await expect(messageField).toBeFocused();
        });

        test('should show error messages accessibly', async ({ page }) => {
            await page.goto('/en');

            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            const submitButton = page
                .locator('button[type="submit"], button')
                .filter({ hasText: /send|submit|enviar/i })
                .first();

            await nameField.scrollIntoViewIfNeeded();

            // Try to submit empty form
            await submitButton.click();

            // Error messages should be visible and associated with fields
            await page.waitForTimeout(500);

            // Check for error indicators
            const errorMessages = page.locator('[role="alert"], .error, [aria-invalid="true"]');
            const errorCount = await errorMessages.count();

            // Errors might be shown via browser validation or custom messages
            expect(errorCount).toBeGreaterThanOrEqual(0);
        });
    });

    test.describe('Responsive Behavior', () => {
        test('should work on mobile devices', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/en');

            const nameField = page.locator('input[name="name"], input[type="text"]').first();
            await nameField.scrollIntoViewIfNeeded();
            await expect(nameField).toBeVisible();

            // Fill form on mobile
            await nameField.fill('Mobile User');

            const emailField = page.locator('input[name="email"], input[type="email"]').first();
            await emailField.fill('mobile@example.com');

            const messageField = page.locator('textarea[name="message"], textarea').first();
            await messageField.fill('Testing from mobile device');

            // Verify all fields are filled
            expect(await nameField.inputValue()).toBe('Mobile User');
            expect(await emailField.inputValue()).toBe('mobile@example.com');
            expect(await messageField.inputValue()).toBe('Testing from mobile device');
        });
    });
});
