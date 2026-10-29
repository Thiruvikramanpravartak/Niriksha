# Architecture Overview

## 1. The Four Layers

This framework follows a strict four-layer architecture with unidirectional dependencies:

1. **Config Layer** (`packages/core/src/config`, `projects/cag-v2/config`):
   - Reads environment variables, validates schemas with Zod, and enforces fail-fast error reporting before any test run or browser launch.
   - Completely environment-agnostic; zero hardcoded URLs, ports, or credentials in test code.
   - Self-contained `MOCK=1` mode bypasses live networks using local HTTP stubs and static HTML test harnesses.

2. **Core Services** (`packages/core/src`):
   - Project-agnostic utilities: `ApiClient`, `AuthProvider`, `BrowserFactory`, `DataFactory`, `CleanupRegistry`, schema/visual/a11y assertions, logger, Allure attachments.
   - Reusable across any future project via `@qa/core`.
   - **Hard Rule**: Core **never** imports from `projects/*` (strictly enforced by ESLint).

3. **Object Layer** (`projects/cag-v2/src`):
   - **Page Objects** (`src/pages`): One per screen, representing structure and user actions.
   - **Component Objects** (`src/components`): Reusable UI components across screens (e.g., `DataTable`, `SearchFilterPanel`, `Header`, `MainNav`, `Footer`).
   - **API Clients** (`src/api/clients`): Strongly typed domain clients (`PublicApi`, `AdminApi`) referencing endpoints solely from `src/api/endpoints.ts`.
   - **Hard Rule**: Page and Component objects **NEVER assert**. They return state, locators, and promises; assertions live only in `steps/` and `tests/`.

4. **Test Layer** (`projects/cag-v2/tests`, `features/`, `steps/`):
   - **Playwright Test** (`tests/api`, `visual`, `a11y`, `crawl`): Fast, parallelized, developer-friendly runner for technical checks.
   - **Cucumber BDD** (`features/`, `steps/`): High-level business journey tests in Gherkin for user-facing workflows.
   - All assertions reside exclusively in the test layer.

---

## 2. Why Two Runners?

- **Cucumber + Playwright** is optimal for high-level business journeys (`@smoke`, regression user flows) where stakeholders benefit from declarative Gherkin specifications and readable living documentation.
- **Playwright Test** is optimal for technical checks: REST API verification, visual regression testing, accessibility audits, and link crawling where Gherkin adds unnecessary boilerplate and slows execution.
- Both runners share the exact same `packages/core` utilities, Page Objects, Component Objects, and config.

---

## 3. Test Isolation & Data Management

- **No Shared State**: Every test generates its own isolated test data using `DataFactory` with unique execution IDs.
- **LIFO Teardown**: `CleanupRegistry` executes registered teardown tasks in Last-In-First-Out order, ensuring created resources are deleted even if an assertion fails midway.
- **Resilient Execution**: Tests execute in any order and in parallel without cross-test side effects.

---

## 4. Traceability & Tagging

Every automated test is mapped to a Test Case ID from the test-case workbook:

- API tests tagged `@api @TC:API-xx`
- UI smoke journeys tagged `@ui @smoke @TC:xx`
- Specialist suites tagged `@visual`, `@a11y @gigw`, `@crawl`
- Traceability mappings are reconciled via `projects/cag-v2/traceability/mapping.csv`.

---

## 5. Architectural Quality Gates (ESLint)

Five custom ESLint rules strictly enforce architectural principles:

1. `no-hardcoded-urls`: Zero `http://` or `https://` literals outside `config/` and `mocks/`.
2. `no-hardcoded-credentials`: Zero committed passwords or sensitive tokens.
3. `no-core-importing-projects`: `@qa/core` is strictly forbidden from importing anything in `projects/*`.
4. `no-assertions-in-poms`: Page Objects and Component Objects are strictly prohibited from calling `expect()`.
5. `no-arbitrary-waits`: `page.waitForTimeout()` and `setTimeout()` are banned; only deterministic condition-based waits are permitted.

---

## 6. Core Design Decisions & Engineering Rationales

### 6.1 Two Runners Strategy (Cucumber BDD + Playwright Test)

Each runner addresses a distinct layer of the testing pyramid:

- **Cucumber BDD (`features/`, `steps/`):** High-level user journeys (smoke and regression flows) where business analysts, product owners, and UAT stakeholders can read and validate declarative specifications.
- **Playwright Test (`tests/api`, `visual`, `a11y`, `crawl`):** Technical specialist checks (API parameter boundary testing, visual regression pixel comparisons, accessibility tree audits, broken link crawling) where Gherkin adds unnecessary verbosity and slows down parallel execution.
- **Unified Object Layer:** Both runners share identical `@qa/core` services, Page Objects, Component Objects, and configuration.

