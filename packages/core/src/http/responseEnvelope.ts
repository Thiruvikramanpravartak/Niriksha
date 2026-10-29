export interface ResponseWrapper<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: string | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
  error?: string | null;
}

export function isResponseWrapper<T>(obj: unknown): obj is ResponseWrapper<T> {
  if (!obj || typeof obj !== 'object') return false;
  const candidate = obj as Record<string, unknown>;
  return typeof candidate['success'] === 'boolean' && 'data' in candidate;
}

export function isPaginatedResponse<T>(obj: unknown): obj is PaginatedResponse<T> {
  if (!isResponseWrapper(obj)) return false;
  const data = (obj as ResponseWrapper).data as Record<string, unknown> | undefined;
  if (!data || typeof data !== 'object') return false;
  return Array.isArray(data['items']) && typeof data['pagination'] === 'object';
}
