import { test } from '@playwright/test';

export interface TestCaseMetadata {
  id: string;
  module?: string;
  feature?: string;
  severity?: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
  description?: string;
}

export function tagTestCase(meta: TestCaseMetadata): void {
  try {
    const testInfo = test.info();
    testInfo.annotations.push({
      type: 'testCaseId',
      description: meta.id,
    });
    if (meta.module) {
      testInfo.annotations.push({
        type: 'module',
        description: meta.module,
      });
    }
    if (meta.severity) {
      testInfo.annotations.push({
        type: 'severity',
        description: meta.severity,
      });
    }
  } catch {
    // If not in Playwright test context, annotations can be skipped or handled by Cucumber tags
  }
}
