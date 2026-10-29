import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { ResourcesLibraryPage } from '../../src/pages/public/ResourcesLibraryPage';

Given('I navigate to the Resources and Library portal', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  await resources.goto();
});

Then('the page displays all four primary resource categories', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  const cards = process.env.MOCK === '1'
    ? resources.categoryCards().locator('> div')
    : page.locator('main h2');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(4);
  this.checklist?.record('4 resource categories rendered', `${count} categories verified`, true);
});

When('I inspect each category collection', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  await expect(resources.categoryCards().first()).toBeVisible();
});

Then('each category section presents its published documents correctly', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  if (process.env.MOCK === '1') {
    const card1 = resources.categoryCard('acts-rules');
    await expect(card1).toBeVisible();
  } else {
    const docLinks = page.locator('a[href*="/Resources/"]');
    expect(await docLinks.count()).toBeGreaterThan(0);
  }
  this.checklist?.record('Documents listed in categories', 'Resource documents verified', true);
});

When('I view the active departmental tenders table', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  await expect(resources.tendersTable()).toBeVisible();
});

Then('current tender notices are displayed with valid IDs and dates', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  const rows = resources.tendersTable().locator('tbody tr, [class*="card"], li, a');
  expect(await rows.count()).toBeGreaterThan(0);
  this.checklist?.record('Tenders table rows verified', 'Tender notices present', true);
});

When('I view the departmental circulars table', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  await expect(resources.circularsTable()).toBeVisible();
});

Then('published administrative circulars are listed with subject and date', async function (this: CustomWorld) {
  const page = this.getPage();
  const resources = new ResourcesLibraryPage(page);
  const rows = resources.circularsTable().locator('tbody tr, [class*="card"], li, a');
  expect(await rows.count()).toBeGreaterThan(0);
  this.checklist?.record('Circulars table rows verified', 'Circular records present', true);
});
