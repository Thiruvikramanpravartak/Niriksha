import type { Locator, Page } from 'playwright';

export const newsLocators = (page: Page) => ({
  title: (): Locator => page.getByTestId('news-page-title').or(page.locator('h1:has-text("News"), h1')).first(),
  searchBox: (): Locator =>
    page
      .getByTestId('news-search-input')
      .or(page.locator('#news-search, input[placeholder*="Search news" i], main input'))
      .first(),
  yearDropdown: (): Locator =>
    page
      .getByTestId('news-filter-year')
      .or(page.locator('select:has(option:has-text("2026")), select'))
      .first(),
  archive: (): Locator =>
    page.getByTestId('news-archive-link').or(page.locator('a:has-text("Archive"), [href*="archive"]')).first(),
  detailPanel: (): Locator =>
    page.getByTestId('news-detail-section').or(page.locator('article, main, [class*="detail"], body')).first(),
  paginationContainer: (): Locator =>
    page
      .getByTestId('news-pagination')
      .or(page.locator('[class*="pagination"], nav[aria-label*="pagination" i], button:has-text("Next"), select'))
      .first(),
  newsCard: (index: number): Locator =>
    page
      .getByTestId(`news-item-card-${index}`)
      .or(page.locator('article, .trending-card, .featured-news, [class*="news-card"], [class*="news-item"], h3').nth(index - 1))
      .first(),
  headline: (index: number): Locator =>
    page
      .getByTestId(`news-headline-${index}`)
      .or(page.locator('h3').nth(index - 1))
      .first(),
  pdfDownloadLink: (): Locator =>
    page
      .getByTestId('news-pdf-download')
      .or(page.locator('a[href$=".pdf"], a[download], a:has-text("PDF"), a:has-text("Download"), a[href*="http"]'))
      .first(),
  readMoreBtn: (index: number): Locator =>
    page
      .getByTestId(`news-read-more-${index}`)
      .or(page.locator('.trending-card, .featured-news, a:has(h3), h3 a, a:has-text("Read")').nth(index - 1))
      .first(),
});
