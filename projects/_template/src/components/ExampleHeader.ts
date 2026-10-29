import { Locator } from '@playwright/test';
import { getExampleHeaderLogo } from '../locators/example.locators';

export class ExampleHeader {
  constructor(private readonly root: Locator) {}

  public rootLocator(): Locator {
    return this.root;
  }

  public logo(): Locator {
    return getExampleHeaderLogo(this.root);
  }
}
