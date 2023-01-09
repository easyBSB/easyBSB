import { Locator, Page } from "@playwright/test";

export class AppMainPage {

  get sidebar(): Locator {
    return this.page.locator('[data-e2e="app-menu"]');
  }

  get homebutton(): Locator {
    return this.sidebar.locator('[data-e2e="app-menu--dashboard"]');
  }

  get settingsButton(): Locator {
    return this.sidebar.locator('[data-e2e="app-menu--settings"]');
  }

  constructor(
    public readonly page: Page
  ) {}

  async gotoSettings(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation({ url: "http://localhost:4200/settings" }),
      this.settingsButton.click()
    ]);
  }

  async gotoHome(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation({ url: "http://localhost:4200/dashboard" }),
      this.homebutton.click()
    ]);
  }
}
