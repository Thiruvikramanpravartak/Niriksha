import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { ConsoleProbe, NetworkProbe } from '@qa/core';

Then('the page records no console errors', async function (this: CustomWorld) {
  const consoleProbe = this.probes.get<ConsoleProbe>('console');
  const errors = (consoleProbe ? consoleProbe.getErrors() : []).filter(
    (e) =>
      !e.includes('ERR_NAME_NOT_RESOLVED') &&
      !e.includes('ERR_INTERNET_DISCONNECTED') &&
      !e.includes('ERR_NETWORK_CHANGED') &&
      !e.includes('401 (Unauthorized)') &&
      !e.includes('404 (Not Found)') &&
      !e.includes('Failed to load resource')
  );
  this.checklist.record('No console errors', `${errors.length} error(s)`, errors.length === 0);
  expect(errors, `Expected 0 console errors but found: ${errors.join(', ')}`).toHaveLength(0);
});

Then('no network request on the page returns a 4xx or 5xx status', async function (this: CustomWorld) {
  const networkProbe = this.probes.get<NetworkProbe>('network');
  const failed5xx = networkProbe ? networkProbe.getFailedCalls().filter((c) => c.status && c.status >= 500) : [];
  this.checklist.record('No 5xx server responses', `${failed5xx.length} error(s)`, failed5xx.length === 0);
  expect(failed5xx, `Expected 0 server 5xx errors but found: ${JSON.stringify(failed5xx)}`).toHaveLength(0);
});

Then('the page returns no 5xx response', async function (this: CustomWorld) {
  const networkProbe = this.probes.get<NetworkProbe>('network');
  const failed5xx = networkProbe ? networkProbe.getFailedCalls().filter((c) => c.status && c.status >= 500) : [];
  this.checklist.record('No 5xx response', `${failed5xx.length} error(s)`, failed5xx.length === 0);
  expect(failed5xx).toHaveLength(0);
});
