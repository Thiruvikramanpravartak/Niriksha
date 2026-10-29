import type { Locator, Page } from 'playwright';

export const contactLocators = (page: Page) => ({
  form: (): Locator => page.locator('form').first(),
  nameInput: (): Locator => page.locator('input[placeholder*="Enter Name"], input[name="name"]').first(),
  emailInput: (): Locator => page.locator('input[placeholder*="Enter Email"], input[type="email"]').first(),
  mobileInput: (): Locator => page.locator('input[placeholder*="Enter Mobile Number"], input[type="tel"]').first(),
  categorySelect: (): Locator => page.locator('select').first(),
  feedbackTextarea: (): Locator => page.locator('textarea[placeholder*="Enter Feedback"], textarea').first(),
  captchaInput: (): Locator => page.locator('input[placeholder*="Enter Captcha"]').first(),
  captchaRefreshBtn: (): Locator => page.locator('button:has(svg), button[class*="refresh"]').first(),
  submitBtn: (): Locator => page.locator('button[type="submit"]:has-text("Submit Feedback"), button:has-text("Submit Feedback")').first(),
  errorMessages: (): Locator => page.locator('[class*="text-red"], [class*="text-[#dc2626]"], [class*="text-danger"]'),
  nameError: (): Locator => page.getByText('Please enter your name').first(),
  emailError: (): Locator => page.getByText('Please enter a valid email').first(),
  mobileError: (): Locator => page.getByText('Please enter a valid 10-digit mobile number').first(),
  categoryError: (): Locator => page.getByText('Please select a category').first(),
  feedbackError: (): Locator => page.getByText('Please enter at least 10 characters').first(),
  captchaError: (): Locator => page.getByText('Captcha does not match').first(),
  successMessage: (): Locator => page.locator('[class*="text-green"], [class*="bg-green-"], [role="status"]').first(),
});
