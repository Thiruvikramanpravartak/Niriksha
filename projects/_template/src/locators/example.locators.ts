import { Locator, Page } from '@playwright/test';
import { templateTestIds } from './testIds';

export function getExamplePageTitle(page: Page): Locator {
  return page.getByTestId(templateTestIds.example.title);
}

export function getExamplePageContent(page: Page): Locator {
  return page.getByTestId(templateTestIds.example.content);
}

export function getExampleHeaderRoot(page: Page): Locator {
  return page.getByTestId(templateTestIds.example.headerRoot);
}

export function getExampleHeaderLogo(root: Locator): Locator {
  return root.getByTestId(templateTestIds.example.headerLogo);
}
