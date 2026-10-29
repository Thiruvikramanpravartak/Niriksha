export interface EnvConfig {
  name: 'uat' | 'e2e';
  baseUrl: string;
  adminUrl: string;
  apiBaseUrl: string;
  apiVersionPrefixes: string[];
  timeouts: {
    action: number;
    navigation: number;
    expect: number;
    api: number;
  };
  retries: number;
  db?: {
    host: string;
    port: number;
    name: string;
    schema: string;
    user: string;
    password: string;
  };
  features: {
    visualBaselines: boolean;
    dbChecks: boolean;
    a11y: boolean;
  };
}

export interface SecretsConfig {
  adminUser?: string;
  adminPassword?: string;
  dbPassword?: string;
}
