import { Locator, Page } from '@playwright/test';
import { commonLocators } from '../locators/common.locators';

export class Header {
  private readonly L: ReturnType<typeof commonLocators>;

  constructor(target: Page | Locator) {
    const page = 'page' in target && typeof target.page === 'function' ? target.page() : (target as Page);
    this.L = commonLocators(page);
  }

  public root(): Locator {
    return this.L.header();
  }

  public logo(): Locator {
    return this.L.headerLogo();
  }

  public title(): Locator {
    return this.L.headerTitle();
  }

  public async getTitleText(): Promise<string> {
    const el = this.title();
    const text = (await el.textContent())?.trim();
    if (text) return text;
    const alt = await el.getAttribute('alt');
    if (alt) return alt;
    const aria = await el.getAttribute('aria-label');
    if (aria) return aria;
    return '';
  }
}
