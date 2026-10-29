# QA Automation Framework — Build Specification

**Target repo name:** `qa-automation`
**Primary consumer of this document:** a coding agent (Antigravity / Gemini) building the repo from scratch.
**Status:** approved design. Build exactly this structure. Deviations must be raised, not silently changed.

---

## 0. How to use this document

This is a build spec, not a tutorial. It is ordered so that it can be executed top to bottom:

1. §1–§3 give the goal, the decisions already made, and the design principles every file must obey.
2. §4 gives the exact repo tree. Create it first, empty, then fill it.
3. §5–§13 specify each package and file: responsibility, public interface, rules.
4. §14–§17 give the phased build order with acceptance criteria per phase.
5. §18–§21 give conventions, CI, risks and open items.

**Hard rule for the building agent:** the real application may not be reachable while building. Everything must compile, lint, and pass structurally in `MOCK=1` mode against stubbed responses (§11). Do not block on live access. Do not invent credentials or commit any.

---

## 1. Goal

Build a test automation framework that:

1. **Protects regression.** Re-runs already-passing checks after every build, in minutes, without a human clicking.
2. **Is environment-agnostic.** One flag switches between QA environments. Zero hardcoded URLs, credentials or data anywhere in test code.
3. **Feeds a CI deploy gate.** A fast smoke slice runs automatically on each deployment to a QA environment.
4. **Is reusable.** ~60% of the code is a project-agnostic core that the next project consumes as a dependency, so a new project starts in ~2 days, not ~2 weeks.

**Non-goals.** This framework does not replace manual testing. First-pass testing of new features, design/Figma judgement, translation correctness, usability and exploratory testing remain human. Target automation coverage is ~100 of 253 test cases (~40%); the remainder is permanently manual by design.

**Project under test (first consumer):** CAG Website v2 — Next.js 16 / React 19 frontend, FastAPI / PostgreSQL backend, bilingual EN/HI public site + Admin CMS + REST API. Known deployed host: `http://13.202.245.81:3000/`. Treat this as one environment entry in config, never as a literal in code.

---

## 2. Decisions already made

These are settled. Build to them.

| #   | Decision                                                                                                                                                                       | Rationale                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Language: TypeScript** (Node 20 LTS)                                                                                                                                         | Team lead knows TS; Playwright is TS-first; one language for UI, API and data checks.                                                                                                                      |
| D2  | **Two runners, one core.** Cucumber+Playwright for UI journeys; Playwright Test for API, visual, accessibility, crawl.                                                         | Gherkin is readable for UAT alignment on user journeys. Nobody reads Gherkin for `GET /api/reports?page=2`. Visual/a11y need Playwright Test's native `toHaveScreenshot`, axe integration and parallelism. |
| D3  | **Page Objects are runner-agnostic and never assert.**                                                                                                                         | Single most important structural rule — it is what lets the same POM serve both runners (§7.3).                                                                                                            |
| D4  | **Two environments: `uat`, `e2e`.** Config is a map, so adding a third is a one-file change.                                                                                   | Confirmed scope. Avoid over-building.                                                                                                                                                                      |
| D5  | **Build order: API suite → smoke slice → regression pack → specialist suites.**                                                                                                | API is stable, fast, and unaffected by the UX redesign. Fastest path to something real running.                                                                                                            |
| D6  | **Tests for pending modules ARE written with `@pending`.** Excluded from all CI gates (smoke, regression, deploy gate); promoted by removing `@pending` when the module ships. | "Pending from Dev" means the module is still being developed and QA writes tests in parallel deliberately. Automating a pending module is correct, not a violation. Exclude from CI runs until shipped.    |
| D7  | **CI smoke is report-only for the first 2 weeks (or 10 consecutive green runs), then promoted to blocking.**                                                                   | A flaky gate that blocks deploys gets switched off permanently within a fortnight. Earn the trust first, then take the power.                                                                              |
| D8  | **Failure evidence always on:** screenshot + video + trace retained on failure.                                                                                                | A CI failure with no artefact is noise. Also auto-fills the empty `Screenshot` column in the defect sheet.                                                                                                 |
| D9  | **Visual regression baselines are generated on the CI agent, never a laptop.**                                                                                                 | Different OS/browser build = different pixels = permanent false failures.                                                                                                                                  |
| D10 | **Secrets only via environment variables.** `.env` is git-ignored; `.env.example` is committed with empty values.                                                              | Government project. A credential in git history is a reportable incident.                                                                                                                                  |

### 2.1 Endpoint paths are not yet confirmed

The API test cases name paths (`/api/home`, `/api/reports`, `/api/v1/...`) but these are unverified and the backend contract may change. Therefore:

- **All endpoint paths live in exactly one file:** `projects/cag-v2/src/api/endpoints.ts`.
- No test, page object or step may contain a URL path literal.
- When real paths arrive, one file changes and the whole suite follows.
- Until then, paths come from the test-case sheet as best-known values and the suite runs in `MOCK=1`.

---

## 3. Design principles

