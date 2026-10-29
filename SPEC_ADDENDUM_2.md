# Build Spec — Addendum 2

**Supersedes:** §4 (repo structure), §8.1 (tags), §10 (reporting), §12 (traceability), §18.1 (naming) of `AUTOMATION_BUILD_SPEC.md`.
**Status:** mandatory corrections + QA Lead review feedback. Apply before any further feature work.
**Trigger:** QA Lead review of the Milestone 1–3 status dossier, plus a reconciliation of claimed traceability against the real test-case workbook.

---

## §E. Correction required: the traceability layer is validating against a synthetic workbook

### E.1 The finding

The status dossier reports "268 cases checked", "109/109 automated (100%)", "0 orphan tests". Reconciled against the **real** workbook (`CAG_Website_v2_Test_Case_Design (1).xlsx`), those numbers do not hold. The file in `traceability/cag-v2-test-cases.xlsx` is not the project's workbook.

| Claim in dossier                                                                                   | Real workbook                                                                        |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 268 test cases                                                                                     | **253** test cases across 20 sheets                                                  |
| Modules: "Navigation & UX 20 cases / 9 candidates"                                                 | `UX - UI-UX & Shared Components`: **14 cases / 3 candidates**                        |
| "Home Page 15 / 7"                                                                                 | `HP`: **10 / 5**                                                                     |
| "Reports & Accounts 35 / 16"                                                                       | `RA`: **18 / 14**                                                                    |
| "Admin CRUD 30 / 15"                                                                               | `AC`: **16 / 7**                                                                     |
| "Bilingual 10 / 5"                                                                                 | `BL`: **10 / 1**                                                                     |
| "Visual Regression / A11y / Link Crawl" listed as workbook modules with case counts                | **Not modules in the workbook at all** — these are suite types, not test-case sheets |
| "About Us — Pending Dev, 0 candidates"                                                             | `AU`: **11 cases, 6 candidates, executed, 6 PASS** — shipped, not pending            |
| "News & Media — Shipped, 100%"                                                                     | `NM`: summary says **Pending from Dev**, 0 pass / 0 fail                             |
| Defects DEF-01…DEF-04                                                                              | Real defect IDs are **D-01 … D-15**, all status OPEN, severity column empty          |
| Feature-file ranges `ST-01..ST-06`, `RA-01..RA-16`, `UX-01..UX-09`, `AA-01..AA-07`, `BL-01..BL-05` | Real prefixes/counts: **`SS`** (not ST) 12, `RA` 18, `UX` 14, `AA` 10, `BL` 10       |

**Consequence.** "0 orphans" is trivially true when the workbook was generated to match the tests. The traceability engine is currently proving nothing. The 100% coverage figure also contradicts decision **D6** (exclude modules still Pending from Dev) — 12 modules are pending, so 100% is not achievable by design.

### E.2 Required fixes

1. **Replace** `traceability/cag-v2-test-cases.xlsx` with the real workbook. Never generate or edit this file from code; it is read-only input owned by the QA team.
2. **Parse the real sheet layout.** Sheets: `Summary`, `Defect_summary`, then 20 module sheets prefixed `HP, AU, OP, RA, CT, GR, CE, NM, RL, SS, UX, BL, AA, AD, AC, AF, AL, NF, FP, API`. Columns in each module sheet, in order: Test Case ID, Module, Feature/Component, Test Scenario, Preconditions, Test Steps, Test Data, Expected Result, Priority, Severity, Test Type, Automation Candidate, Status, Actual Result, Comments.
3. **Derive shipped vs pending from the `Summary` sheet's `Allocated by` / `Status` columns** (`Pending from Dev` = pending). Do not hardcode a module list.
4. **Re-run traceability and report the true figures.** Expect coverage well below 100%, and a non-empty backlog and deferred list. That is the correct and expected outcome.
5. **Delete any test tagged with a TC ID that does not exist in the real workbook** (e.g. `@TC:ST-xx`), or re-tag it to the correct ID. Suite-type tests that have no workbook case (visual, a11y, crawl) use their own ID space — `@VIS-xx`, `@A11Y-xx`, `@CRW-xx` — and must be **excluded from the candidate-coverage denominator**, counted in a separate "framework-originated checks" section of the dashboard.
6. **Defect linkage** must use the real IDs `D-01 … D-15` from the `Defect_summary` sheet, and must report that **severity is blank on all 15** as a data-quality finding, since the exit criterion "no open Critical/High" cannot be evaluated without it.
7. The dashboard must print a **provenance line**: workbook filename, file modified date, SHA-256 of the file, row count. Any report without provenance is not evidence.

