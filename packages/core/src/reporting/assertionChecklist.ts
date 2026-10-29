export interface ChecklistItem {
  condition: string;
  actual: string;
  status: 'pass' | 'fail' | 'warn';
}

export class AssertionChecklist {
  private items: ChecklistItem[] = [];

  public record(condition: string, actual: string, passed: boolean | 'warn' = true): void {
    const status = passed === 'warn' ? 'warn' : passed ? 'pass' : 'fail';
    this.items.push({ condition, actual, status });
  }

  public getItems(): readonly ChecklistItem[] {
    return this.items;
  }

  public hasFailures(): boolean {
    return this.items.some((i) => i.status === 'fail');
  }

  public formatMarkdown(scenarioTitle: string, overallPassed: boolean): string {
    const statusText = overallPassed ? 'PASS' : 'FAIL';
    const lines = [
      `### Assertion Checklist: ${scenarioTitle} — [${statusText}]`,
      '| Check | Condition | Actual Observed Value | Status |',
      '|---|---|---|---|',
    ];
    for (const item of this.items) {
      const icon = item.status === 'pass' ? '✔' : item.status === 'warn' ? '⚠' : '✘';
      lines.push(`| ${icon} | ${item.condition} | ${item.actual} | ${item.status.toUpperCase()} |`);
    }
    return lines.join('\n');
  }
}
