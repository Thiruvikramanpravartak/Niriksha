import {
  Browser,
  BrowserContext,
  chromium,
  firefox,
  webkit,
  LaunchOptions,
} from '@playwright/test';
import { CustomContextOptions, buildContextOptions } from './contextOptions';
import { logger } from '../utils/logger';

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export class BrowserFactory {
  public static async launchBrowser(options?: LaunchOptions): Promise<Browser> {
    const browserType = (process.env.BROWSER || 'chromium').toLowerCase() as BrowserType;
    logger.info(`[BrowserFactory] Launching browser type: ${browserType}`);

    const launchOptions: LaunchOptions = {
      headless: process.env.HEADLESS !== 'false',
      ...options,
    };

    switch (browserType) {
      case 'firefox':
        return firefox.launch(launchOptions);
      case 'webkit':
        return webkit.launch(launchOptions);
      case 'chromium':
      default:
        return chromium.launch(launchOptions);
    }
  }

  public static async createContext(
    browser: Browser,
    options?: CustomContextOptions,
  ): Promise<BrowserContext> {
    const contextOptions = buildContextOptions(options);
    return browser.newContext(contextOptions);
  }
}
