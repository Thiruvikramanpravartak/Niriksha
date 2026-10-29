import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const ourPresenceLocators = (page: Page) => ({
  container: (): Locator =>
    page.getByTestId(TestIds.publicOurPresence.container).or(page.locator('main, [class*="presence"]')).first(),
  title: (): Locator =>
    page.getByTestId(TestIds.publicOurPresence.title).or(page.locator('h1, h2')).first(),
  centralOfficesList: (): Locator =>
    page.getByTestId(TestIds.publicOurPresence.centralOfficesList).or(page.locator('[class*="office"], [class*="card"], main')).first(),
  stateAgOfficesList: (): Locator =>
    page.getByTestId(TestIds.publicOurPresence.stateAgOfficesList).or(page.locator('[class*="office"], [class*="state"], main')).first(),
  trainingInstitutesList: (): Locator =>
    page.getByTestId(TestIds.publicOurPresence.trainingInstitutesList).or(page.locator('[class*="institute"], [class*="training"], main')).first(),
  subpageLink: (slug: string): Locator =>
    page.getByTestId(TestIds.publicOurPresence.subpageLink(slug)).or(page.locator(`a[href*="${slug}"]`)).first(),
  navMenu: (): Locator =>
    page.getByTestId(TestIds.publicOurPresence.navMenu).or(page.locator('aside, nav, [class*="sidebar"], [class*="menu"]')).first(),
});
