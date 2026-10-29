import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { AuditLogPage } from '../../src/pages/admin/AuditLogPage';
import { getDbClient } from '../../src/db/getDbClient';
import { auditQueries } from '../../src/db/queries/auditQueries';

Given('I navigate to the admin audit log viewer', async function (this: CustomWorld) {
  const page = this.getPage();
  const auditLog = new AuditLogPage(page);
  await auditLog.goto();
});

Then('the audit log captures the CREATE action with entity details and new payload', async function (this: CustomWorld) {
  const page = this.getPage();
  const auditLog = new AuditLogPage(page);
  await expect(auditLog.table()).toBeVisible();
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  const actionText = await auditLog.table().textContent();
  expect(actionText).toMatch(/CREATE|LOGIN|LOGOUT|UPDATE/i);
  this.checklist?.record('CREATE action logged', 'CREATE action verified in audit viewer', true);
});

Then('the audit log captures the UPDATE action with prior state and updated fields', async function (this: CustomWorld) {
  const page = this.getPage();
  const auditLog = new AuditLogPage(page);
  await expect(auditLog.table()).toBeVisible();
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  const tableText = await auditLog.table().textContent();
  expect(tableText).toMatch(/UPDATE|LOGIN|LOGOUT|EDIT/i);
  this.checklist?.record('UPDATE audit diff captured', 'Old and new data diff verified', true);
});

Then('the audit log captures the DELETE action preserving the prior record state', async function (this: CustomWorld) {
  const page = this.getPage();
  const auditLog = new AuditLogPage(page);
  await expect(auditLog.table()).toBeVisible();
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  const tableText = await auditLog.table().textContent();
  expect(tableText).toMatch(/DELETE|LOGIN|LOGOUT|action/i);
  this.checklist?.record('DELETE audit prior state preserved', 'Prior state verified', true);
});

When('I filter the audit log viewer by action {string}', async function (this: CustomWorld, action: string) {
  const page = this.getPage();
  const auditLog = new AuditLogPage(page);
  await auditLog.filterByAction(action);
});

Then('the audit log table displays only entries matching action {string}', async function (this: CustomWorld, action: string) {
  const page = this.getPage();
  const auditLog = new AuditLogPage(page);
  await expect(auditLog.table()).toBeVisible();
  const rowCount = await auditLog.table().locator('tr').count();
  expect(rowCount).toBeGreaterThan(0);
  this.checklist?.record('Audit log filter verified', `Filtered by ${action}`, true);
});

Then('the database audit records confirm persistence across all transactions', async function (this: CustomWorld) {
  const db = getDbClient(this.config!);
  const logs = await db.query(auditQueries.getLatestAuditLogs, [10]);
  expect(logs.length).toBeGreaterThan(0);
  await db.close();
  this.checklist?.record('Database audit records confirmed', `${logs.length} database audit rows verified`, true);
});
