# Build Spec — Addendum 1

Supersedes §14 (phases) of `AUTOMATION_BUILD_SPEC.md` and adds §22 (dashboard). Everything else in the spec stands unchanged.

---

## A. Clarification: what `MOCK=1` is and why it exists

**Problem.** At build time the team does not yet have: confirmed API endpoint paths, environment URLs, or test credentials. Without these, no test can execute, so the framework would be delivered having never run.

**Solution.** `MOCK=1` is a self-contained fake of the application under test, running locally.

| Concern           | Real run (`ENV=uat`)      | Mock run (`MOCK=1`)                                                                          |
| ----------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| API calls         | Real FastAPI backend      | Local stub server, canned JSON from `mocks/responses/`                                       |
| Browser API calls | Pass through to backend   | Intercepted by `page.route()`, fulfilled from the same canned JSON                           |
| Pages             | Real Next.js app          | Minimal static HTML harness in `mocks/pages/` carrying the required `data-testid` attributes |
| Credentials       | Real, from env vars       | Dummy values                                                                                 |
| DB checks         | Real Postgres (read-only) | Disabled via `features.dbChecks=false`                                                       |

**What it proves.** That config loading, fail-fast validation, auth token flow, page objects, step wiring, assertions, reporting, failure artefacts and the CI pipeline all work. It does **not** prove anything about the real application — it validates the _framework_, not the product.

**Rules.**

1. `MOCK=1 npm run test:all` must pass on every commit, in CI. This is the framework's own regression test.
2. Mock responses must match the documented contract shapes (`ResponseWrapper`, `PaginatedResponse`) — they are the contract placeholder until real responses are captured.
3. Once a real environment is reachable, capture real responses and replace the canned files with them (keep them sanitised — no production data).
4. No test may branch on `MOCK`. If a test needs to know whether it is mocked, the abstraction is wrong. Only config and the stub server are mock-aware.

---

## B. Revised build plan — three milestones

Replaces the five phases. Each milestone is independently demonstrable, and each ends with a hard gate. Do not start a milestone before the previous gate passes.

### Milestone 1 — Working skeleton + API suite

_(was Phase 0 + Phase 1)_

**Build**

1. Repo tree, npm workspaces, strict TS, ESLint (including the custom rules in §18.3), Prettier, husky.
2. `packages/core`: config loader with zod + fail-fast, `ApiClient`, `authProvider`, `browserFactory`, `DataFactory`, `CleanupRegistry`, assertions, `BaseWorld`, `baseHooks`, logger, reporting attachments.
3. Mock server + canned responses + static page harness.
4. `projects/cag-v2`: `endpoints.ts`, zod schemas, `PublicApi`, `AdminApi`, config for `uat` and `e2e`.
5. All 20 API specs, tagged `@api @TC:API-xx`, plus:
   - dual-mount parity (`/api` vs `/api/v1`) as a parameterised loop
   - boundary/negative params: `page=0|-1|99999`, `pageSize=0|100000`, non-numeric, long string, Unicode/Hindi string, SQL-ish and XSS-ish payloads (assert rejected or sanitised, never executed)
   - `NF-01`: unauthenticated `/admin/*` returns 401/403
   - record whether `/docs` and `/openapi.json` are reachable (report as a finding; do not exploit)
6. Allure wired for both runners. `Jenkinsfile` running lint → typecheck → mock suite.
7. `README.md`, `docs/ARCHITECTURE.md`.

**Gate**

- `npm run lint`, `npm run typecheck`, `MOCK=1 npm run test:all` green.
- Removing a required env var aborts with an error naming that variable, before any browser launches.
- A deliberately failing test yields screenshot + video + trace + request/response in the Allure report.
- API suite completes in under 60 seconds.
- Zero hardcoded URLs or credentials (lint-enforced).

### Milestone 2 — Smoke slice + CI + dashboard

_(was Phase 2 + the dashboard + CI promotion)_

**Build**

1. Page objects: `HomePage`, `ReportsPage`, `LoginPage`, `DashboardPage`, `CrudListPage` (generic, module-parameterised).
2. Component objects: `Header`, `Footer`, `MainNav`, `Breadcrumb`, `LanguageToggle`, `DataTable`, `SearchFilterPanel`.
3. Flows: `adminLogin` (via API + `storageState`), `createRecord`.
4. The 15 smoke journeys listed in the main spec, as Gherkin features + steps, tagged `@smoke @TC:xx`.
5. `npm run traceability` script, and the dashboard in §22 below.
6. `Jenkinsfile` complete: parameters, live stage, Allure publish, artefact archive, notification. Report-only gate.
7. `docs/CI.md`, `docs/WRITING_TESTS.md`.

**Gate**

- Smoke suite under 3 minutes.
- 10 consecutive green smoke runs on CI against a real environment → promote the gate from UNSTABLE to FAILURE, and record the promotion date in `docs/CI.md`.
- Dashboard generated as a CI artefact on every run.
- Flaky rate under 2%.

### Milestone 3 — Regression pack + specialist suites + reusability

_(was Phase 3 + Phase 4 + Phase 5 + §16)_

**Build**

