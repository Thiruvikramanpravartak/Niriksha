import { ApiResponse, IApiClient, RequestOptions } from '@qa/core';
import { endpoints } from '../endpoints';

export class PublicApi {
  constructor(
    private readonly client: IApiClient,
    private readonly prefix: string = '/api',
  ) {}

  private resolvePath(endpoint: string): string {
    return `${this.prefix}${endpoint}`;
  }

  public async getHome(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.home), options);
  }

  public async getReports(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.reports), options);
  }

  public async getReportFilters(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.reportFilters), options);
  }

  public async getReportById(id: string | number, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.reportById(id)), options);
  }

  public async getAccounts(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.accounts), options);
  }

  public async getStateAccounts(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.stateAccounts), options);
  }

  public async getStateAccountById(
    id: string | number,
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.stateAccountById(id)), options);
  }

  public async getCombinedAccounts(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.combinedAccounts), options);
  }

  public async getCombinedAccountById(
    id: string | number,
    options?: RequestOptions,
  ): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.combinedAccountById(id)), options);
  }

  public async getEvents(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.events), options);
  }

  public async getNews(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.news), options);
  }

  public async getNewsById(id: string | number, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.newsById(id)), options);
  }

  public async getPage(slugOrId: string | number, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.pageBySlugOrId(slugOrId)), options);
  }

  public async getOrganisationChart(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.organisationChart), options);
  }

  public async getFormerCag(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.formerCag), options);
  }

  public async getStates(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.states), options);
  }

  public async getStateSubsite(state: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(this.resolvePath(endpoints.public.stateSubsite(state)), options);
  }

  public async getHealth(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(endpoints.health, options);
  }

  public async getDocs(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(endpoints.docs, options);
  }

  public async getOpenApi(options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(endpoints.openapi, options);
  }
}
