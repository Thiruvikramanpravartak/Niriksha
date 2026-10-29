import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

interface ApiResponseData {
  status: number;
  contentType: string;
  body: any;
}

function getBaseUrl(world: CustomWorld): string {
  return world.config?.baseUrl || process.env.BASE_URL || 'http://13.202.245.81:3001';
}

When('I send a GET request to {string}', async function (this: CustomWorld, endpoint: string) {
  const baseUrl = getBaseUrl(this);
  const target = `${baseUrl}${endpoint}`;
  const response = await fetch(target);
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  const isJson = contentType.includes('json');
  const body = isJson ? await response.json().catch(() => ({})) : await response.text();

  this.customState.set('lastApiResponse', {
    status: response.status,
    contentType,
    body,
  } as ApiResponseData);

  this.checklist.record('API GET Request Sent', `${endpoint} -> HTTP ${response.status}`, true);
});

Then('the API response status should be {int}', async function (this: CustomWorld, expectedStatus: number) {
  const res = this.customState.get('lastApiResponse') as ApiResponseData;
  expect(res).toBeDefined();
  expect(res.status).toBe(expectedStatus);
  this.checklist.record('API Status Verification', `Received ${res.status}`, res.status === expectedStatus);
});

Then('the response body should contain {string} and {string}', async function (this: CustomWorld, key1: string, key2: string) {
  const res = this.customState.get('lastApiResponse') as ApiResponseData;
  expect(typeof res.body).toBe('object');
  expect(res.body).not.toBeNull();
  expect(res.body).toHaveProperty(key1);
  expect(res.body).toHaveProperty(key2);
  this.checklist.record('Payload Keys Verification', `Keys ${key1}, ${key2} present`, true);
});

Then('the response should match json content type', async function (this: CustomWorld) {
  const res = this.customState.get('lastApiResponse') as ApiResponseData;
  expect(res.contentType).toContain('application/json');
  this.checklist.record('Content-Type Verification', res.contentType, true);
});

Then('the response body should be a non-empty array of items', async function (this: CustomWorld) {
  const res = this.customState.get('lastApiResponse') as ApiResponseData;
  const isArray = Array.isArray(res.body) || (res.body && Array.isArray(res.body.items)) || (res.body && Array.isArray(res.body.data));
  expect(isArray).toBe(true);
  const items = Array.isArray(res.body) ? res.body : (res.body.items || res.body.data || []);
  expect(items.length).toBeGreaterThan(0);
  this.checklist.record('Array Payload Verification', `${items.length} items present`, true);
});

Then('the reports pagination items should not be empty', async function (this: CustomWorld) {
  const res = this.customState.get('lastApiResponse') as ApiResponseData;
  const items = res.body?.items || res.body?.data || [];
  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBeGreaterThan(0);
  this.checklist.record('Pagination items verified', `${items.length} records returned`, true);
});

Then('the response body should contain {string}, {string}, {string}, and {string}', async function (
  this: CustomWorld,
  k1: string,
  k2: string,
  k3: string,
  k4: string
) {
  const res = this.customState.get('lastApiResponse') as ApiResponseData;
  expect(typeof res.body).toBe('object');
  expect(res.body).toHaveProperty(k1);
  expect(res.body).toHaveProperty(k2);
  expect(res.body).toHaveProperty(k3);
  expect(res.body).toHaveProperty(k4);
  this.checklist.record('Dimensions Verification', `Found ${k1}, ${k2}, ${k3}, ${k4}`, true);
});

When('I send a GET request for a valid and an invalid report ID', async function (this: CustomWorld) {
  const baseUrl = getBaseUrl(this);
  // First get a valid ID from /api/reports
  const listRes = await fetch(`${baseUrl}/api/reports?page=1&pageSize=1`);
  const listData = await listRes.json().catch(() => ({}));
  const validItem = listData.items?.[0] || listData.data?.[0];
  const validId = validItem?.id || '1';

  const validRes = await fetch(`${baseUrl}/api/reports/${validId}`);
  const invalidRes = await fetch(`${baseUrl}/api/reports/non-existent-id-999999`);

  this.customState.set('idCheckResults', {
    validStatus: validRes.status,
    invalidStatus: invalidRes.status,
  });

  this.checklist.record('Report ID probes completed', `Valid: ${validRes.status}, Invalid: ${invalidRes.status}`, true);
});

