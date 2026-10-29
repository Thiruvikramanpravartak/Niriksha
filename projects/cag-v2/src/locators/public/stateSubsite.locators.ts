import type { Locator, Page } from 'playwright';

const stateNames: Record<string, string> = {
  dl: 'Delhi',
  mh: 'Maharashtra',
  ka: 'Karnataka',
};

export const stateSubsiteLocators = (page: Page) => ({
  subsiteTitle: (): Locator => page.getByTestId('state-subsite-title').or(page.locator('h1, h2')).first(),
  pageTitle: (): Locator =>
    page.getByTestId('states-page-title').or(page.locator('h1:has-text("State"), h1')).first(),
  searchBox: (): Locator =>
    page.getByTestId('states-search-input').or(page.locator('input[type="text"], input')).first(),
  listButton: (): Locator => page.getByTestId('states-toggle-list').or(page.locator('button:has-text("List")')).first(),
  mapButton: (): Locator => page.getByTestId('states-toggle-map').or(page.locator('button:has-text("Map")')).first(),
  pagPanel: (): Locator => page.getByTestId('state-pag-details').or(page.locator('.op-page, main, article')).first(),
  stateCard: (code: string): Locator => {
    const name = stateNames[code.toLowerCase()] || code;
    return page
      .getByTestId(`state-card-${code.toLowerCase()}`)
      .or(page.locator(`div:has(h3:has-text("${name}")), [class*="card"]:has-text("${name}"), div:has(h3)`))
      .first();
  },
  stateName: (code: string): Locator => {
    const name = stateNames[code.toLowerCase()] || code;
    return page
      .getByTestId(`state-name-${code.toLowerCase()}`)
      .or(page.locator(`h3:has-text("${name}"), h3`))
      .first();
  },
  pagOffice: (code: string): Locator => {
    const name = stateNames[code.toLowerCase()] || code;
    return page
      .getByTestId(`state-pag-office-${code.toLowerCase()}`)
      .or(page.locator(`div:has(h3:has-text("${name}")) a, div:has(h3) a, .op-page a`))
      .first();
  },
  pagName: (code: string): Locator => {
    const name = stateNames[code.toLowerCase()] || code;
    return page
      .getByTestId(`state-pag-name-${code.toLowerCase()}`)
      .or(page.locator(`div:has(h3:has-text("${name}")) a, div:has(h3) a, .op-page a`))
      .first();
  },
  subsiteLink: (code: string): Locator => {
    const name = stateNames[code.toLowerCase()] || code;
    return page
      .getByTestId(`state-subsite-link-${code.toLowerCase()}`)
      .or(page.locator(`div:has(h3:has-text("${name}")) a[href*="/ae/"], div:has(h3:has-text("${name}")) a, a[href*="/ae/"]`))
      .first();
  },
  reportsLink: (code: string): Locator => {
    const name = stateNames[code.toLowerCase()] || code;
    return page
      .getByTestId(`state-reports-link-${code.toLowerCase()}`)
      .or(page.locator(`div:has(h3:has-text("${name}")) a, a[href*="report"], .about-sidebar a, .op-page a`))
      .first();
  },
  accountsLink: (code: string): Locator => {
    const name = stateNames[code.toLowerCase()] || code;
    return page
      .getByTestId(`state-accounts-link-${code.toLowerCase()}`)
      .or(page.locator(`div:has(h3:has-text("${name}")) a, a[href*="account" i], .about-sidebar a, .op-page a`))
      .first();
  },
});
