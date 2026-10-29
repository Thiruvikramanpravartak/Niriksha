# Milestone 2 — Build Progress & Implementation Tracking

**Target:** Milestone 2 — Smoke Slice + CI + Dashboard (Addendum §B)  
**Repository:** `qa-automation` (`NirikshaAG`)  
**Status:** All Milestone 2 Deliverables & Hard Gate Criteria **COMPLETE & VERIFIED**  
**Last Updated:** 2026-10-13

---

## 1. Executive Summary

Milestone 2 delivers the complete **E2E Smoke Slice**, full BDD automation of the **15 core user journeys**, the **Traceability & Coverage Dashboard (§22)**, production-grade **CI/CD pipeline governance**, and testing guidelines. The entire smoke suite executes completely offline against the local mock environment in **under 9 seconds** (well within the < 3 minute gate requirement).

### Deliverables Tracker

| #     | Component                    |  Status  | Key Deliverables & Evidence                                                                                                                                                       |
| ----- | ---------------------------- | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **Page Objects**             | **DONE** | `HomePage`, `ReportsPage`, `LoginPage`, `DashboardPage`, `CrudListPage`. All adhere to §7.3 (zero assertions, return state and locators only).                                    |
| **2** | **Component Objects**        | **DONE** | `Header`, `Footer`, `MainNav`, `Breadcrumb`, `LanguageToggle`, `DataTable`, `SearchFilterPanel`. Reusable and bound by `data-testid`.                                             |
| **3** | **Flows**                    | **DONE** | `adminLogin.ts` (API authentication + storageState reuse) and `createRecord.ts` (module-parameterized creation + cleanup).                                                        |
| **4** | **15 Smoke Journeys**        | **DONE** | All 15 journeys from §14.2 implemented as Gherkin scenarios in `features/` + step definitions in `steps/`, tagged `@smoke @TC:xx`. **15/15 scenarios (45 steps) passed in 8.9s**. |
| **5** | **Traceability & Dashboard** | **DONE** | `npm run traceability` scans code, reconciles against workbook, verifies 0 orphans, and outputs `traceability/dashboard.html` (single file, 21 KB, offline-ready).                |
| **6** | **CI Pipeline Governance**   | **DONE** | Root & project `Jenkinsfile` with report-only gate (`UNSTABLE` on live failure), Allure reporting, and artifact archiving.                                                        |
| **7** | **Documentation**            | **DONE** | `docs/CI.md` (agent specs, promotion log), `docs/WRITING_TESTS.md` (engineering guide), updated `README.md`.                                                                      |

---

## 2. The 15 Smoke Journeys (§14.2) Verification Evidence

All 15 smoke journeys run via Cucumber BDD:

```bash
$env:MOCK="1"; npm run test:smoke
```

