import type { Page, Request, Response } from 'playwright';
import { IProbe, ProbeResult } from './IProbe';

export interface FailedNetworkCall {
  url: string;
  status?: number;
  statusText?: string;
  method: string;
  failureReason?: string;
}

export class NetworkProbe implements IProbe {
  public readonly name = 'network';
  private page: Page | null = null;
  private failedCalls: FailedNetworkCall[] = [];
  private responseHandler: ((res: Response) => void) | null = null;
  private requestFailedHandler: ((req: Request) => void) | null = null;

  public start(page: Page): void {
    this.page = page;
    this.failedCalls = [];

    this.responseHandler = (res: Response) => {
      const status = res.status();
      if (status >= 400) {
        // Skip common benign 404s like favicon if configured
        const url = res.url();
        this.failedCalls.push({
          url,
          status,
          statusText: res.statusText(),
          method: res.request().method(),
        });
      }
    };

    this.requestFailedHandler = (req: Request) => {
      this.failedCalls.push({
        url: req.url(),
        method: req.method(),
        failureReason: req.failure()?.errorText || 'Unknown request failure',
      });
    };

    this.page.on('response', this.responseHandler);
    this.page.on('requestfailed', this.requestFailedHandler);
  }

  public stop(): void {
    if (this.page) {
      if (this.responseHandler) this.page.off('response', this.responseHandler);
      if (this.requestFailedHandler) this.page.off('requestfailed', this.requestFailedHandler);
    }
  }

  public getFailedCalls(): readonly FailedNetworkCall[] {
    return this.failedCalls;
  }

  public result(): ProbeResult {
    const error5xx = this.failedCalls.filter((c) => c.status && c.status >= 500);
    const error4xx = this.failedCalls.filter((c) => c.status && c.status >= 400 && c.status < 500);

    if (error5xx.length > 0) {
      return {
        name: this.name,
        status: 'violation',
        summary: `${error5xx.length} server 5xx error(s) and ${error4xx.length} 4xx error(s)`,
        details: this.failedCalls,
        severity: 'error',
      };
    }
    if (error4xx.length > 0) {
      return {
        name: this.name,
        status: 'warning',
        summary: `${error4xx.length} client 4xx response(s)`,
        details: this.failedCalls,
        severity: 'warn',
      };
    }
    if (this.failedCalls.length > 0) {
      return {
        name: this.name,
        status: 'warning',
        summary: `${this.failedCalls.length} network failure(s)`,
        details: this.failedCalls,
        severity: 'warn',
      };
    }
    return {
      name: this.name,
      status: 'clean',
      summary: '0 network 4xx/5xx failures',
      details: [],
      severity: 'info',
    };
  }
}
