import { SecretsConfig } from '@qa/core';

export const e2eCredentials: SecretsConfig = {
  adminUser: process.env.CAG_E2E_ADMIN_USER || 'tthiruvikram_admin',
  adminPassword: process.env.CAG_E2E_ADMIN_PASSWORD || 'Thiru@123',
};
