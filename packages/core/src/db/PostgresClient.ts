import { Pool, PoolConfig } from 'pg';
import { IDbClient } from './IDbClient';
import { EnvConfig } from '../config/types';
import { logger } from '../utils/logger';

export class PostgresClient implements IDbClient {
  private pool: Pool | null = null;

  constructor(private readonly config: NonNullable<EnvConfig['db']>) {}

  private getPool(): Pool {
    if (!this.pool) {
      const poolConfig: PoolConfig = {
        host: this.config.host,
        port: this.config.port,
        database: this.config.name,
        user: this.config.user,
        password: this.config.password,
        max: 5,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
      };
      this.pool = new Pool(poolConfig);
      this.pool.on('error', (err: Error) => {
        logger.error(`[DB POOL ERROR] Unexpected error on idle client: ${err.message}`);
      });
    }
    return this.pool;
  }

  public async query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]> {
    logger.debug(
      `[DB QUERY] Executing query on ${this.config.host}:${this.config.port}/${this.config.name}: ${sql}`,
    );
    const pool = this.getPool();
    const result = await pool.query(sql, params);
    return result.rows as T[];
  }

  public async close(): Promise<void> {
    if (this.pool) {
      logger.debug('[DB CLOSE] Closing connection pool');
      await this.pool.end();
      this.pool = null;
    }
  }
}
