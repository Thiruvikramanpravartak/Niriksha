import { DataFactory } from '@qa/core';

export interface ReportRecord {
  title: string;
  year: number;
  category: string;
  state: string;
  description: string;
}

export interface NewsRecord {
  title: string;
  publishDate: string;
  summary: string;
  status: 'draft' | 'published';
}

export const buildReportRecord = (overrides?: Partial<ReportRecord>): ReportRecord => ({
  title: DataFactory.title('Audit Report'),
  year: 2025,
  category: 'Civil',
  state: 'Delhi',
  description: DataFactory.text(10),
  ...overrides,
});

export const buildNewsRecord = (overrides?: Partial<NewsRecord>): NewsRecord => ({
  title: DataFactory.title('Press Release'),
  publishDate: DataFactory.pastDate(),
  summary: DataFactory.text(8),
  status: 'published',
  ...overrides,
});