Every file must obey these. The building agent should treat a violation as a build error.

| Principle                     | Concrete rule in this repo                                                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single responsibility**     | One page object per screen. One component object per shared UI component. One client per protocol (HTTP, DB). No "utils dumping ground" — `utils/` files are named for one job.                                        |
| **Separation of concerns**    | Four strict layers: Config → Core services → Object layer (POM/API client) → Test layer. A layer may only import from layers below it. Tests never import a browser or HTTP library directly.                          |
| **Dependency inversion**      | Core exposes interfaces (`IApiClient`, `IDbClient`, `EnvConfig`). Projects depend on the interface, not the implementation. Lets a project swap Postgres for SQLite, or `request` for `axios`, without touching tests. |
| **Open/closed**               | Adding a new project must require **zero** edits to `packages/core`. If it does, the core abstraction is wrong.                                                                                                        |
| **DRY, but only once proven** | Something is promoted into `core` after a second project needs it, or when it is obviously generic (config loading, reporting, browser setup). Premature abstraction in core is worse than duplication in a project.   |
| **No hardcoding**             | Zero URLs, credentials, ports, user names, record IDs or waits-in-milliseconds in test files. All from config or data factory. Enforced by an ESLint rule (§18.3).                                                     |
| **Fail fast on config**       | Config is schema-validated at process start. A missing required env var aborts with a readable message naming the variable — never a mid-run `undefined` URL.                                                          |
| **Test isolation**            | Every test creates the data it needs and removes it afterwards. No test depends on another's leftovers or on manually seeded rows. Suites must pass in any order and in parallel.                                      |
| **Deterministic waits**       | No `waitForTimeout` / `sleep`. Only condition-based waits (`expect(...).toBeVisible()`, `waitForResponse`). Enforced by lint.                                                                                          |
| **Stable locators**           | Priority order: `getByTestId` → `getByRole` → `getByLabel` → text. **Never** CSS class chains, nth-child, or XPath. See `data-testid-convention.md` (separate deliverable).                                            |
| **Traceability**              | Every automated test is tagged with its workbook Test Case ID. A script reconciles workbook ↔ code (§12).                                                                                                              |
| **Evidence by default**       | Failures produce screenshot, video, trace, and for API tests the full request/response. No manual instrumentation per test.                                                                                            |

---

## 4. Repository structure

Monorepo using npm workspaces. Create this tree first.

