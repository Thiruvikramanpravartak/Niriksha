import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const dashboardLocators = (page: Page) => ({
  container: (): Locator =>
    page
      .getByTestId(TestIds.adminDashboard.container)
      .or(page.locator('main, [class*="dashboard"], [class*="admin"], header'))
      .first(),
  welcomeBanner: (): Locator =>
    page
      .getByTestId(TestIds.adminDashboard.welcomeBanner)
      .or(page.locator('h1, h2, [class*="welcome"], [class*="user"], p'))
      .first(),
  navNews: (): Locator =>
    page.getByTestId(TestIds.adminDashboard.navNews).or(page.locator('a[href*="news"], button:has-text("News")')).first(),
  navReports: (): Locator =>
    page.getByTestId(TestIds.adminDashboard.navReports).or(page.locator('a[href*="report"], button:has-text("Report")')).first(),
  userMenu: (): Locator =>
    page
      .getByTestId(TestIds.adminDashboard.userMenu)
      .or(page.locator('button:has-text("Admin"):not(:has-text("Administration")), [class*="avatar"]'))
      .first(),
  logoutButton: (): Locator =>
    page.getByTestId(TestIds.adminDashboard.logout).or(page.locator('button:has-text("Log out"), button:has-text("Logout"), button:has-text("Sign out")')).first(),
});
