import { Page } from '@playwright/test';
import { AuthProvider, EnvConfig, SecretsConfig } from '@qa/core';
import { endpoints } from '../api/endpoints';

export async function loginViaApiAndSetStorage(
  page: Page,
  env: EnvConfig,
  secrets: SecretsConfig,
): Promise<string> {
  const authProvider = new AuthProvider({
    loginEndpoint: endpoints.admin.login,
  });
  const token = await authProvider.getAdminToken(env, secrets);
  await page.addInitScript((authToken) => {
    window.localStorage.setItem('token', authToken);
    window.localStorage.setItem('auth_token', authToken);
  }, token);
  return token;
}
