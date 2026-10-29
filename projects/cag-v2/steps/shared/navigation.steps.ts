import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { ReportsPage } from '../../src/pages/public/ReportsPage';

Given('the public Reports page is open in English', async function (this: CustomWorld) {
  const page = this.getPage();
  const reports = new ReportsPage(page);
  await reports.goto();
});
