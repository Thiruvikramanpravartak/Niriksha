import type { Page } from 'playwright';
import { IProbe, ProbeResult } from './IProbe';
import { ConsoleProbe } from './consoleProbe';
import { NetworkProbe } from './networkProbe';
import { PageErrorProbe } from './pageErrorProbe';
import { AssetProbe } from './assetProbe';
import { PerformanceProbe } from './performanceProbe';

export class ProbeCollector {
  private probes: Map<string, IProbe> = new Map();
  private isStarted = false;

  constructor() {
    this.register(new ConsoleProbe());
    this.register(new NetworkProbe());
    this.register(new PageErrorProbe());
    this.register(new AssetProbe());
    this.register(new PerformanceProbe());
  }

  public register(probe: IProbe): void {
    this.probes.set(probe.name, probe);
  }

  public get<T extends IProbe>(name: string): T | undefined {
    return this.probes.get(name) as T | undefined;
  }

  public async startAll(page: Page): Promise<void> {
    if (this.isStarted) return;
    for (const probe of this.probes.values()) {
      await probe.start(page);
    }
    this.isStarted = true;
  }

  public async stopAll(): Promise<void> {
    if (!this.isStarted) return;
    for (const probe of this.probes.values()) {
      await probe.stop();
    }
    this.isStarted = false;
  }

  public getResults(): ProbeResult[] {
    const results: ProbeResult[] = [];
    for (const probe of this.probes.values()) {
      results.push(probe.result());
    }
    return results;
  }

  public hasViolations(): boolean {
    return this.getResults().some((r) => r.status === 'violation');
  }

  public formatMarkdownSummary(): string {
    const results = this.getResults();
    const rows = results.map((r) => {
      const icon = r.status === 'clean' ? '✔' : r.status === 'warning' ? '⚠' : '✘';
      return `| ${icon} | **${r.name}** | ${r.status.toUpperCase()} | ${r.summary} |`;
    });

    return [
      '### Probe Health Summary',
      '| State | Probe | Status | Detail |',
      '|---|---|---|---|',
      ...rows,
    ].join('\n');
  }
}
