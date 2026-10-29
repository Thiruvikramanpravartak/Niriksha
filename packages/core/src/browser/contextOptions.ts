import { BrowserContextOptions } from '@playwright/test';

export type ViewportPreset = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export const VIEWPORT_PRESETS: Record<ViewportPreset, { width: number; height: number }> = {
  desktop: { width: 1920, height: 1080 },
  laptop: { width: 1366, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

export interface CustomContextOptions {
  viewportPreset?: ViewportPreset;
  locale?: string;
  timezoneId?: string;
  storageState?: string;
  ignoreHTTPSErrors?: boolean;
  baseURL?: string;
}

export function buildContextOptions(options?: CustomContextOptions): BrowserContextOptions {
  const preset = options?.viewportPreset ?? 'desktop';
  const viewport = VIEWPORT_PRESETS[preset];

  const defaultBaseUrl =
    process.env.BASE_URL ??
    process.env.CAG_E2E_BASE_URL ??
    process.env.CAG_UAT_BASE_URL ??
    (process.env.MOCK === '1' ? `http://127.0.0.1:${process.env.MOCK_PORT || '4000'}` : undefined);

  return {
    viewport,
    locale: options?.locale ?? 'en-US',
    timezoneId: options?.timezoneId ?? 'Asia/Kolkata',
    storageState: options?.storageState,
    ignoreHTTPSErrors: options?.ignoreHTTPSErrors ?? true,
    baseURL: options?.baseURL ?? defaultBaseUrl,
  };
}