| #      | Journey Description                                                  |    Workbook Reference    | Gherkin Feature File                                                                                                                        |   Status   |
| ------ | -------------------------------------------------------------------- | :----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **1**  | Home page loads: hero banner, stats section, valid assets            | `@TC:HP-01`, `@TC:HP-09` | [`features/public/home.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/home.feature)                       | **PASSED** |
| **2**  | Home statistics match `/api/home` backend payload                    |       `@TC:HP-02`        | [`features/public/home.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/home.feature)                       | **PASSED** |
| **3**  | Main navigation: 5 items in expected order                           |       `@TC:UX-03`        | [`features/public/navigation.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/navigation.feature)           | **PASSED** |
| **4**  | Header & Footer present and populated on public pages                | `@TC:UX-01`, `@TC:UX-05` | [`features/public/navigation.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/navigation.feature)           | **PASSED** |
| **5**  | Breadcrumb reflects nested page hierarchy                            |       `@TC:UX-07`        | [`features/public/navigation.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/navigation.feature)           | **PASSED** |
| **6**  | Language toggle present with English/Hindi choices                   |       `@TC:BL-01`        | [`features/public/language-toggle.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/language-toggle.feature) | **PASSED** |
| **7**  | Language selection persists across site navigation                   |       `@TC:BL-02`        | [`features/public/language-toggle.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/language-toggle.feature) | **PASSED** |
| **8**  | Reports list: default page size (10) and columns                     |       `@TC:RA-01`        | [`features/public/reports-search.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/reports-search.feature)   | **PASSED** |
| **9**  | Reports keyword search returns only matching records                 |       `@TC:RA-02`        | [`features/public/reports-search.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/reports-search.feature)   | **PASSED** |
| **10** | Reports combined filters apply AND logic                             |       `@TC:RA-08`        | [`features/public/reports-search.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/reports-search.feature)   | **PASSED** |
| **11** | Reports pagination renders next page without duplicates              |       `@TC:RA-10`        | [`features/public/reports-search.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/public/reports-search.feature)   | **PASSED** |
| **12** | Valid admin login succeeds and redirects to dashboard                |       `@TC:AA-01`        | [`features/admin/login.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/admin/login.feature)                       | **PASSED** |
| **13** | Invalid admin login credentials are rejected with error              |       `@TC:AA-02`        | [`features/admin/login.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/admin/login.feature)                       | **PASSED** |
| **14** | Unauthenticated access to admin routes redirects to login            |       `@TC:AA-06`        | [`features/admin/login.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/admin/login.feature)                       | **PASSED** |
| **15** | Admin creates record &rarr; appears in list &rarr; queryable via API | `@TC:AC-01`, `@TC:AC-08` | [`features/admin/crud.feature`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/features/admin/crud.feature)                         | **PASSED** |

### Test Run Output

```text
15 scenarios (15 passed)
45 steps (45 passed)
0m08.934s (executing steps: 0m05.383s)
```

---

## 3. §22 Coverage Dashboard & Traceability Tooling

Executing `npm run traceability` yields:

- [`traceability/mapping.csv`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/traceability/mapping.csv): Complete mapping of all automated tests to workbook IDs.
- [`traceability/report.md`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/traceability/report.md): Markdown coverage report.
- [`traceability/dashboard.html`](file:///c:/Users/HP/Desktop/NirikshaAG/projects/cag-v2/traceability/dashboard.html):
  - **Single File:** 21 KB, no external dependencies, zero network requests at render time (works from `file://`).
  - **Color Schemes:** Full light & dark mode support (`prefers-color-scheme`).
  - **Interactive Drilling:** Clickable stat tiles filter and highlight the table.
  - **Three Core Worklists:**
    1. **Automation Backlog:** 69 cases on shipped modules ready for Milestone 3.
    2. **Orphans:** **0 orphan tests** (fails build if any unmapped tests are introduced).
    3. **Deferred:** Candidates on pending modules.
  - **Defect Summary:** Open defects by severity and module.

---

## 4. Milestone 2 Hard Gate Verification Proof

| Gate Requirement               |      Threshold      |           Actual Result           | Verification Status |
| ------------------------------ | :-----------------: | :-------------------------------: | :-----------------: |
| **Smoke Suite Duration**       |     < 3 minutes     |         **8.93 seconds**          |     **PASSED**      |
| **Dashboard CI Generation**    | Generated every run | Verified (`dashboard.html` 21 KB) |     **PASSED**      |
| **Orphan Test Discrepancy**    |      0 orphans      |           **0 orphans**           |     **PASSED**      |
| **Flakiness Rate**             |        < 2%         | **0.0%** (10 consecutive passes)  |     **PASSED**      |
| **Architectural Lint & Types** |      0 errors       |     **0 errors, 0 warnings**      |     **PASSED**      |

---

## 5. Next Steps: Ready for Milestone 3

Milestone 2 is complete. Ready to proceed to **Milestone 3 — Regression Pack + Specialist Suites (Visual, A11y, Crawl) + Reusability Template** upon instruction.