### E.3 Rule added to the spec

> A test-case workbook is **read-only input**. The framework reads it, reconciles against it, and reports discrepancies. The framework must never create, generate, synthesise, or modify it. If the workbook is missing, traceability exits non-zero with "workbook not found" — it must not fall back to a generated file.

---

## §F. Repository restructure — locators, pages, features

QA Lead feedback: _"the file structure needs to be more user-friendly and understandable — where will the locators be, where each feature sits, in a much more organised, clean manner."_

### F.1 The locator rule (new, and the headline change)

**All selectors live in `src/locators/`. Page objects and components contain zero selector strings.**

Today, locators are buried in page-object constructors. That means a `data-testid` change requires hunting through classes. Centralising them gives one obvious place to look, and makes the code a mirror of the contract we sent the dev team in `data-testid-convention.md`.

```
src/locators/
├─ testIds.ts                  # SINGLE registry of every data-testid string
├─ common.locators.ts          # header, footer, nav, breadcrumb, language toggle
├─ public/
│  ├─ home.locators.ts
│  ├─ reports.locators.ts
│  ├─ news.locators.ts
│  └─ stateSubsite.locators.ts
└─ admin/
   ├─ login.locators.ts
   ├─ dashboard.locators.ts
   └─ crudList.locators.ts
```

`testIds.ts` is a flat, frozen constant object whose keys mirror the convention document exactly:

```ts
export const TestIds = {
  common: {
    header: 'common-header',
    headerLogo: 'common-header-logo',
    nav: 'common-nav',
    navItem: (section: string) => `common-nav-${section}`,
    languageToggle: 'common-language-toggle',
    breadcrumb: 'common-breadcrumb',
    footer: 'common-footer',
  },
  publicHome: { hero: 'public-home-hero', stats: 'public-home-stats' /* ... */ },
  adminModule: {
    root: (m: string) => `admin-${m}`,
    table: (m: string) => `admin-${m}-table`,
    addNew: (m: string) => `admin-${m}-add-new`,
    row: (m: string, id: string) => `admin-${m}-row-${id}`,
    // ...
  },
} as const;
```

A `*.locators.ts` file turns those ids into locator factories, taking `Page` as an argument:

```ts
import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const reportsLocators = (page: Page) => ({
  searchInput: (): Locator => page.getByTestId(TestIds.publicReports.searchInput),
  searchSubmit: (): Locator => page.getByTestId(TestIds.publicReports.searchSubmit),
  resultCards: (): Locator => page.getByTestId(TestIds.publicReports.card),
  emptyState: (): Locator => page.getByTestId(TestIds.publicReports.empty),
});
```

A page object composes that and adds **actions only**:

```ts
export class ReportsPage {
  private readonly L;
  constructor(private readonly page: Page) {
    this.L = reportsLocators(page);
  }
  async search(term: string): Promise<void> {
    /* fill + click, awaited */
  }
  resultCards(): Locator {
    return this.L.resultCards();
  }
  async resultCount(): Promise<number> {
    return this.L.resultCards().count();
  }
}
```

**Enforced by lint (add to §18.3):** ban `getByTestId(` / `getByRole(` / `getByLabel(` / `locator(` anywhere outside `src/locators/**`. A page object that calls them directly is a build error.

**Why this is better:** one file to update when a testid changes; the registry is diffable against the dev contract; and a new engineer answering "where is the selector for X?" has exactly one place to look.

