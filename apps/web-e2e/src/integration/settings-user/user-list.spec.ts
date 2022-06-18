import { expect, test } from "@playwright/test";
import { SettingsPageObject } from "../../page-objects/settings-user-page-object";

test.describe("App: sidebar", () => {

  let settingsPage: SettingsPageObject;

  test.beforeEach(async ({ page, request }) => {
    settingsPage = new SettingsPageObject(page, request);
    await settingsPage.bootstrap();
  });

  test.only("should contain sidebar with settings icon", async () => {
    const users = await settingsPage.getUsers();
    expect(await users.count()).toBe(1);

    const cols = users.locator('[data-e2e="users-list--control"]');
    expect(await cols.nth(0).locator('input').inputValue()).toBe('easybsb');
    expect(await cols.nth(1).innerText()).toBe('*****');
    expect(await cols.nth(2).innerText()).toBe('Admin');
  });
});
