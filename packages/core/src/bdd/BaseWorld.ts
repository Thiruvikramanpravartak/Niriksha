import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { IApiClient } from '../http/IApiClient';
import { ApiClient } from '../http/ApiClient';
import { EnvConfig, SecretsConfig } from '../config/types';
import { CleanupRegistry } from '../data/CleanupRegistry';
import { setActiveAttachmentContext } from '../reporting/attach';

export interface BaseWorldParameters {
  config: EnvConfig;
  secrets: SecretsConfig;
  isMock: boolean;
}

export class BaseWorld extends World<BaseWorldParameters> {
  public browser?: Browser;
  public context?: BrowserContext;
  public page?: Page;
  public api?: IApiClient;
  public config?: EnvConfig;
  public readonly cleanup = new CleanupRegistry();

  constructor(options: IWorldOptions<BaseWorldParameters>) {
    super(options);
  }

  public getPage(): Page {
    if (!this.page) {
      throw new Error('Playwright page is not initialized. Ensure scenario hooks have run.');
    }
    return this.page;
  }

  public getApi(): IApiClient {
    if (!this.api) {
      throw new Error('API client is not initialized.');
    }
    return this.api;
  }

  public init(config: EnvConfig, _secrets: SecretsConfig): void {
    this.config = config;
    this.api = new ApiClient({
      baseUrl: config.apiBaseUrl,
      timeout: config.timeouts.api,
    });
    setActiveAttachmentContext({
      attach: (name: string, content: string | Buffer, contentType?: string) => {
        if (typeof content === 'string') {
          return this.attach(`[${name}]\n${content}`, contentType ?? 'text/plain');
        }
        return this.attach(content, contentType ?? 'application/octet-stream');
      },
    });
  }

  public async teardown(): Promise<void> {
    await this.cleanup.runAll();
    if (this.context) {
      await this.context.close();
      this.context = undefined;
    }
    setActiveAttachmentContext(null);
  }
}
