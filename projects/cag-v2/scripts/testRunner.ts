import { spawn } from 'child_process';
import { archiveReport } from './archiveReport';

const args = process.argv.slice(2);
const cucumberCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const formattedArgs = args.map((arg) => {
  if (arg.includes(' ') || arg.includes('"') || arg.includes('@')) {
    return `"${arg.replace(/"/g, '\\"')}"`;
  }
  return arg;
});

const child = spawn(cucumberCmd, ['cucumber-js', '--config', 'cucumber.cjs', ...formattedArgs], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('close', (code) => {
  try {
    archiveReport();
  } catch (err) {
    console.error('[WARN] Failed to archive report:', err);
  }
  process.exit(code ?? 0);
});
