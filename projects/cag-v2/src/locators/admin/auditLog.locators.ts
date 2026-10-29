import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const auditLogLocators = (page: Page) => ({
  container: (): Locator =>
    page.getByTestId(TestIds.adminAuditLog.container).or(page.locator('main, [class*="audit"], [class*="layout"]')).first(),
  title: (): Locator =>
    page.getByTestId(TestIds.adminAuditLog.title).or(page.locator('h1, h2:has-text("Audit"), [class*="title"]')).first(),
  table: (): Locator =>
    page.getByTestId(TestIds.adminAuditLog.table).or(page.locator('table, [role="table"]')).first(),
  filterAction: (): Locator =>
    page.getByTestId(TestIds.adminAuditLog.filterAction).or(page.locator('select[name*="action"], select')).first(),
  filterDate: (): Locator =>
    page.getByTestId(TestIds.adminAuditLog.filterDate).or(page.locator('input[type="date"]')).first(),
  row: (id: string | number): Locator =>
    page.getByTestId(TestIds.adminAuditLog.row(id)).or(page.locator(`tbody tr:nth-child(${id})`)).first(),
  cellAction: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminAuditLog.cellAction(id))
      .or(page.locator(`tbody tr:nth-child(${id}) td:nth-child(4), table tr:nth-child(${id}) td:nth-child(4)`))
      .first(),
  cellEntity: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminAuditLog.cellEntity(id))
      .or(page.locator(`tbody tr:nth-child(${id}) td:nth-child(3)`))
      .first(),
  cellOldData: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminAuditLog.cellOldData(id))
      .or(page.locator(`tbody tr:nth-child(${id}) td:nth-child(6)`))
      .first(),
  cellNewData: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminAuditLog.cellNewData(id))
      .or(page.locator(`tbody tr:nth-child(${id}) td:nth-child(6)`))
      .first(),
});
