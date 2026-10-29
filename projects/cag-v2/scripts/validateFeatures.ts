import * as fs from 'fs';
import * as path from 'path';

interface Violation {
  file: string;
  line: number;
  scenario: string;
  rule: string;
  message: string;
}

const BANNED_MECHANICAL_PHRASES = [
  'click the',
  'type into',
  '.css',
  '#',
  'locator(',
  'getByTestId',
  'xpath',
];

export function validateFeatures(featuresDir: string): Violation[] {
  const violations: Violation[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.feature')) {
        validateFeatureFile(fullPath, violations);
      }
    }
  }

  function validateFeatureFile(filePath: string, outViolations: Violation[]) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

    let currentScenario = '';
    let currentScenarioLine = 0;
    let currentTags: string[] = [];
    let assertionCount = 0;
    let inScenario = false;
    let inExamples = false;

    function finalizeScenario() {
      if (!currentScenario) return;

      // 1. Minimum 3 assertion steps (Then / And following Then)
      if (assertionCount < 3) {
        outViolations.push({
          file: relPath,
          line: currentScenarioLine,
          scenario: currentScenario,
          rule: 'I.1-assertion-depth',
          message: `Scenario has only ${assertionCount} assertion step(s) (minimum 3 required: Primary, Supporting, Health)`,
        });
      }

      // 2. Mandatory @TC: tag
      const hasTcTag = currentTags.some((t) => t.startsWith('@TC:'));
      if (!hasTcTag) {
        outViolations.push({
          file: relPath,
          line: currentScenarioLine,
          scenario: currentScenario,
          rule: 'H.4-tc-tag',
          message: 'Scenario is missing mandatory @TC:<ID> tag',
        });
      }

      // 3. Name starts with [ID] and has >= 8 words
      const bracketMatch = currentScenario.match(/^\[([A-Za-z0-9_,\s<>-]+)\]\s+(.+)$/);
      if (!bracketMatch) {
        outViolations.push({
          file: relPath,
          line: currentScenarioLine,
          scenario: currentScenario,
          rule: 'H.1-name-bracket',
          message: 'Scenario title does not start with bracketed ID prefix "[<ID>]"',
        });
      }

      const words = currentScenario.split(/\s+/).filter(Boolean);
      if (words.length < 8) {
        outViolations.push({
          file: relPath,
          line: currentScenarioLine,
          scenario: currentScenario,
          rule: 'H.1-name-length',
          message: `Scenario title is too short (${words.length} words; minimum 8 words required, target 10–22 words)`,
        });
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i]!;
      const trimmed = rawLine.trim();
      const lineNum = i + 1;

      // Check for banned mechanical phrases
      for (const phrase of BANNED_MECHANICAL_PHRASES) {
        if (trimmed.toLowerCase().includes(phrase.toLowerCase()) && !trimmed.startsWith('#')) {
          outViolations.push({
            file: relPath,
            line: lineNum,
            scenario: currentScenario || '<file header>',
            rule: 'I.1-banned-phrase',
            message: `Contains banned mechanical phrase "${phrase}"`,
          });
        }
      }

      if (trimmed.startsWith('@')) {
        const lineTags = trimmed.match(/@[A-Za-z0-9:_-]+/g) || [];
        if (!inScenario) {
          currentTags.push(...lineTags);
        } else {
          // New scenario tags
          finalizeScenario();
          currentScenario = '';
          assertionCount = 0;
          inScenario = false;
          inExamples = false;
          currentTags = [...lineTags];
        }
        continue;
      }

      if (trimmed.startsWith('Scenario:') || trimmed.startsWith('Scenario Outline:')) {
        if (inScenario) {
          finalizeScenario();
        }
        currentScenario = trimmed.replace(/^Scenario(?:\s+Outline)?:\s*/, '').trim();
        currentScenarioLine = lineNum;
        assertionCount = 0;
        inScenario = true;
        inExamples = false;
        continue;
      }

      if (trimmed.startsWith('Examples:')) {
        inExamples = true;
        continue;
      }

      if (inScenario && !inExamples) {
        // Count assertion steps: Then or And following assertions
        if (/^(Then|And)\s+/.test(trimmed)) {
          assertionCount++;
        }
      }
    }

    if (inScenario) {
      finalizeScenario();
    }
  }

  walk(featuresDir);
  return violations;
}

// CLI execution
if (require.main === module) {
  const targetDir = path.resolve(__dirname, '../features');
  console.log(`Running feature file validation (§I.1) against: ${targetDir}`);
  const violations = validateFeatures(targetDir);

  if (violations.length > 0) {
    console.error(`\n[VALIDATION FAILED] Found ${violations.length} violation(s):\n`);
    for (const v of violations) {
      console.error(`  - ${v.file}:${v.line} [${v.rule}]`);
      console.error(`    Scenario: ${v.scenario}`);
      console.error(`    Error:    ${v.message}\n`);
    }
    process.exit(1);
  } else {
    console.log('[VALIDATION PASSED] All scenarios comply with §I assertion depth and §H standards (0 violations).');
  }
}
