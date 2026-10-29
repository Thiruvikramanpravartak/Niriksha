import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const crudListLocators = (page: Page) => ({
  container: (): Locator =>
    page.getByTestId(TestIds.adminCrud.container).or(page.locator('main, [class*="layout"]')).first(),
  title: (): Locator =>
    page.getByTestId(TestIds.adminCrud.title).or(page.locator('h1, h2')).first(),
  addNewButton: (): Locator =>
    page
      .getByTestId(TestIds.adminCrud.addBtn)
      .or(page.getByTestId('add-new-record-btn'))
      .or(page.locator('button:has-text("Add New"), button:has-text("Add"), button:has-text("Create")'))
      .first(),
  table: (moduleName?: string): Locator => {
    const base = page.getByTestId(TestIds.adminCrud.table);
    const mod = moduleName ? base.or(page.getByTestId(`${moduleName}-table`)) : base;
    return mod.or(page.locator('table, [role="table"]')).first();
  },
  row: (id: string | number): Locator =>
    page.getByTestId(TestIds.adminCrud.row(id)).or(page.locator(`tbody tr:nth-child(${id}), table tr:nth-child(${id})`)).first(),
  cellTitle: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminCrud.cellTitle(id))
      .or(page.locator(`tbody tr:nth-child(${id}) td:nth-child(2)`))
      .first(),
  cellCategory: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminCrud.cellCategory(id))
      .or(page.locator(`tbody tr:nth-child(${id}) td:nth-child(3)`))
      .first(),
  cellStatus: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminCrud.cellStatus(id))
      .or(page.locator(`tbody tr:nth-child(${id}) td:nth-child(7), tbody tr:nth-child(${id}) [data-testid*="status"]`))
      .first(),
  actionEdit: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminCrud.actionEdit(id))
      .or(page.locator(`tbody tr:nth-child(${id}) button[title*="Edit" i], tbody tr:nth-child(${id}) button:has-text("Live Edit"), tbody tr:nth-child(${id}) button:has-text("Edit")`))
      .first(),
  actionDelete: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.adminCrud.actionDelete(id))
      .or(page.locator(`tbody tr:nth-child(${id}) button[title*="Delete" i], tbody tr:nth-child(${id}) button:has-text("Delete")`))
      .first(),
  paginationSummary: (): Locator =>
    page.getByTestId(TestIds.adminCrud.paginationSummary).or(page.locator('[class*="pagination"], [class*="showing"]')).first(),
  paginationPage1: (): Locator =>
    page.getByTestId(TestIds.adminCrud.paginationPage1).or(page.locator('button:has-text("1")')).first(),
  paginationPage2: (): Locator =>
    page.getByTestId(TestIds.adminCrud.paginationPage2).or(page.locator('button:has-text("2"), [aria-label*="Next" i], button:has-text("Next")')).first(),
  rowsPerPage: (): Locator =>
    page.getByTestId(TestIds.adminCrud.rowsPerPage).or(page.locator('select')).last(),
  searchInput: (): Locator =>
    page
      .getByTestId(TestIds.adminCrud.searchInput)
      .or(page.locator('input[placeholder*="keyword" i], input[type="search"], input[placeholder*="Search" i], input[type="text"]'))
      .first(),
  filterStatus: (): Locator =>
    page
      .getByTestId(TestIds.adminCrud.filterStatus)
      .or(page.locator('select[name*="status"], select').first()),
  modal: (): Locator =>
    page.getByTestId(TestIds.adminCrud.modal).or(page.locator('[role="dialog"], [class*="modal"], form')).first(),
  submitButton: (): Locator =>
    page
      .getByTestId(TestIds.adminCrud.submitBtn)
      .or(page.locator('button[type="submit"]:has-text("Save"), button:has-text("Save Notice Record"), button[type="submit"]'))
      .first(),
  errorMessage: (): Locator =>
    page
      .getByTestId(TestIds.adminCrud.errorMsg)
      .or(page.locator('.error-message, [class*="error-msg"], [class*="error_msg"], [class*="error"]:not(#__next-route-announcer__), [role="alert"]:not(#__next-route-announcer__)'))
      .first(),
  inputTitleEn: (): Locator =>
    page
      .getByTestId(TestIds.adminCrud.inputTitleEn)
      .or(page.locator('input[placeholder*="notice title" i], input[placeholder*="title" i], input[name*="title" i]'))
      .first(),
  inputTitleHi: (): Locator =>
    page
      .getByTestId(TestIds.adminCrud.inputTitleHi)
      .or(page.locator('input[placeholder*="Hindi" i], input[name*="hi" i], textarea[placeholder*="details" i]'))
      .first(),
  thTitle: (): Locator =>
    page.getByTestId(TestIds.adminCrud.thTitle).or(page.locator('th:has-text("Title")')).first(),
});
