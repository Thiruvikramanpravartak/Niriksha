import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { LoginPage } from '../../src/pages/admin/LoginPage';
import { DashboardPage } from '../../src/pages/admin/DashboardPage';

Given('I am on the admin login page', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('I submit valid admin credentials', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  const username = process.env.CAG_E2E_ADMIN_USER || 'admin';
  const password = process.env.CAG_E2E_ADMIN_PASSWORD || 'mock-password-123';
  await loginPage.login(username, password);
});

When('I submit invalid admin credentials', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await loginPage.login('invalidUser', 'wrongPassword');
});

Then('I should be redirected to the admin dashboard', async function (this: CustomWorld) {
  const page = this.getPage();
  const dashboard = new DashboardPage(page);
  await expect(dashboard.root()).toBeVisible();
});

Then('an authentication error should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await expect(loginPage.errorMessage()).toBeVisible();
});

Given('I am an unauthenticated user', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
  });
});

When('I attempt to visit the admin dashboard directly', async function (this: CustomWorld) {
  const page = this.getPage();
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
});

Then('I should be redirected to the admin login page', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await expect(loginPage.root()).toBeVisible();
});

When('I submit the login form without entering credentials', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await loginPage.usernameInput().fill('');
  await loginPage.passwordInput().fill('');
  await loginPage.submitButton().click();
});

Then('required validation messages for username and password should appear', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  const usernameValid = await loginPage.usernameInput().evaluate((el: HTMLInputElement) => el.checkValidity());
  if (!usernameValid) {
    expect(usernameValid).toBe(false);
  } else {
    await expect(loginPage.errorMessage()).toBeVisible();
    const errorText = await loginPage.errorMessage().innerText();
    expect(errorText.toLowerCase()).toMatch(/required|fill|enter|invalid/);
  }
});

Given('I am logged in as an administrator on the dashboard', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const username = process.env.CAG_E2E_ADMIN_USER || 'admin';
  const password = process.env.CAG_E2E_ADMIN_PASSWORD || 'mock-password-123';
  await loginPage.login(username, password);
  const dashboard = new DashboardPage(page);
  await expect(dashboard.userMenu()).toBeVisible({ timeout: 15000 });
});

When('I click the logout button', async function (this: CustomWorld) {
  const page = this.getPage();
  const dashboard = new DashboardPage(page);
  await dashboard.logout();
});

When('I log out of the admin portal', async function (this: CustomWorld) {
  const page = this.getPage();
  const dashboard = new DashboardPage(page);
  await dashboard.logout();
});

Then('my session should be terminated and I should be redirected to the login page', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await expect(loginPage.root()).toBeVisible({ timeout: 10000 });
});

When('I log in with remember me enabled', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  const checkbox = loginPage.rememberMeCheckbox();
  if (await checkbox.isVisible()) {
    await checkbox.check();
  }
  const username = process.env.CAG_E2E_ADMIN_USER || 'admin';
  const password = process.env.CAG_E2E_ADMIN_PASSWORD || 'mock-password-123';
  await loginPage.login(username, password);
});

Then('the session should persist across browser reloads', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.reload();
  const dashboard = new DashboardPage(page);
  await expect(dashboard.root()).toBeVisible();
});

When('I submit invalid credentials 3 consecutive times', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  for (let i = 0; i < 3; i++) {
    await loginPage.login('badUser', 'badPass');
  }
});

Then('a security warning or account throttle notice should appear', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await expect(loginPage.errorMessage()).toBeVisible();
  await expect(loginPage.errorMessage()).toContainText('Security notice');
});
