import { IDbClient, PostgresClient, MockDbClient, EnvConfig } from '@qa/core';

export function getDbClient(config: EnvConfig): IDbClient {
  if (config.features.dbChecks && config.db) {
    return new PostgresClient(config.db);
  }
  return new MockDbClient();
}
