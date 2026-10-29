import { Locator, Page } from '@playwright/test';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MainNav } from '../../components/MainNav';
import { LanguageToggle } from '../../components/LanguageToggle';
import { homeLocators } from '../../locators/public/home.locators';

export class HomePage {
  public readonly header: Header;
  public readonly footer: Footer;
  public readonly mainNav: MainNav;
  public readonly languageToggle: LanguageToggle;
  private readonly L: ReturnType<typeof homeLocators>;

  constructor(
    private readonly page: Page,
    private readonly baseUrl?: string,
  ) {
    this.header = new Header(page);
    this.footer = new Footer(page);
    this.mainNav = new MainNav(page);
    this.languageToggle = new LanguageToggle(page);
    this.L = homeLocators(page);
  }

  public async goto(): Promise<void> {
    const target = this.baseUrl ? `${this.baseUrl}/` : '/';
    await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public heroSection(): Locator {
    return this.L.hero();
  }

  public statsSection(): Locator {
    return this.L.stats();
  }

  public statReports(): Locator {
    return this.L.statReports();
  }

  public statOffices(): Locator {
    return this.L.statOffices();
  }

  public async getStatsCount(): Promise<number> {
    return this.L.statCards().count();
  }

  public get nav(): MainNav {
    return this.mainNav;
  }

  public hero(): Locator {
    return this.heroSection();
  }

  public stats(): Locator {
    return this.statsSection();
  }
}
