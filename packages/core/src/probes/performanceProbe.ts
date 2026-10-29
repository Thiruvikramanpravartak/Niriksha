import type { Page } from 'playwright';
import { IProbe, ProbeResult } from './IProbe';

export class PerformanceProbe implements IProbe {
  public readonly name = 'performance';
  private page: Page | null = null;
  private metrics: Record<string, number> = {};

  public start(page: Page): void {
    this.page = page;
    this.metrics = {};
  }

  public async stop(): Promise<void> {
    if (!this.page || this.page.isClosed()) return;
    try {
      this.metrics = await this.page.evaluate(() => {
        const perf = window.performance;
        const timing = perf?.timing;
        if (!timing) {
          return {
            dnsTimeMs: 0,
            connectTimeMs: 0,
            ttfbMs: 0,
            domContentLoadedMs: 0,
            loadEventMs: 0,
          };
        }
        const navStart = timing.navigationStart || 0;
        return {
          dnsTimeMs: Math.max(0, timing.domainLookupEnd - timing.domainLookupStart),
          connectTimeMs: Math.max(0, timing.connectEnd - timing.connectStart),
          ttfbMs: Math.max(0, timing.responseStart - timing.requestStart),
          domContentLoadedMs: Math.max(0, timing.domContentLoadedEventEnd - navStart),
          loadEventMs: Math.max(0, timing.loadEventEnd - navStart),
        };
      });
    } catch {
      // In case page closed
    }
  }

  public result(): ProbeResult {
    const loadTime = this.metrics.loadEventMs ?? 0;
    const isSlow = loadTime > 5000;
    return {
      name: this.name,
      status: isSlow ? 'warning' : 'clean',
      summary: loadTime > 0 ? `Page load completed in ${loadTime}ms` : 'Navigation timing recorded',
      details: [this.metrics],
      severity: isSlow ? 'warn' : 'info',
    };
  }
}
