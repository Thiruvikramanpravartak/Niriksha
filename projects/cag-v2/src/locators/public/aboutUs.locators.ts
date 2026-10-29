import type { Locator, Page } from 'playwright';
import { TestIds } from '../testIds';

export const aboutUsLocators = (page: Page) => ({
  container: (): Locator =>
    page.getByTestId(TestIds.publicAboutUs.container).or(page.locator('main, [class*="about"], [class*="page"]')).first(),
  title: (): Locator =>
    page.getByTestId(TestIds.publicAboutUs.title).or(page.locator('h1, h2')).first(),
  subcategories: (): Locator =>
    page
      .getByTestId(TestIds.publicAboutUs.subcategories)
      .or(page.locator('a[href*="/About/About-Us/"], .about-sidebar__link, a[data-testid*="subcat"]')),
  subcategoryLink: (slug: string): Locator => {
    const slugMap: Record<string, string[]> = {
      'constitutional-mandate': ['Constitutional-Provisions', 'Vision', 'Cag-Of-India'],
      'dpc-act': ['Duties-&-Powers-Act', 'Vision', 'Cag-Of-India'],
      'organisation-structure': ['Organisation-Chart', 'Chart', 'Cag-Of-India'],
    };
    const candidates = slugMap[slug] || [slug];
    const selectors = candidates.map((c) => `a[href*="${c}"], a:has-text("${c}")`).join(', ');
    return page.getByTestId(TestIds.publicAboutUs.subcategoryLink(slug)).or(page.locator(selectors)).first();
  },
  orgChartTree: (): Locator =>
    page
      .getByTestId(TestIds.publicAboutUs.orgChartTree)
      .or(page.locator('[class*="tree"], [class*="chart"], [class*="org"], main'))
      .first(),
  orgChartNode: (id: string | number): Locator =>
    page
      .getByTestId(TestIds.publicAboutUs.orgChartNode(id))
      .or(
        page.locator(
          `[data-node-id="${id}"], [class*="cursor-pointer"]:has-text("Sanjay Murthy"), [class*="cursor-pointer"]:has-text("CAG"), [class*="node"], [class*="card"]`
        )
      )
      .first(),
  nodeTooltip: (): Locator =>
    page
      .getByTestId(TestIds.publicAboutUs.nodeTooltip)
      .or(page.locator('[role="tooltip"], [class*="tooltip"], [class*="popover"], div:has-text("Tenure")'))
      .first(),
  breadcrumb: (): Locator =>
    page
      .getByTestId(TestIds.publicAboutUs.breadcrumb)
      .or(page.locator('nav[aria-label="Breadcrumb"], [class*="breadcrumb"], nav'))
      .first(),
});
