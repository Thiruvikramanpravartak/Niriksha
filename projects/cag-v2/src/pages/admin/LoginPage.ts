import { Locator, Page } from '@playwright/test';
import { loginLocators } from '../../locators/admin/login.locators';

export class LoginPage {
  private readonly L: ReturnType<typeof loginLocators>;

  constructor(
    private readonly page: Page,
    private readonly adminUrl?: string,
  ) {
    this.L = loginLocators(page);
  }

  public async goto(): Promise<void> {
    const target = this.adminUrl ? `${this.adminUrl}/login` : '/admin/login';
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  public root(): Locator {
    return this.L.container();
  }

  public usernameInput(): Locator {
    return this.L.usernameInput();
  }

  public passwordInput(): Locator {
    return this.L.passwordInput();
  }

  public submitButton(): Locator {
    return this.L.submitBtn();
  }

  public errorMessage(): Locator {
    return this.L.errorMessage();
  }

  public rememberMeCheckbox(): Locator {
    return this.L.rememberMeCheckbox();
  }

  public async login(username: string, pass: string): Promise<void> {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(pass);
    const captcha = this.L.captchaInput();
    if ((await captcha.count()) > 0 && (await captcha.isVisible())) {
      const code = (await this.L.captchaCodeText().textContent())?.trim();
      if (code) {
        await captcha.fill(code);
      }
    }
    await this.submitButton().click();
    await this.page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  public async getErrorText(): Promise<string> {
    return (await this.errorMessage().textContent()) ?? '';
  }
}
