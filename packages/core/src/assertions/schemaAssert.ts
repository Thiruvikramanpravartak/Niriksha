import { ZodType } from 'zod';
import {
  isPaginatedResponse,
  isResponseWrapper,
  PaginatedResponse,
} from '../http/responseEnvelope';

export function assertSchema<T>(data: unknown, schema: ZodType<T>): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const path = issue.path.join('.') || '<root>';
      return `  - Path: "${path}" | Expected: ${issue.code} | Message: ${issue.message}`;
    });
    const message = `[SCHEMA ASSERTION FAILED]\nPayload failed schema validation with ${issues.length} issue(s):\n${issues.join('\n')}`;
    throw new Error(message);
  }
  return result.data;
}

export function assertEnvelope(body: unknown): void {
  if (!isResponseWrapper(body)) {
    throw new Error(
      `[ENVELOPE ASSERTION FAILED] Expected body to match ResponseWrapper shape with 'success' boolean and 'data' field. Received: ${JSON.stringify(body)}`,
    );
  }

  if (isPaginatedResponse(body)) {
    const paginated = body as PaginatedResponse;
    const pagination = paginated.data.pagination;
    const items = paginated.data.items;

    if (typeof pagination.page !== 'number' || pagination.page < 0) {
      throw new Error(`Invalid pagination.page: ${pagination.page}`);
    }
    if (typeof pagination.pageSize !== 'number' || pagination.pageSize < 0) {
      throw new Error(`Invalid pagination.pageSize: ${pagination.pageSize}`);
    }
    if (typeof pagination.total !== 'number' || pagination.total < 0) {
      throw new Error(`Invalid pagination.total: ${pagination.total}`);
    }
    if (items.length > pagination.pageSize && pagination.pageSize > 0) {
      throw new Error(
        `Returned item count (${items.length}) exceeds declared pageSize (${pagination.pageSize})`,
      );
    }
  }
}
