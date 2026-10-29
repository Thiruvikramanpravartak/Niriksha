import type { ConsoleMessage, Page } from 'playwright';
import { IProbe, ProbeResult } from './IProbe';

export class ConsoleProbe implements IProbe {
  public readonly name = 'console';
  private page: Page | null = null;
  private errors: string[] = [];
  private warnings: string[] = [];
  private handler: ((msg: ConsoleMessage) => void) | null = null;

  public start(page: Page): void {
    this.page = page;
    this.errors = [];
    this.warnings = [];
    this.handler = (msg: ConsoleMessage) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        this.errors.push(text);
      } else if (type === 'warning') {
        this.warnings.push(text);
      }
    };
    this.page.on('console', this.handler);
  }

  public stop(): void {
    if (this.page && this.handler) {
      this.page.off('console', this.handler);
    }
  }

  public getErrors(): readonly string[] {
    return this.errors;
  }

  public getWarnings(): readonly string[] {
    return this.warnings;
  }

  public result(): ProbeResult {
    if (this.errors.length > 0) {
      return {
        name: this.name,
        status: 'violation',
        summary: `${this.errors.length} console error(s) detected`,
        details: this.errors,
        severity: 'error',
      };
    }
    if (this.warnings.length > 0) {
      return {
        name: this.name,
        status: 'warning',
        summary: `${this.warnings.length} console warning(s) detected`,
        details: this.warnings,
        severity: 'warn',
      };
    }
    return {
      name: this.name,
      status: 'clean',
      summary: '0 console errors',
      details: [],
      severity: 'info',
    };
  }
}
