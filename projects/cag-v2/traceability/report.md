# Traceability & Automation Coverage Report (Addendum §E & §K)

## Provenance

- **Workbook File:** `cag-v2-test-cases.xlsx`
- **File Modified Date:** `2026-09-29T06:17:17.928Z`
- **SHA-256 Checksum:** `61445D43061034D01F1A9C3D4954E25A4585960B4011EE608B28704197160BA9`
- **File Size:** 808.5 KB
- **Workbook Rows Scanned:** 269 rows across 20 module sheets (247 verified Test Cases)

---

## Executive Summary & True Coverage Figures

- **Total Workbook Test Cases:** 247
- **Total Automation Candidates (Y):** 109
- **Total Automated Candidates:** 62 of 109 (**57%** overall candidate coverage)
- **Shipped Modules Candidate Coverage:** 23 of 41 (**56%**)
- **Automation Backlog (Shipped modules awaiting automation):** 18 cases
- **Deferred Candidates (Pending from Dev):** 29 cases
- **Automated Non-Candidate Cases (Manual-by-design scenarios covered):** 28 cases
- **Framework-Originated Specialist Checks:** 16 checks (Visual: 5, A11y: 6, Crawl: 5 — excluded from candidate denominator)
- **Orphan Tests (Discrepancies):** 0
- **Tracked Workbook Defects:** 15 (D-01 to D-15)
  > [!WARNING]
  > **Data Quality Finding:** Severity column is **BLANK** on all 15 open defects in the workbook. Exit criterion "no open Critical/High defects" cannot be evaluated until QA populates severity values.

---

## Module Coverage Breakdown

| Module                        | Sheet                            | Status  | Total Cases | Candidates | Automated | Candidate Coverage | Open Defects |
| :---------------------------- | :------------------------------- | :-----: | :---------: | :--------: | :-------: | :----------------: | :----------: |
| **Home Page**                 | `HP - Home Page`                 | shipped |     10      |     5      |     5     |        100%        |      2       |
| **About Us**                  | `AU - About Us`                  | shipped |     11      |     6      |     0     |         0%         |      4       |
| **Our Presence**              | `OP - Our Presence`              | shipped |     10      |     4      |     0     |         0%         |      2       |
| **Reports & Accounts**        | `RA - Reports & Accounts`        | shipped |     18      |     14     |    14     |        100%        |      1       |
| **Contact**                   | `CT - Contact`                   | pending |     11      |     5      |     0     |         0%         |      0       |
| **Global Relations**          | `GR - Global Relations`          | pending |     10      |     5      |     0     |         0%         |      0       |
| **Careers & Engagement**      | `CE - Careers & Engagement`      | pending |      8      |     3      |     0     |         0%         |      0       |
| **News & Media**              | `NM - News & Media`              | pending |     11      |     7      |     6     |        86%         |      0       |
| **Resources & Library**       | `RL - Resources & Library`       | shipped |      8      |     4      |     0     |         0%         |      0       |
| **State Subsites**            | `SS - State Subsites`            | pending |     12      |     4      |     2     |        50%         |      0       |
| **UI-UX & Shared Components** | `UX - UI-UX & Shared Components` | pending |     14      |     3      |     3     |        100%        |      0       |
| **Bilingual (i18n)**          | `BL - Bilingual (i18n)`          | pending |     10      |     1      |     1     |        100%        |      0       |
| **Admin - Authentication**    | `AA - Admin - Authentication`    | shipped |     10      |     4      |     4     |        100%        |      0       |
| **Admin - Dashboard**         | `AD - Admin - Dashboard`         | pending |     13      |     2      |     0     |         0%         |      0       |
| **Admin - CRUD Modules**      | `AC - Admin - CRUD Modules`      | pending |     16      |     7      |     7     |        100%        |      0       |
| **Admin - File Upload**       | `AF - Admin - File Upload`       | pending |     10      |     3      |     0     |         0%         |      0       |
| **Admin - Audit Log**         | `AL - Admin - Audit Log`         | shipped |      8      |     4      |     0     |         0%         |      0       |
| **Non-Functional**            | `NF - Non-Functional`            | pending |     16      |     4      |     0     |         0%         |      0       |
| **Figma Design Parity**       | `FP - Figma Design Parity`       | pending |     21      |     4      |     0     |         0%         |      0       |
| **API Testing**               | `API - API Testing`              | pending |     20      |     20     |    20     |        100%        |      0       |

---

## Worklists

### 1. Automation Backlog (18 cases on shipped modules)

These test cases reside on shipped, completed modules and are eligible for automation:

