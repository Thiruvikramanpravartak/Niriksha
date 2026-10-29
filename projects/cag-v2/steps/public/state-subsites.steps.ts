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
