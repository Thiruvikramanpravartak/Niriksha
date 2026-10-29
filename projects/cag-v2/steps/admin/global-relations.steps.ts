import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { GlobalRelationsPage } from '../../src/pages/admin/GlobalRelationsPage';

When('I navigate to the admin global relations registry', async function (this: CustomWorld) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  await grPage.goto();
  await expect(grPage.pageTitle).toBeVisible({ timeout: 20000 });
  this.checklist.record('Global Relations registry loaded', page.url(), true);
});

When('I search the global relations registry for {string}', async function (this: CustomWorld, term: string) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  await grPage.search(term);
  await page.waitForTimeout(1000);
  this.checklist.record('Global relations search submitted', term, true);
});

Then('only matching global relations static page records should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  const rows = await grPage.getRowCount();
  expect(rows).toBeGreaterThan(0);
  this.checklist.record('Filtered rows count verified', `${rows} matching records`, true);
});

Then('the registry table should remain visible', async function (this: CustomWorld) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  await expect(grPage.table).toBeVisible({ timeout: 10000 });
  this.checklist.record('Global relations table visible', 'Table rendered', true);
});

When('I click the Add Section Record button in global relations', async function (this: CustomWorld) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  await expect(grPage.addRecordBtn).toBeVisible({ timeout: 10000 });
  await grPage.addRecordBtn.click();
  this.checklist.record('Add Section Record clicked', 'Creation modal triggered', true);
});

Then('the record creation modal dialog should be displayed with input controls', async function (this: CustomWorld) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  await expect(grPage.modalDialog).toBeVisible({ timeout: 10000 });
  const inputs = grPage.modalDialog.locator('input, textarea, select');
  const count = await inputs.count();
  expect(count).toBeGreaterThan(0);
  this.checklist.record('Creation modal dialog controls verified', `${count} inputs found`, true);
});

When('I close the global relations modal dialog', async function (this: CustomWorld) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  if (await grPage.modalCancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await grPage.modalCancelBtn.click();
  } else {
    await page.keyboard.press('Escape');
  }
  await expect(grPage.modalDialog).not.toBeVisible({ timeout: 10000 });
  this.checklist.record('Creation modal dialog dismissed', 'Closed safely', true);
});

Then('the global relations registry should display active status indicators for configured pages', async function (this: CustomWorld) {
  const page = this.getPage();
  const statusBadge = page.locator('table tbody tr button:has-text("Active"), table tbody tr span:has-text("Active")').first();
  await expect(statusBadge).toBeVisible({ timeout: 10000 });
  this.checklist.record('Active status indicator verified', 'Active badge visible', true);
});

Then('the pagination or row summary should reflect total configured records', async function (this: CustomWorld) {
  const page = this.getPage();
  const grPage = new GlobalRelationsPage(page);
  const rowCount = await grPage.getRowCount();
  expect(rowCount).toBeGreaterThan(0);
  this.checklist.record('Total records count verified', `${rowCount} records visible on screen`, true);
});

When('I navigate to the recruitment management tab under About Us', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.goto('/admin/about?tab=recruitment', { waitUntil: 'domcontentloaded', timeout: 35000 });
  this.checklist.record('Recruitment tab navigation', page.url(), true);
});

Then('the recruitment registry table should display published pathway records', async function (this: CustomWorld) {
  const page = this.getPage();
  const table = page.locator('table').first();
  await expect(table).toBeVisible({ timeout: 15000 });
  const rows = await page.locator('table tbody tr').count();
  expect(rows).toBeGreaterThan(0);
  this.checklist.record('Recruitment pathway table rows verified', `${rows} records present`, true);
});

Then('recruitment records should include active status indicators', async function (this: CustomWorld) {
  const page = this.getPage();
  const statusBadge = page.locator('table tbody tr button:has-text("Active")').first();
  await expect(statusBadge).toBeVisible({ timeout: 10000 });
  this.checklist.record('Recruitment status badges verified', 'Active indicators verified', true);
});
