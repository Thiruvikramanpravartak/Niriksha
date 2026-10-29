import fs from 'fs';
import path from 'path';

interface RunMetadata {
  id: string;
  timestamp: string;
  dateStr: string;
  env: string;
  targetUrl: string;
  totalScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  skippedScenarios: number;
  passRate: string;
  htmlReport: string;
  jsonReport: string;
}

export function archiveReport() {
  const reportsDir = path.resolve(__dirname, '../reports');
  const historyDir = path.join(reportsDir, 'history');
  const htmlFile = path.join(reportsDir, 'cucumber-report.html');
  const jsonFile = path.join(reportsDir, 'cucumber-report.json');

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  if (!fs.existsSync(htmlFile)) {
    console.warn('[WARN] No cucumber-report.html found to archive.');
    return;
  }

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const dateStr = now.toISOString().replace('T', ' ').slice(0, 19);
  const env = (process.env.ENV || 'e2e').toLowerCase();
  const targetUrl = process.env.BASE_URL || (env === 'uat' ? 'http://15.252.122.216' : 'http://13.202.245.81:3001');

  let passedScenarios = 0;
  let failedScenarios = 0;
  let skippedScenarios = 0;
  let totalScenarios = 0;

  if (fs.existsSync(jsonFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      for (const feature of data) {
        for (const el of feature.elements || []) {
          const isFailed = el.steps.some((s: any) => s.result && s.result.status === 'failed');
          const isSkipped = el.steps.some((s: any) => s.result && s.result.status === 'skipped');
          if (isFailed) failedScenarios++;
          else if (isSkipped) skippedScenarios++;
          else passedScenarios++;
        }
      }
      totalScenarios = passedScenarios + failedScenarios + skippedScenarios;
    } catch {
      // Non-fatal parse issue
    }
  }

  const passRate = totalScenarios > 0 ? `${((passedScenarios / totalScenarios) * 100).toFixed(1)}%` : 'N/A';

  const archivedHtmlName = `cucumber-report_${timestamp}_${env}.html`;
  const archivedJsonName = `cucumber-report_${timestamp}_${env}.json`;
  const archivedHtmlPath = path.join(historyDir, archivedHtmlName);
  const archivedJsonPath = path.join(historyDir, archivedJsonName);

  // Copy with timestamp
  fs.copyFileSync(htmlFile, archivedHtmlPath);
  if (fs.existsSync(jsonFile)) {
    fs.copyFileSync(jsonFile, archivedJsonPath);
  }

  // Update history metadata
  const metaFile = path.join(historyDir, 'index.json');
  let historyList: RunMetadata[] = [];
  if (fs.existsSync(metaFile)) {
    try {
      historyList = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    } catch {
      historyList = [];
    }
  }

  const runMeta: RunMetadata = {
    id: `RUN-${timestamp}`,
    timestamp,
    dateStr,
    env,
    targetUrl,
    totalScenarios,
    passedScenarios,
    failedScenarios,
    skippedScenarios,
    passRate,
    htmlReport: `history/${archivedHtmlName}`,
    jsonReport: `history/${archivedJsonName}`,
  };

  historyList.unshift(runMeta); // Newest first
  fs.writeFileSync(metaFile, JSON.stringify(historyList, null, 2), 'utf8');

  // Generate Markdown History Table in reports/README.md
  let readme = `# CAG v2 — Automated Test Execution History & Reports\n\n`;
  readme += `This directory preserves historical Cucumber test run reports with permanent timestamps and run metadata.\n\n`;
  readme += `### Latest Active Reports\n`;
  readme += `- **Primary HTML Report:** [cucumber-report.html](./cucumber-report.html)\n`;
  readme += `- **Primary JSON Data:** [cucumber-report.json](./cucumber-report.json)\n\n`;
  readme += `### Historical Runs Archive\n\n`;
  readme += `| Run ID | Date & Time (UTC) | Env | Target URL | Total | Passed | Failed | Pass Rate | Report Link |\n`;
  readme += `| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :--- |\n`;

  for (const h of historyList) {
    readme += `| **${h.id}** | ${h.dateStr} | \`${h.env.toUpperCase()}\` | ${h.targetUrl} | ${h.totalScenarios} | ${h.passedScenarios} | ${h.failedScenarios} | **${h.passRate}** | [View HTML](./${h.htmlReport}) |\n`;
  }

  fs.writeFileSync(path.join(reportsDir, 'README.md'), readme, 'utf8');

  console.log(`\n================================================================================`);
  console.log(`[REPORT ARCHIVED] Run report saved permanently with metadata:`);
  console.log(`  Archived Report:  reports/${runMeta.htmlReport}`);
  console.log(`  Timestamp:        ${runMeta.dateStr}`);
  console.log(`  Environment:      ${runMeta.env.toUpperCase()} (${runMeta.targetUrl})`);
  console.log(`  Results:          ${runMeta.passedScenarios}/${runMeta.totalScenarios} passed (${runMeta.passRate})`);
  console.log(`================================================================================\n`);
}

if (require.main === module) {
  archiveReport();
}
