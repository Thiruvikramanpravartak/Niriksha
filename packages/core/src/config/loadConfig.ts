import dotenv from 'dotenv';
import { EnvConfig, SecretsConfig } from './types';
import { EnvConfigSchema, SecretsConfigSchema } from './schema';

dotenv.config();

export interface LoadedConfig {
  env: EnvConfig;
  secrets: SecretsConfig;
  isMock: boolean;
}

export function loadConfig(envOverrides?: Record<'uat' | 'e2e', Partial<EnvConfig>>): LoadedConfig {
  const envName = (process.env.ENV || 'uat').toLowerCase() as 'uat' | 'e2e';
  const isMock = process.env.MOCK === '1';

  if (isMock) {
    const mockPort = process.env.MOCK_PORT || '4000';
    const mockHost = `http://127.0.0.1:${mockPort}`;
    const mockConfig: EnvConfig = {
      name: envName,
      baseUrl: mockHost,
      adminUrl: `${mockHost}/admin`,
      apiBaseUrl: mockHost,
      apiVersionPrefixes: ['/api', '/api/v1'],
      timeouts: {
        action: 5000,
        navigation: 10000,
        expect: 5000,
        api: 5000,
      },
      retries: 0,
      features: {
        visualBaselines: false,
        dbChecks: false,
        a11y: false,
      },
    };

    const mockSecrets: SecretsConfig = {
      adminUser: 'mock-admin',
      adminPassword: 'mock-password-123',
    };

    return {
      env: mockConfig,
      secrets: mockSecrets,
      isMock: true,
    };
  }

  // Real run validation: check required env vars
  const envPrefix = `CAG_${envName.toUpperCase()}_`;
  const adminUserVar = `${envPrefix}ADMIN_USER`;
  const adminPassVar = `${envPrefix}ADMIN_PASSWORD`;
  const baseUrlVar = `${envPrefix}BASE_URL`;
  const adminUrlVar = `${envPrefix}ADMIN_URL`;
  const apiBaseUrlVar = `${envPrefix}API_BASE_URL`;

  const missingVars: string[] = [];
  if (!process.env[adminUserVar]) missingVars.push(adminUserVar);
  if (!process.env[adminPassVar]) missingVars.push(adminPassVar);

  const projectEnv = envOverrides ? envOverrides[envName] : undefined;
  const baseUrl = process.env[baseUrlVar] || projectEnv?.baseUrl;
  const adminUrl = process.env[adminUrlVar] || projectEnv?.adminUrl;
  const apiBaseUrl = process.env[apiBaseUrlVar] || projectEnv?.apiBaseUrl;

  if (!baseUrl) missingVars.push(baseUrlVar);
  if (!adminUrl) missingVars.push(adminUrlVar);
  if (!apiBaseUrl) missingVars.push(apiBaseUrlVar);

  if (missingVars.length > 0) {
    throw new Error(
      `[FAIL-FAST CONFIG ERROR] Missing required environment variable(s): ${missingVars.join(', ')}.\n` +
        `Please set them in your environment or check .env.example.`,
    );
  }

  const mergedConfig: EnvConfig = {
    name: envName,
    baseUrl: baseUrl!,
    adminUrl: adminUrl!,
    apiBaseUrl: apiBaseUrl!,
    apiVersionPrefixes: projectEnv?.apiVersionPrefixes || ['/api', '/api/v1'],
    timeouts: projectEnv?.timeouts || {
      action: 10000,
      navigation: 30000,
      expect: 5000,
      api: 10000,
    },
    retries: projectEnv?.retries ?? 0,
    features: projectEnv?.features || {
      visualBaselines: false,
      dbChecks: false,
      a11y: false,
    },
  };

  const parsedEnv = EnvConfigSchema.safeParse(mergedConfig);
  if (!parsedEnv.success) {
    const errorDetails = parsedEnv.error.errors
      .map((e) => ` - ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`[FAIL-FAST CONFIG ERROR] Invalid configuration:\n${errorDetails}`);
  }

  const secrets: SecretsConfig = {
    adminUser: process.env[adminUserVar],
    adminPassword: process.env[adminPassVar],
    dbPassword: process.env[`${envPrefix}DB_PASSWORD`],
  };

  const parsedSecrets = SecretsConfigSchema.safeParse(secrets);
  if (!parsedSecrets.success) {
    const errorDetails = parsedSecrets.error.errors
      .map((e) => ` - ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`[FAIL-FAST CONFIG ERROR] Invalid secrets:\n${errorDetails}`);
  }

  return {
    env: parsedEnv.data,
    secrets: parsedSecrets.data,
    isMock: false,
  };
}
