import fs from 'fs';
import path from 'path';

export function getFixturePath(relativePath: string): string {
  return path.resolve(process.cwd(), relativePath);
}

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function readJsonFile<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}
