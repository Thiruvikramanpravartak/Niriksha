import { EnvConfig } from '@qa/core';

export const config: EnvConfig = {
  name: 'uat',
  baseUrl: 'https://uat.example.gov.in',
  adminUrl: 'https://uat.example.gov.in/admin',
  apiBaseUrl: 'https://uat.example.gov.in',
  apiVersionPrefixes: ['/api', '/api/v1'],
  timeouts: {
    action: 5000,
    navigation: 15000,
    expect: 5000,
    api: 10000,
  },
  retries: 0,
  features: {
    visualBaselines: false,
    dbChecks: false,
    a11y: true,
  },
};
