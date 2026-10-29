import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const reportPath = path.resolve(__dirname, '../reports/cucumber-report.html');

if (!fs.existsSync(reportPath)) {
  console.error(`[ERROR] Report not found at: ${reportPath}`);
  console.log(`Please run 'npm test' or 'npm run test:e2e' first to generate the report.`);
  process.exit(1);
}

console.log(`Opening Cucumber HTML Report in default browser: ${reportPath}`);

const cmd = process.platform === 'win32'
  ? `start "" "${reportPath}"`
  : process.platform === 'darwin'
  ? `open "${reportPath}"`
  : `xdg-open "${reportPath}"`;

exec(cmd, (err) => {
  if (err) {
    console.error('[ERROR] Could not open report automatically:', err.message);
  } else {
    console.log('[SUCCESS] Report opened in browser.');
  }
});
