import { EnvConfig } from '@qa/core';

export const envUat: EnvConfig = {
  name: 'uat',
  baseUrl: process.env.CAG_UAT_BASE_URL || 'http://15.252.122.216',
  adminUrl: process.env.CAG_UAT_ADMIN_URL || 'http://15.252.122.216/admin',
  apiBaseUrl: process.env.CAG_UAT_API_BASE_URL || 'http://15.252.122.216',
  apiVersionPrefixes: ['/api/v1', '/api'],
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
