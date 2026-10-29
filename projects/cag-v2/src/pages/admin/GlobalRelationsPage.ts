import { Locator, Page } from '@playwright/test';
import { globalRelationsLocators } from '../../locators/admin/globalRelations.locators';

export class GlobalRelationsPage {
  private readonly L: ReturnType<typeof globalRelationsLocators>;

  constructor(
    private readonly page: Page,
    private readonly adminUrl?: string,
  ) {
    this.L = globalRelationsLocators(page);
  }

  public async goto(): Promise<void> {
    const target = this.adminUrl ? `${this.adminUrl}/global-relations` : '/admin/global-relations';
    await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public get container(): Locator {
    return this.L.container();
  }

  public get pageTitle(): Locator {
    return this.L.pageTitle();
  }

  public get table(): Locator {
    return this.L.table();
  }

  public get tableRows(): Locator {
    return this.L.tableRows();
  }

  public get searchInput(): Locator {
    return this.L.searchInput();
  }

  public get searchBtn(): Locator {
    return this.L.searchBtn();
  }

  public get resetBtn(): Locator {
    return this.L.resetBtn();
  }

  public get addRecordBtn(): Locator {
    return this.L.addRecordBtn();
  }

  public get modalDialog(): Locator {
    return this.L.modalDialog();
  }

  public get modalCancelBtn(): Locator {
    return this.L.modalCancelBtn();
  }

  public async getRowCount(): Promise<number> {
    return this.L.tableRows().count();
  }

  public async search(term: string): Promise<void> {
    await this.L.searchInput().fill(term);
    if (await this.L.searchBtn().isVisible().catch(() => false)) {
      await this.L.searchBtn().click();
    }
  }

  public async resetSearch(): Promise<void> {
    if (await this.L.resetBtn().isVisible().catch(() => false)) {
      await this.L.resetBtn().click();
    } else {
      await this.L.searchInput().fill('');
    }
  }
}
