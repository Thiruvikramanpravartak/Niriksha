import { IDbClient } from './IDbClient';
import { logger } from '../utils/logger';

export class MockDbClient implements IDbClient {
  private mockRows: Map<string, Record<string, unknown>[]> = new Map();

  constructor() {
    this.mockRows.set('news', [
      { id: '1', title: 'CAG Table Audit Report 2024', status: 'published', language: 'en' },
      { id: '2', title: 'State Financial Audit Update', status: 'published', language: 'en' },
    ]);
    this.mockRows.set('reports', [
      {
        id: 'rep-001',
        title: 'Union Audit Report on Defense 2023',
        year: '2023',
        type: 'compliance',
      },
      {
        id: 'rep-002',
        title: 'State Audit Report on Revenue 2024',
        year: '2024',
        type: 'financial',
      },
    ]);
    this.mockRows.set('admin_audit_log', [
      {
        id: 'log-001',
        action: 'LOGIN_SUCCESS',
        username: 'admin',
        created_at: new Date().toISOString(),
      },
      {
        id: 'log-002',
        action: 'CREATE_RECORD',
        username: 'admin',
        created_at: new Date().toISOString(),
      },
    ]);
  }

  public seed(table: string, rows: Record<string, unknown>[]): void {
    this.mockRows.set(table, rows);
  }

  public async query<T = Record<string, unknown>>(sql: string, _params?: unknown[]): Promise<T[]> {
    logger.debug(`[MOCK DB QUERY] Executing mock query: ${sql}`);
    const lower = sql.toLowerCase();
    for (const [table, rows] of this.mockRows.entries()) {
      if (lower.includes(table)) {
        return rows as T[];
      }
    }
    return [] as T[];
  }

  public async close(): Promise<void> {
    logger.debug('[MOCK DB CLOSE]');
  }
}
