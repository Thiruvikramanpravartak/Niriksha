import { Locator, Page } from '@playwright/test';
import { resourcesLibraryLocators } from '../../locators/public/resourcesLibrary.locators';

export class ResourcesLibraryPage {
  public readonly L: ReturnType<typeof resourcesLibraryLocators>;

  constructor(private readonly page: Page) {
    this.L = resourcesLibraryLocators(page);
  }

  public async goto(subpath?: string): Promise<void> {
    const isMock = process.env.MOCK === '1';
    const target = isMock
      ? subpath
        ? `/resources/${subpath}`
        : '/resources'
      : subpath
        ? `/Resources/${subpath}`
        : '/Resources';
    await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public root(): Locator {
    return this.L.container();
  }

  public title(): Locator {
    return this.L.title();
  }

  public categoryCards(): Locator {
    return this.L.categoryCards();
  }

  public categoryCard(slug: string): Locator {
    return this.L.categoryCard(slug);
  }

  public tendersTable(): Locator {
    return this.L.tendersTable();
  }

  public circularsTable(): Locator {
    return this.L.circularsTable();
  }

  public documentList(): Locator {
    return this.L.documentList();
  }
}
