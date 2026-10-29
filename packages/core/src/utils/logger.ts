export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export class ConsoleLogger implements ILogger {
  constructor(private readonly prefix: string = 'QA') {}

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.prefix}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.DEBUG) {
      console.debug(this.format('debug', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.info(this.format('info', message), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(this.format('warn', message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.format('error', message), ...args);
  }
}

export const logger = new ConsoleLogger();
