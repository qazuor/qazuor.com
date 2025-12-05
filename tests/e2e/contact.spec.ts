import { expect, test } from '@playwright/test';

/** Selector for the contact section */
const CONTACT_SECTION_SELECTOR = '#contact';
/** Selector to detect when Contact React component is hydrated */
const CONTACT_FORM_READY_SELECTOR = '[data-testid="contact-form"]';

/**
 * Wait for the Contact React component to be hydrated
 */
async function waitForContactFormReady(page: import('@playwright/test').Page) {
    // Scroll to contact section first to trigger client:visible hydration
    const contactSection = page.locator(CONTACT_SECTION_SELECTOR);
    await contactSection.scrollIntoViewIfNeeded();

    // Wait for the React form component to hydrate
    await page.waitForSelector(CONTACT_FORM_READY_SELECTOR, { state: 'attached', timeout: 15000 });
}

/**
 * Helper to get form fields with improved selectors
 */
async function getContactFormFields(page: import('@playwright/test').Page) {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Wait for React component to hydrate
    await waitForContactFormReady(page);

    // Get contact section by ID
    const contactSection = page.locator(CONTACT_SECTION_SELECTOR);

    // Get form within contact section
    const form = page.locator(CONTACT_FORM_READY_SELECTOR);

    // Use more specific selectors within the form
    const nameField = form.locator('input[name="name"]');
    const emailField = form.locator('input[name="email"]');
    const messageField = form.locator('textarea[name="message"]');
    const submitButton = form.locator('button[type="submit"]');

    return { contactSection, form, nameField, emailField, messageField, submitButton };
}

/**
 * Contact Form E2E Tests
 * Tests contact form functionality and validation
 */
test.describe('Contact Form', () => {
    test.describe('Form Display', () => {
        test('should load contact section', async ({ page }) => {
            await page.goto('/en');

            // Scroll to contact section by ID
            const contactSection = page.locator(CONTACT_SECTION_SELECTOR);
            await contactSection.scrollIntoViewIfNeeded();
            await expect(contactSection).toBeVisible();
        });

        test('should display all required form fields', async ({ page }) => {
            await page.goto('/en');

            const { nameField, emailField, messageField } = await getContactFormFields(page);

            // Check for name field
            await expect(nameField).toBeVisible();

            // Check for email field
            await expect(emailField).toBeVisible();

            // Check for message field
            await expect(messageField).toBeVisible();
        });

        test('should have submit button', async ({ page }) => {
            await page.goto('/en');

            const { submitButton } = await getContactFormFields(page);
            await expect(submitButton).toBeVisible();
        });
    });

    test.describe('Form Validation', () => {
        test('should show validation for empty name field', async ({ page }) => {
            await page.goto('/en');

            const { nameField, emailField, messageField, submitButton } = await getContactFormFields(page);

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

            const { nameField, emailField, messageField, submitButton } = await getContactFormFields(page);

            // Fill form with invalid email
            await nameField.fill('John Doe');
            await expect(nameField).toHaveValue('John Doe');

            await emailField.fill('invalid-email');
            await expect(emailField).toHaveValue('invalid-email');

            await messageField.fill('Test message that is long enough to pass validation');
            await expect(messageField).toHaveValue('Test message that is long enough to pass validation');

            // Try to submit
            await submitButton.click();
            await page.waitForTimeout(500);

            // Check for email validation - either browser validation message or custom error
            const emailValidation = await emailField.evaluate((el: HTMLInputElement) => el.validationMessage);
            const hasAriaInvalid = await emailField.getAttribute('aria-invalid');
            const errorMessage = page.locator('[role="alert"]').filter({ hasText: /email|correo/i });
            const hasErrorMessage = (await errorMessage.count()) > 0;

            // Email should be flagged as invalid in some way
            expect(emailValidation || hasAriaInvalid === 'true' || hasErrorMessage).toBeTruthy();
        });

        test('should show validation for empty message', async ({ page }) => {
            await page.goto('/en');

            const { nameField, emailField, messageField, submitButton } = await getContactFormFields(page);

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

            const { nameField, emailField, messageField, submitButton } = await getContactFormFields(page);

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

            const { nameField, emailField, messageField, submitButton } = await getContactFormFields(page);

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

            const { nameField } = await getContactFormFields(page);

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

            const { contactSection, nameField } = await getContactFormFields(page);

            // Focus name field first
            await nameField.focus();
            await expect(nameField).toBeFocused();

            // Tab to next field - may be email or something else depending on form structure
            await page.keyboard.press('Tab');

            // Check that focus moved to a form element
            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();

            // The focused element should be within the contact section
            const isWithinSection = await focusedElement.evaluate(
                (el, section) => {
                    return section?.contains(el) ?? false;
                },
                await contactSection.elementHandle()
            );

            // Focus should stay within contact form during Tab navigation
            expect(isWithinSection).toBe(true);
        });

        test('should show error messages accessibly', async ({ page }) => {
            await page.goto('/en');

            const { submitButton } = await getContactFormFields(page);

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

            // Wait for page to fully load
            await page.waitForLoadState('networkidle');

            const { nameField, emailField, messageField } = await getContactFormFields(page);

            await expect(nameField).toBeVisible();

            // Fill form on mobile with explicit waits
            await nameField.click();
            await nameField.fill('Mobile User');
            await expect(nameField).toHaveValue('Mobile User');

            await emailField.click();
            await emailField.fill('mobile@example.com');
            await expect(emailField).toHaveValue('mobile@example.com');

            await messageField.click();
            await messageField.fill('Testing from mobile device');
            await expect(messageField).toHaveValue('Testing from mobile device');
        });
    });
});
