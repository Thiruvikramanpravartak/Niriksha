export interface SoftCheckError {
  label: string;
  error: Error;
}

export class SoftAssert {
  private failures: SoftCheckError[] = [];

  public check(label: string, fn: () => void | Promise<void>): void {
    try {
      const result = fn();
      if (result instanceof Promise) {
        // Synchronous check invoked async
        result.catch((err) => {
          this.failures.push({
            label,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        });
      }
    } catch (err) {
      this.failures.push({
        label,
        error: err instanceof Error ? err : new Error(String(err)),
      });
    }
  }

  public async checkAsync(label: string, fn: () => Promise<void>): Promise<void> {
    try {
      await fn();
    } catch (err) {
      this.failures.push({
        label,
        error: err instanceof Error ? err : new Error(String(err)),
      });
    }
  }

  public async assertAll(): Promise<void> {
    if (this.failures.length === 0) return;

    const message = [
      `Soft assertion failure: ${this.failures.length} condition(s) failed:`,
      ...this.failures.map((f, i) => `  ${i + 1}. [${f.label}]: ${f.error.message}`),
    ].join('\n');

    throw new Error(message);
  }

  public getFailureCount(): number {
    return this.failures.length;
  }
}
