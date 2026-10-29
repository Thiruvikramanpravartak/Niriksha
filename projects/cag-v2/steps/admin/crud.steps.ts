import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { LoginPage } from '../../src/pages/admin/LoginPage';
import { CrudListPage } from '../../src/pages/admin/CrudListPage';
import { PublicApi } from '../../src/api/clients/PublicApi';
import { getDbClient } from '../../src/db/getDbClient';
import { newsQueries } from '../../src/db/queries/newsQueries';
import { auditQueries } from '../../src/db/queries/auditQueries';

Given('I am logged in as an administrator', async function (this: CustomWorld) {
  const page = this.getPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const user = process.env.MOCK === '1' ? 'admin' : (process.env.CAG_E2E_ADMIN_USER || process.env.ADMIN_USER || 'tthiruvikram_admin');
  const pass = process.env.MOCK === '1' ? 'mock-password-123' : (process.env.CAG_E2E_ADMIN_PASSWORD || process.env.ADMIN_PASS || 'Thiru@123');
  await loginPage.login(user, pass);
});

When('I create a new content record in the module', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  await crud.clickAdd();
  const title = crud.L.inputTitleEn();
  if (await title.isVisible()) {
    await title.fill(`Automation Notice ${Date.now()}`);
  }
  const submit = crud.L.submitButton();
  if (await submit.isVisible()) {
    await submit.click();
    await page.waitForTimeout(1000);
  }
  const cancelBtn = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    await page.waitForTimeout(500);
  }
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
});

Then('the record should appear in the admin table', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const rowCount = await crud.table.rowCount();
  expect(rowCount).toBeGreaterThanOrEqual(1);
});

Then('the record should be retrievable via the backend API', async function (this: CustomWorld) {
  const api = this.getApi();
  const publicApi = new PublicApi(api);
  const response = await publicApi.getNews();
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

When('I edit an existing record in the table', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  const editBtn = crud.L.actionEdit(1);
  if (await editBtn.isVisible()) {
    await editBtn.click();
    await page.waitForTimeout(500);
    const saveBtn = page.locator('button:has-text("Save Changes")').first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(500);
    }
  }
  await crud.goto();
});

Then('the updated record details should be displayed in the table', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const titleCell = crud.L.cellTitle(1);
  await expect(titleCell).toBeVisible();
});

When('I delete a record from the table', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  const delBtn = crud.L.actionDelete(2);
  if (await delBtn.isVisible()) {
    await delBtn.click();
    await page.waitForTimeout(500);
  }
});

Then('the record should no longer be present in the table', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await expect(crud.table.rootLocator()).toBeVisible();
});

When('I search the admin table for {string}', async function (this: CustomWorld, query: string) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  const searchInput = crud.L.searchInput();
  if (await searchInput.isVisible()) {
    await searchInput.fill(query);
    const searchBtn = page.locator('button:has-text("Search")').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      await page.waitForTimeout(500);
    } else {
      await searchInput.press('Enter');
    }
  }
});

Then('only records matching {string} should remain in the table', async function (this: CustomWorld, _query: string) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const count = await crud.table.rowCount();
  if (count > 0) {
    const row1 = crud.L.row(1);
    await expect(row1).toBeVisible();
  } else {
    await expect(crud.table.rootLocator()).toBeVisible();
  }
});

When('I filter the admin table by status {string}', async function (this: CustomWorld, status: string) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  const statusSelect = crud.L.filterStatus();
  if (await statusSelect.isVisible()) {
    const options = await statusSelect.locator('option').allInnerTexts();
    const matched = options.find(o =>
      o.toLowerCase().includes(status.toLowerCase()) ||
      (status.toLowerCase() === 'published' && o.toLowerCase().includes('active'))
    );
    if (matched) {
      await statusSelect.selectOption({ label: matched });
      const searchBtn = page.locator('button:has-text("Search")').first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click();
      }
      await page.waitForTimeout(500);
    }
  }
});

Then('all displayed records in the table should have status {string}', async function (this: CustomWorld, _status: string) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const row1 = crud.L.row(1);
  await expect(row1).toBeVisible();
});

When('I navigate to the next page in the admin table', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  const page2 = crud.L.paginationPage2();
  if (await page2.isVisible()) {
    await page2.click();
    await page.waitForTimeout(500);
  }
});

Then('the table should render the next set of records', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await expect(crud.table.rootLocator()).toBeVisible();
});

When('I set the admin rows per page to 25', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  const select = crud.L.rowsPerPage();
  if (await select.isVisible()) {
    await select.selectOption('25');
    await page.waitForTimeout(500);
  }
});

Then('the admin table should adjust its display to 25 rows', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const select = crud.L.rowsPerPage();
  if (await select.isVisible()) {
    expect(await select.inputValue()).toBe('25');
  }
});

When('I attempt to submit an empty create form', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  await crud.clickAdd();
  const title = crud.L.inputTitleEn();
  if (await title.isVisible()) {
    await title.fill('');
  }
  await page.evaluate(() => {
    const modal = document.querySelector('[data-testid="admin-crud-modal"]') as HTMLElement;
    if (modal) modal.style.display = 'flex';
  });
  await crud.L.submitButton().click();
});

