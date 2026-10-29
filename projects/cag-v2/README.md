# CAG Website v2 — Test Automation Project

This project contains the test automation suite for the Comptroller and Auditor General of India (CAG) Website v2.

---

## 1. Quick Navigation Rules for Newcomers (§F.2)

- **Where is the selector for X?** → `src/locators/`
- **Where is the action that clicks X?** → `src/pages/` or `src/components/`
- **Where is the scenario that tests X?** → `features/<area>/<module>.feature`, one file per workbook sheet
- **Where is the assertion?** → `steps/` (BDD) or `tests/` (Playwright Test). Nowhere else.
- **Where is the API path?** → `src/api/endpoints.ts`, and only there.
- **Where is the URL or password?** → `config/` and environment variables, and only there.

---

## 2. Directory Layout (§F.2)

```
projects/cag-v2/
├─ config/                      # environment settings (no secrets)
├─ src/                         # OBJECT LAYER — no assertions anywhere in here
│  ├─ locators/                 # ← ALL selectors. Nothing else holds a selector.
│  │  ├─ testIds.ts
│  │  ├─ common.locators.ts
│  │  ├─ public/
│  │  └─ admin/
│  ├─ components/               # shared UI widgets, actions + state
│  ├─ pages/                    # one file per screen
│  ├─ flows/                    # multi-step business actions
│  ├─ api/                      # endpoints & schemas
│  ├─ db/                       # db client & queries
│  └─ data/                     # fixtures & builders
├─ features/                    # ONE FILE PER WORKBOOK SHEET (§G)
│  ├─ public/
│  ├─ admin/
│  └─ cross-cutting/
├─ steps/                       # mirrors features/ one-for-one
│  ├─ public/
│  ├─ admin/
│  └─ shared/
├─ reports/                     # cucumber-report.html, json, and evidence screenshots
├─ traceability/                # workbook (READ-ONLY INPUT) & dashboard.html
└─ README.md
```

---

## 3. How to Run

```bash
# Verify environment readiness
npm run check:e2e

# Typecheck (0 errors)
npm run typecheck

# Validate feature specifications against §H and §I standards
npm run validate:features

# Run Traceability Matrix & Workbook Reconciliation
npm run traceability

# Run Full Live E2E Regression Suite (Cucumber BDD)
npm run test:e2e

# Run Smoke suite (Cucumber BDD)
npm run test:smoke

# Run Regression suite (Cucumber BDD)
npm run test:regression
```
