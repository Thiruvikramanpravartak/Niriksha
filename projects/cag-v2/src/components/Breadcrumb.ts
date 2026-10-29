import { Locator, Page } from '@playwright/test';
import { commonLocators } from '../locators/common.locators';

export class Breadcrumb {
  private readonly L: ReturnType<typeof commonLocators>;

  constructor(target: Page | Locator) {
    const page = 'page' in target && typeof target.page === 'function' ? target.page() : (target as Page);
    this.L = commonLocators(page);
  }

  public root(): Locator {
    return this.L.breadcrumb();
  }

  public items(): Locator {
    return this.L.breadcrumbItems();
  }

  public async getItems(): Promise<string[]> {
    return this.items().allTextContents();
  }
}
