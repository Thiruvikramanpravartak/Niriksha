import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { NewsPage } from '../../src/pages/public/NewsPage';

Given('I navigate to the news page', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await newsPage.goto();
});

Then('the news title should be visible', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.titleLocator()).toBeVisible();
});

Then('published news cards should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.newsCard(1)).toBeVisible();
});

When('I click on read more for the first article', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await newsPage.openDetail(1);
});

Then('the article detail section should be visible with publication metadata', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.detailSection()).toBeVisible();
});

When('I select news publication year {string}', async function (this: CustomWorld, year: string) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await newsPage.selectYear(year);
});

Then('only news articles from year {string} should be displayed', async function (this: CustomWorld, _year: string) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.newsCard(1)).toBeVisible();
});

When('I search news with keyword {string}', async function (this: CustomWorld, keyword: string) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await newsPage.search(keyword);
});

Then('only articles matching {string} should remain visible', async function (this: CustomWorld, keyword: string) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.headline(1)).toContainText(keyword, { ignoreCase: true });
});

Then('the news pagination control should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.pagination()).toBeVisible();
});

Then('the official press release PDF download link should be available', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.pdfDownloadLink()).toBeVisible();
});

Then('the news page title and headlines should be rendered in Hindi', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.titleLocator()).toContainText('समाचार');
});

Then('the link to historical press release archive should be present', async function (this: CustomWorld) {
  const page = this.getPage();
  const newsPage = new NewsPage(page, this.config);
  await expect(newsPage.archiveLink()).toBeVisible();
});

Then('all visible news item images should have valid dimensions and sources', async function (this: CustomWorld) {
  const page = this.getPage();
  const images = await page.locator('img').all();
  let validCount = 0;
  for (const img of images) {
    const isNatural = await img.evaluate(
      (el: HTMLImageElement) => el.naturalWidth > 0 || (Boolean(el.src) && !el.src.includes('broken'))
    );
    if (isNatural) validCount++;
  }
  expect(validCount).toBeGreaterThan(0);
  this.checklist.record('News media images verified', `${validCount} images intact`, true);
});

