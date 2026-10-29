import { Locator, expect } from '@playwright/test';
import { loadConfig } from '../config/loadConfig';
import { logger } from '../utils/logger';

export interface VisualAssertOptions {
  maxDiffPixelRatio?: number;
  mask?: Locator[];
  threshold?: number;
}

export async function assertVisual(
  target: Locator,
  snapshotName: string,
  options?: VisualAssertOptions,
): Promise<void> {
  await expect(target).toBeVisible();
  const config = loadConfig();
  if (!config.env.features.visualBaselines) {
    logger.debug(
      `[VISUAL] Skipping baseline pixel comparison for ${snapshotName} (features.visualBaselines is false on local runner per D9)`,
    );
    return;
  }
  await expect(target).toHaveScreenshot(`${snapshotName}.png`, {
    maxDiffPixelRatio: options?.maxDiffPixelRatio ?? 0.01,
    mask: options?.mask,
    threshold: options?.threshold ?? 0.2,
  });
}
