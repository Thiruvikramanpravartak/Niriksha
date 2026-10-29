import { Locator, Page } from '@playwright/test';
import { EnvConfig } from '@qa/core';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MainNav } from '../../components/MainNav';
import { Breadcrumb } from '../../components/Breadcrumb';
import { LanguageToggle } from '../../components/LanguageToggle';
import { stateSubsiteLocators } from '../../locators/public/stateSubsite.locators';
import { commonLocators } from '../../locators/common.locators';

export class StatesPage {
  public readonly header: Header;
  public readonly footer: Footer;
  public readonly nav: MainNav;
  public readonly breadcrumb: Breadcrumb;
  public readonly languageToggle: LanguageToggle;
  private readonly L: ReturnType<typeof stateSubsiteLocators>;

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

    this.L = stateSubsiteLocators(page);
  }

  public async goto(): Promise<void> {
    const base = this.config?.baseUrl ?? '';
    const route = process.env.MOCK === '1' ? '/states' : '/Our-Presence/Index-Menu/State-Level-Offices?filter=ae';
    await this.page.goto(base ? `${base}${route}` : route, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public titleLocator(): Locator {
    return this.L.pageTitle();
  }

  public searchInput(): Locator {
    return this.L.searchBox();
  }

  public async search(term: string): Promise<void> {
    const input = this.searchInput();
    await input.fill(term);
    await input.dispatchEvent('input');
    await input.dispatchEvent('keyup');
  }

  public async switchToMap(): Promise<void> {
    await this.L.mapButton().click();
  }

  public async switchToList(): Promise<void> {
    await this.L.listButton().click();
  }

  public mapToggle(): Locator {
    return this.L.mapButton();
  }

  public listToggle(): Locator {
    return this.L.listButton();
  }

  public stateCard(code: string): Locator {
    return this.L.stateCard(code);
  }

  public stateName(code: string): Locator {
    return this.L.stateName(code);
  }

  public pagOffice(code: string): Locator {
    return this.L.pagOffice(code);
  }

  public pagName(code: string): Locator {
    return this.L.pagName(code);
  }

  public subsiteLink(code: string): Locator {
    return this.L.subsiteLink(code);
  }

  public reportsLink(code: string): Locator {
    return this.L.reportsLink(code);
  }

  public accountsLink(code: string): Locator {
    return this.L.accountsLink(code);
  }

  public pagDetails(): Locator {
    return this.L.pagPanel();
  }
}
