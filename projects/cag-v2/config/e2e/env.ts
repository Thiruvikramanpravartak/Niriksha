import { EnvConfig } from '@qa/core';

export const e2eEnvConfig: EnvConfig = {
  name: 'e2e',
  baseUrl: process.env.CAG_E2E_BASE_URL || 'http://13.202.245.81:3001',
  adminUrl: process.env.CAG_E2E_ADMIN_URL || 'http://13.202.245.81:3001/admin',
  apiBaseUrl: process.env.CAG_E2E_API_BASE_URL || 'http://13.202.245.81:3001',
  apiVersionPrefixes: ['/api', '/api/v1'],
  timeouts: {
    action: 30000,
    navigation: 60000,
    expect: 10000,
    api: 20000,
  },
  retries: 0,
  features: {
    visualBaselines: false,
    dbChecks: false,
    a11y: false,
  },
};