1. Expand to `Automation Candidate = Y` cases on shipped, passing modules. Priority order: Reports & Accounts → Admin CRUD → Admin Auth → Home Page → News & Media → Audit Log → File Upload → About Us → Global Relations → Dashboard.
2. `IDbClient` + Postgres implementation; three-level assertions (UI → API → DB) on CRUD and audit-log cases, gated by `features.dbChecks`.
3. Visual suite: baselines for `Header`, `Footer`, `MainNav`, `Breadcrumb` and home sections, generated on the CI agent only.
4. Accessibility suite: axe scan on ~10 key templates, in EN and HI.
5. Crawl suite: site-wide broken links, missing assets, "under construction" pages.
6. Tag `@gigw` on every test that maps to a GIGW 3.0 checkpoint.
7. `projects/_template` + `docs/ADDING_A_PROJECT.md`.
8. Adopt the rule: every closed defect gains an automated test before it is marked Closed.

**Gate**

- ≥ 80% of eligible automation candidates automated.
- Traceability report clean: zero orphan tests.
- Regression suite under 20 minutes.
- A second project can be scaffolded from `_template` with **zero** changes to `packages/core`. If core needs changing, the abstraction is wrong — fix core, not the project.

---

## C. §22 — Coverage dashboard

### C.1 What it is, and what it deliberately is not

**Is:** a single self-contained HTML file, generated by `npm run traceability`, answering one question — _what is covered, what is automated, and what is the current state?_ — from source data rather than opinion.

**Is not:** a web application. No server, no backend, no database, no auth, no npm start. It is a build artefact, like a report. Open it from disk, or let Jenkins publish it.

**Why not build a real UI:** Jenkins already provides run triggering and history; Allure already provides test results, traces and trends. Rebuilding either costs weeks and earns nothing. The coverage view is the only thing neither tool can give, because only we hold the mapping between the test-case workbook and the automated suite.

### C.2 Inputs

| Input                                                                                  | Source                                                                |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Test cases: ID, module, feature, priority, automation candidate, status, actual result | The test-case workbook (`exceljs` via `core/utils/spreadsheet.ts`)    |
| Automated tests: TC ID, suite tags, file path                                          | Static scan of `features/**` and `tests/**` for `@TC:` and suite tags |
| Last run results                                                                       | `allure-results/*.json` or Playwright's `results.json`, if present    |
| Defects: ID, module, severity, status                                                  | The workbook's `Defect_summary` sheet                                 |

All inputs are optional except the workbook — the dashboard must degrade gracefully and state plainly which inputs were missing rather than rendering empty panels.

### C.3 Build as a single HTML file

- Generated to `traceability/dashboard.html`.
- Data embedded as a JSON literal in a `<script>` tag — no `fetch`, so it works from `file://`.
- Vanilla JS, inline CSS, no build step, no CDN dependency (CI agents may be offline).
- Target under 500 KB.
- Must render correctly at laptop width and on a phone (someone will open it from a status email).
- Light and dark mode via `prefers-color-scheme`, with an explicit `body` background in both.
- Every number must be traceable to a row: clicking a figure filters the table beneath it. A dashboard whose numbers cannot be drilled into is a dashboard nobody trusts.

### C.4 Content

**Header strip** — generated timestamp, environment, build/commit, suite(s) included, and a visible warning if any input was missing.

**Row of stat tiles**

- Total test cases
- Automation candidates (`Y`)
- Automated (tests found with a matching `@TC:`)
- Automation coverage % (automated ÷ candidates)
- Executed / Not executed
- Pass / Fail / Partial / Blocked
- Open defects, and open defects at Critical or High severity

**Per-module table** — one row per module: total, candidates, automated, coverage %, executed, pass, fail, blocked, open defects, shipped/pending flag. Sortable by any column. Colour by coverage band, with the number always shown as text too (never colour alone — accessibility, and it is also a GIGW requirement).

**Three worklists** — these are the point of the whole dashboard:

1. **Automation backlog** — cases marked `Y`, module shipped, not yet automated. Ordered by priority. This is the build queue.
2. **Orphans** — automated tests with no matching workbook ID. Each one is a defect in traceability; the script exits non-zero if any exist.
3. **Deferred** — cases marked `Y` on `@pending` modules, with the reason. This is what makes "QA is behind" visibly a build-gap issue instead.

**Suite summary** — per suite (api / smoke / regression / visual / a11y / crawl): test count, last runtime, pass rate, and flaky count.

**Defect panel** — open defects by severity and module, flagging any with severity blank (currently all of them), since exit criteria cannot be evaluated without severity.

### C.5 Non-negotiables

- Zero network calls at render time.
- Deterministic output: the same inputs produce a byte-identical file, so it diffs cleanly in git.
- No chart library. If a visual is needed, draw inline SVG bars — a bar chart of coverage per module is sufficient and adds no dependency.
- Published by Jenkins as an archived artefact on every run; also committed to `traceability/` on demand so coverage history is reviewable over time.

### C.6 Optional, only after Milestone 3 ships

A `--write-back` flag that updates the workbook's `Automation Status` column from the scan, so the sheet and the code never drift. Default off. Always write to a copy, never the original file in place.

---

## D. Order of work for the building agent

```
Milestone 1  →  gate  →  Milestone 2  →  gate  →  Milestone 3  →  gate
```

Build one milestone per session. Do not begin the next until the previous gate demonstrably passes, with the evidence shown. Report at each gate: what passes, what does not, and what was blocked by missing access — do not work around missing access by inventing credentials, endpoints or data.
