# data-testid Convention & Deliverable Specification

This document defines the strict `data-testid` convention required across the CAG Website v2 frontend (Next.js/React) and the test automation suite.

---

## 1. Core Principles

1. **Uniqueness**: **No `data-testid` may repeat on a single page.** Every interactive element, container, or distinct text node has a unique identifier.
2. **Predictability**: Format follows `[scope]-[component/entity]-[element]-[optional-descriptor]`:
   - `common-*`: Shared cross-cutting components (Header, MainNav, Footer, LanguageToggle, Breadcrumb).
   - `public-[module]-*`: Public portal pages and modules.
   - `admin-[module]-*`: Admin CMS and authentication pages.
3. **No Brittle Selectors**: Automation tests prioritize `getByTestId` to remain immune to CSS styling rewrites, DOM re-nesting, and translation changes.

---

## 2. Shared / Common Components (`common-*`)

| Component           | Element / Role       | `data-testid`                    | Description                                      |
| :------------------ | :------------------- | :------------------------------- | :----------------------------------------------- |
| **Header**          | Root Container       | `common-header`                  | Main site header wrapper                         |
|                     | Logo                 | `common-header-logo`             | CAG national emblem / emblem logo                |
|                     | Title                | `common-header-title`            | Comptroller & Auditor General of India title     |
| **Language Toggle** | Root Container       | `common-language-toggle`         | Bilingual switcher root                          |
|                     | Current Display      | `common-lang-current`            | Label showing current language (e.g., "English") |
|                     | Switch to EN         | `common-lang-switch-en`          | Button/link to activate English                  |
|                     | Switch to HI         | `common-lang-switch-hi`          | Button/link to activate Hindi                    |
| **Main Navigation** | Root Nav             | `common-nav`                     | Top navigation bar                               |
|                     | Home Link            | `common-nav-home`                | Link to `/`                                      |
|                     | About Us Link        | `common-nav-about-us`            | Link to `/about-us`                              |
|                     | Reports Link         | `common-nav-reports`             | Link to `/reports`                               |
|                     | News & Media Link    | `common-nav-news`                | Link to `/news`                                  |
|                     | State Sub-sites Link | `common-nav-states`              | Link to `/states`                                |
| **Breadcrumb**      | Root Container       | `common-breadcrumb`              | Breadcrumb navigation wrapper                    |
|                     | Home Item            | `common-breadcrumb-item-home`    | Home link in breadcrumb                          |
|                     | Current Item         | `common-breadcrumb-item-current` | Current active leaf in breadcrumb                |
| **Footer**          | Root Container       | `common-footer`                  | Main site footer wrapper                         |
|                     | Copyright            | `common-footer-copyright`        | Copyright statement text                         |
|                     | Links Wrapper        | `common-footer-links`            | Links container                                  |
|                     | Terms Link           | `common-footer-link-terms`       | Link to terms and conditions                     |
|                     | Privacy Link         | `common-footer-link-privacy`     | Link to privacy policy                           |

---

## 3. Public Pages

### 3.1 Public Home (`public-home-*`)

| Element                 | `data-testid`              | Description                         |
| :---------------------- | :------------------------- | :---------------------------------- |
| Hero Section Container  | `public-home-hero`         | Hero banner section                 |
| Hero Title              | `public-home-hero-title`   | Supreme Audit Institution headline  |
| Stats Section Container | `public-home-stats`        | Portal stats counter strip          |
| Reports Stat Counter    | `public-home-stat-reports` | Counter for total reports published |
| Offices Stat Counter    | `public-home-stat-offices` | Counter for field audit offices     |

### 3.2 Public Reports (`public-reports-*`)

