import { EnvConfig } from '@qa/core';

export const envUat: EnvConfig = {
  name: 'uat',
  baseUrl: process.env.CAG_UAT_BASE_URL || 'http://13.202.245.81:3001',
  adminUrl: process.env.CAG_UAT_ADMIN_URL || 'http://13.202.245.81:3001/admin',
  apiBaseUrl: process.env.CAG_UAT_API_BASE_URL || 'http://13.202.245.81:3001',
  apiVersionPrefixes: ['/api', '/api/v1'],
  timeouts: {
    action: 10000,
    navigation: 30000,
    expect: 5000,
    api: 10000,
  },
  retries: 0,
  features: {
    visualBaselines: false,
    dbChecks: false,
    a11y: false,
  },
};
