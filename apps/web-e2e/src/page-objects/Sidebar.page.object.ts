import { Locator, Page } from "@playwright/test";

export class SidebarPageObject {

  constructor(
    protected readonly page: Page,
  ) {}

  getSidebar(): Locator {
    return this.page.getByTestId('easybsb-sidebar');
  }

  getHomeButton(): Locator {
    const sidebar = this.getSidebar();
    return sidebar.getByTestId('easybsb-sidebar-home')
  }

  getDevicesButton(): Locator {
    const sidebar = this.getSidebar();
    return sidebar.getByTestId('easybsb-sidebar-devices')
  }

  getUsersButton(): Locator {
    const sidebar = this.getSidebar();
    return sidebar.getByTestId('easybsb-sidebar-users')
  }

  async clickMenuEntryDevices(): Promise<void> {
    const btn = this.getDevicesButton();
    await btn.click();
  }

  async clickMenuEntryUsers(): Promise<void> {
    const btn = this.getUsersButton();
    await btn.click();
  }

  async clickMenuEntryHome(): Promise<void> {
    const btn = this.getHomeButton();
    await btn.click();
  }
}
