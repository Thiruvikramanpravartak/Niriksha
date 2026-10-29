import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const homeLocators = (page: Page) => ({
  hero: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.hero)
      .or(page.locator('h1'))
      .or(page.locator('[class*="hero"]'))
      .first(),
  heroTitle: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.heroTitle)
      .or(page.locator('h1'))
      .first(),
  stats: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.stats)
      .or(page.locator('[class*="stat"]'))
      .or(page.getByText('Years of Excellence'))
      .or(page.getByText('150+'))
      .first(),
  statReports: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.statReports)
      .or(page.getByText('150+'))
      .or(page.locator('[class*="stat"]').first()),
  statOffices: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.statOffices)
      .or(page.getByText('700+'))
      .or(page.locator('[class*="stat"]').nth(1)),
  statCards: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.stats)
      .locator('div')
      .or(page.locator('[class*="stat"]')),
  quickActions: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.quickActions)
      .or(page.getByText('Latest Audit Reports'))
      .or(page.locator('a[href*="Reports"]'))
      .first(),
  announcements: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.announcements)
      .or(page.getByText('News & Events'))
      .or(page.getByText('Latest Videos'))
      .first(),
  searchInput: (): Locator =>
    page
      .getByTestId(TestIds.publicHome.searchInput)
      .or(page.locator('input[type="search"]'))
      .or(page.locator('input[placeholder*="Search"]'))
      .first(),
  images: (): Locator => page.locator('img'),
});
