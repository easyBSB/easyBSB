import { AbstractPageObject } from "./Abstract.page.object";
import { Locator } from "@playwright/test";

export class SidebarPageObject extends AbstractPageObject {

  protected async initialize(): Promise<void> {
    await this.page.goto('http://localhost:4200/dashboard', { waitUntil: 'networkidle' });
  }

  reload(): Promise<void> {
    throw new Error("Method not implemented.");
  }

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