| ID      | Module              | Priority | Scenario                                                                         |
| :------ | :------------------ | :------: | :------------------------------------------------------------------------------- |
| `AU-01` | About Us            |   High   | Verify About Us landing page lists all 11 sub-category links                     |
| `AU-02` | About Us            |   High   | Verify each About Us sub-category page loads correctly                           |
| `AU-06` | About Us            |  Medium  | Verify officer tree data matches the /api/organisation-chart response            |
| `AU-09` | About Us            |  Medium  | Verify breadcrumb trail updates correctly within About Us                        |
| `AU-10` | About Us            |  Medium  | Verify an About Us sub-page loads correctly via direct URL                       |
| `AU-11` | About Us            |  Medium  | Verify node details tooltip displays fully without screen clipping on hover      |
| `OP-04` | Our Presence        |  Medium  | Verify the Central Audit Offices sub-page lists all central-level offices correc |
| `OP-05` | Our Presence        |  Medium  | Verify the State-Level Offices sub-page lists State Accountant General offices c |
| `OP-06` | Our Presence        |   Low    | Verify the Training Institutes sub-page lists NAAA and regional centres correctl |
| `OP-07` | Our Presence        |  Medium  | Verify all 4 Our Presence sub-pages are reachable from the menu                  |
| `RL-01` | Resources & Library |   High   | Verify Resources & Library page displays all 4 categories                        |
| `RL-02` | Resources & Library |  Medium  | Verify each category lists its documents correctly                               |
| `RL-04` | Resources & Library |  Medium  | Verify the Tenders sub-page lists current tenders with correct details           |
| `RL-05` | Resources & Library |  Medium  | Verify the Circulars sub-page lists departmental circulars correctly             |
| `AL-01` | Admin - Audit Log   |   High   | Verify a CREATE action is logged correctly                                       |
| `AL-02` | Admin - Audit Log   |   High   | Verify an UPDATE action captures old and new data correctly                      |
| `AL-03` | Admin - Audit Log   |   High   | Verify a DELETE action captures the deleted record's prior state                 |
| `AL-06` | Admin - Audit Log   |  Medium  | Verify the audit-log viewer filters/sorts entries correctly                      |

### 2. Deferred Candidates (29 cases on pending modules)

Awaiting developer delivery of pending modules before automation commences:

