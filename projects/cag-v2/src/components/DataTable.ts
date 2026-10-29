import { Locator } from '@playwright/test';
import { tableLocators } from '../locators/common.locators';

export class DataTable {
  private readonly L: ReturnType<typeof tableLocators>;

  constructor(private readonly tableRoot: Locator) {
    this.L = tableLocators(tableRoot);
  }

  public rootLocator(): Locator {
    return this.L.root();
  }

  public rows(): Locator {
    return this.L.rows();
  }

  public async rowCount(): Promise<number> {
    return this.rows().count();
  }

  public cell(rowIndex: number, column: string): Locator {
    return this.L.cell(rowIndex, column);
  }

  public async headers(): Promise<string[]> {
    return this.L.headers().allTextContents();
  }

  public async paginationSummary(): Promise<{ from: number; to: number; total: number }> {
    const el = this.L.paginationSummary();
    if ((await el.count()) === 0) {
      return { from: 0, to: 0, total: 0 };
    }
    const summaryText = (await el.first().textContent()) ?? '0-0 of 0';
    const match = summaryText.match(/(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/i);
    if (!match || !match[1] || !match[2] || !match[3]) {
      return { from: 0, to: 0, total: 0 };
    }
    return {
      from: parseInt(match[1], 10),
      to: parseInt(match[2], 10),
      total: parseInt(match[3], 10),
    };
  }

  public async gotoPage(n: number): Promise<void> {
    await this.L.paginationPage(n).click();
  }

  public async setRowsPerPage(n: number): Promise<void> {
    await this.L.rowsPerPage().selectOption(String(n));
  }

  public rowByText(text: string): Locator {
    return this.L.rowByText(text);
  }

  public async editRow(text: string): Promise<void> {
    await this.L.actionEdit(text).click();
  }

  public async deleteRow(text: string): Promise<void> {
    await this.L.actionDelete(text).click();
  }
}
