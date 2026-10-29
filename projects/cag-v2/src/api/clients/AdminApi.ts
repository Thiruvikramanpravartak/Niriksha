import { ApiResponse, IApiClient, RequestOptions } from '@qa/core';
import { endpoints } from '../endpoints';

export class AdminApi {
  constructor(
    private readonly client: IApiClient,
    private readonly prefix: string = '/api',
  ) {}

  private resolvePath(endpoint: string): string {
    return `${this.prefix}${endpoint}`;
  }

  public async login(
    credentials: { username?: string; password?: string },
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.client.post(this.resolvePath(endpoints.admin.login), {
      ...options,
      body: credentials,
    });
  }

  public async getCrudList(table: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.admin.crud(table)), options);
  }

  public async createRecord(
    table: string,
    payload: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.client.post(this.resolvePath(endpoints.admin.crud(table)), {
      ...options,
      body: payload,
    });
  }

  public async getRecordById(
    table: string,
    id: string | number,
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.admin.recordById(table, id)), options);
  }

  public async updateRecord(
    table: string,
    id: string | number,
    payload: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.client.put(this.resolvePath(endpoints.admin.recordById(table, id)), {
      ...options,
      body: payload,
    });
  }

  public async deleteRecord(
    table: string,
    id: string | number,
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.client.delete(this.resolvePath(endpoints.admin.recordById(table, id)), options);
  }

  public async upload(formData: unknown, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.post(this.resolvePath(endpoints.admin.upload), {
      ...options,
      body: formData,
    });
  }

  public async getOptions(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.admin.options), options);
  }

  public async getUsers(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.admin.users), options);
  }
}