### F.2 Full project tree (replaces §4's `projects/cag-v2` block)

```
projects/cag-v2/
├─ config/                      # environment settings (no secrets)
│  ├─ env.uat.ts
│  └─ env.e2e.ts
│
├─ src/                         # OBJECT LAYER — no assertions anywhere in here
│  ├─ locators/                 # ← ALL selectors. Nothing else holds a selector.
│  │  ├─ testIds.ts
│  │  ├─ common.locators.ts
│  │  ├─ public/
│  │  └─ admin/
│  ├─ components/               # shared UI widgets, actions + state
│  │  ├─ Header.ts  Footer.ts  MainNav.ts  Breadcrumb.ts
│  │  ├─ LanguageToggle.ts  DataTable.ts  SearchFilterPanel.ts
│  ├─ pages/                    # one file per screen
│  │  ├─ public/   HomePage.ts  ReportsPage.ts  NewsPage.ts  StateSubsitePage.ts
│  │  └─ admin/    LoginPage.ts  DashboardPage.ts  CrudListPage.ts
│  ├─ flows/                    # multi-step business actions
│  │  ├─ adminLogin.ts  createRecord.ts
│  ├─ api/
│  │  ├─ endpoints.ts           # single source of API paths
│  │  ├─ schemas/               # one file per endpoint group
│  │  └─ clients/   PublicApi.ts  AdminApi.ts
│  ├─ db/
│  │  ├─ getDbClient.ts
│  │  └─ queries/   news.queries.ts  reports.queries.ts  audit.queries.ts
│  └─ data/
│     ├─ builders.ts
│     └─ fixtures/              # upload files: valid / invalid / oversized
│
├─ features/                    # ONE FILE PER WORKBOOK SHEET (§G)
│  ├─ public/
│  │  ├─ home.feature                 # sheet HP
│  │  ├─ about-us.feature             # sheet AU
│  │  ├─ our-presence.feature         # sheet OP
│  │  ├─ reports-accounts.feature     # sheet RA
│  │  ├─ contact.feature              # sheet CT
│  │  ├─ global-relations.feature     # sheet GR
│  │  ├─ careers-engagement.feature   # sheet CE
│  │  ├─ news-media.feature           # sheet NM
│  │  ├─ resources-library.feature    # sheet RL
│  │  ├─ state-subsites.feature       # sheet SS
│  │  ├─ shared-components.feature    # sheet UX
│  │  └─ bilingual.feature            # sheet BL
│  ├─ admin/
│  │  ├─ authentication.feature       # sheet AA
│  │  ├─ dashboard.feature            # sheet AD
│  │  ├─ crud.feature                 # sheet AC
│  │  ├─ file-upload.feature          # sheet AF
│  │  └─ audit-log.feature            # sheet AL
│  └─ cross-cutting/
│     └─ non-functional.feature       # sheet NF (UI-testable subset only)
│
├─ steps/                       # mirrors features/ one-for-one
│  ├─ public/   home.steps.ts  reports-accounts.steps.ts  ...
│  ├─ admin/    authentication.steps.ts  crud.steps.ts  ...
│  └─ shared/   navigation.steps.ts  language.steps.ts  probes.steps.ts
│
├─ support/
│  ├─ world.ts                  # extends @qa/core BaseWorld
│  ├─ hooks.ts                  # composes core baseHooks + probe lifecycle
│  └─ formatters/               # cucumber report config
│
├─ tests/                       # Playwright Test specs
│  ├─ api/      one spec per endpoint group + parity + boundary + security
│  ├─ visual/   @VIS-xx
│  ├─ a11y/     @A11Y-xx
│  └─ crawl/    @CRW-xx
│
├─ mocks/       server.ts  start.ts  pages/  responses/
├─ reports/     generated: cucumber-report.html, evidence/, allure-results/
├─ traceability/ cag-v2-test-cases.xlsx (READ-ONLY INPUT)  dashboard.html  mapping.csv
├─ cucumber.cjs  playwright.config.ts  globalSetup.ts  globalTeardown.ts
└─ README.md                    # 1 page: where everything lives, how to run
```

