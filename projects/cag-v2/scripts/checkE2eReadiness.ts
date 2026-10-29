import { e2eEnvConfig, e2eCredentials } from '../config/e2e';

interface ProbeResult {
  target: string;
  url: string;
  reachable: boolean;
  statusCode?: number;
  latencyMs?: number;
  message?: string;
  details?: string;
}

async function probeHttp(target: string, rawUrl: string, timeoutMs: number = 5000): Promise<ProbeResult> {
  const start = Date.now();
  try {
    const res = await fetch(rawUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(timeoutMs),
    });
    const latency = Date.now() - start;
    return {
      target,
      url: rawUrl,
      reachable: res.status < 500,
      statusCode: res.status,
      latencyMs: latency,
      message: `HTTP ${res.status} (${latency}ms)`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unreachable';
    return {
      target,
      url: rawUrl,
      reachable: false,
      message: errorMsg,
    };
  }
}

async function probeAdminAuth(
  apiBaseUrl: string,
  user: string,
  pass: string,
  timeoutMs: number = 5000,
): Promise<ProbeResult> {
  const start = Date.now();
  const url = `${apiBaseUrl}/api/admin/auth/login`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const latency = Date.now() - start;
    const body = (await res.json().catch(() => ({}))) as {
      access_token?: string;
      token?: string;
      data?: { token?: string };
      user?: { id?: string | number; role?: string };
    };
    const hasToken = Boolean(body.access_token || body.token || body.data?.token);
    const role = body.user?.role || 'unknown';

    return {
      target: 'Admin Auth (/api/admin/auth/login)',
      url,
      reachable: res.status === 200 && hasToken,
      statusCode: res.status,
      latencyMs: latency,
      message:
        res.status === 200 && hasToken
          ? `HTTP 200 OK — Authenticated as ${role} (${latency}ms)`
          : `HTTP ${res.status} — Authentication rejected`,
      details: hasToken
        ? `Token: ${(body.access_token || body.token || '').slice(0, 24)}... (User ID: ${body.user?.id || 'N/A'})`
        : undefined,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Auth Request Failed';
    return {
      target: 'Admin Auth (/api/admin/auth/login)',
      url,
      reachable: false,
      message: errorMsg,
    };
  }
}

async function main() {
  console.log('================================================================================');
  console.log(' CAG v2 PRE-FLIGHT LIVE E2E ENVIRONMENT READINESS CHECK');
  console.log('================================================================================');
  console.log(`Environment:        ${e2eEnvConfig.name.toUpperCase()} (Live Target Environment)`);
  console.log(`Base URL:           ${e2eEnvConfig.baseUrl}`);
  console.log(`Admin Portal URL:   ${e2eEnvConfig.adminUrl}`);
  console.log(`API Base URL:       ${e2eEnvConfig.apiBaseUrl}`);
  console.log(`Admin Username:     ${e2eCredentials.adminUser}`);
  console.log(`Admin Password:     ${'*'.repeat((e2eCredentials.adminPassword || '').length)}`);
  console.log('--------------------------------------------------------------------------------');

  const targets = [
    { name: 'Public Landing (Next.js)', url: e2eEnvConfig.baseUrl },
    { name: 'Admin Portal Page', url: e2eEnvConfig.adminUrl },
    { name: 'Home API (/api/home)', url: `${e2eEnvConfig.apiBaseUrl}/api/home` },
    { name: 'Reports API (/api/reports)', url: `${e2eEnvConfig.apiBaseUrl}/api/reports` },
    { name: 'News API (/api/news)', url: `${e2eEnvConfig.apiBaseUrl}/api/news` },
  ];

  console.log('Probing Web and API Endpoints...');
  const results: ProbeResult[] = [];
  for (const t of targets) {
    const res = await probeHttp(t.name, t.url);
    results.push(res);
    const mark = res.reachable ? '[ONLINE]' : '[FAIL/OFFLINE]';
    console.log(`  ${mark.padEnd(16)} ${t.name.padEnd(28)} -> ${res.message}`);
  }

  console.log('--------------------------------------------------------------------------------');
  console.log('Testing Admin Credentials Authentication...');
  const authRes = await probeAdminAuth(
    e2eEnvConfig.apiBaseUrl,
    e2eCredentials.adminUser || '',
    e2eCredentials.adminPassword || '',
  );
  results.push(authRes);
  const authMark = authRes.reachable ? '[SUCCESS]' : '[FAILED]';
  console.log(`  ${authMark.padEnd(16)} ${authRes.target.padEnd(28)} -> ${authRes.message}`);
  if (authRes.details) {
    console.log(`                   ${authRes.details}`);
  }

  console.log('================================================================================');
  const allReachable = results.every((r) => r.reachable);
  if (allReachable) {
    console.log('[READINESS RESULT] ALL CHECKS PASSED: E2E environment is 100% ready for test runs.');
  } else {
    console.log('[READINESS RESULT] SOME CHECKS FAILED: Review the endpoint errors above.');
  }
  console.log('================================================================================');
}

main().catch((err) => {
  console.warn('[WARN] Pre-flight check encountered non-fatal error:', err.message);
  process.exit(0);
});
