import { Locator, Page } from '@playwright/test';
import { DataTable } from '../../components/DataTable';
import { SearchFilterPanel } from '../../components/SearchFilterPanel';
import { crudListLocators } from '../../locators/admin/crudList.locators';
import { LoginPage } from './LoginPage';

export interface CrudListPageOptions {
  module: string;
  adminUrl?: string;
}

export class CrudListPage {
  public readonly table: DataTable;
  public readonly filters: SearchFilterPanel;
  public readonly L: ReturnType<typeof crudListLocators>;
  private readonly moduleName: string;
  private readonly adminUrl?: string;

  constructor(
    private readonly page: Page,
    options: CrudListPageOptions,
  ) {
    this.moduleName = options.module;
    this.adminUrl = options.adminUrl;
    this.L = crudListLocators(page);
    this.table = new DataTable(this.L.table(this.moduleName));
    this.filters = new SearchFilterPanel(page);
  }

  public async goto(): Promise<void> {
    const target = this.adminUrl
      ? `${this.adminUrl}/${this.moduleName}`
      : `/admin/${this.moduleName}`;
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(1500);
    if (this.page.url().includes('/admin/login')) {
      const login = new LoginPage(this.page);
      const user = process.env.MOCK === '1' ? 'admin' : (process.env.CAG_E2E_ADMIN_USER || process.env.ADMIN_USER || 'tthiruvikram_admin');
      const pass = process.env.MOCK === '1' ? 'mock-password-123' : (process.env.CAG_E2E_ADMIN_PASSWORD || process.env.ADMIN_PASS || 'Thiru@123');
      await login.login(user, pass);
      await this.page.goto(target, { waitUntil: 'domcontentloaded' });
    }
    await this.page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  public addNewButton(): Locator {
    return this.L.addNewButton();
  }

  public async clickAddNew(): Promise<void> {
    await this.addNewButton().click();
  }

  public async clickAdd(): Promise<void> {
    await this.clickAddNew();
  }
}