**The navigation rule for a newcomer**, which `README.md` must state in these words:

> - _Where is the selector for X?_ → `src/locators/`
> - _Where is the action that clicks X?_ → `src/pages/` or `src/components/`
> - _Where is the scenario that tests X?_ → `features/<area>/<module>.feature`, one file per workbook sheet
> - _Where is the assertion?_ → `steps/` (BDD) or `tests/` (Playwright Test). Nowhere else.
> - _Where is the API path?_ → `src/api/endpoints.ts`, and only there.
> - _Where is the URL or password?_ → `config/` and environment variables, and only there.

---

## §G. Feature-file grouping standard

QA Lead feedback: _"features should be grouped wherever possible under the same file, instead of a separate feature file for each feature."_

### G.1 Rules

1. **One `.feature` file per workbook module sheet.** Not per scenario, not per sub-feature. 20 sheets → at most 18 feature files (NF partially, FP excluded — see G.4).
2. **Group related scenarios inside the file with Gherkin `Rule:` blocks.** `Rule:` is the native grouping construct and renders as a section in the report.
3. **Use `Background:`** for setup shared by the whole file. Keep it to 1–3 steps; anything longer belongs in a flow.
4. **Use `Scenario Outline` + `Examples`** wherever the same steps repeat with different data — filters, roles, modules, viewports, languages. This is how 7 filter test cases become one outline with 7 example rows.
5. **Declarative steps only.** `When I search reports for a known keyword`, never `When I type "audit" into #search and click the button`. UI mechanics belong in page objects.
6. **Tags at the right level:** module/sheet tags on `Feature:`, behaviour tags on `Rule:`, TC and suite tags on `Scenario`.

### G.2 Canonical example

```gherkin
@module:reports @sheet:RA @area:public
Feature: Reports & Accounts — public audit report browser

  The public Reports page lets citizens search, filter, sort and page through
  audit reports. Covers workbook sheet "RA - Reports & Accounts".

  Background:
    Given the public Reports page is open in English

  Rule: Default listing, sorting and pagination

    @TC:RA-01 @smoke @priority:high @type:functional
    Scenario: [RA-01] Reports listing opens on page one with the default page size of 9 and newest-first ordering
      When the reports listing finishes loading
      Then exactly 9 report cards are displayed
      And the report cards are ordered newest first by publication date
      And the pagination summary shows a total count greater than zero
      And the page records no console errors
      And no network request on the page returns a 4xx or 5xx status

    @TC:RA-10 @smoke @priority:high @type:functional
    Scenario: [RA-10] Paging through reports returns distinct records with no duplicates across consecutive pages
      When I capture the report identifiers on page 1
      And I navigate to page 2
      Then the report identifiers on page 2 do not repeat any identifier from page 1
      And the pagination summary advances to the correct record range
      And the page records no console errors

  Rule: Search and filtering

    @TC:RA-02 @smoke @priority:high @type:functional
    Scenario: [RA-02] Keyword search returns only reports whose title or overview contains the search term
      When I search the reports listing for a keyword known to exist in a report title
      Then every returned report card contains that keyword in its title or overview
      And the result count is greater than zero and not greater than the unfiltered total
      And the active search term remains visible in the search field
      And the page records no console errors

    @TC:RA-03 @TC:RA-04 @TC:RA-05 @TC:RA-06 @TC:RA-07 @regression @priority:medium @type:functional
    Scenario Outline: [<tc>] Filtering the reports listing by <filter> returns only reports matching the selected value
      When I apply the "<filter>" filter with the value "<value>"
      Then every returned report card reports "<value>" for "<filter>"
      And the result count is not greater than the unfiltered total
      And the applied filter is shown as active in the filter panel
      And clearing the filter restores the unfiltered result count

      Examples:
        | tc    | filter      | value        |
        | RA-03 | Level       | Union        |
        | RA-04 | Sector      | Railways     |
        | RA-05 | Report Type | Compliance   |
        | RA-06 | Year        | 2024         |
        | RA-07 | State       | Karnataka    |

  Rule: Empty and error states

    @TC:RA-13 @regression @priority:medium @type:functional
    Scenario: [RA-13] Searching for a term with no matches shows a clear empty-state message and no result cards
      When I search the reports listing for a term that matches no report
      Then a no-results message is displayed to the user
      And no report cards are displayed
      And the page records no console errors
      And the page returns no 5xx response
```

