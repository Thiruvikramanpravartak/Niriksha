import { test } from '@playwright/test';
import { ApiRequestDetails, ApiResponse } from '../http/IApiClient';

export interface AttachmentContext {
  attach?: (name: string, content: string | Buffer, contentType?: string) => void | Promise<void>;
}

let activeAttachmentContext: AttachmentContext | null = null;

export function setActiveAttachmentContext(ctx: AttachmentContext | null): void {
  activeAttachmentContext = ctx;
}

export function attachText(name: string, content: string, contentType = 'text/plain'): void {
  try {
    // If Playwright Test runner is active
    test.info().attach(name, {
      body: content,
      contentType,
    });
  } catch {
    // Fallback to active BDD context if available
    if (activeAttachmentContext?.attach) {
      void activeAttachmentContext.attach(name, content, contentType);
    }
  }
}

export function attachJson(name: string, data: unknown): void {
  attachText(name, JSON.stringify(data, null, 2), 'application/json');
}

export function attachApiExchange(request: ApiRequestDetails, response: ApiResponse): void {
  const payload = {
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
    },
    response: {
      status: response.status,
      headers: response.headers,
      durationMs: response.durationMs,
      body: response.body,
    },
  };
  attachJson(`API Exchange: ${request.method} ${request.url} [${response.status}]`, payload);
}
