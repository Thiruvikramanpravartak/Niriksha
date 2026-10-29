# QA Automation Framework

Enterprise multi-runner test automation framework built for web applications, APIs, and digital government portals.

---

## 1. Tech Stack

- **Language**: TypeScript (Node 20 LTS) with strict typing (`noImplicitAny`, `strictNullChecks`).
- **Runners**:
  - **Playwright Test**: REST API, visual regression, accessibility (axe-core), and link crawling.
  - **Cucumber BDD**: User journeys and Gherkin smoke/regression scenarios.
- **Reporting**: Allure Report + Playwright HTML Reporter.
- **Configuration**: Zod fail-fast schema validation with zero hardcoded URLs or credentials.
- **Architecture**: Monorepo with reusable `@qa/core` package and modular `projects/` workspace.

---

## 2. Quick Start

### Installation

```bash
npm install
npx playwright install chromium
```

### Running Tests

```bash
# 1. Run in self-contained mock mode (no live environment needed)
MOCK=1 npm run test:all

# 2. Run core unit tests
npm run test:core

# 3. Run Cucumber smoke journey tests
MOCK=1 npm run test:smoke

# 4. Run against target environments (UAT / E2E)
ENV=uat npm run test:api
ENV=e2e npm run test:smoke
```

### Quality & Static Checks

```bash
# Architectural linting (enforces 5 custom design rules)
npm run lint

# Strict TypeScript typechecking across all workspaces
npm run typecheck

# Generate Traceability & Coverage Dashboard (§22)
npm run traceability

# Start local interactive mock portal on http://localhost:4000
npm run mock:server

# View Playwright HTML test report
npm run report
```

---

## 3. How to Add a Test

### Adding an API Test (`Playwright Test`)

1. Create a spec file in `projects/cag-v2/tests/api/` named `apiXXFeature.spec.ts`.
2. Tag the test with `@api @TC:API-XX`.
3. Use `ApiClient` and domain client methods; validate using Zod schemas and `assertEnvelope`:

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient, assertEnvelope, assertSchema, loadConfig } from '@qa/core';
import { PublicApi } from '../../src/api/clients/PublicApi';
import { HomeResponseSchema } from '../../src/api/schemas';

test('[TC:API-01] GET /api/home returns home page payload @api @TC:API-01', async () => {
  const config = loadConfig();
  const client = new ApiClient({ baseUrl: config.env.apiBaseUrl });
  const api = new PublicApi(client);

  const res = await api.getHome();
  expect(res.status).toBe(200);
  assertEnvelope(res.body);
  assertSchema(res.body, HomeResponseSchema);
});
```

### Adding a UI Scenario (`Cucumber BDD`)

1. Add a `.feature` file in `projects/cag-v2/features/` with tags `@ui @smoke @TC:XX`.
2. Implement step definitions in `projects/cag-v2/steps/` using runner-agnostic Page Objects.
3. **Remember the rule**: Page Objects return state and locators; assertions (`expect`) live strictly in step definitions.

```gherkin
@ui @smoke
Feature: Public Home Page
  @TC:HP-01
  Scenario: Home page loads with hero banner
    Given I navigate to the home page
    Then the hero section should be visible
```

---

## 4. Reporting (Allure)

Test executions automatically output raw results to `allure-results/`.

```bash
# Generate and open Allure report
npx allure serve allure-results
```

---

## 5. Milestone Tracking & Documentation

- [MILESTONE_1_TRACKING.md](./MILESTONE_1_TRACKING.md) — Comprehensive checklist, architecture rules compliance, and verification outputs for Milestone 1.
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — The 4-layer design, why two runners, and ESLint rule enforcement.
- [docs/data-testid-convention.md](./docs/data-testid-convention.md) — Frontend testing contract and locator conventions.
- [docs/WRITING_TESTS.md](./docs/WRITING_TESTS.md) — Test writing standards and locator priority rules.
- [docs/CI.md](./docs/CI.md) — Jenkins pipeline setup and CI agent specifications.
