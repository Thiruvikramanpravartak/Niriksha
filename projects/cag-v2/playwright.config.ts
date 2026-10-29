import { defineConfig } from '@playwright/test';
import { loadConfig } from '@qa/core';
import { envUat } from './config/env.uat';
import { envE2e } from './config/env.e2e';

const cfg = loadConfig({ uat: envUat, e2e: envE2e }).env;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  globalSetup: require.resolve('./globalSetup.ts'),
  globalTeardown: require.resolve('./globalTeardown.ts'),
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', { detail: true, outputFolder: 'allure-results' }],
    ['list'],
  ],
  use: {
    baseURL: cfg.baseUrl,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: cfg.timeouts.action,
    navigationTimeout: cfg.timeouts.navigation,
  },
  expect: {
    timeout: cfg.timeouts.expect,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
});
