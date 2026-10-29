import { Locator, Page } from '@playwright/test';
import { EnvConfig } from '@qa/core';
import { getExamplePageTitle, getExamplePageContent } from '../locators/example.locators';

export class ExamplePage {
  constructor(
    private readonly page: Page,
    private readonly config?: EnvConfig,
  ) {}

  public async goto(): Promise<void> {
    const base = this.config?.baseUrl ?? '';
    await this.page.goto(base ? `${base}/example` : '/example');
  }

  public titleLocator(): Locator {
    return getExamplePageTitle(this.page);
  }

  public contentLocator(): Locator {
    return getExamplePageContent(this.page);
  }
}
