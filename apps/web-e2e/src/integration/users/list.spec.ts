import { expect, Locator, test } from "@playwright/test";
import { UsersPageObject } from "../../page-objects/Users.page.object";

test.describe("Users list", () => {

  let settingsPage: UsersPageObject;
  let admin: Locator;

  test.beforeEach(async ({ page, request }) => {
    settingsPage = new UsersPageObject(page, request);
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