| Element                 | `data-testid`                       | Description                       |
| :---------------------- | :---------------------------------- | :-------------------------------- |
| Page Heading            | `public-reports-title`              | Audit Reports page heading        |
| Search Filter Panel     | `public-reports-filter-panel`       | Filter card container             |
| Keyword Search Input    | `public-reports-search-input`       | Free-text search input            |
| Year Filter Select      | `public-reports-filter-year`        | Year dropdown                     |
| Category Filter Select  | `public-reports-filter-category`    | Category dropdown                 |
| Search Submit Button    | `public-reports-search-submit`      | Search action button              |
| Filter Clear Button     | `public-reports-filter-clear`       | Reset filters button              |
| Table Root              | `public-reports-table-root`         | Reports table container           |
| Column Header: Title    | `public-reports-th-title`           | Table column header               |
| Column Header: Year     | `public-reports-th-year`            | Table column header               |
| Column Header: Category | `public-reports-th-category`        | Table column header               |
| Row 1                   | `public-reports-row-1`              | First data row                    |
| Row 1 Title Cell        | `public-reports-cell-title-1`       | Title cell                        |
| Row 1 Year Cell         | `public-reports-cell-year-1`        | Year cell                         |
| Row 1 Category Cell     | `public-reports-cell-category-1`    | Category cell                     |
| Pagination Summary      | `public-reports-pagination-summary` | Summary text (e.g., "1-10 of 24") |
| Pagination Page 1       | `public-reports-pagination-page-1`  | Jump to page 1                    |
| Pagination Page 2       | `public-reports-pagination-page-2`  | Jump to page 2                    |
| Rows Per Page Select    | `public-reports-rows-per-page`      | Page size dropdown selector       |

---

## 4. Admin Portal (`admin-*`)

### 4.1 Admin Login (`admin-login-*`)

| Element           | `data-testid`                | Description                     |
| :---------------- | :--------------------------- | :------------------------------ |
| Form Container    | `admin-login-container`      | Login box wrapper               |
| Username Input    | `admin-login-username-input` | Username field                  |
| Password Input    | `admin-login-password-input` | Password field                  |
| Submit Button     | `admin-login-submit-btn`     | Login submit button             |
| Error Message Box | `admin-login-error-message`  | Invalid credentials error alert |

### 4.2 Admin Dashboard (`admin-dashboard-*`)

| Element                 | `data-testid`                    | Description                  |
| :---------------------- | :------------------------------- | :--------------------------- |
| Dashboard Container     | `admin-dashboard-container`      | Admin dashboard wrapper      |
| Welcome Banner          | `admin-dashboard-welcome-banner` | Welcome message text         |
| Nav: News Management    | `admin-dashboard-nav-news`       | Sidebar/menu link to news    |
| Nav: Reports Management | `admin-dashboard-nav-reports`    | Sidebar/menu link to reports |

### 4.3 Admin CRUD (`admin-crud-*`)

| Element                 | `data-testid`                   | Description                     |
| :---------------------- | :------------------------------ | :------------------------------ |
| Container               | `admin-crud-container`          | Module CRUD container           |
| Module Title            | `admin-crud-title`              | Heading for module management   |
| Add Record Button       | `admin-crud-add-btn`            | Button to create new record     |
| Table Root              | `admin-crud-table`              | Data table container            |
| Column Header: Title    | `admin-crud-th-title`           | Table column header             |
| Column Header: Category | `admin-crud-th-category`        | Table column header             |
| Column Header: Status   | `admin-crud-th-status`          | Table column header             |
| Row 1                   | `admin-crud-row-1`              | First row container             |
| Row 1 Title Cell        | `admin-crud-cell-title-1`       | Title cell                      |
| Row 1 Category Cell     | `admin-crud-cell-category-1`    | Category cell                   |
| Row 1 Status Cell       | `admin-crud-cell-status-1`      | Status cell                     |
| Row 1 Edit Action       | `admin-crud-action-edit-1`      | Row action edit                 |
| Row 1 Delete Action     | `admin-crud-action-delete-1`    | Row action delete               |
| Pagination Summary      | `admin-crud-pagination-summary` | Summary text (e.g., "1-2 of 2") |
| Pagination Page 1       | `admin-crud-pagination-page-1`  | Page 1 button                   |
| Rows Per Page Select    | `admin-crud-rows-per-page`      | Page size dropdown selector     |