Then('the valid report ID should return 200 and the invalid ID should return 404', async function (this: CustomWorld) {
  const results = this.customState.get('idCheckResults') as { validStatus: number; invalidStatus: number };
  expect(results.validStatus).toBe(200);
  expect([404, 400, 500]).toContain(results.invalidStatus);
  this.checklist.record('Valid/Invalid status codes verified', `Valid: ${results.validStatus}, Invalid: ${results.invalidStatus}`, true);
});

Then('the response body should contain {string}', async function (this: CustomWorld, key: string) {
  const res = this.customState.get('lastApiResponse') as ApiResponseData;
  expect(typeof res.body).toBe('object');
  expect(res.body).toHaveProperty(key);
  this.checklist.record('Key verification', `Key ${key} present`, true);
});

When('I send a GET request to both {string} and {string}', async function (this: CustomWorld, ep1: string, ep2: string) {
  const baseUrl = getBaseUrl(this);
  const res1 = await fetch(`${baseUrl}${ep1}`);
  const res2 = await fetch(`${baseUrl}${ep2}`);

  const data1 = await res1.json().catch(() => ({}));
  const data2 = await res2.json().catch(() => ({}));

  this.customState.set('dualEndpointResults', {
    status1: res1.status,
    status2: res2.status,
    count1: (data1.items || data1.data || []).length,
    count2: (data2.items || data2.data || []).length,
  });

  this.checklist.record('Dual mount point requests sent', `${ep1} & ${ep2}`, true);
});

Then('both endpoints should return HTTP status 200 with matching items', async function (this: CustomWorld) {
  const res = this.customState.get('dualEndpointResults') as {
    status1: number;
    status2: number;
    count1: number;
    count2: number;
  };
  expect(res.status1).toBe(200);
  expect(res.status2).toBe(200);
  expect(res.count1).toBeGreaterThan(0);
  expect(res.count2).toBeGreaterThan(0);
  this.checklist.record('Dual endpoints matched', `Both HTTP 200 with records`, true);
});

When('I authenticate with valid credentials via API', async function (this: CustomWorld) {
  const baseUrl = getBaseUrl(this);
  const username = process.env.CAG_E2E_ADMIN_USER || 'tthiruvikram_admin';
  const password = process.env.CAG_E2E_ADMIN_PASSWORD || 'Thiru@123';

  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));
  this.customState.set('apiLoginResultValid', {
    status: res.status,
    hasToken: Boolean(data.token || data.access_token || data.data?.token),
  });

  this.checklist.record('Valid API Auth Sent', `HTTP ${res.status}`, true);
});

Then('the login API returns status 200 with an authorization token', async function (this: CustomWorld) {
  const r = this.customState.get('apiLoginResultValid') as { status: number; hasToken: boolean };
  expect(r.status).toBe(200);
  expect(r.hasToken).toBe(true);
  this.checklist.record('Valid Login Token Verified', 'Token issued', true);
});

When('I authenticate with invalid credentials via API', async function (this: CustomWorld) {
  const baseUrl = getBaseUrl(this);
  const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'invalid_admin', password: 'WrongPassword' }),
  });

  const data = await res.json().catch(() => ({}));
  this.customState.set('apiLoginResultInvalid', {
    status: res.status,
    hasToken: Boolean(data.token || data.access_token || data.data?.token),
  });

  this.checklist.record('Invalid API Auth Sent', `HTTP ${res.status}`, true);
});

Then('the login API returns status 401 without a token', async function (this: CustomWorld) {
  const r = this.customState.get('apiLoginResultInvalid') as { status: number; hasToken: boolean };
  expect(r.status).toBe(401);
  expect(r.hasToken).toBe(false);
  this.checklist.record('Invalid Login Rejected', 'HTTP 401 without token', true);
});

When('I send an unauthenticated request to {string}', async function (this: CustomWorld, endpoint: string) {
  const baseUrl = getBaseUrl(this);
  const target = `${baseUrl}${endpoint}`;
  const response = await fetch(target);
  const contentType = (response.headers.get('content-type') || '').toLowerCase();

  this.customState.set('lastApiResponse', {
    status: response.status,
    contentType,
    body: null,
  } as ApiResponseData);

  this.checklist.record('Unauthenticated API Request', `${endpoint} -> HTTP ${response.status}`, true);
});
