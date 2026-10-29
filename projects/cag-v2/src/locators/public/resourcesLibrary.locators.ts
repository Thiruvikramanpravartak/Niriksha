import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const resourcesLibraryLocators = (page: Page) => ({
  container: (): Locator =>
    page.getByTestId(TestIds.publicResources.container).or(page.locator('main, [class*="resource"]')).first(),
  title: (): Locator =>
    page.getByTestId(TestIds.publicResources.title).or(page.locator('h1, h2')).first(),
  categoryCards: (): Locator =>
    page
      .getByTestId(TestIds.publicResources.categoryCards)
      .or(page.locator('main h2, [class*="card"], [class*="item"], article')),
  categoryCard: (slug: string): Locator =>
    page
      .getByTestId(TestIds.publicResources.categoryCard(slug))
      .or(page.locator(`a[href*="${slug}"], h2:has-text("${slug}"), [class*="card"]:has-text("${slug}")`))
      .first(),
  tendersTable: (): Locator =>
    page
      .getByTestId(TestIds.publicResources.tendersTable)
      .or(page.locator('table, [class*="table"], [class*="list"], main'))
      .first(),
  circularsTable: (): Locator =>
    page
      .getByTestId(TestIds.publicResources.circularsTable)
      .or(page.locator('table, [class*="table"], [class*="list"], main'))
      .first(),
  documentList: (): Locator =>
    page
      .getByTestId(TestIds.publicResources.documentList)
      .or(page.locator('ul, ol, [class*="list"], [class*="grid"], main'))
      .first(),
});
