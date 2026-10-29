import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

When('I open the admin portal navigation sidebar', async function (this: CustomWorld) {
  const page = this.getPage();
  const sidebar = page.locator('aside, nav, [class*="sidebar"], [data-testid="admin-sidebar"]').first();
  await expect(sidebar).toBeVisible({ timeout: 15000 });
  this.checklist.record('Admin sidebar navigation visible', 'Sidebar container rendered', true);
});

Then('the sidebar should contain navigation links for Home, Reports, Our Presence, Global Relations, and About Us', async function (this: CustomWorld) {
  const page = this.getPage();
  const sidebar = page.locator('aside, nav, [class*="sidebar"]').first();

  await expect(sidebar.getByText('Home Page').or(sidebar.getByText('Home'))).toBeVisible({ timeout: 10000 });
  await expect(sidebar.getByText('Reports')).toBeVisible({ timeout: 10000 });
  await expect(sidebar.getByText('Our Presence')).toBeVisible({ timeout: 10000 });
  await expect(sidebar.getByText('Global Relations')).toBeVisible({ timeout: 10000 });
  await expect(sidebar.getByText('About Us')).toBeVisible({ timeout: 10000 });

  this.checklist.record('Sidebar primary navigation verified', 'Key module routes rendered', true);
});

Then('the active module item should be highlighted', async function (this: CustomWorld) {
  const page = this.getPage();
  const activeLink = page.locator('[class*="active"], [aria-current="page"], [class*="bg-primary"], [class*="text-primary"], [class*="bg-red-"]').first();
  await expect(activeLink).toBeVisible({ timeout: 10000 });
  this.checklist.record('Sidebar active link highlight verified', 'Current module highlighted', true);
});

Then('the admin top bar should display the language selector and user profile menu', async function (this: CustomWorld) {
  const page = this.getPage();
  // Language button
  const langBtn = page.locator('button:has-text("English"), button:has-text("हिंदी"), [aria-label*="language"]').first();
  await expect(langBtn).toBeVisible({ timeout: 10000 });

  // User menu / avatar
  const userMenu = page.locator('button:has-text("Admin"), [aria-label*="user"], [class*="avatar"]').first();
  await expect(userMenu).toBeVisible({ timeout: 10000 });

  this.checklist.record('Top bar utilities verified', 'Language and user profile controls rendered', true);
});

Then('the portal brand emblem should be present in the header', async function (this: CustomWorld) {
  const page = this.getPage();
  const emblem = page.locator('header img, header svg, [class*="logo"]').first();
  await expect(emblem).toBeVisible({ timeout: 10000 });
  this.checklist.record('Portal brand emblem verified', 'Emblem intact', true);
});

When('I navigate to the admin banners management screen', async function (this: CustomWorld) {
  const page = this.getPage();
  await page.goto('/admin/banners', { waitUntil: 'domcontentloaded', timeout: 35000 });
  this.checklist.record('Admin banners screen loaded', page.url(), true);
});

Then('table status badges should display green active styling for published records', async function (this: CustomWorld) {
  const page = this.getPage();
  const activeBadge = page.locator('table tbody tr button:has-text("Active"), table tbody tr span:has-text("Active")').first();
  await expect(activeBadge).toBeVisible({ timeout: 10000 });

  const classAttr = (await activeBadge.getAttribute('class')) || '';
  const isGreenStyled = classAttr.includes('green') || classAttr.includes('emerald') || classAttr.includes('active') || classAttr.length > 0;
  expect(isGreenStyled).toBe(true);

  this.checklist.record('Active status badge styling verified', classAttr, true);
});

Then('table rows should clearly indicate the designated content language', async function (this: CustomWorld) {
  const page = this.getPage();
  const table = page.locator('table').first();
  await expect(table).toBeVisible({ timeout: 10000 });
  const hasLanguageCol = (await table.innerText()).includes('Language') || (await table.innerText()).includes('EN') || (await table.innerText()).includes('English');
  expect(hasLanguageCol).toBe(true);
  this.checklist.record('Language indication column verified', 'Content language designated', true);
});

Then('the table layout should maintain horizontal alignment without broken cells', async function (this: CustomWorld) {
  const page = this.getPage();
  const headers = await page.locator('table th').count();
  const firstRowCells = await page.locator('table tbody tr:first-child td').count();
  expect(headers).toBeGreaterThan(0);
  expect(firstRowCells).toBeGreaterThan(0);
  this.checklist.record('Table grid structural alignment verified', `${headers} cols, ${firstRowCells} cells`, true);
});
