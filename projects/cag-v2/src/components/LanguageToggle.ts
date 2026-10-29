import { Locator, Page } from '@playwright/test';
import { commonLocators } from '../locators/common.locators';

export class LanguageToggle {
  private readonly L: ReturnType<typeof commonLocators>;
  private readonly page: Page;

  constructor(target: Page | Locator) {
    this.page = 'page' in target && typeof target.page === 'function' ? target.page() : (target as Page);
    this.L = commonLocators(this.page);
  }

  public root(): Locator {
    return this.L.languageToggle();
  }

  public currentLanguage(): Locator {
    return this.L.langCurrent();
  }

  public async getCurrentLanguage(): Promise<string> {
    const text = await this.currentLanguage().textContent();
    return text ? text.trim() : '';
  }

  public async selectLanguage(lang: 'en' | 'hi'): Promise<void> {
    const targetOpt = this.L.langSwitch(lang);
    if (!(await targetOpt.isVisible())) {
      await this.root().click();
      await this.page.waitForTimeout(300);
    }
    await targetOpt.click();
    await this.page.waitForTimeout(1000);
  }

  public async switchToHindi(): Promise<void> {
    await this.selectLanguage('hi');
  }

  public async switchToEnglish(): Promise<void> {
    await this.selectLanguage('en');
  }
}
