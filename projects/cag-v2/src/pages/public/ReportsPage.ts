import { Locator, Page } from '@playwright/test';
import { SearchFilterPanel } from '../../components/SearchFilterPanel';
import { DataTable } from '../../components/DataTable';
import { Breadcrumb } from '../../components/Breadcrumb';
import { LanguageToggle } from '../../components/LanguageToggle';
import { reportsLocators } from '../../locators/public/reports.locators';
import { commonLocators } from '../../locators/common.locators';

export class ReportsPage {
  public readonly filters: SearchFilterPanel;
  public readonly table: DataTable;
  public readonly breadcrumb: Breadcrumb;
  public readonly languageToggle: LanguageToggle;
  private readonly L: ReturnType<typeof reportsLocators>;

  constructor(
    private readonly page: Page,
    private readonly baseUrl?: string,
  ) {
    this.filters = new SearchFilterPanel(page);
    this.breadcrumb = new Breadcrumb(commonLocators(page).breadcrumb());
    this.languageToggle = new LanguageToggle(commonLocators(page).languageToggle());
    this.L = reportsLocators(page);
    this.table = new DataTable(this.L.tableRoot());
  }

  public async goto(): Promise<void> {
    const target = this.baseUrl ? `${this.baseUrl}/Reports` : '/Reports';
    try {
      await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
    } catch {
      await this.page.goto(target, { waitUntil: 'commit', timeout: 20000 });
    }
    await this.page.locator('[class*="report-listing-card"], article, table').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  public pageTitle(): Locator {
    return this.L.title();
  }

  public async getTitle(): Promise<string> {
    return (await this.pageTitle().textContent()) ?? '';
  }
}
