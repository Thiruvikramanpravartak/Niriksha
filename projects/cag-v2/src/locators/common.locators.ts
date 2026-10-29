import type { Locator, Page } from 'playwright';
import { TestIds } from './testIds';

export const commonLocators = (page: Page) => ({
  header: (): Locator => page.getByTestId(TestIds.common.header).or(page.locator('header')),
  headerLogo: (): Locator =>
    page
      .locator(
        '[data-testid="common-header-logo-mobile"]:visible, [data-testid="common-header-logo"]:visible, .header-logo--mobile:visible, header img[alt*="crest"]:visible'
      )
      .first(),
  headerTitle: (): Locator =>
    page
      .getByTestId(TestIds.common.headerTitle)
      .or(
        page.locator(
          'header h1, header [class*="title"], img[alt*="Comptroller and Auditor General"]:visible, [alt*="Comptroller and Auditor General"]:visible'
        )
      )
      .first(),
  nav: (): Locator =>
    page
      .getByTestId(TestIds.common.nav)
      .or(page.locator('nav.primary-nav, [aria-label="Primary"], header nav, nav, [class*="navbar"], [class*="menu"]'))
      .first(),
  navItems: (): Locator =>
    page
      .getByTestId(TestIds.common.nav)
      .getByRole('link')
      .or(page.locator('nav.primary-nav a, [aria-label="Primary"] a, header nav a, nav a, [class*="navbar"] a')),
  navItem: (section: string): Locator =>
    page.getByTestId(TestIds.common.navItem(section)).or(page.locator(`header a[href*="${section}"], nav a[href*="${section}"]`)).first(),
  navItemByText: (text: string): Locator =>
    page
      .getByTestId(TestIds.common.nav)
      .getByRole('link', { name: text })
      .or(page.locator(`header nav a:has-text("${text}"), nav a:has-text("${text}")`))
      .first(),
  navHome: (): Locator => page.getByTestId(TestIds.common.navHome).or(page.locator('a[href="/"]')).first(),
  navAboutUs: (): Locator => page.getByTestId(TestIds.common.navAboutUs).or(page.locator('a[href*="About"]')).first(),
  navReports: (): Locator => page.getByTestId(TestIds.common.navReports).or(page.locator('a[href*="Report"]')).first(),
  navNews: (): Locator => page.getByTestId(TestIds.common.navNews).or(page.locator('a[href*="News"]')).first(),
  navStates: (): Locator => page.getByTestId(TestIds.common.navStates).or(page.locator('a[href*="State"]')).first(),
  languageToggle: (): Locator =>
    page
      .getByTestId(TestIds.common.languageToggle)
      .or(page.locator('.lang-switch__current, button[aria-haspopup="listbox"], button:has-text("English"), button:has-text("हिन्दी")'))
      .first(),
  langCurrent: (): Locator =>
    page
      .getByTestId(TestIds.common.langCurrent)
      .or(page.locator('.lang-switch__current, [class*="lang-current"]'))
      .first(),
  langSwitchEn: (): Locator =>
    page
      .getByTestId(TestIds.common.langSwitchEn)
      .or(page.locator('.lang-switch__option[lang="en"], button[role="option"][lang="en"], button[lang="en"]'))
      .or(page.locator('button:has-text("English")'))
      .first(),
  langSwitchHi: (): Locator =>
    page
      .getByTestId(TestIds.common.langSwitchHi)
      .or(page.locator('.lang-switch__option[lang="hi"], button[role="option"][lang="hi"], button[lang="hi"]'))
      .or(page.locator('button:has-text("हिन्दी")'))
      .first(),
  langSwitch: (lang: 'en' | 'hi'): Locator =>
    page
      .getByTestId(`common-lang-switch-${lang}`)
      .or(page.getByTestId(`common-lang-${lang}`))
      .or(page.locator(`.lang-switch__option[lang="${lang}"], button[role="option"][lang="${lang}"], button[lang="${lang}"]`))
      .or(page.locator(lang === 'hi' ? 'button:has-text("हिन्दी")' : 'button:has-text("English")'))
      .first(),
  breadcrumb: (): Locator =>
    page
      .getByTestId(TestIds.common.breadcrumb)
      .or(page.locator('nav[aria-label*="breadcrumb" i], [class*="breadcrumb"], nav:has(a:has-text("Home"))'))
      .first(),
  breadcrumbHome: (): Locator =>
    page
      .getByTestId(TestIds.common.breadcrumbHome)
      .or(page.locator('[class*="breadcrumb"] a:has-text("Home"), nav a:has-text("Home"), a[href="/"]'))
      .first(),
  breadcrumbCurrent: (): Locator =>
    page
      .getByTestId(TestIds.common.breadcrumbCurrent)
      .or(page.locator('[class*="breadcrumb"] span, [class*="breadcrumb"] [aria-current="page"]'))
      .first(),
  breadcrumbItems: (): Locator =>
    page.getByTestId(TestIds.common.breadcrumb).locator('span').or(page.locator('[class*="breadcrumb"] *')),
  footer: (): Locator =>
    page
      .getByTestId(TestIds.common.footer)
      .or(page.locator('footer'))
      .or(page.locator('[class*="footer"]'))
      .first(),
  footerCopyright: (): Locator =>
    page
      .getByTestId(TestIds.common.footerCopyright)
      .or(page.getByText('Comptroller and Auditor General'))
      .or(page.locator('footer'))
      .first(),
  footerLinks: (): Locator =>
    page
      .getByTestId(TestIds.common.footerLinks)
      .or(page.locator('footer a, [class*="footer"] a, footer ul'))
      .first(),
  footerLinkItems: (): Locator =>
    page.getByTestId(TestIds.common.footer).getByRole('link').or(page.locator('footer a')),
  footerTerms: (): Locator =>
    page.getByTestId(TestIds.common.footerTerms).or(page.locator('footer a:has-text("Terms")')).first(),
  footerPrivacy: (): Locator =>
    page.getByTestId(TestIds.common.footerPrivacy).or(page.locator('footer a:has-text("Privacy")')).first(),
});

