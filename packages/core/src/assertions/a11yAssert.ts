import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { attachJson } from '../reporting/attach';
import { loadConfig } from '../config/loadConfig';
import { logger } from '../utils/logger';

export interface A11yOptions {
  include?: string[];
  exclude?: string[];
  rules?: string[];
}

export async function assertNoA11yViolations(page: Page, options?: A11yOptions): Promise<void> {
  const config = loadConfig();
  if (!config.env.features.a11y) {
    logger.debug('[A11Y] Skipping accessibility audit because features.a11y is disabled in config');
    return;
  }
  let builder = new AxeBuilder({ page });

  if (options?.include) {
    for (const inc of options.include) {
      builder = builder.include(inc);
    }
  }

  if (options?.exclude) {
    for (const exc of options.exclude) {
      builder = builder.exclude(exc);
    }
  }

  if (options?.rules) {
    builder = builder.withRules(options.rules);
  }

  const results = await builder.analyze();
  if (results.violations.length > 0) {
    attachJson('A11y Violations Table', results.violations);
    const summary = results.violations.map(
      (v) =>
        `[${v.impact?.toUpperCase()}] ${v.id}: ${v.description} (${v.nodes.length} occurrences)`,
    );
    throw new Error(
      `[A11Y AUDIT FAILED] Found ${results.violations.length} accessibility violation(s):\n${summary.join('\n')}`,
    );
  }
}