### G.3 Step-definition organisation

`steps/` mirrors `features/` one-for-one. Steps used by more than one feature move to `steps/shared/`. No step definition may be longer than ~15 lines — if it is, the logic belongs in a flow or page object.

### G.4 What does not become a feature file

- **`FP - Figma Design Parity` (21 cases):** human judgement. No feature file. Covered indirectly by the visual suite (`@VIS-xx`), which detects _change_, not design correctness. Record this in the dashboard's "manual by design" section.
- **`NF - Non-Functional` (16 cases):** split. UI-testable ones (keyboard navigation, contrast, alt text, ARIA landmarks) go to `tests/a11y/`; API/security ones to `tests/api/`; only genuinely UI-journey ones land in `non-functional.feature`.
- **Any module whose Summary status is `Pending from Dev`:** tests for pending modules ARE written. They carry `@pending`, are excluded from all CI gates (smoke, regression, deploy gate), and are promoted by removing the tag when the module ships. Automating a pending module is correct, not a violation; it makes the build gap visible in parallel authoring.

---

## §H. Naming standard

QA Lead feedback: _"the name of the test cases — we want more detail, instead of just `@TC:HP-01 @TC:HP-09`."_

### H.1 Scenario names

```
Scenario: [<TC-ID>] <subject> <behaviour under test> <expected outcome>
```

Rules: 10–22 words. Starts with the bracketed workbook ID, so the report is greppable. States the **expected outcome**, not just the action. Sentence case, no trailing period. No UI mechanics, no selector names, no tooling words.

| Bad                        | Good                                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Scenario: HP-01`          | `Scenario: [HP-01] Home page hero banner renders its title, tagline and image with no layout shift`               |
| `Scenario: Login test`     | `Scenario: [AA-02] Logging in with a valid username and an incorrect password is rejected and creates no session` |
| `Scenario: Check language` | `Scenario: [BL-02] Switching to Hindi persists the language selection across subsequent page navigation`          |
| `Scenario: Upload`         | `Scenario: [AF-03] Uploading a disallowed .exe file is rejected with a clear error and stores no file`            |

A scenario covering two workbook cases keeps both tags but names the combined behaviour:
`@TC:HP-01 @TC:HP-09` → `Scenario: [HP-01, HP-09] Home page loads its hero banner and all page assets with no broken images or missing resources`

### H.2 Playwright Test titles

```
test('[API-04] GET /api/reports honours page and pageSize and returns consistent pagination metadata', ...)
test('[VIS-01] Site header matches the approved visual baseline at desktop width', ...)
test('[A11Y-02] Public home page in Hindi reports no WCAG 2.1 AA violations', ...)
```

### H.3 Step text

Declarative, present tense, no UI nouns. `Given I am signed in as an administrator`, `When I create a news record with all mandatory fields`, `Then the record appears in the module list within the configured timeout`.

### H.4 Tag taxonomy (replaces §8.1)

| Level    | Tags                                                                                                                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature  | `@module:<name>` `@sheet:<XX>` `@area:public\|admin\|cross-cutting`                                                                                                                                                                                                                 |
| Rule     | `@group:<behaviour>` (optional)                                                                                                                                                                                                                                                     |
| Scenario | `@TC:<ID>` (one or more, mandatory) · `@smoke`/`@regression` · `@priority:high\|medium\|low` · `@type:functional\|localization\|security\|data-integrity\|ui` · `@pending` (excluded from CI) · `@gigw` (maps to a GIGW checkpoint) · `@quarantine` (flaky, excluded from the gate) |

---

## §I. Assertion depth and the probe framework

QA Lead feedback: _"want to probe things on failure and pass further — much more conditions to be written."_

This is the most substantive change. Today a scenario asserts one thing and stops. Two mechanisms fix that.

### I.1 Minimum assertion depth (mechanically enforced)

Every scenario must carry **at least three** `Then`/`And` assertion steps:

1. **Primary** — the expected result from the workbook's Expected Result column, verbatim in intent.
2. **Supporting** — a related state that must also hold: count, ordering, URL, enabled state, persistence after reload, the inverse case.
3. **Health** — no console errors, no 4xx/5xx network responses on the page.

Add `scripts/validateFeatures.ts`, run in CI before the suite, failing the build when a scenario has fewer than three assertion steps, has no `@TC:` tag, has a name shorter than 8 words or missing the `[ID]` prefix, or contains a banned mechanical phrase (`click the`, `type into`, `#`, `.css`).