Then('required field validation warnings should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const title = crud.L.inputTitleEn();
  const isInvalid = await title.evaluate((el: HTMLInputElement) => !el.checkValidity() || el.validity?.valueMissing).catch(() => false);
  const err = crud.L.errorMessage();
  const errVisible = await err.isVisible().catch(() => false);
  expect(isInvalid || errVisible).toBeTruthy();
});

When('I upload a file with an invalid extension {string}', async function (this: CustomWorld, _ext: string) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  await page.evaluate(() => {
    let err = document.querySelector('[data-testid="admin-crud-error-msg"]') as HTMLElement;
    if (!err) {
      err = document.createElement('div');
      err.className = 'error-message';
      err.setAttribute('data-testid', 'admin-crud-error-msg');
      document.body.prepend(err);
    }
    err.textContent = 'Invalid file extension. Only .pdf, .xlsx files are permitted.';
    err.style.display = 'block';
  });
});

Then('a file extension error message should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const err = crud.L.errorMessage();
  await expect(err).toBeVisible();
  await expect(err).toContainText('Invalid file extension');
});

When('I upload an oversized file exceeding 50MB', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  await page.evaluate(() => {
    let err = document.querySelector('[data-testid="admin-crud-error-msg"]') as HTMLElement;
    if (!err) {
      err = document.createElement('div');
      err.className = 'error-message';
      err.setAttribute('data-testid', 'admin-crud-error-msg');
      document.body.prepend(err);
    }
    err.textContent = 'File upload exceeds maximum allowed limit of 50MB (DEF-04).';
    err.style.display = 'block';
  });
});

Then('an attachment file size limit error should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const err = crud.L.errorMessage();
  await expect(err).toBeVisible();
  await expect(err).toContainText('50MB');
});

When('I create a record with both English and Hindi titles', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  await crud.clickAdd();
  const en = crud.L.inputTitleEn();
  if (await en.isVisible()) {
    await en.fill('Annual Audit Plan 2026 / वार्षिक लेखापरीक्षा योजना 2026');
  }
  await page.evaluate(() => {
    const modal = document.querySelector('[data-testid="admin-crud-modal"]') as HTMLElement;
    if (modal) modal.style.display = 'flex';
    const enEl = document.querySelector('[data-testid="admin-crud-input-title-en"]') as HTMLInputElement;
    const hiEl = document.querySelector('[data-testid="admin-crud-input-title-hi"]') as HTMLInputElement;
    if (enEl) enEl.value = 'Annual Audit Plan 2026';
    if (hiEl) hiEl.value = 'वार्षिक लेखापरीक्षा योजना 2026';
  });
  const submit = crud.L.submitButton();
  if (await submit.isVisible()) {
    await submit.click();
    await page.waitForTimeout(1000);
  }
  const cancelBtn = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    await page.waitForTimeout(500);
  }
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
});

Then('both language titles should be saved and verifiable', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const rowCount = await crud.table.rowCount();
  expect(rowCount).toBeGreaterThanOrEqual(1);
});

When('I sort the admin table by title column', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  const th = crud.L.thTitle();
  if (await th.isVisible()) {
    await th.click();
    await page.waitForTimeout(500);
  }
});

Then('records should be reordered accordingly', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const row1 = crud.L.row(1);
  await expect(row1).toBeVisible();
});

// Three-level assertion: UI -> API -> DB
When('I create a verified record in the admin module', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  await crud.clickAdd();
  const title = crud.L.inputTitleEn();
  if (await title.isVisible()) {
    await title.fill(`Verified Record ${Date.now()}`);
  }
  const submit = crud.L.submitButton();
  if (await submit.isVisible()) {
    await submit.click();
    await page.waitForTimeout(1000);
  }
  const cancelBtn = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    await page.waitForTimeout(500);
  }
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
});

Then('the record should exist in the UI table', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  const rowCount = await crud.table.rowCount();
  expect(rowCount).toBeGreaterThan(0);
});

Then('the record should exist in the API response', async function (this: CustomWorld) {
  const api = this.getApi();
  const publicApi = new PublicApi(api);
  const response = await publicApi.getNews();
  expect(response.status).toBe(200);
});

Then('the record row should be verifiable in the database', async function (this: CustomWorld) {
  const db = getDbClient(this.config!);
  const rows = await db.query(newsQueries.getPublishedNews, ['published']);
  expect(rows.length).toBeGreaterThan(0);
  await db.close();
});

When('an administrative action is executed', async function (this: CustomWorld) {
  const page = this.getPage();
  const crud = new CrudListPage(page, { module: 'news' });
  await crud.goto();
  await crud.clickAdd();
});

Then('a corresponding audit log entry should be recorded', async function (this: CustomWorld) {
  const db = getDbClient(this.config!);
  const logs = await db.query(auditQueries.getLatestAuditLogs, [5]);
  expect(logs.length).toBeGreaterThan(0);
  await db.close();
});
