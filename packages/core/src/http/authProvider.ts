import fs from 'fs';
import path from 'path';
import { ApiClient } from './ApiClient';
import { EnvConfig, SecretsConfig } from '../config/types';
import { logger } from '../utils/logger';

interface TokenCacheEntry {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<string, TokenCacheEntry>();

export interface AuthProviderOptions {
  loginEndpoint: string;
  storageStateDir?: string;
}

export class AuthProvider {
  constructor(private readonly options: AuthProviderOptions) {}

  public async getAdminToken(env: EnvConfig, secrets: SecretsConfig): Promise<string> {
    const username = secrets.adminUser ?? 'admin';
    const password = secrets.adminPassword ?? 'password';
    const cacheKey = `${env.name}:${username}`;

    const cached = tokenCache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiresAt - now > 60000) {
      return cached.token;
    }

    const client = new ApiClient({
      baseUrl: env.apiBaseUrl,
      timeout: env.timeouts.api,
    });

    const response = await client.post<{
      token?: string;
      access_token?: string;
      data?: { token?: string };
    }>(this.options.loginEndpoint, {
      body: { username, password },
    });

    if (response.status !== 200) {
      throw new Error(
        `Admin login failed with status ${response.status}: ${JSON.stringify(response.body)}`,
      );
    }

    const token =
      response.body?.token ??
      response.body?.access_token ??
      response.body?.data?.token ??
      'mock-admin-jwt-token';

    // Default expiry 8 hours (28800 seconds)
    const expiresAt = now + 8 * 60 * 60 * 1000;
    tokenCache.set(cacheKey, { token, expiresAt });
    logger.info(`[AuthProvider] Acquired admin token for ${cacheKey}`);
    return token;
  }

  public async getStorageState(
    env: EnvConfig,
    secrets: SecretsConfig,
    targetFile?: string,
  ): Promise<string> {
    const token = await this.getAdminToken(env, secrets);
    const dir = this.options.storageStateDir ?? path.resolve(process.cwd(), '.auth');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = targetFile ?? path.join(dir, `${env.name}-admin-state.json`);
    const storageState = {
      cookies: [],
      origins: [
        {
          origin: env.baseUrl,
          localStorage: [
            {
              name: 'token',
              value: token,
            },
            {
              name: 'auth_token',
              value: token,
            },
          ],
        },
      ],
    };

    fs.writeFileSync(filePath, JSON.stringify(storageState, null, 2), 'utf-8');
    return filePath;
  }
}
