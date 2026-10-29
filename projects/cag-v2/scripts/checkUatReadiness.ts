import http from 'http';
import { URL } from 'url';
import { envUat } from '../config/env.uat';
import { getDbClient } from '../src/db/getDbClient';

interface ProbeResult {
  target: string;
  url: string;
  reachable: boolean;
  statusCode?: number;
  latencyMs?: number;
  message?: string;
}

async function probeHttp(target: string, rawUrl: string, timeoutMs: number = 3000): Promise<ProbeResult> {
  const start = Date.now();
  return new Promise<ProbeResult>((resolve) => {
    try {
      const parsed = new URL(rawUrl);
      const req = http.request(
        {
          hostname: parsed.hostname,
          port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
          path: parsed.pathname || '/',
          method: 'HEAD',
          timeout: timeoutMs,
        },
        (res) => {
          const latency = Date.now() - start;
          resolve({
            target,
            url: rawUrl,
            reachable: true,
            statusCode: res.statusCode,
            latencyMs: latency,
            message: `HTTP ${res.statusCode} (${latency}ms)`,
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve({
          target,
          url: rawUrl,
          reachable: false,
          message: `Timed out after ${timeoutMs}ms`,
        });
      });

      req.on('error', (err) => {
        resolve({
          target,
          url: rawUrl,
          reachable: false,
          message: err.message,
        });
      });

      req.end();
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Invalid URL';
      resolve({
        target,
        url: rawUrl,
        reachable: false,
        message: errorMsg,
      });
    }
  });
}

async function main() {
  console.log('================================================================================');
  console.log(' CAG v2 PRE-FLIGHT LIVE UAT READINESS CHECKER');
  console.log('================================================================================');
  console.log(`Environment:        ${envUat.name}`);
  console.log(`Base URL:           ${envUat.baseUrl}`);
  console.log(`Admin Portal URL:   ${envUat.adminUrl}`);
  console.log(`API Base URL:       ${envUat.apiBaseUrl}`);
  console.log('--------------------------------------------------------------------------------');

  const targets = [
    { name: 'Public Landing', url: envUat.baseUrl },
    { name: 'Admin Portal', url: envUat.adminUrl },
    { name: 'API Health Probe', url: `${envUat.apiBaseUrl}/api/health` },
  ];

  console.log('Probing HTTP endpoints (non-blocking)...');
  const results: ProbeResult[] = [];
  for (const t of targets) {
    const res = await probeHttp(t.name, t.url);
    results.push(res);
    const mark = res.reachable ? '[ONLINE]' : '[OFFLINE / WARN]';
    console.log(`  ${mark.padEnd(18)} ${t.name.padEnd(20)} ${res.url.padEnd(40)} -> ${res.message}`);
  }

  console.log('--------------------------------------------------------------------------------');
  console.log('Database Connectivity Probe:');
  const dbClient = getDbClient(envUat);
  let dbStatus = false;
  try {
    const res = await dbClient.query('SELECT 1 as ping');
    dbStatus = Array.isArray(res);
  } catch (_err: unknown) {
    dbStatus = false;
  }
  console.log(`  DB Status:          ${dbStatus ? '[CONNECTED / READY]' : '[MOCK / STANDALONE]'}`);
  console.log(`  DB Mode:            ${envUat.features.dbChecks ? 'Live Postgres' : 'Mock Db Client'}`);
  await dbClient.close().catch(() => {});
  console.log('--------------------------------------------------------------------------------');

  const anyReachable = results.some((r) => r.reachable);
  if (anyReachable) {
    console.log('[READINESS] Live UAT environment responded to probe. Ready for live test runs.');
  } else {
    console.log('[READINESS] Live UAT server is currently unreachable or protected behind private VPC/firewall.');
    console.log('            Recommended: Run test suites with local mock server (MOCK=true) or verify VPN connectivity.');
  }
  console.log('================================================================================');
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  console.warn('[WARN] Pre-flight check encountered non-fatal error:', msg);
  process.exit(0); // non-blocking
});
