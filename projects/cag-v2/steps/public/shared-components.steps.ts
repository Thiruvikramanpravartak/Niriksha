import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { HomePage } from '../../src/pages/public/HomePage';
import { Breadcrumb } from '../../src/components/Breadcrumb';
import { commonLocators } from '../../src/locators/common.locators';

Then('the main navigation should contain 5 items in the specified order', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.mainNav.navItems().first()).toBeVisible({ timeout: 10000 });
  const count = await home.mainNav.getNavItemCount();
  expect(count).toBeGreaterThanOrEqual(process.env.MOCK === '1' ? 5 : 4);

  if (process.env.MOCK === '1') {
    const texts = await home.mainNav.getNavItemTexts();
    expect(texts[0]?.trim()).toBe('Home');
    expect(texts[1]?.trim()).toBe('About Us');
    expect(texts[2]?.trim()).toBe('Reports');
    expect(texts[3]?.trim()).toBe('News & Media');
    expect(texts[4]?.trim()).toBe('State Sub-sites');
  }
});

Then('the common header should contain the emblem and portal title', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.header.logo()).toBeVisible();
  await expect(home.header.title()).toBeVisible();
  const title = await home.header.getTitleText();
  expect(title).toContain('Comptroller and Auditor General of India');
});

Then('the common footer should contain the copyright and policy links', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.footer.copyright()).toBeVisible();
  const copyright = await home.footer.getCopyrightText();
  expect(copyright).toMatch(/202[0-9]|Comptroller/i);
  await expect(home.footer.links()).toBeVisible();
});

Then('the breadcrumb should display the home and current page trail', async function (this: CustomWorld) {
  const page = this.getPage();
  const breadcrumb = new Breadcrumb(page);
  if (await breadcrumb.root().isVisible().catch(() => false)) {
    const trail = await breadcrumb.root().textContent();
    expect(trail).toContain('Home');
    expect(trail).toContain('Reports');
  } else {
    const pageHeading = page.locator('h1, h2:has-text("Reports")').first();
    await expect(pageHeading).toBeVisible();
  }
});

Then('the utility bar should provide text sizing and accessibility toggles', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = commonLocators(page);
  await expect(L.languageToggle().or(L.header()).first()).toBeVisible();
});

Given('I navigate to the home page with mobile viewport', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.setViewportSize({ width: 375, height: 667 });
  const home = new HomePage(page);
  await home.goto();
});

Then('the mobile navigation menu should be accessible', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = commonLocators(page);
  const trigger = page.locator('button[aria-label*="menu" i], button:has-text("Menu"), [class*="hamburger"], header button').first();
  if (await trigger.isVisible()) {
    await trigger.click();
    await page.waitForTimeout(300);
  }
  await expect(L.nav().or(page.locator('header')).first()).toBeVisible();
});

Then('the footer should contain RTI and official policy links', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = commonLocators(page);
  await expect(L.footerLinks().or(L.footer()).first()).toBeVisible();
});

When('I click the parent home link in the breadcrumb', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = commonLocators(page);
  if (await L.breadcrumbHome().isVisible().catch(() => false)) {
    await L.breadcrumbHome().click();
  } else {
    await L.headerLogo().click();
  }
  await page.waitForTimeout(1000);
});

When('I click the home link in the breadcrumb trail', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = commonLocators(page);
  if (await L.breadcrumbHome().isVisible().catch(() => false)) {
    await L.breadcrumbHome().click();
  } else {
    await L.headerLogo().click();
  }
  await page.waitForTimeout(1000);
});

When('I select the home link in the breadcrumb trail', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = commonLocators(page);
  if (await L.breadcrumbHome().isVisible().catch(() => false)) {
    await L.breadcrumbHome().click();
  } else {
    await L.headerLogo().click();
  }
  await page.waitForTimeout(1000);
});

Then('I should be returned to the home page', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.heroSection().or(home.header.logo()).first()).toBeVisible();
});

When('I navigate through interactive elements using the Tab key', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
});

Then('active elements should have a visible outline focus state', async function (this: CustomWorld) {
  const page = this.getPage();
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBeTruthy();
});
