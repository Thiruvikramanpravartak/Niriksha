import { Locator, Page } from '@playwright/test';
import { dashboardLocators } from '../../locators/admin/dashboard.locators';

export class DashboardPage {
  private readonly L: ReturnType<typeof dashboardLocators>;

  constructor(
    private readonly page: Page,
    private readonly adminUrl?: string,
  ) {
    this.L = dashboardLocators(page);
  }

  public async goto(): Promise<void> {
    const target = this.adminUrl ? `${this.adminUrl}/dashboard` : '/admin/dashboard';
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  public root(): Locator {
    return this.L.container();
  }

  public welcomeBanner(): Locator {
    return this.L.welcomeBanner();
  }

  public userMenu(): Locator {
    return this.L.userMenu();
  }

  public logoutButton(): Locator {
    return this.L.logoutButton();
  }

  public async logout(): Promise<void> {
    const logoutBtn = this.logoutButton();
    const menu = this.userMenu();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      return;
    }
    await menu.waitFor({ state: 'visible', timeout: 10000 });
    await menu.click();
    await logoutBtn.waitFor({ state: 'visible', timeout: 5000 });
    await logoutBtn.click();
  }

  public async getWelcomeMessage(): Promise<string> {
    return (await this.welcomeBanner().textContent()) ?? '';
  }
}
