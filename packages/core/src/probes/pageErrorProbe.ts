import type { Page } from 'playwright';
import { IProbe, ProbeResult } from './IProbe';

export class PageErrorProbe implements IProbe {
  public readonly name = 'pageError';
  private page: Page | null = null;
  private pageErrors: string[] = [];
  private handler: ((err: Error) => void) | null = null;

  public start(page: Page): void {
    this.page = page;
    this.pageErrors = [];
    this.handler = (err: Error) => {
      this.pageErrors.push(err.stack || err.message || String(err));
    };
    this.page.on('pageerror', this.handler);
  }

  public stop(): void {
    if (this.page && this.handler) {
      this.page.off('pageerror', this.handler);
    }
  }

  public getPageErrors(): readonly string[] {
    return this.pageErrors;
  }

  public result(): ProbeResult {
    if (this.pageErrors.length > 0) {
      return {
        name: this.name,
        status: 'violation',
        summary: `${this.pageErrors.length} unhandled page exception(s)`,
        details: this.pageErrors,
        severity: 'error',
      };
    }
    return {
      name: this.name,
      status: 'clean',
      summary: '0 unhandled exceptions',
      details: [],
      severity: 'info',
    };
  }
}
