import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TemplateWorld } from '../support/world';
import { ExamplePage } from '../src/pages/ExamplePage';

Given('I navigate to the example page', async function (this: TemplateWorld) {
  const page = this.getPage();
  const examplePage = new ExamplePage(page, this.config);
  await examplePage.goto();
});

Then('the example page title should be visible', async function (this: TemplateWorld) {
  const page = this.getPage();
  const examplePage = new ExamplePage(page, this.config);
  await expect(examplePage.titleLocator()).toBeVisible();
});

Then('the example page content container should be rendered', async function (this: TemplateWorld) {
  const page = this.getPage();
  const examplePage = new ExamplePage(page, this.config);
  await expect(examplePage.contentLocator()).toBeVisible();
});

Then(
  'probe health check confirms the page DOM hierarchy is stable',
  async function (this: TemplateWorld) {
    const page = this.getPage();
    const readyState = await page.evaluate(() => document.readyState);
    expect(readyState).toMatch(/interactive|complete/);
  },
);
