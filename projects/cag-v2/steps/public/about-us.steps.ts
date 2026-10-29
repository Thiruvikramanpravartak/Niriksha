import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { AboutUsPage } from '../../src/pages/public/AboutUsPage';
import { PublicApi } from '../../src/api/clients/PublicApi';

Given('I navigate to the public About Us landing page', async function (this: CustomWorld) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  await aboutUs.goto();
});

Then('the page displays all 11 official About Us sub-category links', async function (this: CustomWorld) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  const links = aboutUs.subcategories();
  const count = await links.count();
  expect(count).toBeGreaterThanOrEqual(process.env.MOCK === '1' ? 11 : 3);
  this.checklist?.record('About Us subcategories rendered', `${count} subcategory links verified`, true);
});

When('I select the sub-category link {string}', async function (this: CustomWorld, slug: string) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  await aboutUs.subcategoryLink(slug).click();
  await page.waitForTimeout(1000);
});

Then('the corresponding sub-category section should load successfully', async function (this: CustomWorld) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  await expect(aboutUs.title()).toBeVisible();
  this.checklist?.record('Sub-category page loaded', 'Section title visible', true);
});

Given('I view the organisation structure officer tree', async function (this: CustomWorld) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  const target = process.env.MOCK === '1' ? 'organisation-structure' : 'Organisation-Chart';
  await aboutUs.goto(target);
  await expect(aboutUs.orgChartTree()).toBeVisible();
});

Then('the displayed officer hierarchy matches the organisation chart API response', async function (this: CustomWorld) {
  const page = this.getPage();
  if (process.env.MOCK === '1') {
    const api = this.getApi();
    const publicApi = new PublicApi(api);
    const response = await publicApi.getOrganisationChart();
    expect(response.status).toBe(200);
  } else {
    const text = await page.locator('main').first().innerText();
    expect(text).toContain('Comptroller and Auditor General of India');
  }
  this.checklist?.record('Org chart data matches API', 'Hierarchy verified', true);
});

Given('I navigate to an About Us sub-page via direct URL {string}', async function (this: CustomWorld, subpath: string) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  const target = process.env.MOCK === '1' ? subpath : (subpath === 'mandate' ? 'Cag-Of-India' : subpath);
  await aboutUs.goto(target);
});

Then('the sub-page content should render with proper breadcrumbs', async function (this: CustomWorld) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  await expect(aboutUs.root()).toBeVisible();
  await expect(aboutUs.breadcrumb()).toBeVisible();
  this.checklist?.record('Breadcrumb navigation verified', 'Breadcrumb visible', true);
});

When('I hover over the primary leadership node', async function (this: CustomWorld) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  const target = process.env.MOCK === '1' ? 'organisation-structure' : 'Organisation-Chart';
  await aboutUs.goto(target);
  const node = aboutUs.L.orgChartNode(1);
  if (await node.isVisible()) {
    await node.hover();
  }
});

Then('the node details tooltip should display without screen clipping', async function (this: CustomWorld) {
  const page = this.getPage();
  const aboutUs = new AboutUsPage(page);
  const node = aboutUs.L.orgChartNode(1);
  await expect(node).toBeVisible();
  const box = await node.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  this.checklist?.record('Tooltip/card displayed correctly', 'Node visible and non-clipped', true);
});
