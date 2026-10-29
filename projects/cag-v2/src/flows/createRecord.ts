import { IApiClient } from '@qa/core';
import { endpoints } from '../api/endpoints';

export async function createAdminRecord<T = Record<string, unknown>>(
  api: IApiClient,
  table: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const path = endpoints.admin.crud(table);
  const response = await api.post<T>(path, { body: payload });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(
      `Failed to create record in ${table} (HTTP ${response.status}): ${JSON.stringify(response.body)}`,
    );
  }
  return response.body;
}
