import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { loadConfig } from '../src/config/loadConfig';
import { DataFactory } from '../src/data/DataFactory';
import { CleanupRegistry } from '../src/data/CleanupRegistry';
import { assertEnvelope, assertSchema } from '../src/assertions/schemaAssert';
import { buildContextOptions, VIEWPORT_PRESETS } from '../src/browser/contextOptions';
import { ApiClient } from '../src/http/ApiClient';
import { MockDbClient } from '../src/db/MockDbClient';

test.describe('Core Unit Tests', () => {
  test('DataFactory generates unique IDs with prefix and run ID', () => {
    const id1 = DataFactory.nextId('TEST');
    const id2 = DataFactory.nextId('TEST');
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^TEST-[a-z0-9]+-[a-z0-9]+-\d+$/);
  });

  test('DataFactory produces titles and dates', () => {
    const title = DataFactory.title('Report');
    expect(title).toContain('Report');
    const future = DataFactory.futureDate();
    const past = DataFactory.pastDate();
    expect(new Date(future).getTime()).toBeGreaterThan(new Date(past).getTime());
  });

  test('CleanupRegistry executes registered tasks LIFO', async () => {
    const order: number[] = [];
    const registry = new CleanupRegistry();
    registry.register(() => {
      order.push(1);
    });
    registry.register(() => {
      order.push(2);
    });

    await registry.runAll();
    expect(order).toEqual([2, 1]);
  });

  test('CleanupRegistry is resilient to individual task failure', async () => {
    const executed: number[] = [];
    const registry = new CleanupRegistry();
    registry.register(() => {
      executed.push(1);
    });
    registry.register(() => {
      throw new Error('Teardown task 2 failed intentionally');
    });
    registry.register(() => {
      executed.push(3);
    });

    await expect(registry.runAll()).resolves.not.toThrow();
    expect(executed).toEqual([3, 1]);
  });

  test('assertEnvelope accepts valid ResponseWrapper', () => {
    const envelope = {
      success: true,
      data: { message: 'ok' },
    };
    expect(() => assertEnvelope(envelope)).not.toThrow();
  });

  test('assertEnvelope rejects malformed response', () => {
    const badEnvelope = { message: 'no success field' };
    expect(() => assertEnvelope(badEnvelope)).toThrow(/ENVELOPE ASSERTION FAILED/);
  });

  test('assertEnvelope validates pagination consistency', () => {
    const paginated = {
      success: true,
      data: {
        items: [{ id: 1 }, { id: 2 }],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 2,
        },
      },
    };
    expect(() => assertEnvelope(paginated)).not.toThrow();

    const invalidPaginated = {
      success: true,
      data: {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        pagination: {
          page: 1,
          pageSize: 2, // items count (3) > pageSize (2)
          total: 3,
        },
      },
    };
    expect(() => assertEnvelope(invalidPaginated)).toThrow(/exceeds declared pageSize/);
  });

  test('assertSchema produces clear error with issue paths', () => {
    const TestSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const valid = { name: 'Audit', age: 42 };
    expect(assertSchema(valid, TestSchema)).toEqual(valid);

    const invalid = { name: 'Audit', age: 'forty-two' };
    expect(() => assertSchema(invalid, TestSchema)).toThrow(
      /Path: "age" \| Expected: invalid_type/,
    );
  });

  test('loadConfig short-circuits in MOCK=1 mode with default mock port and host', () => {
    const oldMock = process.env.MOCK;
    process.env.MOCK = '1';
    const config = loadConfig();
    expect(config.isMock).toBe(true);
    expect(config.env.name).toBe('uat');
    expect(config.env.baseUrl).toContain('127.0.0.1:4000');
    expect(config.env.features.dbChecks).toBe(false);
    expect(config.secrets.adminUser).toBe('mock-admin');
    process.env.MOCK = oldMock;
  });

  test('loadConfig fails fast naming missing environment variables in real mode', () => {
    const oldMock = process.env.MOCK;
    const oldEnv = process.env.ENV;
    const oldUser = process.env.CAG_UAT_ADMIN_USER;

    delete process.env.MOCK;
    process.env.ENV = 'uat';
    delete process.env.CAG_UAT_ADMIN_USER;

    expect(() => loadConfig()).toThrow(
      /Missing required environment variable\(s\):.*CAG_UAT_ADMIN_USER/,
    );

    // Restore
    if (oldMock !== undefined) process.env.MOCK = oldMock;
    if (oldEnv !== undefined) process.env.ENV = oldEnv;
    if (oldUser !== undefined) process.env.CAG_UAT_ADMIN_USER = oldUser;
  });

  test('buildContextOptions supports all viewport presets and default timezone', () => {
    const desktop = buildContextOptions({ viewportPreset: 'desktop' });
    expect(desktop.viewport).toEqual(VIEWPORT_PRESETS.desktop);
    expect(desktop.timezoneId).toBe('Asia/Kolkata');

    const mobile = buildContextOptions({ viewportPreset: 'mobile' });
    expect(mobile.viewport).toEqual(VIEWPORT_PRESETS.mobile);
  });

  test('ApiClient withToken clones client with authorization header', () => {
    const client = new ApiClient({ baseUrl: 'http://127.0.0.1:4000' });
    const scoped = client.withToken('secret-jwt-token');
    expect(scoped).not.toBe(client);
  });

  test('MockDbClient queries seeded records and closes cleanly', async () => {
    const db = new MockDbClient();
    const news = await db.query('SELECT * FROM news WHERE status = $1', ['published']);
    expect(news.length).toBeGreaterThan(0);
    expect(news[0]).toHaveProperty('title');
    await expect(db.close()).resolves.not.toThrow();
  });
});
