import { expect, Locator } from "@playwright/test";
import { matSelectValue } from "../support/mat-select";
import { AbstractPageObject } from "./Abstract.page.object";

export class UsersPageObject extends AbstractPageObject {

  get userList(): Locator {
    const table = this.page.locator('[data-e2e="users-list"]');
    return table;
  }

  protected async initialize(): Promise<void> {
    await this.navigate();
  }

  async reload(): Promise<void> {
    await this.navigate();
  }

  /**
   * user tab is allready loaded
   */
  private async navigate(): Promise<void> {

    await this.page.goto('http://localhost:4200/settings/users', { waitUntil: 'networkidle' });
    expect(this.page.url()).toContain('/settings');

    const userTab = this.page.getByRole('tab', { name: 'users' });
    await expect(userTab).toBeVisible();
    await userTab.click();
  }

  /**
   * @description get all users 
   */
  async getUsers(): Promise<Locator> {
    await this.page.waitForSelector('[data-e2e="users-list-row"]');
    return this.userList.locator('[data-e2e="users-list-row"]');
  }

  async findUser(name: string): Promise<Locator> {
    const rows = await this.getUsers();
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const ctrl = await row.locator('[data-e2e="users-list-name"] input');

      expect(await ctrl.count()).toBe(1);
      const value = await ctrl.inputValue();
      if (value === name) {
        return row;
      }
    }

    throw `not found`;
  }

  async getUserCol(row: number): Promise<Locator> {
    return (await this.getUsers()).nth(row).locator('td');
  }

  async getUserName(row: Locator): Promise<string> {
    const ctrl = row.locator('[data-e2e="users-list-name"] input');
    expect(await ctrl.count()).toBe(1);
    return ctrl.inputValue();
  }

  async getUserRole(row: Locator): Promise<string> {
    const ctrl = row.locator('[data-e2e="users-list-role"] .mat-mdc-select-value-text');
    await ctrl.waitFor({ state: "visible" })
    return ctrl.innerText();
  }

  async createUser(username: string, password: string, role: string): Promise<void> {
    const create = this.page.locator('[data-e2e="users-list-actions-create"]');
    expect(await create.count()).toBe(1);
    await create.click();

    // should have a new row
    const editRow = this.page.locator('table tr[data-phantom="true"]');
    await editRow.waitFor({ state: "attached" });
    await this.updateUser(editRow, username, password, role);
    await this.writeUser(editRow);
  }

  async deleteUser(row: Locator): Promise<void> {

    const deleteAction = row.locator('[data-e2e="users-list-actions-delete"]');
    expect(await deleteAction.count()).toBe(1);
    await deleteAction.click()
  }

  async updateAndSaveUser(row: Locator, username?: string, password?: string, role?: string): Promise<void> {
    const edit = row.locator('[data-e2e="users-list-actions-edit"]');
    expect(await edit.count()).toBe(1);
    await edit.click();

    await this.updateUser(row, username, password, role);
    await this.writeUser(row);
  }

  async writeUser(row: Locator) {
    const accept = row.locator('[data-e2e="users-list-actions-accept"]');
    expect(await accept.count()).toBe(1);
    await accept.click();
  }

  /**
   * @description fill user data
   */
  async updateUser(row: Locator, username?: string, password?: string, role?: string): Promise<void> {
    if (username) {
      const ctrl = row.locator('[data-e2e="users-list-name"] input');
      await ctrl.fill(username)
    }

    if (password) {
      const ctrl = row.locator('[data-e2e="users-list-password"] input');
      await ctrl.fill(password);
    }

    if (role) {
      const ctrl = row.locator('[data-e2e="users-list-role"] mat-select');
      await matSelectValue(this.page, ctrl, role)
    }
  }
}