```
qa-automation/
├─ package.json                         # workspaces root, shared scripts
├─ tsconfig.base.json                   # strict TS, path aliases
├─ .eslintrc.cjs                        # incl. custom no-hardcode rules
├─ .prettierrc
├─ .gitignore                           # .env, test-results, allure-results, node_modules
├─ .env.example                         # every var, all values empty
├─ .nvmrc                               # 20
├─ README.md                            # 1-page: install, run, add a test
├─ docs/
│  ├─ ARCHITECTURE.md                   # the 4 layers, why two runners
│  ├─ ADDING_A_PROJECT.md               # the 2-day onboarding checklist
│  ├─ WRITING_TESTS.md                  # POM rules, tagging, data factory
│  └─ CI.md                             # Jenkins setup, agent requirements
│
├─ packages/
│  └─ core/                             # @qa/core — PROJECT-AGNOSTIC. Reusable.
│     ├─ package.json
│     ├─ src/
│     │  ├─ index.ts                    # public surface; nothing else is importable
│     │  ├─ config/
│     │  │  ├─ types.ts                 # EnvConfig, SecretsConfig interfaces
│     │  │  ├─ schema.ts                # zod schema
│     │  │  └─ loadConfig.ts            # ENV -> validated config, fail fast
│     │  ├─ http/
│     │  │  ├─ IApiClient.ts
│     │  │  ├─ ApiClient.ts             # wraps Playwright APIRequestContext
│     │  │  ├─ authProvider.ts          # token acquire + cache + refresh
│     │  │  └─ responseEnvelope.ts      # ResponseWrapper / PaginatedResponse helpers
│     │  ├─ db/
│     │  │  ├─ IDbClient.ts
│     │  │  └─ PostgresClient.ts        # read-only credentials expected
│     │  ├─ browser/
│     │  │  ├─ browserFactory.ts        # launch once, context per test
│     │  │  ├─ contextOptions.ts        # viewport, locale, timezone, storageState
│     │  │  └─ storageState.ts          # save/load authenticated session
│     │  ├─ data/
│     │  │  ├─ DataFactory.ts           # faker-backed builders, unique ids
│     │  │  └─ CleanupRegistry.ts       # LIFO teardown of created records
│     │  ├─ assertions/
│     │  │  ├─ schemaAssert.ts          # zod-based response shape assertion
│     │  │  ├─ a11yAssert.ts            # axe-core wrapper, rule config
│     │  │  └─ visualAssert.ts          # masking + tolerance defaults
│     │  ├─ bdd/
│     │  │  ├─ BaseWorld.ts             # shared Cucumber World (config, browser, api)
│     │  │  └─ baseHooks.ts             # BeforeAll/Before/After/AfterAll factory
│     │  ├─ reporting/
│     │  │  ├─ attach.ts                # screenshot/trace/req-res attachment
│     │  │  └─ allure.ts                # labels, TC-ID links, severity
│     │  └─ utils/
│     │     ├─ logger.ts
│     │     ├─ waits.ts                 # condition helpers only
│     │     ├─ files.ts                 # fixture file paths, temp files
│     │     └─ spreadsheet.ts           # read the test-case workbook (for §12)
│     └─ tests/                          # core's own unit tests
│
└─ projects/
   └─ cag-v2/                            # PROJECT-SPECIFIC
      ├─ package.json
      ├─ playwright.config.ts            # runner 1: api / visual / a11y / crawl
      ├─ cucumber.cjs                    # runner 2: UI journeys
      ├─ config/
      │  ├─ env.uat.ts
      │  └─ env.e2e.ts
      ├─ src/
      │  ├─ api/
      │  │  ├─ endpoints.ts              # SINGLE SOURCE OF PATHS
      │  │  ├─ schemas/                  # zod schemas per endpoint
      │  │  └─ clients/                  # PublicApi, AdminApi (thin, typed)
      │  ├─ pages/                       # one file per screen
      │  │  ├─ public/HomePage.ts
      │  │  ├─ public/ReportsPage.ts
      │  │  ├─ public/StateSubsitePage.ts
      │  │  ├─ admin/LoginPage.ts
      │  │  ├─ admin/DashboardPage.ts
      │  │  └─ admin/CrudListPage.ts     # generic: parameterised by module
      │  ├─ components/                  # shared UI, used by many pages
      │  │  ├─ Header.ts
      │  │  ├─ Footer.ts
      │  │  ├─ MainNav.ts
      │  │  ├─ Breadcrumb.ts
      │  │  ├─ LanguageToggle.ts
      │  │  ├─ DataTable.ts
      │  │  └─ SearchFilterPanel.ts
      │  ├─ flows/                       # multi-step business actions
      │  │  ├─ adminLogin.ts
      │  │  └─ createRecord.ts
      │  └─ data/
      │     ├─ builders.ts               # record builders per module
      │     └─ fixtures/                 # upload test files (valid/invalid/oversized)
      ├─ features/                       # Gherkin — UI journeys ONLY
      │  ├─ public/home.feature
      │  ├─ public/reports-search.feature
      │  ├─ public/language-toggle.feature
      │  ├─ admin/login.feature
      │  └─ admin/crud.feature
      ├─ steps/
      │  ├─ public/*.steps.ts
      │  └─ admin/*.steps.ts
      ├─ support/
      │  ├─ world.ts                     # extends core BaseWorld
      │  └─ hooks.ts                     # composes core baseHooks
      ├─ tests/                          # Playwright Test specs
      │  ├─ api/*.spec.ts
      │  ├─ visual/*.spec.ts
      │  ├─ a11y/*.spec.ts
      │  └─ crawl/links.spec.ts
      ├─ traceability/
      │  ├─ mapping.csv                  # TC-ID -> spec/feature + tag
      │  └─ report.md                    # generated
      ├─ mocks/                          # MOCK=1 stub responses
      └─ Jenkinsfile
```

**Import rule, enforced by lint:** `projects/*` may import `@qa/core`. `packages/core` may **never** import from `projects/*`. Tests may import pages, components, flows, api clients and core — never `playwright` or `@cucumber/cucumber` primitives directly except in `support/` and config files.

---

## 5. Config layer

### 5.1 `EnvConfig` interface

```ts
export interface EnvConfig {
  name: 'uat' | 'e2e';
  baseUrl: string; // public site root
  adminUrl: string; // admin entry (may be baseUrl + /login)
  apiBaseUrl: string; // API root; may differ from baseUrl
  apiVersionPrefixes: string[]; // e.g. ['/api', '/api/v1'] for parity checks
  timeouts: { action: number; navigation: number; expect: number; api: number };
  retries: number;
  db?: { host: string; port: number; name: string; schema: string; user: string; password: string };
  features: { visualBaselines: boolean; dbChecks: boolean; a11y: boolean };
}
```

### 5.2 Rules

- `loadConfig()` reads `process.env.ENV` (default `uat`), merges the matching `config/env.<name>.ts` with secrets from environment variables, validates with zod, and **throws a readable error naming every missing variable** before any test runs.
- Config files contain **no secrets** — only URLs, timeouts, feature flags. Secrets are referenced by variable name only.
- Secret variable naming: `CAG_<ENV>_<PURPOSE>`, e.g. `CAG_UAT_ADMIN_USER`, `CAG_UAT_ADMIN_PASSWORD`, `CAG_UAT_DB_PASSWORD`.
- `MOCK=1` short-circuits: `baseUrl` points at the local stub server, secrets become dummy values, `features.dbChecks=false`.

### 5.3 Invocation contract

