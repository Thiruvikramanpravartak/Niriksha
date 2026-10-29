import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

When('I attempt to access the admin dashboard URL directly without a session', async function (this: CustomWorld) {
  const page = this.getPage();
  const target = '/admin/dashboard';
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
  this.checklist.record('Direct protected dashboard navigation', target, true);
});


Then('the protected dashboard metrics or banners should not be rendered', async function (this: CustomWorld) {
  const page = this.getPage();
  // Assertion 1: Password input is visible (login screen)
  const passwordInput = page.locator('input[type="password"]').first();
  await expect(passwordInput).toBeVisible({ timeout: 10000 });
  this.checklist.record('Login password input rendered', 'Auth barrier active', true);

  // Assertion 2: Protected table/banners not present
  const adminTable = page.locator('table, [data-testid="admin-dashboard-metrics"]').first();
  await expect(adminTable).not.toBeVisible();
  this.checklist.record('Protected dashboard content hidden', 'No dashboard data leaked', true);

  // Assertion 3: Submit button is Sign In / Login
  const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
  await expect(submitBtn).toBeVisible({ timeout: 10000 });
  this.checklist.record('Login submit button visible', 'Sign In control ready', true);
});
