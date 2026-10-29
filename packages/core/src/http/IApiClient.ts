export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  timeout?: number;
}

export interface ApiRequestDetails {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface ApiResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body: T;
  durationMs: number;
  request: ApiRequestDetails;
}

export interface IApiClient {
  get<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  withToken(token: string): IApiClient;
}
