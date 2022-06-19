import { expect, Locator, test } from "@playwright/test";
import { SettingsPageObject } from "../../page-objects/settings-user-page-object";

test.describe("Users list", () => {

  let settingsPage: SettingsPageObject;
  let admin: Locator;

  test.beforeEach(async ({ page, request }) => {
    settingsPage = new SettingsPageObject(page, request);
    await settingsPage.bootstrap();
  });

  test.beforeEach(async () => {
    admin = await settingsPage.findUser('easybsb');
    expect(await admin.count()).toBe(1);
  });

  test("should contain default easybsb user", async () => {
    const data = await Promise.all([
      settingsPage.getUserName(admin),
      settingsPage.getUserRole(admin)
    ]);
    expect(data).toStrictEqual(['easybsb', 'Admin']);
  });
});
