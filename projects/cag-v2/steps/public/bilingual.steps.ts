import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { LanguageToggle } from '../../src/components/LanguageToggle';
import { HomePage } from '../../src/pages/public/HomePage';
import { commonLocators } from '../../src/locators/common.locators';

Then('the language toggle should be visible with English and Hindi options', async function (this: CustomWorld) {
  const page = this.getPage();
  const toggle = new LanguageToggle(page);
  await expect(toggle.root()).toBeVisible();
  const L = commonLocators(page);
  if (!(await L.langSwitchHi().isVisible()) || !(await L.langSwitchEn().isVisible())) {
    await toggle.root().click();
    await page.waitForTimeout(300);
  }
  await expect(L.langSwitchEn()).toBeVisible();
  await expect(L.langSwitchHi()).toBeVisible();
});

When('I switch language to Hindi', async function (this: CustomWorld) {
  const page = this.getPage();
  const toggle = new LanguageToggle(page);
  await toggle.selectLanguage('hi');
});

When('I switch the portal language to Hindi', async function (this: CustomWorld) {
  const page = this.getPage();
  const toggle = new LanguageToggle(page);
  await toggle.selectLanguage('hi');
});

Then('the language should remain set to Hindi', async function (this: CustomWorld) {
  const page = this.getPage();
  const toggle = new LanguageToggle(page);
  await expect(toggle.currentLanguage()).toHaveText(/हिन्दी/);
});

When('I refresh the page', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
});

Then('the language preference should persist as Hindi', async function (this: CustomWorld) {
  const page = this.getPage();
  const toggle = new LanguageToggle(page);
  await expect(toggle.currentLanguage()).toHaveText(/हिन्दी/);
});

Given('I navigate directly to the home page with parameter {string}', async function (this: CustomWorld, param: string) {
  const page = this.getPage();
  if (param.includes('lang=hi')) {
    await page.goto(process.env.MOCK === '1' ? `/?${param}` : '/hi', { waitUntil: 'domcontentloaded' });
  } else {
    await page.goto(`/?${param}`, { waitUntil: 'domcontentloaded' });
  }
});

Then('the page should immediately render with Hindi active', async function (this: CustomWorld) {
  const page = this.getPage();
  const toggle = new LanguageToggle(page);
  await expect(toggle.root()).toBeVisible();
  await expect(toggle.currentLanguage()).toHaveText(/हिन्दी/);
});

Then('major interface headings and navigation links should reflect Hindi translations', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.header.title()).toBeVisible();
  const texts = await page.locator('nav, header, h1, h2').allTextContents();
  const content = texts.join(' ');
  expect(content).toMatch(/रिपोर्ट|उपस्थिति|हमारे बारे में|नवीनतम/);
});
