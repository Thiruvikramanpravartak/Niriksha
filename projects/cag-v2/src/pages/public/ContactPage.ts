import { Locator, Page } from '@playwright/test';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MainNav } from '../../components/MainNav';
import { contactLocators } from '../../locators/public/contact.locators';

export class ContactPage {
  public readonly header: Header;
  public readonly footer: Footer;
  public readonly mainNav: MainNav;
  private readonly L: ReturnType<typeof contactLocators>;

  constructor(
    private readonly page: Page,
    private readonly baseUrl?: string,
  ) {
    this.header = new Header(page);
    this.footer = new Footer(page);
    this.mainNav = new MainNav(page);
    this.L = contactLocators(page);
  }

  public async goto(): Promise<void> {
    const target = this.baseUrl ? `${this.baseUrl}/Contact/Contact-Us` : '/Contact/Contact-Us';
    await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 35000 });
  }

  public get form(): Locator {
    return this.L.form();
  }

  public get nameInput(): Locator {
    return this.L.nameInput();
  }

  public get emailInput(): Locator {
    return this.L.emailInput();
  }

  public get mobileInput(): Locator {
    return this.L.mobileInput();
  }

  public get categorySelect(): Locator {
    return this.L.categorySelect();
  }

  public get feedbackTextarea(): Locator {
    return this.L.feedbackTextarea();
  }

  public get captchaInput(): Locator {
    return this.L.captchaInput();
  }

  public get submitBtn(): Locator {
    return this.L.submitBtn();
  }

  public async submit(): Promise<void> {
    await this.L.submitBtn().click();
  }

  public async fillForm(data: {
    name?: string;
    email?: string;
    mobile?: string;
    category?: string;
    feedback?: string;
    captcha?: string;
  }): Promise<void> {
    if (data.name !== undefined) await this.L.nameInput().fill(data.name);
    if (data.email !== undefined) await this.L.emailInput().fill(data.email);
    if (data.mobile !== undefined) await this.L.mobileInput().fill(data.mobile);
    if (data.category !== undefined) await this.L.categorySelect().selectOption({ label: data.category });
    if (data.feedback !== undefined) await this.L.feedbackTextarea().fill(data.feedback);
    if (data.captcha !== undefined) await this.L.captchaInput().fill(data.captcha);
  }

  public async getErrorTexts(): Promise<string[]> {
    return this.L.errorMessages().allTextContents();
  }

  public get nameError(): Locator {
    return this.L.nameError();
  }

  public get emailError(): Locator {
    return this.L.emailError();
  }

  public get mobileError(): Locator {
    return this.L.mobileError();
  }

  public get categoryError(): Locator {
    return this.L.categoryError();
  }

  public get feedbackError(): Locator {
    return this.L.feedbackError();
  }

  public get captchaError(): Locator {
    return this.L.captchaError();
  }
}
