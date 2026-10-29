import type { Locator, Page } from 'playwright';

export const globalRelationsLocators = (page: Page) => ({
  container: (): Locator => page.locator('main').first(),
  pageTitle: (): Locator => page.getByText('Global Relations Static Pages Registry').first(),
  searchInput: (): Locator => page.locator('input[placeholder*="Search"], input[type="text"]').first(),
  searchBtn: (): Locator => page.locator('button:has-text("Search")').first(),
  resetBtn: (): Locator => page.locator('button:has-text("Reset")').first(),
  addRecordBtn: (): Locator => page.locator('button:has-text("Add Section Record")').first(),
  table: (): Locator => page.locator('table').first(),
  tableRows: (): Locator => page.locator('table tbody tr'),
  statusBadges: (): Locator => page.locator('table tbody tr button:has-text("Active"), table tbody tr button:has-text("Inactive")'),
  actionMenuBtns: (): Locator => page.locator('table tbody tr button:has(svg), table tbody tr [aria-label*="action"], table tbody tr [aria-label*="more"]'),
  modalDialog: (): Locator => page.locator('[role="dialog"], [class*="modal"], [class*="fixed inset-0"]').first(),
  modalTitleInput: (): Locator => page.locator('[role="dialog"] input[name*="title"], [role="dialog"] input[placeholder*="Title"]').first(),
  modalSaveBtn: (): Locator => page.locator('[role="dialog"] button:has-text("Save"), [role="dialog"] button:has-text("Submit")').first(),
  modalCancelBtn: (): Locator => page.locator('[role="dialog"] button:has-text("Cancel"), [role="dialog"] button:has-text("Close")').first(),
  paginationButtons: (): Locator => page.locator('button:has-text("1"), button:has-text("2"), button:has-text("Next")'),
});
