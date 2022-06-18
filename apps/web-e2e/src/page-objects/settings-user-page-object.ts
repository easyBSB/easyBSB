import { expect, Locator } from "@playwright/test";
import { matSelectValue } from "../support/mat-select";
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

  /**
   * @description get all users 
   */
  getUsers(): Locator {
    return this.userList.locator('[data-e2e="users-list-row"]');
  }

  /**
   * @description get col of user 
   */
  getUserCol(row: number, locator?: Locator): Locator {
    return this.getUsers().nth(row).locator('td');
  }

  async getUserName(cols: Locator): Promise<string> {
    return cols.nth(0).locator('input').inputValue();
  }

  async getUserRole(cols: Locator): Promise<string> {
    return await cols.nth(2).textContent() ?? '';
  }

  writeUserName(index: number, value: string) {
  }

  cancelEditUser(row: number) {}

  deleteUser(row: number) {}

  async editAndSaveUser(index: number, username?: string, password?: string, role?: string): Promise<void> {
    const userCols = this.getUserCol(index);
    const actions = await this.findInLocatorResult(userCols, 'data-e2e', 'users-list-actions');
    expect(await actions.count()).toBe(1);

    const editBtn = actions.locator('[data-e2e="users-list-actions-edit"]');
    expect(await editBtn.count()).toBe(1);
    await editBtn.click()

    await this.fillUser(userCols, username, password, role);

    const accept = actions.locator('[data-e2e="users-list-actions-accept"]');
    expect(await accept.count()).toBe(1);
    await accept.click()
  }

  writeUser(row: number) {}

  /**
   * @description fill user data
   */
  private async fillUser(cols: Locator, username?: string, password?: string, role?: string): Promise<void> {
    if (username) {
      const control = await this.getUserControl(cols, 'users-list-name', 'input')
      await control.fill(username);
    }

    if (password) {
      const control = await this.getUserControl(cols, 'users-list-password', 'input')
      await control.fill(password);
    }

    if (role) {
      const control = await this.getUserControl(cols, 'users-list-role', 'mat-select')
      await matSelectValue(this.page, control, role)
    }
  }

  /**
   * @description get specific control from user table
   * @param cols page locator object all [row > td] elements
   * @param colSelector every col has a data-e2e attribute with specific name like users-list-{role,name,password}
   */
  private async getUserControl(cols: Locator, colSelector: string, ctrlSelector: string): Promise<Locator> {
      const userCtrl = await this.findInLocatorResult(cols, 'data-e2e', colSelector);

      expect(await userCtrl.count()).toBe(1);
      const ctrl = userCtrl.locator(ctrlSelector)
      expect(await ctrl.count()).toBe(1);
      return ctrl;
  }

  /**
   * @description every locator can contain multiple, this works like a filter we search 
   * for something specific
   */
  private async findInLocatorResult(locator: Locator, attribute: string, needle: string): Promise<Locator> {
    const count = await locator.count();
    let match: Locator | undefined = void 0;
    for (let i = 0; i < count; i++) {
      const found = await locator.nth(i).getAttribute(attribute);
      if (found !== void 0 && found === needle) {
        match = locator.nth(i);
        break;
      }
    }

    if (match === undefined) {
      throw `no Locator found for attribute ${attribute} with ${needle}`;
    }
    return match as Locator;
  }
}
