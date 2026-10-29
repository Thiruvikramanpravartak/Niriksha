import type { Page } from 'playwright';
import { IProbe, ProbeResult } from './IProbe';

export class AssetProbe implements IProbe {
  public readonly name = 'asset';
  private page: Page | null = null;
  private brokenImages: string[] = [];

  public start(page: Page): void {
    this.page = page;
    this.brokenImages = [];
  }

  public async stop(): Promise<void> {
    if (!this.page || this.page.isClosed()) return;
    try {
      const broken = await this.page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.src || img.getAttribute('src') || '<unknown img>');
      });
      this.brokenImages = broken;
    } catch {
      // In case navigation happened or context destroyed
    }
  }

  public result(): ProbeResult {
    if (this.brokenImages.length > 0) {
      return {
        name: this.name,
        status: 'violation',
        summary: `${this.brokenImages.length} broken image asset(s)`,
        details: this.brokenImages,
        severity: 'error',
      };
    }
    return {
      name: this.name,
      status: 'clean',
      summary: 'All image assets rendered cleanly',
      details: [],
      severity: 'info',
    };
  }
}
