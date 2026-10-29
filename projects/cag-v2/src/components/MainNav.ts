import { Locator, Page } from '@playwright/test';
import { commonLocators } from '../locators/common.locators';

export class MainNav {
  private readonly L: ReturnType<typeof commonLocators>;

  constructor(target: Page | Locator) {
    const page = 'page' in target && typeof target.page === 'function' ? target.page() : (target as Page);
    this.L = commonLocators(page);
  }

  public root(): Locator {
    return this.L.nav();
  }

  public navItems(): Locator {
    return this.L.navItems();
  }

  public async getNavItemCount(): Promise<number> {
    return this.navItems().count();
  }

  public async getNavItemTexts(): Promise<string[]> {
    return this.navItems().allTextContents();
  }

  public navItem(section: 'home' | 'about-us' | 'reports' | 'news' | 'states'): Locator {
    return this.L.navItem(section);
  }

  public async clickNavItem(text: string): Promise<void> {
    await this.L.navItemByText(text).click();
  }

  public async links(): Promise<Locator[]> {
    return this.navItems().all();
  }
}
