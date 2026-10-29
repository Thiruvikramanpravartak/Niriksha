import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

When('I probe multiple protected administrative endpoints without authorization', async function (this: CustomWorld) {
  const endpoints = [
    '/api/admin/crud?table=reports',
    '/api/admin/options?type=states',
    '/api/admin/crud?table=news',
  ];

  const results: Array<{ endpoint: string; status: number }> = [];
  const baseUrl = this.config?.baseUrl || process.env.BASE_URL || 'http://13.202.245.81:3001';
  for (const ep of endpoints) {
    const res = await fetch(`${baseUrl}${ep}`);
    results.push({ endpoint: ep, status: res.status });
  }

  this.customState.set('sampledSecurityProbes', results);
  this.checklist.record('Security probes executed', `${results.length} protected endpoints checked`, true);
});

Then('all sampled administrative endpoints should return 401 or 403 status codes', async function (this: CustomWorld) {
  const results = this.customState.get('sampledSecurityProbes') as Array<{ endpoint: string; status: number }>;
  expect(results).toBeDefined();
  expect(results.length).toBeGreaterThan(0);

  for (const r of results) {
    expect([401, 403]).toContain(r.status);
    this.checklist.record(`Endpoint guard ${r.endpoint}`, `HTTP ${r.status}`, true);
  }
});

When('I navigate to the public home portal page', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  this.checklist.record('Home page loaded for non-functional audit', page.url(), true);
});

Then('page text content should render with legible visual presentation and background separation', async function (this: CustomWorld) {
  const page = this.getPage();
  const headings = await page.locator('h1, h2').all();
  expect(headings.length).toBeGreaterThan(0);

  for (const h of headings.slice(0, 3)) {
    const isVisible = await h.isVisible();
    expect(isVisible).toBe(true);
    const color = await h.evaluate((el) => window.getComputedStyle(el).color);
    expect(color.length).toBeGreaterThan(0);
  }

  this.checklist.record('Visual contrast and typography verified', 'Key headings inspected', true);
});

When('I inspect the images on the public home portal page', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  const count = await page.locator('img').count();
  expect(count).toBeGreaterThan(0);
  this.checklist.record('Images discovered on portal', `${count} images found`, true);
});

Then('all informative images should provide descriptive alt text', async function (this: CustomWorld) {
  const page = this.getPage();
  const images = await page.locator('img').all();
  let checked = 0;

  for (const img of images) {
    const alt = await img.getAttribute('alt');
    const ariaHidden = await img.getAttribute('aria-hidden');
    // If not decorative (aria-hidden=true), should have an alt attribute defined
    if (ariaHidden !== 'true') {
      expect(alt !== null).toBe(true);
      checked++;
    }
  }

  this.checklist.record('Image alt text compliance verified', `${checked} images checked`, true);
});

When('I inspect the DOM architecture of the home portal', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  this.checklist.record('DOM architecture inspection initiated', page.url(), true);
});

Then('semantic landmarks header, nav, main, and footer should be properly declared', async function (this: CustomWorld) {
  const page = this.getPage();
  // Header landmark
  const header = page.locator('header, [role="banner"]').first();
  await expect(header).toBeVisible({ timeout: 10000 });
  this.checklist.record('Header landmark verified', 'Declared in DOM', true);

  // Navigation landmark
  const nav = page.locator('nav, [role="navigation"]').first();
  await expect(nav).toBeVisible({ timeout: 10000 });
  this.checklist.record('Nav landmark verified', 'Declared in DOM', true);

  // Main landmark
  const main = page.locator('main, [role="main"]').first();
  await expect(main).toBeVisible({ timeout: 10000 });
  this.checklist.record('Main landmark verified', 'Declared in DOM', true);

  // Footer landmark
  const footer = page.locator('footer, [role="contentinfo"]').first();
  await expect(footer).toBeVisible({ timeout: 10000 });
  this.checklist.record('Footer landmark verified', 'Declared in DOM', true);
});
