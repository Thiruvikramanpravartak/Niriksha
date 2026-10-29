import { logger } from '../utils/logger';

export type CleanupTask = () => Promise<void> | void;

export class CleanupRegistry {
  private readonly tasks: CleanupTask[] = [];

  public register(task: CleanupTask): void {
    this.tasks.push(task);
  }

  public async runAll(): Promise<void> {
    logger.debug(`[CleanupRegistry] Running ${this.tasks.length} teardown tasks LIFO`);
    while (this.tasks.length > 0) {
      const task = this.tasks.pop();
      if (!task) continue;
      try {
        await task();
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logger.error(`[CleanupRegistry ERROR] Failed to execute cleanup task: ${errorMsg}`);
      }
    }
  }

  public clear(): void {
    this.tasks.length = 0;
  }
}
