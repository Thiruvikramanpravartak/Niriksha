import { Locator, Page } from '@playwright/test';
import { commonLocators } from '../locators/common.locators';

export class Footer {
  private readonly L: ReturnType<typeof commonLocators>;

  constructor(target: Page | Locator) {
    const page = 'page' in target && typeof target.page === 'function' ? target.page() : (target as Page);
    this.L = commonLocators(page);
  }

  public root(): Locator {
    return this.L.footer();
  }

  public copyright(): Locator {
    return this.L.footerCopyright();
  }

  public links(): Locator {
    return this.L.footerLinks();
  }

  public linkItems(): Locator {
    return this.L.footerLinkItems();
  }

  public async getCopyrightText(): Promise<string> {
    return (await this.copyright().textContent()) ?? '';
  }
}
