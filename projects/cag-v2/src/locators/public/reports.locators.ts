import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const reportsLocators = (page: Page) => ({
  title: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.title)
      .or(page.getByTestId('page-title'))
      .or(page.locator('h1, h2:has-text("Reports"), [class*="page-title"]'))
      .first(),
  filterPanel: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.filterPanel)
      .or(page.getByTestId('search-filter-panel'))
      .or(page.locator('[class*="filter"]'))
      .first(),
  searchInput: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.searchInput)
      .or(page.locator('.page-search__input, input[placeholder*="keyword" i]'))
      .or(page.locator('main input[type="search"], main input[placeholder*="Search" i]'))
      .first(),
  searchSubmit: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.searchSubmit)
      .or(page.locator('button[type="submit"], button.page-search__button, button[aria-label*="Search" i], button:has-text("Search")'))
      .first(),
  filterSelect: (name: string): Locator =>
    page
      .getByTestId(`public-reports-filter-${name}`)
      .or(page.getByTestId(`filter-select-${name}`))
      .or(page.locator(`select[name*="${name}"], button:has-text("${name}")`)),
  filterYear: (): Locator =>
    page.getByTestId(TestIds.publicReports.filterYear).or(page.locator('select[name*="year"], button:has-text("Year")')).first(),
  filterCategory: (): Locator =>
    page.getByTestId(TestIds.publicReports.filterCategory).or(page.locator('select[name*="category"], select[name*="sector"], button:has-text("Sector")')).first(),
  filterClear: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.filterClear)
      .or(page.getByTestId('filter-clear-btn'))
      .or(page.locator('button:has-text("Clear All"), button:has-text("Clear")'))
      .first(),
  tableRoot: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.tableRoot)
      .or(page.locator('main, [class*="reports-container"]'))
      .first(),
  resultCards: (): Locator =>
    page.getByTestId(TestIds.publicReports.card).or(page.locator('[class*="report-listing-card"], article, [class*="card"]')),
  emptyState: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.empty)
      .or(page.getByTestId('public-reports-empty-state'))
      .or(page.locator('p:has-text("No reports matching"), p:has-text("0 results found"), [class*="no-results"]'))
      .first(),
  paginationSummary: (): Locator =>
    page.getByTestId(TestIds.publicReports.paginationSummary).or(page.locator('[class*="pagination"]')).first(),
  paginationPage1: (): Locator =>
    page.getByTestId(TestIds.publicReports.paginationPage1).or(page.locator('button:has-text("1")')).first(),
  paginationPage2: (): Locator =>
    page.getByTestId(TestIds.publicReports.paginationPage2).or(page.locator('button:has-text("2")')).first(),
  rowsPerPage: (): Locator =>
    page
      .getByTestId(TestIds.publicReports.rowsPerPage)
      .or(page.locator('select[name*="rows" i], select[name*="page" i], select[name*="limit" i], select[name*="size" i]'))
      .first(),
  row: (index: number | string): Locator =>
    page
      .getByTestId(TestIds.publicReports.row(index))
      .or(page.locator('[class*="report-listing-card"], [class*="card"], tr:not(:has(th))'))
      .nth(typeof index === 'number' ? index : parseInt(String(index), 10)),
  cellTitle: (index: number | string): Locator =>
    page
      .getByTestId(TestIds.publicReports.cellTitle(index))
      .or(page.locator('[class*="report-listing-card"] h3, tr h3, tr td:first-child'))
      .nth(typeof index === 'number' ? index : parseInt(String(index), 10)),
  cellYear: (index: number | string): Locator =>
    page.getByTestId(TestIds.publicReports.cellYear(index)),
  cellCategory: (index: number | string): Locator =>
    page.getByTestId(TestIds.publicReports.cellCategory(index)),
});
