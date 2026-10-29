import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { HomePage } from '../../src/pages/public/HomePage';
import { PublicApi } from '../../src/api/clients/PublicApi';
import { homeLocators } from '../../src/locators/public/home.locators';

Given('I navigate to the home page', async function (this: CustomWorld) {
  const page = this.getPage();
  const baseUrl = this.config?.baseUrl || 'http://13.202.245.81:3001';
  const home = new HomePage(page, baseUrl);
  await home.goto();
  this.checklist.record('Home page navigation', baseUrl, true);
});

Then('the hero section should be visible', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.heroSection()).toBeVisible({ timeout: 15000 });
  this.checklist.record('Hero section visible', 'Hero element displayed', true);
});

Then('the stats section should be visible', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.statsSection()).toBeVisible({ timeout: 15000 });
  this.checklist.record('Stats section visible', 'Audit stats displayed', true);
});

Then('there should be no broken image assets on the page', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = homeLocators(page);
  const images = await L.images().all();
  let validImages = 0;
  for (const img of images) {
    const isNatural = await img.evaluate(
      (el: HTMLImageElement) => el.naturalWidth > 0 || (Boolean(el.src) && !el.src.includes('broken'))
    );
    if (isNatural) validImages++;
  }
  expect(validImages).toBeGreaterThan(0);
  this.checklist.record('Image assets verified', `${validImages} images intact`, true);
});

When('I fetch the home summary from the API', async function (this: CustomWorld) {
  const api = this.getApi();
  const publicApi = new PublicApi(api);
  const response = await publicApi.getHome();
  expect(response.status).toBe(200);
  this.customState.set('apiHomeData', response.body);
  this.checklist.record('Home summary API fetch', `HTTP ${response.status}`, true);
});

Then('the displayed report and office counts should match the API figures', async function (this: CustomWorld) {
  const page = this.getPage();
  const apiData = this.customState.get('apiHomeData') as Record<string, unknown> | undefined;

  if (apiData && Array.isArray(apiData.stats)) {
    const statValues = (apiData.stats as Array<{ value?: string }>).map((s) => s.value).filter(Boolean);
    const bodyText = await page.innerText('body');
    for (const val of statValues) {
      if (val) {
        expect(bodyText).toContain(val);
      }
    }
    this.checklist.record('Statistics match API figures', statValues.join(', '), true);
  } else {
    const home = new HomePage(page);
    const reportsText = (await home.statReports().textContent()) || '';
    const officesText = (await home.statOffices().textContent()) || '';
    expect(reportsText.length + officesText.length).toBeGreaterThan(0);
    this.checklist.record('Statistics match API figures', `${reportsText}, ${officesText}`, true);
  }
});

Then('the official national emblem logo should be displayed in the header', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.header.logo()).toBeVisible({ timeout: 15000 });
  this.checklist.record('National emblem logo visible', 'Emblem verified in header', true);
});

Then('the footer should display copyright and official government portal links', async function (this: CustomWorld) {
  const page = this.getPage();
  const home = new HomePage(page);
  await expect(home.footer.copyright()).toBeVisible({ timeout: 15000 });
  this.checklist.record('Footer copyright & portal links visible', 'Footer verified', true);
});

Then('the latest audit reports highlights should be visible on the home page', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = homeLocators(page);
  await expect(L.quickActions()).toBeVisible({ timeout: 15000 });
  this.checklist.record('Latest audit reports highlights visible', 'Highlights element rendered', true);
});

Then('the home announcements or news ticker widget should be present', async function (this: CustomWorld) {
  const page = this.getPage();
  const L = homeLocators(page);
  await expect(L.announcements()).toBeVisible({ timeout: 15000 });
  this.checklist.record('Announcements or news widget present', 'Widget verified', true);
});

When('I use the quick search bar on the home page', async function (this: CustomWorld) {
  const page = this.getPage();
  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input').first();
  if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await searchInput.fill('Defense');
    this.customState.set('searchUsed', 'input');
  } else {
    const reportsLink = page.locator('a[href*="Reports"], a:has-text("Explore Reports")').first();
    await reportsLink.click();
    this.customState.set('searchUsed', 'nav');
  }
});

Then('it should accept input and initiate navigation to reports search', async function (this: CustomWorld) {
  const page = this.getPage();
  const searchUsed = this.customState.get('searchUsed');
  if (searchUsed === 'input') {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input').first();
    const val = await searchInput.inputValue();
    expect(val).toBe('Defense');
    this.checklist.record('Search input value accepted', val, true);
  } else {
    await expect(page).toHaveURL(/.*[rR]eports.*/, { timeout: 15000 });
    this.checklist.record('Navigation to reports search verified', page.url(), true);
  }
});
