import { faker } from '@faker-js/faker';

export class DataFactory {
  private static readonly runId = `${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).slice(2, 6)}`;
  private static sequence = 0;

  public static nextId(prefix = 'AUTO'): string {
    this.sequence += 1;
    return `${prefix}-${this.runId}-${this.sequence}`;
  }

  public static text(wordCount = 5): string {
    return faker.lorem.words(wordCount);
  }

  public static title(prefix = 'Test Title'): string {
    return `${prefix} ${this.nextId()}`;
  }

  public static email(): string {
    return faker.internet.email();
  }

  public static futureDate(): string {
    return faker.date.future().toISOString().split('T')[0] ?? '2026-12-31';
  }

  public static pastDate(): string {
    return faker.date.past().toISOString().split('T')[0] ?? '2025-01-01';
  }
}
