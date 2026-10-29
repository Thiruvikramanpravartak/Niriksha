import { Locator, Page } from '@playwright/test';
import { auditLogLocators } from '../../locators/admin/auditLog.locators';
import { LoginPage } from './LoginPage';

export class AuditLogPage {
  public readonly L: ReturnType<typeof auditLogLocators>;

  constructor(private readonly page: Page) {
    this.L = auditLogLocators(page);
  }

  public async goto(): Promise<void> {
    await this.page.goto('/admin/audit-log', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(1500);
    if (this.page.url().includes('/admin/login')) {
      const login = new LoginPage(this.page);
      const user = process.env.MOCK === '1' ? 'admin' : (process.env.ADMIN_USER || 'tthiruvikram_admin');
      const pass = process.env.MOCK === '1' ? 'mock-password-123' : (process.env.ADMIN_PASS || 'Thiru@123');
      await login.login(user, pass);
      await this.page.goto('/admin/audit-log', { waitUntil: 'domcontentloaded' });
    }
    await this.page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  public root(): Locator {
    return this.L.container();
  }

  public title(): Locator {
    return this.L.title();
  }

  public table(): Locator {
    return this.L.table();
  }

  public async filterByAction(action: string): Promise<void> {
    const filter = this.L.filterAction();
    if ((await filter.count()) > 0 && (await filter.isVisible())) {
      await filter.selectOption(action);
    } else {
      const search = this.page.locator('input[placeholder*="Search command"], input[type="text"]').first();
      if (await search.isVisible()) {
        await search.fill(action);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
      }
    }
  }
}
