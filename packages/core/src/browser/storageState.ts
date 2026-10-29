import fs from 'fs';

export interface StorageStateData {
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  }>;
  origins: Array<{
    origin: string;
    localStorage: Array<{ name: string; value: string }>;
  }>;
}

export function loadStorageState(filePath: string): StorageStateData | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as StorageStateData;
}

export function saveStorageState(filePath: string, data: StorageStateData): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
