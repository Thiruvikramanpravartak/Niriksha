import { APIRequestContext, request as playwrightRequest } from '@playwright/test';
import { IApiClient, RequestOptions, ApiResponse, ApiRequestDetails } from './IApiClient';
import { ILogger, logger } from '../utils/logger';
import { attachApiExchange } from '../reporting/attach';

export interface ApiClientOptions {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  logger?: ILogger;
  requestContext?: APIRequestContext;
  token?: string;
}

export class ApiClient implements IApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeout: number;
  private readonly log: ILogger;
  private requestContext?: APIRequestContext;
  private readonly token?: string;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl;
    this.defaultHeaders = options.defaultHeaders ?? {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    this.timeout = options.timeout ?? 10000;
    this.log = options.logger ?? logger;
    this.requestContext = options.requestContext;
    this.token = options.token;
  }

  private async getContext(): Promise<APIRequestContext> {
    if (!this.requestContext) {
      this.requestContext = await playwrightRequest.newContext({
        baseURL: this.baseUrl,
        timeout: this.timeout,
      });
    }
    return this.requestContext;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const fullUrl = path.startsWith('http')
      ? path
      : `${this.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    if (!params) return fullUrl;

    const url = new URL(fullUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }
    return url.toString();
  }

  private async execute<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const ctx = await this.getContext();
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options?.headers ?? {}),
    };

    const effectiveToken = options?.token ?? this.token;
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }

    const targetUrl = this.buildUrl(path, options?.params);
    const requestDetails: ApiRequestDetails = {
      url: targetUrl,
      method,
      headers,
      body: options?.body,
    };

    this.log.debug(`[API] ${method} ${targetUrl}`);
    const start = Date.now();

    try {
      const response = await ctx.fetch(targetUrl, {
        method,
        headers,
        data: options?.body,
        timeout: options?.timeout ?? this.timeout,
      });

      const durationMs = Date.now() - start;
      const status = response.status();
      const responseHeaders: Record<string, string> = {};
      for (const [k, v] of Object.entries(response.headers())) {
        responseHeaders[k] = v;
      }

      let parsedBody: unknown;
      const rawText = await response.text();
      try {
        parsedBody = rawText ? JSON.parse(rawText) : null;
      } catch {
        parsedBody = rawText;
      }

      const apiResponse: ApiResponse<T> = {
        status,
        headers: responseHeaders,
        body: parsedBody as T,
        durationMs,
        request: requestDetails,
      };

      // Always attach for failure traceability
      if (status >= 400) {
        attachApiExchange(requestDetails, apiResponse as unknown as ApiResponse);
      }

      return apiResponse;
    } catch (err: unknown) {
      const durationMs = Date.now() - start;
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.log.error(
        `[API ERROR] ${method} ${targetUrl} failed after ${durationMs}ms: ${errorMsg}`,
      );
      throw err;
    }
  }

  public async get<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.execute<T>('GET', path, options);
  }

  public async post<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.execute<T>('POST', path, options);
  }

  public async put<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.execute<T>('PUT', path, options);
  }

  public async patch<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.execute<T>('PATCH', path, options);
  }

  public async delete<T = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.execute<T>('DELETE', path, options);
  }

  public withToken(token: string): IApiClient {
    return new ApiClient({
      baseUrl: this.baseUrl,
      defaultHeaders: this.defaultHeaders,
      timeout: this.timeout,
      logger: this.log,
      requestContext: this.requestContext,
      token,
    });
  }
}
