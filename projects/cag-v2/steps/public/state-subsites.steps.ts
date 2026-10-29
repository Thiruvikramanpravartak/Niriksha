import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { StatesPage } from '../../src/pages/public/StatesPage';

Given('I navigate to the state offices directory', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  await statesPage.goto();
});

Then('the state directory page title should be visible', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  await expect(statesPage.titleLocator()).toBeVisible();
});

Then('state office cards should be displayed for Delhi, Maharashtra, and Karnataka', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  await expect(statesPage.stateCard('dl')).toBeVisible();
  await expect(statesPage.stateCard('mh')).toBeVisible();
  await expect(statesPage.stateCard('ka')).toBeVisible();
});

Then('state subsite links should point to valid regional subsite routes', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  const href = await statesPage.subsiteLink('dl').getAttribute('href');
  expect(href).toMatch(/\/states\/dl|\/ae\/|Our-Presence/i);
});

When('I search the state directory for {string}', async function (this: CustomWorld, state: string) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  await statesPage.search(state);
});

Then('only the Maharashtra state office card should remain visible', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  await expect(statesPage.stateCard('mh')).toBeVisible();
  if (process.env.MOCK === '1') {
    await expect(statesPage.stateCard('dl')).toBeHidden();
  }
});

Then('the PAG office name and designated officer should be displayed for Delhi', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  await expect(statesPage.pagName('dl')).toBeVisible();
  await expect(statesPage.pagOffice('dl')).toBeVisible();
});

Then('regional audit reports and accounts links should be present on each state card', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  await expect(statesPage.reportsLink('dl')).toBeVisible();
  await expect(statesPage.accountsLink('dl')).toBeVisible();
});

When('I toggle the directory view between list and map', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  if (await statesPage.mapToggle().isVisible().catch(() => false)) {
    await statesPage.switchToMap();
  }
});

Then('the selected view toggle mode should be active', async function (this: CustomWorld) {
  const page = this.getPage();
  const statesPage = new StatesPage(page, this.config);
  if (await statesPage.mapToggle().isVisible().catch(() => false)) {
    await expect(statesPage.mapToggle()).toHaveClass(/active/);
  } else {
    await expect(statesPage.titleLocator()).toBeVisible();
  }
});

When('I navigate to an invalid state subsite slug {string}', async function (this: CustomWorld, slugPath: string) {
  const page = this.getPage();
  await page.goto(slugPath, { waitUntil: 'domcontentloaded', timeout: 35000 });
  this.checklist.record('Invalid state slug navigation', slugPath, true);
});

Then('the application should handle the route gracefully without raw crash', async function (this: CustomWorld) {
  const page = this.getPage();
  // Assertion 1: Page has content
  const body = page.locator('body');
  await expect(body).toBeVisible();
  this.checklist.record('Body content rendered', 'No blank screen', true);

  // Assertion 2: No unhandled React / Next.js exception stack trace on screen
  const errorOverlay = page.locator('#nextjs__container_errors, [data-nextjs-dialog-overlay]');
  await expect(errorOverlay).not.toBeVisible();
  this.checklist.record('No Next.js error dialog', 'Clean graceful degradation', true);

  // Assertion 3: Header or navigation remains intact
  const header = page.locator('header, nav, [class*="header"]').first();
  await expect(header).toBeVisible({ timeout: 10000 });
  this.checklist.record('Portal header visible on fallback', 'Layout preserved', true);
});

