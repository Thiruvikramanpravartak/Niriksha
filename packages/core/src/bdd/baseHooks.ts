import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
  ITestCaseHookParameter,
} from '@cucumber/cucumber';
import { Browser } from '@playwright/test';
import { BaseWorld } from './BaseWorld';
import { BrowserFactory } from '../browser/browserFactory';
import { logger } from '../utils/logger';

let sharedBrowser: Browser | null = null;

export function registerBaseHooks(): void {
  BeforeAll({ timeout: 30000 }, async function () {
    logger.info('[Cucumber] Launching shared browser instance');
    sharedBrowser = await BrowserFactory.launchBrowser();
  });

  AfterAll({ timeout: 30000 }, async function () {
    if (sharedBrowser) {
      logger.info('[Cucumber] Closing shared browser instance');
      try {
        await sharedBrowser.close();
      } catch (err) {
        logger.warn(`[Cucumber] Error closing shared browser: ${err}`);
      }
      sharedBrowser = null;
    }
  });

  Before(async function (this: BaseWorld) {
    if (!sharedBrowser) {
      sharedBrowser = await BrowserFactory.launchBrowser();
    }
    this.browser = sharedBrowser;
    this.context = await BrowserFactory.createContext(sharedBrowser);
    this.page = await this.context.newPage();
  });

  After(async function (this: BaseWorld, scenario: ITestCaseHookParameter) {
    if (scenario.result?.status === Status.FAILED && this.page) {
      const screenshot = await this.page.screenshot();
      await this.attach(screenshot, 'image/png');
    }
    await this.teardown();
  });
}
