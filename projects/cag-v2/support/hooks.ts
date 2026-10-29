import * as fs from 'fs';
import * as path from 'path';
import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { registerBaseHooks, ProbeCollector, AssertionChecklist } from '@qa/core';
import { CustomWorld } from './world';

setDefaultTimeout(45000);

// Compose base hooks from @qa/core
registerBaseHooks();

Before(async function (this: CustomWorld) {
  this.probes = new ProbeCollector();
  this.checklist = new AssertionChecklist();
  if (this.page && !this.page.isClosed()) {
    await this.probes.startAll(this.page);
  }
});

After(async function (this: CustomWorld, scenario) {
  await this.probes.stopAll();

  const isPassed = scenario.result?.status === Status.PASSED;
  const statusStr = isPassed ? 'pass' : 'fail';

  // 1. Workbook metadata attachment (§J.2)
  const tcTags = scenario.pickle.tags
    .map((t) => t.name)
    .filter((n) => n.startsWith('@TC:'))
    .map((n) => n.replace('@TC:', ''));
  const primaryTcId = tcTags[0] || scenario.pickle.name.match(/^\[([A-Za-z0-9_-]+)/)?.[1] || 'UNKNOWN';

  const metadataTable = [
    '### Scenario Metadata',
    '| Property | Value |',
    '|---|---|',
    `| **Scenario** | ${scenario.pickle.name} |`,
    `| **TC ID(s)** | ${tcTags.join(', ') || 'N/A'} |`,
    `| **Status** | ${statusStr.toUpperCase()} |`,
    `| **Tags** | ${scenario.pickle.tags.map((t) => t.name).join(' ')} |`,
  ].join('\n');
  await this.attach(metadataTable, 'text/markdown');

  // 2. Assertion Checklist table (§J.3)
  const checklistMarkdown = this.checklist.formatMarkdown(scenario.pickle.name, isPassed);
  await this.attach(checklistMarkdown, 'text/markdown');

  // 3. Probe summary table (§I.2, §J.2)
  const probeSummary = this.probes.formatMarkdownSummary();
  await this.attach(probeSummary, 'text/markdown');

  // 4. Evidence screenshot saving & inline attachment (§J.2, §J.4)
  if (this.page && !this.page.isClosed()) {
    try {
      const screenshot = await this.page.screenshot({ timeout: 20000, animations: 'disabled' });
      await this.attach(screenshot, 'image/png');

      // Write to reports/evidence/<TC-ID>__<pass|fail>__<timestamp>.png
      const reportsDir = path.resolve(__dirname, '../reports');
      const evidenceDir = path.join(reportsDir, 'evidence');
      if (!fs.existsSync(evidenceDir)) {
        fs.mkdirSync(evidenceDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const evidencePath = path.join(evidenceDir, `${primaryTcId}__${statusStr}__${timestamp}.png`);
      fs.writeFileSync(evidencePath, screenshot);

      // On failure, capture DOM snapshot (§J.2)
      if (!isPassed) {
        const domContent = await this.page.content();
        await this.attach(domContent, 'text/html');
      }
    } catch {
      // Ignored if browser closed early
    }
  }

  // 5. Strict probes enforcement
  if (process.env.STRICT_PROBES === '1' && this.probes.hasViolations()) {
    throw new Error(`Strict probe failure: violation detected in scenario "${scenario.pickle.name}"`);
  }
});