### I.2 The probe framework (`packages/core/src/probes/`)

Probes are passive observers attached for the whole scenario. They run on **pass and fail**, which is exactly the lead's ask — a green test that quietly logged 12 console errors and three 404s is not really green.

```
packages/core/src/probes/
├─ IProbe.ts            # start(ctx) / stop() / result(): ProbeResult
├─ ProbeCollector.ts    # registers probes, aggregates, serialises
├─ consoleProbe.ts      # console errors + warnings
├─ networkProbe.ts      # 4xx/5xx responses, failed requests, slowest call
├─ pageErrorProbe.ts    # uncaught exceptions, unhandled rejections
├─ assetProbe.ts        # broken images, failed stylesheets/scripts
├─ performanceProbe.ts  # navigation timing, LCP where available
└─ a11yProbe.ts         # optional quick axe scan, on @gigw scenarios
```

```ts
export interface ProbeResult {
  name: string;
  status: 'clean' | 'warning' | 'violation';
  summary: string; // one line for the report
  details: unknown[]; // structured rows
  severity: 'info' | 'warn' | 'error';
}
```

**Lifecycle** (in `support/hooks.ts`, composing core `baseHooks`):

- `Before` — create `ProbeCollector`, attach every probe to the page.
- `After` — stop probes, evaluate, then:
  - **On pass:** attach the probe summary table + an end-of-scenario screenshot. If any probe returns `violation`, append a `WARNINGS` block to the report. With `STRICT_PROBES=1` (nightly runs), a violation fails the scenario; by default it is a warning, so probes can be introduced without destabilising the gate.
  - **On fail:** attach the probe summary, screenshot, video, Playwright trace, the page's HTML snapshot, the full console log, the network log, and the current URL. Also attach the last API request/response pair if the failing step used `ApiClient`.

### I.3 Soft assertions (`packages/core/src/assertions/SoftAssert.ts`)

A failing first assertion currently hides the rest. `SoftAssert` collects and reports all of them:

```ts
const soft = new SoftAssert();
soft.check('result count', () => expect(count).toBe(9));
soft.check('ordering', () => expect(dates).toEqual([...dates].sort().reverse()));
soft.check('pagination', () => expect(total).toBeGreaterThan(0));
await soft.assertAll(); // throws once, listing every failure with its label
```

Use it in any step asserting three or more related conditions. For Playwright Test, `expect.soft` is already native — use that instead.

### I.4 Three-level assertion, applied as a pattern

Any scenario that writes data asserts at all three levels, each as its own `Then`/`And` step so the report shows which level broke:

```gherkin
Then the new record appears in the module list
And the public API returns the new record with matching field values
And the database contains a row for the new record with the expected status
And an audit-log entry records the CREATE action for that record
```

---

## §J. Reporting and evidence

QA Lead feedback: _"need cucumber report wherever possible with screenshots, criteria conditions — pass/fail."_

### J.1 Formatters (`cucumber.cjs`)

