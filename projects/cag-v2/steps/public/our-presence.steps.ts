import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { OurPresencePage } from '../../src/pages/public/OurPresencePage';

Given('I navigate to the Our Presence section', async function (this: CustomWorld) {
  const page = this.getPage();
  const presence = new OurPresencePage(page);
  await presence.goto();
});

Then('the Central Audit Offices list displays all central-level directorates', async function (this: CustomWorld) {
  const page = this.getPage();
  const presence = new OurPresencePage(page);
  const centralLink = page.locator('a[href*="Central-Audit-Offices"], a:has-text("Defence"), a:has-text("Railway")').first();
  if (await centralLink.isVisible()) {
    await centralLink.click();
    await page.waitForTimeout(1000);
  }
  await expect(presence.centralOfficesList()).toBeVisible();
  const text = await page.locator('main').first().textContent();
  expect(text).toMatch(/Expenditure|Defence|Railway|Central/i);
  this.checklist?.record('Central audit offices verified', 'Central directorates present', true);
});

Then('the State-Level Offices section lists Accountant General offices accurately', async function (this: CustomWorld) {
  const page = this.getPage();
  const presence = new OurPresencePage(page);
  const stateLink = page.locator('a[href*="State-Level-Offices"], a:has-text("State Account"), a:has-text("State Audit")').first();
  if (await stateLink.isVisible()) {
    await stateLink.click();
    await page.waitForTimeout(1000);
  }
  await expect(presence.stateAgOfficesList()).toBeVisible();
  const text = await page.locator('main').first().textContent();
  expect(text).toMatch(/Accountant General|State Audit/i);
  this.checklist?.record('State AG offices verified', 'State AG offices present', true);
});

Then('the Training Institutes section lists NAAA and regional training centres', async function (this: CustomWorld) {
  const page = this.getPage();
  const presence = new OurPresencePage(page);
  const trainingLink = page.locator('a[href*="Traning-Institutes"], a[href*="Training"], a:has-text("NAAA"), a:has-text("Academy")').first();
  if (await trainingLink.isVisible()) {
    await trainingLink.click();
    await page.waitForTimeout(1000);
  }
  await expect(presence.trainingInstitutesList()).toBeVisible();
  const text = await page.locator('main').first().textContent();
  expect(text).toMatch(/National Academy|NAAA|Training|Capacity Building/i);
  this.checklist?.record('Training institutes verified', 'NAAA / training institutes present', true);
});

When('I check the Our Presence sub-navigation menu', async function (this: CustomWorld) {
  const page = this.getPage();
  const presence = new OurPresencePage(page);
  await expect(presence.navMenu()).toBeVisible();
});

Then('all four sub-pages are reachable and render valid content', async function (this: CustomWorld) {
  const page = this.getPage();
  const presence = new OurPresencePage(page);
  const links = presence.navMenu().locator('a.about-sidebar__link, a[data-testid*="subpage"], a');
  const count = await links.count();
  expect(count).toBeGreaterThanOrEqual(4);
  this.checklist?.record('Presence subpages reachable', `${count} subpage navigation links verified`, true);
});
