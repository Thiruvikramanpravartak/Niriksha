import { Locator, Page } from '@playwright/test';
import { aboutUsLocators } from '../../locators/public/aboutUs.locators';

export class AboutUsPage {
  public readonly L: ReturnType<typeof aboutUsLocators>;

  constructor(private readonly page: Page) {
    this.L = aboutUsLocators(page);
  }

  public async goto(subpath?: string): Promise<void> {
    const isMock = process.env.MOCK === '1';
    const target = isMock
      ? subpath
        ? `/about-us/${subpath}`
        : '/about-us'
      : subpath
        ? `/About/About-Us/${subpath}`
        : '/About/About-Us/Cag-Of-India';
    await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public root(): Locator {
    return this.L.container();
  }

  public title(): Locator {
    return this.L.title();
  }

  public subcategories(): Locator {
    return this.L.subcategories();
  }

  public subcategoryLink(slug: string): Locator {
    return this.L.subcategoryLink(slug);
  }

  public orgChartTree(): Locator {
    return this.L.orgChartTree();
  }

  public nodeTooltip(): Locator {
    return this.L.nodeTooltip();
  }

  public breadcrumb(): Locator {
    return this.L.breadcrumb();
  }

  public async hoverNode(id: string | number): Promise<void> {
    await this.L.orgChartNode(id).hover();
  }
}