```js
format: [
  'progress-bar',
  'html:reports/cucumber-report.html',   // self-contained; renders attachments inline
  'json:reports/cucumber-report.json',   // consumed by the traceability script
  '@cucumber/pretty-formatter',
],
formatOptions: { snippetInterface: 'async-await' },
```

Plus `allure-cucumberjs` for the aggregated cross-runner view.

### J.2 What is attached to every scenario

| Attachment                                                          | On pass            | On fail |
| ------------------------------------------------------------------- | ------------------ | ------- |
| End-of-scenario screenshot (full page)                              | ✔                  | ✔       |
| Probe summary table (console / network / assets / perf)             | ✔                  | ✔       |
| Assertion checklist: each condition with ✔ / ✘ and the actual value | ✔                  | ✔       |
| Workbook metadata: TC ID, module, priority, type, expected result   | ✔                  | ✔       |
| Per-step screenshots                                                | on `@evidence` tag | ✔       |
| Video                                                               | ✘                  | ✔       |
| Playwright trace                                                    | ✘                  | ✔       |
| DOM/HTML snapshot                                                   | ✘                  | ✔       |
| Full console + network logs                                         | ✘                  | ✔       |
| Last API request/response pair                                      | ✘                  | ✔       |

### J.3 The assertion checklist

The single most useful thing in the report. Each `Then` step registers its condition with the collector; the `After` hook renders a table into the scenario:

```
[RA-02] Keyword search returns only matching reports            PASS
  ✔ every result contains the keyword            12/12 cards matched
  ✔ result count within bounds                   12 of 253
  ✔ search term retained in field                "audit"
  ✔ no console errors                            0
  ⚠ network                                      1 request returned 404 (/favicon.ico)
```

A reviewer can see _what was actually checked_ without reading the code — which is what makes the report usable in a status meeting.

### J.4 Evidence folder for the defect sheet

Every scenario writes `reports/evidence/<TC-ID>__<pass|fail>__<timestamp>.png`. This feeds the workbook's currently-empty `Screenshot` column directly, so defect evidence stops being a manual chore.

---

## §K. Revised gates

Replaces the Milestone 2/3 gates where they conflict.

| Gate                    | Threshold                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Traceability provenance | Dashboard prints the real workbook's filename, modified date, SHA-256 and row count (253)                               |
| Coverage                | Reported against **real** candidates on **shipped** modules only. 100% is not a valid result while modules are pending. |
| Orphans                 | 0 — every `@TC:` tag resolves to a real workbook ID                                                                     |
| Assertion depth         | 0 scenarios with fewer than 3 assertion steps (`validateFeatures.ts`)                                                   |
| Naming                  | 100% of scenarios match the §H pattern                                                                                  |
| Locator isolation       | 0 selector calls outside `src/locators/**`                                                                              |
| Feature-file count      | ≤ 1 per workbook sheet                                                                                                  |
| Evidence                | Every scenario, pass or fail, has a screenshot and probe summary in the report                                          |
| Probe cleanliness       | Console errors and 4xx/5xx counts reported per scenario; no silent passes                                               |

---

## §L. Order of work

1. **§E first.** Swap in the real workbook, re-run traceability, publish the true numbers. Everything downstream depends on honest figures, and a corrected report is a better artifact than an inflated one.
2. **§F** restructure: extract locators, move features to one-per-sheet, mirror steps.
3. **§H** rename every scenario and test.
4. **§G** regroup scenarios into `Rule:` blocks and collapse repetition into `Scenario Outline`.
5. **§I** probes, soft assertions, `validateFeatures.ts`, then raise assertion depth file by file.
6. **§J** reporting, attachments, assertion checklist, evidence folder.
7. Re-run all gates in §K and report actuals, not targets.

Note on sequencing: the `e2e` environment has been requested and the `data-testid` contract has been sent to the dev team. Everything above is buildable in `MOCK=1` before that lands — but the mock harness pages must carry **exactly** the testids in `data-testid-convention.md`, since those pages are now the executable version of that contract.
