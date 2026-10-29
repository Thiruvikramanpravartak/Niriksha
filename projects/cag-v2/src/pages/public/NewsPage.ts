import { Locator, Page } from '@playwright/test';
import { EnvConfig } from '@qa/core';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MainNav } from '../../components/MainNav';
import { Breadcrumb } from '../../components/Breadcrumb';
import { LanguageToggle } from '../../components/LanguageToggle';
import { newsLocators } from '../../locators/public/news.locators';
import { commonLocators } from '../../locators/common.locators';

export class NewsPage {
  public readonly header: Header;
  public readonly footer: Footer;
  public readonly nav: MainNav;
  public readonly breadcrumb: Breadcrumb;
  public readonly languageToggle: LanguageToggle;
  private readonly L: ReturnType<typeof newsLocators>;

  constructor(
    private readonly page: Page,
    private readonly config?: EnvConfig,
  ) {
    const common = commonLocators(page);
    this.header = new Header(common.header());
    this.footer = new Footer(common.footer());
    this.nav = new MainNav(common.nav());
    this.breadcrumb = new Breadcrumb(common.breadcrumb());
    this.languageToggle = new LanguageToggle(common.languageToggle());

    this.L = newsLocators(page);
  }

  public async goto(): Promise<void> {
    const base = this.config?.baseUrl ?? '';
    const route = process.env.MOCK === '1' ? '/news' : '/News-and-Events';
    await this.page.goto(base ? `${base}${route}` : route, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public titleLocator(): Locator {
    return this.L.title();
  }

  public searchInput(): Locator {
    return this.L.searchBox();
  }

  public async search(keyword: string): Promise<void> {
    const input = this.searchInput();
    await input.fill(keyword);
    await input.dispatchEvent('input');
    await input.dispatchEvent('keyup');
    const btn = this.page.locator('button[aria-label="Search"], form button[type="submit"]').first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
    } else {
      await input.press('Enter');
    }
    await this.page.waitForTimeout(1000);
  }

  public yearSelect(): Locator {
    return this.L.yearDropdown();
  }

  public async selectYear(year: string): Promise<void> {
    await this.yearSelect().selectOption(year);
  }

  public newsCard(index: number): Locator {
    return this.L.newsCard(index);
  }

  public headline(index: number): Locator {
    return this.L.headline(index);
  }

  public pdfDownloadLink(): Locator {
    return this.L.pdfDownloadLink();
  }

  public detailSection(): Locator {
    return this.L.detailPanel();
  }

  public async openDetail(index: number): Promise<void> {
    await this.L.readMoreBtn(index).click();
  }

  public archiveLink(): Locator {
    return this.L.archive();
  }

  public pagination(): Locator {
    return this.L.paginationContainer();
  }
}
