# Onboarding a New Project (2-Day Guide)

This guide documents the standardized process for onboarding a new application into the `qa-automation` repository.

**Reusability Objective:** Over 60% of test automation infrastructure resides in `@qa/core`. A newly onboarded project must execute its first automated test suite within **2 days** without requiring any modifications to `packages/core`.

---

## 1. The Non-Negotiable Contract

1. **Zero Core Modifications:** If adding a project requires modifying `packages/core`, the core abstraction has leaked or is insufficient. Fix core's design rather than hacking project-specific logic into core.
2. **Separation of Layers:** Follow the strict 4-layer architecture:
   - Config layer (`config/env.*.ts`)
   - Core services (`@qa/core`)
   - Object layer (Page Objects, Component Objects, API Clients, Flows)
   - Test layer (Gherkin features + step definitions, Playwright specs)
3. **No Assertions in Page Objects:** Page objects and component objects return locators, state, and promises. Assertions live **exclusively** in `steps/` and `tests/`.
4. **Single Source of Paths:** All API endpoints must be centralized in `src/api/endpoints.ts`. Zero path string literals anywhere else in tests.
5. **No Hardcoded URLs or Credentials:** All environment variables and secrets must be injected from `.env` or CI credential stores.

---

## 2. Step-by-Step 2-Day Onboarding Checklist

### Day 1: Scaffolding, Configuration & API Foundation

#### Step 1: Scaffold from `_template`

```bash
# From workspace root:
cp -r projects/_template projects/<new-project-name>
# or using degit:
# npx degit <repo-url>/projects/_template projects/<new-project-name>
```

Update `package.json` in `projects/<new-project-name>`:

```json
{
  "name": "@projects/<new-project-name>",
  "version": "1.0.0",
  "private": true
}
```

Add the new workspace path to the root `package.json` under `workspaces`:

```json
"workspaces": [
  "packages/core",
  "projects/cag-v2",
  "projects/<new-project-name>"
]
```

#### Step 2: Configure Environments & Secrets

1. Edit `projects/<new-project-name>/config/env.uat.ts` and `env.e2e.ts`.
2. Define `baseUrl`, `adminUrl`, `apiBaseUrl`, timeouts, and feature flags (`features.dbChecks`, `features.visualBaselines`, `features.a11y`).
3. Add the project-specific environment variables to `.env.example`:
   ```bash
   <PROJECT>_UAT_ADMIN_USER=
   <PROJECT>_UAT_ADMIN_PASSWORD=
   <PROJECT>_UAT_DB_PASSWORD=
   ```

#### Step 3: Centralize Endpoints & Zod Schemas

1. Define all API paths in `src/api/endpoints.ts`.
2. Write Zod schemas for response contracts in `src/api/schemas/`.
3. Wrap endpoints with typed API clients in `src/api/clients/` extending `ApiClient`.

#### Step 4: Write Core API Specs

1. Author high-priority API sanity tests in `tests/api/*.spec.ts`.
2. Tag every test with its workbook test case ID: `@api @TC:<ID>`.
3. Validate compilation and execution:
   ```bash
   npm run typecheck
   npm run test:api --workspace=@projects/<new-project-name>
   ```

---

### Day 2: UI Modeling, Smoke Slice, CI & Traceability

#### Step 5: Build Page & Component Objects

1. Create 3–5 Page Objects for primary user journeys in `src/pages/`.
2. Break out reusable navigation, headers, and footers into `src/components/`.
3. Verify compliance with §7.3: Ensure zero `expect()` assertions exist in any POM or component file.

#### Step 6: Automate the Smoke Slice (10–15 Journeys)

1. Write declarative Gherkin feature files in `features/public/` and `features/admin/`.
2. Implement step definitions in `steps/` utilizing the shared `CustomWorld` from `support/world.ts`.
3. Tag every scenario with `@smoke @ui @TC:<ID>`.
4. Run the smoke suite and confirm execution finishes in under 3 minutes:
   ```bash
   npm run test:smoke --workspace=@projects/<new-project-name>
   ```

#### Step 7: Configure CI Pipeline

1. Copy and adapt the project `Jenkinsfile` from `_template`.
2. Update Jenkins agent label and credential IDs matching Jenkins Credentials Store.
3. Configure the report-only gate policy (`catchError(buildResult: 'UNSTABLE')`) for the initial 2-week burn-in period.

#### Step 8: Wire Traceability & Coverage Dashboard

1. Place the test case Excel workbook in `traceability/<new-project-name>-test-cases.xlsx`.
2. Run the traceability script:
   ```bash
   npm run traceability
   ```
3. Verify that `traceability/mapping.csv`, `traceability/report.md`, and `traceability/dashboard.html` are generated with **0 orphan tests**.

---

## 3. Verification & Sign-Off Criteria

Before declaring onboarding complete:

- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `npm run typecheck` passes cleanly across all workspaces.
- [ ] Smoke suite runs and passes in under 3 minutes.
- [ ] Coverage dashboard generates without external network dependencies.
- [ ] Zero lines changed in `packages/core`.
