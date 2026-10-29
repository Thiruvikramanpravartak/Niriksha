import { Locator } from '@playwright/test';

export interface PollOptions {
  timeoutMs?: number;
  message?: string;
}

export async function pollUntil(
  predicate: () => Promise<boolean> | boolean,
  options?: PollOptions,
): Promise<boolean> {
  const timeoutMs = options?.timeoutMs ?? 5000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const matched = await predicate();
    if (matched) return true;
    await new Promise((resolve) => setImmediate(resolve));
  }

  const message = options?.message ?? `Condition not met within ${timeoutMs}ms`;
  throw new Error(`[WAIT TIMEOUT] ${message}`);
}

export async function waitForElementState(
  locator: Locator,
  state: 'visible' | 'attached' | 'detached' | 'hidden' = 'visible',
  timeout = 5000,
): Promise<void> {
  await locator.waitFor({ state, timeout });
}
