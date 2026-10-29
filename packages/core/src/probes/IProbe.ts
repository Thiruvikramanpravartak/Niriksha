import type { Page } from 'playwright';

export interface ProbeResult {
  name: string;
  status: 'clean' | 'warning' | 'violation';
  summary: string;
  details: unknown[];
  severity: 'info' | 'warn' | 'error';
}

export interface IProbe {
  readonly name: string;
  start(page: Page): Promise<void> | void;
  stop(): Promise<void> | void;
  result(): ProbeResult;
}
