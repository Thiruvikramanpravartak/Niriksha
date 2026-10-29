import { defineConfig } from '@playwright/test';
import { loadConfig } from '@qa/core';

const cfg = loadConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: cfg.env.timeouts.action * 3,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
    ['list'],
  ],
  use: {
    baseURL: cfg.env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: cfg.env.timeouts.action,
    navigationTimeout: cfg.env.timeouts.navigation,
  },
  expect: {
    timeout: cfg.env.timeouts.expect,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
});
