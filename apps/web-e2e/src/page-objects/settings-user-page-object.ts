import { expect, Locator } from "@playwright/test";
import { AbstractPageObject } from "./abstract-page-object";

export class SettingsPageObject extends AbstractPageObject {

  get userList(): Locator {
    const table = this.page.locator('[data-e2e="users-list"]');
    return table;
  }

  protected async initialize(): Promise<void> {
    await this.page.goto('http://localhost:4200/settings', { waitUntil: 'networkidle' });
    expect(this.page.url()).toContain('/settings');

    // useless to add an data attribute since angular material does not use it
    const userTab = this.page.locator('#mat-tab-label-0-1');
    await expect(userTab).toBeVisible();
    await userTab.click();
  }

  async getUsers(): Promise<Locator> {
    return this.userList.locator('[data-e2e="users-list--row"]');
  }
}