```bash
ENV=uat  npm run test:api
ENV=e2e  npm run test:smoke
ENV=uat  npm run test:regression
MOCK=1   npm run test:all          # no live environment needed
```

---

## 6. Core services

### 6.1 `ApiClient`

- Wraps Playwright's `APIRequestContext`. Constructor takes `{ baseUrl, defaultHeaders, timeout, logger }`.
- Methods: `get/post/put/patch/delete(path, { params, body, headers, token })` returning a typed `ApiResponse<T>` with `status`, `headers`, `body`, `durationMs`, and the raw request for attachment.
- **Always** records request and response (method, URL, status, body, duration) into the active report on failure.
- Never throws on non-2xx — the test asserts the status. Throws only on transport failure.
- Supports `withToken(token)` returning a scoped clone, so admin and anonymous calls can coexist in one test.

### 6.2 `authProvider`

- `getAdminToken(env)` performs the login API call once per worker, caches the token in memory keyed by `env+user`, and refreshes when within 60s of expiry (JWT is documented as 8h).
- Exposes `getStorageState(env)` for the browser: logs in via API, writes the authenticated `storageState` to a temp file, reused by all UI tests. **UI tests must not log in through the login form** except the login tests themselves.

### 6.3 `browserFactory`

- Launches the browser **once per worker** (`BeforeAll`), creates a **fresh context per test/scenario** (`Before`), closes context after, closes browser at `AfterAll`.
- Browser chosen by `BROWSER` env var: `chromium` (default) | `firefox` | `webkit`.
- Default context options: viewport from a named preset (`desktop 1920×1080`, `laptop 1366×768`, `tablet 768×1024`, `mobile 375×667`), `locale`, `timezoneId: 'Asia/Kolkata'`, `ignoreHTTPSErrors` only when config says so.

### 6.4 `DataFactory` + `CleanupRegistry`

- All generated records carry a run-unique suffix: `AUTO-<runId>-<n>` where `runId` is short and timestamped. Makes orphans identifiable and greppable.
- Builders return plain typed objects; they do not call the API. A `flow` or test does the creating.
- `CleanupRegistry.register(() => adminApi.delete(module, id))` — teardown runs LIFO, never fails the test on cleanup error but logs loudly.

### 6.5 `assertions`

- `assertSchema(body, zodSchema)` — produces a readable diff of missing/extra/mistyped fields, not a raw zod dump.
- `assertEnvelope(body)` — validates the documented `ResponseWrapper` / `PaginatedResponse` shape; pagination metadata consistency (`page`, `pageSize`, `total`, item count).
- `assertNoA11yViolations(page, { include, exclude, rules })` — axe-core via `@axe-core/playwright`; attaches a readable violation table.
- `assertVisual(locator, name, { maxDiffPixelRatio, mask })` — thin wrapper around `toHaveScreenshot` with shared defaults and standard masks for dynamic regions (dates, counts, user name).

---

## 7. Object layer

### 7.1 Component objects

Shared UI that appears across pages gets a component object, not duplicated locators. Required for this project: `Header`, `Footer`, `MainNav`, `Breadcrumb`, `LanguageToggle`, `DataTable`, `SearchFilterPanel`.

`DataTable` and `SearchFilterPanel` matter most: the admin CMS repeats one list/CRUD pattern across ~12 modules (search & filter panel, sort, rows-per-page, export, add-new, table with Language and Status columns, row edit/delete, pagination footer). Model that pattern **once**, parameterised by module, and ~12 modules become configuration rather than code.

```ts
export class DataTable {
  constructor(private readonly root: Locator) {}
  rows(): Locator;
  rowCount(): Promise<number>;
  cell(rowIndex: number, column: string): Locator;
  headers(): Promise<string[]>;
  paginationSummary(): Promise<{ from: number; to: number; total: number }>;
  gotoPage(n: number): Promise<void>;
  setRowsPerPage(n: number): Promise<void>;
  rowByText(text: string): Locator;
  editRow(text: string): Promise<void>;
  deleteRow(text: string): Promise<void>;
}
```

### 7.2 Page objects

- One per screen. Constructor takes `page` (and config if it needs URLs). Composes component objects.
- Exposes: `goto()`, named locators, and **action** methods (`search(term)`, `applyFilter(name, value)`).
- `CrudListPage` is generic: `new CrudListPage(page, { module: 'news' })` serves every admin module following the standard pattern.

### 7.3 THE rule: page objects never assert

```ts
// WRONG — couples the POM to a test runner, unusable from the other runner
async expectTitle() { await expect(this.title).toHaveText('Reports'); }

// RIGHT — returns state; the step or spec asserts
async getTitle(): Promise<string> { return (await this.title.textContent()) ?? ''; }
titleLocator(): Locator { return this.title; }
```

Assertions live in `steps/` (Cucumber) and `tests/` (Playwright Test). This is what makes the POM layer serve both runners and survive a runner change. No exceptions.

### 7.4 API clients