export const tableLocators = (tableRoot: Locator) => ({
  root: (): Locator => tableRoot,
  rows: (): Locator =>
    tableRoot.locator(
      '[data-testid*="-row-"], [data-testid="table-row"], [class*="report-listing-card"]:not([class*="__"]), article, tr:not(:has(th))'
    ),
  cell: (rowIndex: number, column: string): Locator =>
    tableRoot
      .locator('[data-testid*="-row-"], [data-testid="table-row"], [class*="report-listing-card"]:not([class*="__"]), article, tr')
      .nth(rowIndex)
      .locator(`[data-testid*="-cell-${column}"], [data-testid="cell-${column}"], h3, p, a, td`)
      .first(),
  headers: (): Locator => tableRoot.locator('[data-testid*="-th-"], [data-testid="table-header"], th'),
  paginationSummary: (): Locator =>
    tableRoot.locator('[data-testid*="pagination-summary"], [class*="pagination-summary"]').first(),
  paginationPage: (n: number): Locator =>
    tableRoot.locator(`[data-testid*="pagination-page-${n}"], button:has-text("${n}")`).first(),
  rowsPerPage: (): Locator => tableRoot.locator('[data-testid*="rows-per-page"], select').first(),
  rowByText: (text: string): Locator =>
    tableRoot
      .locator('[data-testid*="-row-"], [data-testid="table-row"], [class*="report-listing-card"], article, tr')
      .filter({ hasText: text }),
  actionEdit: (text: string): Locator =>
    tableRoot
      .locator('[data-testid*="-row-"], [data-testid="table-row"], tr')
      .filter({ hasText: text })
      .locator('[data-testid*="action-edit"], button:has-text("Edit")')
      .first(),
  actionDelete: (text: string): Locator =>
    tableRoot
      .locator('[data-testid*="-row-"], [data-testid="table-row"], tr')
      .filter({ hasText: text })
      .locator('[data-testid*="action-delete"], button:has-text("Delete")')
      .first(),
});
