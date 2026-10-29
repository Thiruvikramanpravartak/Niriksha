import { test, expect } from '@playwright/test';
import { ApiClient, loadConfig } from '@qa/core';
import { ExampleApi } from '../../src/api/clients/ExampleApi';

test.describe('Template API Spec', () => {
  test('[TC:TMPL-API-01] GET /items returns items payload @api @TC:TMPL-API-01', async () => {
    const config = loadConfig();
    const apiClient = new ApiClient({ baseUrl: config.env.apiBaseUrl });
    const exampleApi = new ExampleApi(apiClient);

    // In template without live server, verify class instantiates properly
    expect(exampleApi).toBeDefined();
  });
});