`PublicApi` and `AdminApi` are thin typed wrappers over `ApiClient`, with one method per endpoint, paths taken **only** from `endpoints.ts`:

```ts
export const endpoints = {
  public: {
    home: '/home',
    news: '/news',
    reports: '/reports',
    reportById: (id: string) => `/reports/${id}` /* ... */,
  },
  admin: {
    login: '/admin/auth/login',
    crud: (table: string) => `/admin/${table}`,
    upload: '/admin/upload',
    options: '/admin/options',
  },
  health: '/health',
} as const;
```

The version prefix (`/api` vs `/api/v1`) is applied by the client from config, enabling the dual-mount parity check as a loop rather than duplicated tests.

---

## 8. Test layer — suites and tags

### 8.1 Tag taxonomy

Applied to both Gherkin tags and Playwright Test titles/annotations:

| Tag                                     | Meaning                                             |
| --------------------------------------- | --------------------------------------------------- |
| `@smoke`                                | In the CI deploy gate. Must be fast and rock-solid. |
| `@regression`                           | Full pack, runs nightly / pre-release.              |
| `@api` `@ui` `@visual` `@a11y` `@crawl` | Suite type.                                         |
| `@module:reports`                       | Workbook module, for reporting slices.              |
| `@TC:RA-01`                             | **Workbook Test Case ID. Mandatory on every test.** |
| `@shipped` / `@pending`                 | Gate: `@pending` tests are excluded from CI runs.   |

Selection:

```bash
npx cucumber-js --tags "@smoke and not @pending"
npx playwright test --grep "@api"
```

### 8.2 Suite definitions

| Suite          | Runner                    | Content                                                              | Target runtime |
| -------------- | ------------------------- | -------------------------------------------------------------------- | -------------- |
| **api**        | Playwright Test           | All 20 API test cases + dual-mount parity + negative/boundary params | < 60s          |
| **smoke**      | Cucumber (UI) + a few api | ~15 journeys (§14.2)                                                 | < 3 min        |
| **regression** | both                      | Automation-candidate `Y` cases on shipped modules                    | < 20 min       |
| **visual**     | Playwright Test           | Header, Footer, MainNav, Breadcrumb, home sections                   | < 3 min        |
| **a11y**       | Playwright Test           | axe scan on ~10 key templates, EN and HI                             | < 3 min        |
| **crawl**      | Playwright Test           | Site-wide broken links / missing assets / "under construction"       | < 10 min       |

`visual`, `a11y` and `crawl` double as GIGW 3.0 conformity evidence — tag them `@gigw` where they map to a checkpoint so the same run serves both purposes.

### 8.3 What must NOT be automated

Do not generate tests for: Figma design parity judgement (`FP-*` — screenshot comparison detects _change_, not _design correctness_), Hindi translation correctness, usability, exploratory charters, captcha/OTP flows, penetration testing, or any module tagged `@pending`.

---

## 9. Parallelism and isolation

- Playwright Test: `fullyParallel: true`, `workers: 50%` locally, `workers: 2` on CI initially (raise once stable).
- Cucumber: `parallel: 2` initially. Each scenario gets its own browser context.
- Any test that cannot run in parallel (e.g. a global setting change) must be explicitly tagged `@serial` and justified in a code comment. Treat `@serial` as a smell to be removed.

---

## 10. Reporting

- **Playwright Test:** built-in HTML reporter + `allure-playwright`.
- **Cucumber:** `html` formatter + `allure-cucumberjs`.
- Allure is the single aggregated view; CI publishes it.
- Every test attaches, on failure: screenshot, video, trace, console log, and for API tests the request/response pair.
- Allure labels mirror the tags, so the report can be filtered by module or by TC ID — which is what makes the report usable in a status meeting.

```ts
// playwright.config.ts — required bits
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure',
  actionTimeout: cfg.timeouts.action,
  navigationTimeout: cfg.timeouts.navigation,
},
expect: { timeout: cfg.timeouts.expect, toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
retries: process.env.CI ? 1 : 0,   // 1 retry only, to surface flakes rather than hide them
reporter: [['html'], ['allure-playwright'], ['list']],
```

Retries are capped at 1 deliberately. More retries hide flakiness, and a suite nobody trusts is worse than no suite.

---

## 11. MOCK mode (build without the live environment)

Required so the framework can be built and verified before URLs and credentials arrive.

- `MOCK=1` starts a local stub HTTP server (`mocks/server.ts`, plain Node `http` or `express`) serving canned JSON from `mocks/responses/*.json`, keyed by endpoint.
- For UI tests, use Playwright `page.route()` to fulfil API calls from the same canned files, and serve a minimal static HTML harness for page structure where needed.
- Every mock response file must be derived from the **documented** contract (`ResponseWrapper`, `PaginatedResponse`), not invented freely — it is the contract placeholder until the real API is confirmed.
- `MOCK=1 npm run test:all` must pass in CI on every commit. This is the build's own regression test.

---

## 12. Traceability tooling

Build a script, `npm run traceability`, that:

1. Reads the test-case workbook (`core/utils/spreadsheet.ts`, via `exceljs`).
2. Extracts every row's Test Case ID, module, priority, `Automation Candidate`, Status, Actual Result.
3. Scans `features/` and `tests/` for `@TC:<id>` tags.
4. Writes `traceability/mapping.csv` and `traceability/report.md` containing:
   - total cases, candidates (`Y`), automated, % of candidates automated
   - per-module breakdown
   - **candidates not yet automated** (the backlog)
   - **automated tests with no matching workbook ID** (orphans — a bug)
   - cases marked `Y` but belonging to `@pending` modules (deferred, with reason)
5. Fails with a non-zero exit code on orphans.

This script is the single most valuable reporting artefact for the lead and manager: it answers "how much is automated, and what's left" from source data rather than opinion, on demand.

---

## 13. Database checks (phase 3, optional per environment)

- `IDbClient` with a Postgres implementation; **read-only credentials only**.
- Used for three-level assertion on CRUD: UI shows it → API returns it → DB row exists with correct values. This is the check a manual tester cannot do quickly, and it is where the real defects in this project have historically lived (admin shows a record, public site does not).
- All SQL lives in `src/db/queries/*.ts`, never inline in tests.
- Gated by `features.dbChecks`; suite must pass with it disabled.

---

## 14. Phased build order

Each phase ends with something runnable. Do not start a phase before the previous one's acceptance criteria pass.

### Phase 0 — Scaffold (acceptance: `MOCK=1 npm run test:all` green, CI runs it)

Deliverables: repo tree, workspaces, tsconfig, ESLint+Prettier, `.env.example`, `loadConfig` with zod validation and fail-fast, `ApiClient`, `browserFactory`, logger, mock server, one trivial API test and one trivial UI scenario, Allure wired, `Jenkinsfile` skeleton running mock mode, `README.md`.

**Acceptance criteria**

- `npm run lint`, `npm run typecheck`, `MOCK=1 npm run test:all` all pass.
- Missing a required env var produces an error naming the variable and exits before any browser launches.
- A deliberately failing test produces screenshot + video + trace in the report.

### Phase 1 — API suite (acceptance: 20 API cases automated, < 60s)

- `endpoints.ts`, zod schemas, `PublicApi`, `AdminApi`, `authProvider`.
- One spec per endpoint group; `API-01`…`API-20` tagged with their TC IDs.
- Dual-mount parity check: for each endpoint, request both version prefixes and assert equivalent bodies.
- Negative/boundary params for list endpoints: `page=0`, `page=-1`, `page=99999`, `pageSize=0`, `pageSize=100000`, non-numeric, very long search string, Hindi/Unicode search string, SQL-ish and XSS-ish strings (assert sanitised/rejected, not executed).
- Security-adjacent API checks that are safe and non-intrusive: unauthenticated access to `/admin/*` must return 401/403 (`NF-01`); `/docs` and `/openapi.json` reachability recorded as a finding, not an exploit.

**Acceptance:** suite green against mocks, and runnable unchanged against a real environment by changing `ENV`.

> **Escalation to raise separately:** test case `AA-02` (login with an incorrect password) is recorded as failed, with a note that the system does not reject the attempt. If that reproduces, it is a Critical / P1 authentication-bypass defect on a government website, not a Medium. Encode it as an automated test (`@TC:AA-02`, asserting rejection + no session + no token issued) so the answer is permanent and regression-proof, and flag the finding to the lead with the captured request/response the same day it is confirmed.

### Phase 2 — Smoke slice (acceptance: < 3 min, 10 consecutive green runs on CI)

The ~15 journeys:

| #   | Journey                                                 | Workbook ref |
| --- | ------------------------------------------------------- | ------------ |
| 1   | Home page loads: hero, stats, no broken assets          | HP-01, HP-09 |
| 2   | Home stats match `/api/home` payload                    | HP-02        |
| 3   | Main navigation: 5 items, correct order, flyouts open   | UX-03        |
| 4   | Header + Footer present and populated on a public page  | UX-01, UX-05 |
| 5   | Breadcrumb correct on a nested page                     | UX-07        |
| 6   | Language toggle present on sampled pages                | BL-01        |
| 7   | Language selection persists across navigation           | BL-02        |
| 8   | Reports list: default page size and sort                | RA-01        |
| 9   | Reports keyword search returns only matches             | RA-02        |
| 10  | Reports combined filters apply AND logic                | RA-08        |
| 11  | Reports pagination: no duplicates across pages          | RA-10        |
| 12  | Admin login with valid credentials succeeds             | AA-01        |
| 13  | Admin login with wrong password is rejected             | AA-02        |
| 14  | Unauthenticated admin route redirects to login          | AA-06        |
| 15  | Admin create record → appears in list → visible via API | AC-01, AC-08 |

### Phase 3 — Regression pack (acceptance: ≥ 80% of eligible candidates automated; traceability report clean)