### 6.2 Zero Assertions in Page Objects (Runner Agnosticism)

When a Page Object contains assertions (`expect`), it tightly couples itself to a specific runner's assertion library, lifecycle, and reporting engine. By forcing Page Objects and Component Objects to return only locators, state, and promises, the exact same Page Object can be imported into Cucumber steps, Playwright test specs, or custom audit scripts without modification. Assertions reside exclusively in `steps/` and `tests/`.

### 6.3 Locator Isolation & Hierarchy (`src/locators/`)

To eliminate selector drift and fragile chains:

- All selector calls (`getByTestId`, `getByRole`, `getByLabel`, `locator`) are centralized in `src/locators/**`. Zero selector calls are permitted in page objects, components, step definitions, or test files.
- `src/locators/testIds.ts` acts as the single source of truth, mirroring the official `docs/data-testid-convention.md`.
- Selectors prioritize `data-testid` attributes, followed by semantic ARIA roles and accessible labels. Brittle CSS class chains and raw XPath are banned.

### 6.4 Test Flakiness Eradication

Flakiness is prevented through three strict architectural guardrails:

1. **Deterministic Waits Only:** Arbitrary sleep calls (`page.waitForTimeout`, `setTimeout`) are banned via AST lint rules. Waits are strictly condition-based (`toBeVisible()`, `pollUntil()`).
2. **Total Test Isolation:** No test depends on preceding state. Test data is dynamically generated with run-unique suffixes via `DataFactory`.
3. **LIFO Teardown Guarantee:** `CleanupRegistry` ensures created test entities are deleted in reverse order, even if a test fails midway.

### 6.5 Mock Engine Subsystem (`MOCK=1`)

Test code never inspects `process.env.MOCK`. Only `loadConfig.ts` and the local HTTP stub server (`mocks/server.ts`) are mock-aware. When running `MOCK=1`:

- Base URLs point to `http://127.0.0.1:4000`.
- API endpoints serve static fixtures matching production FastAPI schemas.
- Database checks resolve to `MockDbClient` (in-memory SQLite/fixture representation).
- Test code executes identical Page Object and API client interactions offline as it would in live UAT.

### 6.6 Three-Level Assertions (UI -> API -> DB) with Dependency Inversion

Any critical transaction verifies data integrity across the entire application stack:

1. **UI Layer:** Verifies visual rendering and state on the web page.
2. **API Layer:** Verifies REST endpoint payload and HTTP response status.
3. **Database Layer:** Directly queries PostgreSQL via `IDbClient` to verify persistent row state and audit log entries.
   Dependency inversion (`IDbClient` -> `PostgresClient` in live runs, `MockDbClient` in offline runs) ensures test assertions run deterministically in both local and CI environments.

### 6.7 Zero Credential Leakage & Fail-Fast Configuration

Zero passwords, API keys, or target URLs are committed to git. All configurations read from environment variables. On process startup, `loadConfig.ts` validates required variables using Zod schemas; if any mandatory secret is absent, the process aborts immediately, identifying the missing keys before any browser launches or network requests are dispatched.

### 6.8 Multi-Project Reusability & Zero Core Modifications

`projects/_template` provides a self-contained scaffolding blueprint for onboarding new applications within 48 hours. The governing rule is **Zero Core Modifications**: adding or onboarding a project must require zero edits to `@qa/core`. If a new project requires core modifications, the core abstraction has leaked and must be refactored.

### 6.9 CI Promotion Strategy & Gate Graduation

To prevent early pipeline friction from unstable environments, the CI smoke gate begins as a "Report-Only" stage using `catchError(buildResult: 'UNSTABLE')`. If live tests fail, the build is marked `UNSTABLE` rather than `FAILURE`, continuing deployment while notifying QA. Only after 10 consecutive green runs, an execution time under 3 minutes, and a flakiness rate below 2% is the gate promoted to deployment-blocking (`FAILURE`).

### 6.10 API Endpoint Path Centralization

To insulate test suites from backend URL refactoring, all API route paths reside in a single registry: `projects/cag-v2/src/api/endpoints.ts`. Zero path literals exist in test specs or page objects. Updating a path in `endpoints.ts` propagates instantly across all 34 API tests and UI step definitions.
