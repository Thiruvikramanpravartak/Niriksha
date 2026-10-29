import { Locator, Page } from '@playwright/test';
import { reportsLocators } from '../locators/public/reports.locators';

export class SearchFilterPanel {
  private readonly L: ReturnType<typeof reportsLocators>;

  constructor(private readonly page: Page) {
    this.L = reportsLocators(page);
  }

  public root(): Locator {
    return this.L.filterPanel();
  }

  public searchInput(): Locator {
    return this.L.searchInput();
  }

  public async search(keyword: string): Promise<void> {
    await this.searchInput().fill(keyword);
    await this.searchInput().press('Enter');
    const submit = this.L.searchSubmit();
    if ((await submit.count()) > 0 && (await submit.isVisible())) {
      await submit.click();
    }
  }

  public async setFilter(name: string, value: string): Promise<void> {
    const sel = this.L.filterSelect(name);
    if ((await sel.count()) > 0 && (await sel.isVisible())) {
      const tagName = await sel.first().evaluate((el) => el.tagName.toLowerCase());
      if (tagName === 'select') {
        await sel.first().selectOption(value);
        return;
      }
      await sel.first().click();
      const option = this.page
        .locator(`button:has-text("${value}"), label:has-text("${value}"), [role="option"]:has-text("${value}")`)
        .first();
      if ((await option.count()) > 0) {
        await option.click();
      }
    }
  }

  public async clearFilters(): Promise<void> {
    const clearBtn = this.L.filterClear();
    if ((await clearBtn.count()) > 0 && (await clearBtn.isVisible())) {
      await clearBtn.click();
    }
  }

  public async clear(): Promise<void> {
    return this.clearFilters();
  }
}