Expand to the `Automation Candidate = Y` cases on shipped modules. Priority order: Reports & Accounts → Admin CRUD → Admin Auth → Home Page → News & Media → Audit Log → File Upload → About Us → Global Relations → Dashboard. Add DB-level assertions (§13) for CRUD and audit-log cases.

**Tagging corrections to apply** (raise with the lead, then implement):

- **Bilingual:** currently only 1 case marked `Y`. The toggle's presence, persistence, reload behaviour and deep-link behaviour are mechanically checkable and should be `Y`. What stays manual is translation _quality_.
- **Figma Design Parity:** currently 4 marked `Y`. Design parity requires human judgement; move these to `N` and cover the drift risk with the visual suite instead.

### Phase 4 — Specialist suites

Visual baselines (generated on the CI agent), axe accessibility scan in EN and HI, site-wide link/asset crawl. Tag `@gigw` where each maps to a GIGW checkpoint.

### Phase 5 — Steady state

Every closed defect gains an automated test before it is marked Closed, so a fixed bug can never silently return. This is the mechanism that makes the suite appreciate in value rather than rot.

---

## 15. CI — Jenkins (on-premise)

### 15.1 Ownership

| Thing                                                                                                            | Owner                           |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Jenkins server, agents, plugins, uptime                                                                          | DevOps                          |
| An agent that can reach the QA environments, with Node 20 + Playwright browsers (or the Playwright Docker image) | DevOps, on QA's written request |
| `Jenkinsfile` (lives in this repo)                                                                               | QA                              |
| Test code, its stability and its results                                                                         | QA                              |
| Whether a red smoke run blocks the deploy                                                                        | Lead + DevOps jointly           |

**Principle: DevOps owns the machine, QA owns the job.** Keeping the `Jenkinsfile` in this repo means pipeline changes do not need a ticket.

### 15.2 Agent requirements (the request to send DevOps)

- Linux agent, label `qa-playwright`.
- Node 20 LTS, or run the job inside `mcr.microsoft.com/playwright:v1.xx-jammy` (preferred — removes browser-dependency drift and makes visual baselines stable).
- Network reachability to the `uat` and `e2e` application and API hosts, and to the Postgres host if DB checks are enabled.
- Credentials injected via Jenkins Credentials Store as environment variables, never in the job config or repo.
- Allure Jenkins plugin, or HTML Publisher as fallback.
- Workspace retention for `test-results/`, `allure-results/`, `playwright-report/`.

### 15.3 Pipeline

Parameters: `ENV` (uat|e2e), `SUITE` (smoke|api|regression|visual|a11y|crawl|all), `BROWSER`.

Stages: `Checkout` → `Install` (npm ci, cached) → `Lint + Typecheck` → `Mock suite` → `Live suite (SUITE, ENV)` → `Publish Allure` → `Archive artefacts` → `Notify`.

Triggers:

- On deployment to a QA environment: `SUITE=smoke`.
- Nightly: `SUITE=regression` + `visual` + `a11y` + `crawl`.
- On every push to the test repo: lint, typecheck, mock suite only.

**Gate policy (D7):** for the first 2 weeks, wrap the live stage so a failure marks the build **UNSTABLE** and notifies, without failing the deploy. After 10 consecutive green smoke runs, promote to **FAILURE** so it blocks. Record the promotion date in `docs/CI.md`.

---

## 16. Reusability — onboarding the next project

Target: a new project runs its first automated test within 2 days. `docs/ADDING_A_PROJECT.md` must contain exactly this checklist:

1. `npx degit <repo>/projects/_template projects/<new>` (create this `_template` folder in Phase 3).
2. Fill `config/env.*.ts` and add secret variable names to `.env.example`.
3. Write 3–5 page objects for the critical screens.
4. Fill `src/api/endpoints.ts`.
5. Write the smoke slice (aim 10–15 journeys).
6. Copy the `Jenkinsfile`, change the label and credential IDs.
7. Run `npm run traceability` against the new project's workbook.

**Core must not change during this.** If it does, that is a defect in the core abstraction — fix it in core, not in the project.

---

## 17. Quality gates for the framework itself

| Gate                                  | Threshold                                                                                                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flaky rate                            | < 2% of runs. Any test failing intermittently twice is tagged `@quarantine`, excluded from the gate, and fixed within one sprint — never left to be re-run. |
| Smoke runtime                         | < 3 min                                                                                                                                                     |
| Regression runtime                    | < 20 min                                                                                                                                                    |
| Orphan tests (no workbook TC ID)      | 0                                                                                                                                                           |
| Hardcoded URL/credential in test code | 0, lint-enforced                                                                                                                                            |
| `waitForTimeout` occurrences          | 0, lint-enforced                                                                                                                                            |

---

## 18. Conventions

### 18.1 Naming

- Files: `camelCase.ts` for modules, `PascalCase.ts` for classes, `kebab-case.feature`, `*.spec.ts` for Playwright Test, `*.steps.ts` for step definitions.
- Test titles: `[TC:RA-02] Reports keyword search returns only matching reports`.
- Gherkin steps must be **declarative** — describe intent, not UI mechanics. `When I log in as an administrator`, never `When I type "admin" in the username field and click Login`. UI detail belongs in page objects. A feature file containing CSS selectors or field-by-field typing is a review rejection.

