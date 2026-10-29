import { Locator, Page } from '@playwright/test';
import { stateSubsiteLocators } from '../../locators/public/stateSubsite.locators';

export class StateSubsitePage {
  private readonly L: ReturnType<typeof stateSubsiteLocators>;

  constructor(
    private readonly page: Page,
    private readonly baseUrl?: string,
  ) {
    this.L = stateSubsiteLocators(page);
  }

  public async goto(stateCode: string): Promise<void> {
    const target = this.baseUrl ? `${this.baseUrl}/states/${stateCode}` : `/states/${stateCode}`;
    await this.page.goto(target);
  }

  public stateTitle(): Locator {
    return this.L.subsiteTitle();
  }

  public async getStateName(): Promise<string> {
    return (await this.stateTitle().textContent()) ?? '';
  }
}
