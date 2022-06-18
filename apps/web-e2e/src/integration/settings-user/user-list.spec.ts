import { expect, Locator, test } from "@playwright/test";
import { SettingsPageObject } from "../../page-objects/settings-user-page-object";

test.describe("App: sidebar", () => {

  let settingsPage: SettingsPageObject;

  test.beforeEach(async ({ page, request }) => {
    settingsPage = new SettingsPageObject(page, request);
    await settingsPage.bootstrap();
  });

  test.only("should contain default easybsb user", async () => {
    const users = await settingsPage.getUsers();
    expect(await users.count()).toBe(1);

    const user: Locator = settingsPage.getUserCol(0);
    const data = await Promise.all([
      settingsPage.getUserName(user),
      settingsPage.getUserRole(user)
    ]);

    expect(data).toStrictEqual(['easybsb', 'Admin']);
  });

  test.only("Logged in admin user is not allowed to change own role", async () => {
    await settingsPage.editAndSaveUser(0, void 0, void 0, 'Read');
  });
});
