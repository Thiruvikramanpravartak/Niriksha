import { Locator, Page } from '@playwright/test';
import { ourPresenceLocators } from '../../locators/public/ourPresence.locators';

export class OurPresencePage {
  public readonly L: ReturnType<typeof ourPresenceLocators>;

  constructor(private readonly page: Page) {
    this.L = ourPresenceLocators(page);
  }

  public async goto(subpath?: string): Promise<void> {
    const isMock = process.env.MOCK === '1';
    const target = isMock
      ? subpath
        ? `/our-presence/${subpath}`
        : '/our-presence'
      : subpath
        ? `/Our-Presence/${subpath}`
        : '/Our-Presence';
    await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public root(): Locator {
    return this.L.container();
  }

  public title(): Locator {
    return this.L.title();
  }

  public centralOfficesList(): Locator {
    return this.L.centralOfficesList();
  }

  public stateAgOfficesList(): Locator {
    return this.L.stateAgOfficesList();
  }

  public trainingInstitutesList(): Locator {
    return this.L.trainingInstitutesList();
  }

  public subpageLink(slug: string): Locator {
    return this.L.subpageLink(slug);
  }

  public navMenu(): Locator {
    return this.L.navMenu();
  }
}