| ID      | Module               | Sheet                       | Priority | Scenario                                                               |
| :------ | :------------------- | :-------------------------- | :------: | :--------------------------------------------------------------------- |
| `CT-03` | Contact              | `CT - Contact`              |   High   | Verify a message's status can be progressed (e.g., New → In Progress → |
| `CT-05` | Contact              | `CT - Contact`              |  Medium  | Verify a message/complaint can be deleted                              |
| `CT-06` | Contact              | `CT - Contact`              |  Medium  | Verify searching the Contact list returns matching messages            |
| `CT-07` | Contact              | `CT - Contact`              |   Low    | Verify messages can be sorted (e.g., by date) and the Rows-per-page co |
| `CT-10` | Contact              | `CT - Contact`              |  Medium  | Verify the public Contact Us form validates required fields and email  |
| `GR-02` | Global Relations     | `GR - Global Relations`     |   High   | Verify a new Global Relations entry (e.g., an international engagement |
| `GR-03` | Global Relations     | `GR - Global Relations`     |   High   | Verify an existing Global Relations entry can be edited and changes pe |
| `GR-04` | Global Relations     | `GR - Global Relations`     |  Medium  | Verify a Global Relations entry can be deleted                         |
| `GR-06` | Global Relations     | `GR - Global Relations`     |  Medium  | Verify searching the Global Relations list returns matching entries    |
| `GR-07` | Global Relations     | `GR - Global Relations`     |   Low    | Verify the Sort By and Rows-per-page controls behave correctly         |
| `CE-01` | Careers & Engagement | `CE - Careers & Engagement` |   High   | Verify Careers & Engagement page displays all recruitment pathways     |
| `CE-07` | Careers & Engagement | `CE - Careers & Engagement` |  Medium  | Verify the Careers menu item is reachable and highlights as active     |
| `CE-08` | Careers & Engagement | `CE - Careers & Engagement` |   Low    | Verify no broken links or missing assets on the Careers page           |
| `NM-10` | News & Media         | `NM - News & Media`         |   Low    | Verify published news items have no broken links or missing images     |
| `SS-09` | State Subsites       | `SS - State Subsites`       |  Medium  | Verify What's New lists latest tenders/announcements sorted by date    |
| `SS-12` | State Subsites       | `SS - State Subsites`       |  Medium  | Verify navigating to a non-existent state slug is handled gracefully   |
| `AD-05` | Admin - Dashboard    | `AD - Admin - Dashboard`    |   High   | Verify the four Quick Actions match the Figma design and each opens th |
| `AD-13` | Admin - Dashboard    | `AD - Admin - Dashboard`    |   High   | Verify only authenticated admins can view the dashboard                |
| `AF-01` | Admin - File Upload  | `AF - Admin - File Upload`  |   High   | Verify a valid image uploads and displays correctly                    |
| `AF-02` | Admin - File Upload  | `AF - Admin - File Upload`  |   High   | Verify a valid document uploads and its link works                     |
| `AF-03` | Admin - File Upload  | `AF - Admin - File Upload`  |   High   | Verify disallowed file types are rejected                              |
| `NF-01` | Non-Functional       | `NF - Non-Functional`       |   High   | Verify all /api/admin/* endpoints reject unauthenticated requests      |
| `NF-11` | Non-Functional       | `NF - Non-Functional`       |  Medium  | Verify text/background contrast meets WCAG 2.1 AA                      |
| `NF-12` | Non-Functional       | `NF - Non-Functional`       |  Medium  | Verify meaningful alt attributes exist for informative images          |
| `NF-13` | Non-Functional       | `NF - Non-Functional`       |  Medium  | Verify semantic landmarks and ARIA labelling support assistive technol |

_(+ 4 additional deferred cases)_

### 3. Open Defects (15 items from Defect_summary)

| Defect ID | Module               | Priority |        Severity        | Status | Summary                                                                |
| :-------- | :------------------- | :------: | :--------------------: | :----: | :--------------------------------------------------------------------- |
| `D-01`    | Our Presence         |  Medium  | **BLANK (Unassigned)** |  OPEN  | Our Presence' side panel subcategories are not translated when languag |
| `D-02`    | Our Presence         |  Medium  | **BLANK (Unassigned)** |  OPEN  | Keyboard navigation skips main navbar links and lands directly on 'Cit |
| `D-03`    | About Us             |  Medium  | **BLANK (Unassigned)** |  OPEN  | Displayed only 9 categories instead of 11,need to clarify              |
| `D-04`    | About Us             |  Medium  | **BLANK (Unassigned)** |  OPEN  | Name and tenure are displayed, but 7 former CAG photos are missing in  |
| `D-05`    | About Us             |  Medium  | **BLANK (Unassigned)** |  OPEN  | Hindi translation is incomplete; English text is displayed on the Duti |
| `D-06`    | About Us             |  Medium  | **BLANK (Unassigned)** |  OPEN  | Tooltip gets cut off on the left side for all left-aligned nodes in th |
| `D-07`    | Home Page            |  Medium  | **BLANK (Unassigned)** |  OPEN  | Homepage content is not fully translated into Hindi. Some sections/tex |
| `D-08`    | Home Page            |  Medium  | **BLANK (Unassigned)** |  OPEN  | Broken links or assets are found on the homepage                       |
| `D-09`    | Reports              |  Medium  | **BLANK (Unassigned)** |  OPEN  | Report Download button opens the PDF in the browser instead of downloa |
| `D-10`    | Admin-Authentication |  Medium  | **BLANK (Unassigned)** |  OPEN  | Invalid password is not rejected during admin login                    |
| `D-11`    | Resource and Library |  MEDIUM  | **BLANK (Unassigned)** |  OPEN  | Resource and library ---> Tenders subsite                              |
| `D-12`    | Resource and Library |  MEDIUM  | **BLANK (Unassigned)** |  OPEN  | Resource and library ---> Circulars subsite                            |
| `D-13`    | Resource and Library |   LOW    | **BLANK (Unassigned)** |  OPEN  | Resource and library ---> Search Bar                                   |
| `D-14`    | Resource and Library |  MEDIUM  | **BLANK (Unassigned)** |  OPEN  | Resource and library ---> Bilingual Content                            |
| `D-15`    | Resource and Library |   LOW    | **BLANK (Unassigned)** |  OPEN  | Resource and library ---> Empty Category State                         |

### 4. Framework-Originated Specialist Checks (16 checks)

| Check ID   |  Type  | File Path                                   |
| :--------- | :----: | :------------------------------------------ |
| `@A11Y-01` |  A11Y  | `tests/a11y/accessibilityTemplates.spec.ts` |
| `@A11Y-02` |  A11Y  | `tests/a11y/accessibilityTemplates.spec.ts` |
| `@A11Y-03` |  A11Y  | `tests/a11y/accessibilityTemplates.spec.ts` |
| `@A11Y-04` |  A11Y  | `tests/a11y/accessibilityTemplates.spec.ts` |
| `@A11Y-05` |  A11Y  | `tests/a11y/accessibilityTemplates.spec.ts` |
| `@A11Y-06` |  A11Y  | `tests/a11y/accessibilityTemplates.spec.ts` |
| `@CRW-01`  | CRAWL  | `tests/crawl/crawlIntegrity.spec.ts`        |
| `@CRW-02`  | CRAWL  | `tests/crawl/crawlIntegrity.spec.ts`        |
| `@CRW-03`  | CRAWL  | `tests/crawl/crawlIntegrity.spec.ts`        |
| `@CRW-04`  | CRAWL  | `tests/crawl/crawlIntegrity.spec.ts`        |
| `@CRW-05`  | CRAWL  | `tests/crawl/crawlIntegrity.spec.ts`        |
| `@VIS-01`  | VISUAL | `tests/visual/visualComponents.spec.ts`     |
| `@VIS-02`  | VISUAL | `tests/visual/visualComponents.spec.ts`     |
| `@VIS-03`  | VISUAL | `tests/visual/visualComponents.spec.ts`     |
| `@VIS-04`  | VISUAL | `tests/visual/visualComponents.spec.ts`     |
| `@VIS-05`  | VISUAL | `tests/visual/visualComponents.spec.ts`     |