### 18.2 TypeScript

`strict: true`, `noUncheckedIndexedAccess: true`, no `any` (use `unknown` + a schema parse). Path aliases: `@qa/core`, `@pages/*`, `@components/*`, `@api/*`, `@data/*`.

### 18.3 Lint rules to add (custom, `no-restricted-syntax`)

- Ban `http://` / `https://` string literals outside `config/` and `mocks/`.
- Ban `waitForTimeout`, `setTimeout` in tests/pages.
- Ban `page.locator('.`…`')` and `xpath=` — force `getByTestId` / `getByRole` / `getByLabel`.
- Ban `expect(` inside `src/pages/**` and `src/components/**` (enforces §7.3).
- Ban imports from `projects/*` inside `packages/core/**`.

### 18.4 Git

Private repo, QA-team owned. Conventional commits. PR review by at least one other QA engineer — test code is code. Pre-commit hook (husky + lint-staged): lint, typecheck, format.

---

## 19. Dependencies

`@playwright/test`, `playwright`, `@cucumber/cucumber`, `tsx`, `typescript`, `zod`, `@faker-js/faker`, `dotenv`, `exceljs`, `@axe-core/playwright`, `allure-playwright`, `allure-cucumberjs`, `pg` (phase 3), `eslint` + `@typescript-eslint/*`, `prettier`, `husky`, `lint-staged`.

Pin exact versions. Commit `package-lock.json`. Do not add a dependency that duplicates something Playwright already does (no axios, no chai, no separate screenshot-diff library).

---

## 20. Risks

| Risk                                                                  | Mitigation                                                                                                                        |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 12 modules still "Pending from Dev" — automating them means rewriting | `@pending` tag; excluded from CI; regression pack locked to shipped + passing                                                     |
| Endpoint paths unconfirmed                                            | All paths in `endpoints.ts`; mock mode; one-file change when confirmed                                                            |
| No stable locators yet                                                | `data-testid` convention requested from dev team (separate deliverable); `getByRole` fallback meanwhile                           |
| Visual baselines unstable across machines                             | Baselines generated only on the CI agent / Docker image (D9)                                                                      |
| Flaky suite erodes trust                                              | Report-only gate first; 1 retry max; `@quarantine` process; flaky-rate gate                                                       |
| Single-person dependency                                              | Monorepo, PR review, three docs in `docs/`, template project                                                                      |
| Credentials leaking into git                                          | `.env` ignored; `.env.example` empty; secrets from Jenkins store; lint ban on URL literals; add a secret-scanning pre-commit hook |
| Automating what should stay manual                                    | §8.3 explicit exclusion list; tagging corrections in Phase 3                                                                      |

---

## 21. Open items (need answers, do not block the build)

1. **Regression pack confirmation** — proposed in §14.3; needs lead sign-off.
2. **Real endpoint paths and the API contract** — until then, `endpoints.ts` + mock mode.
3. **Environment URLs and test credentials** for `uat` and `e2e`.
4. **Jenkins agent provisioning** — the request in §15.2.
5. **`AA-02` confirmation** — potential authentication bypass; escalate the moment it reproduces.
6. **Whether DB read-only credentials can be issued** for phase-3 three-level assertions.
7. **Figma oracle for the public site** — the design reference described so far covers admin screens; this affects `FP-*` scope but not this framework.

---

## Appendix A — Current workbook state (baseline, as read)

253 test cases across 20 module sheets. 109 marked `Automation Candidate = Y`, 50 of those also High priority; all 20 API cases are `Y`. Execution: 50 Executed, 197 Not Executed. Results recorded: 34 pass, 22 fail, 2 partial. 15 open defects, all `OPEN`, severity column empty, priority values inconsistently cased.

**Workbook hygiene fixes to apply in parallel** (not framework work, but they distort every report):

- Result values are entered as `Pass`/`PASS`/`Fail`/`FAIL`/`Failed` inconsistently. The summary counts `"Failed"`, so `FAIL` rows are silently excluded — failures are currently under-reported. Add data-validation dropdowns and one canonical set: `Pass` / `Fail` / `Partial Pass` / `Blocked`.
- Some summary formulas use fixed ranges shorter than the sheet (`About Us` counts 10 of 11 rows; `Resources & Library` counts 8 of 14), and three modules have hardcoded counts. Use whole-column or table ranges.
- Add columns: `Suite`, `Build/Version`, `Environment`, `Executed By`, `Execution Date`, `Cycle 1 Result`, `Cycle 2 Result`, `Defect ID`, `Blocked Reason`, `Automation Status`, `GIGW Ref`.
- Severity belongs to defects, priority to test cases. The defect sheet's Severity column is empty on all 15 — populate it, because the exit criteria ("no open Critical/High") cannot be evaluated without it.
