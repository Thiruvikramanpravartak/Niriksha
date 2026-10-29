import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const loginLocators = (page: Page) => ({
  container: (): Locator =>
    page.getByTestId(TestIds.adminLogin.container).or(page.locator('form, [class*="login"], main')).first(),
  usernameInput: (): Locator =>
    page
      .getByTestId(TestIds.adminLogin.usernameInput)
      .or(page.locator('input[placeholder*="Username"], input[name="username"], input[type="text"]'))
      .first(),
  passwordInput: (): Locator =>
    page
      .getByTestId(TestIds.adminLogin.passwordInput)
      .or(page.locator('input[type="password"], input[name="password"]'))
      .first(),
  captchaInput: (): Locator =>
    page.locator('input[placeholder*="Captcha"], input[name*="captcha"]').first(),
  captchaCodeText: (): Locator =>
    page.locator('div.font-mono, [class*="captcha-code"], [style*="text-decoration: line-through"]').first(),
  submitBtn: (): Locator =>
    page
      .getByTestId(TestIds.adminLogin.submitBtn)
      .or(page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")'))
      .first(),
  errorMessage: (): Locator =>
    page
      .getByTestId(TestIds.adminLogin.errorMessage)
      .or(page.locator('[class*="bg-red-"], [role="alert"]:not(#__next-route-announcer__), [class*="error-msg"], [class*="error_msg"], [class*="toast"]'))
      .first(),
  rememberMeCheckbox: (): Locator =>
    page.getByTestId(TestIds.adminLogin.rememberMe).or(page.locator('input[type="checkbox"]')).first(),
});
