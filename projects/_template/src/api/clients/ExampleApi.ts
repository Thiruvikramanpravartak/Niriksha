import { IApiClient, ApiResponse } from '@qa/core';
import { endpoints } from '../endpoints';
import { ExampleItem } from '../schemas/exampleSchema';

export class ExampleApi {
  constructor(
    private readonly client: IApiClient,
    private readonly versionPrefix: string = '/api',
  ) {}

  public async getItems(): Promise<ApiResponse<{ items: ExampleItem[] }>> {
    return this.client.get<{ items: ExampleItem[] }>(
      `${this.versionPrefix}${endpoints.public.items}`,
    );
  }
}
