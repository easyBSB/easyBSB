import { expect, Locator, test } from "@playwright/test";
import { UsersPageObject } from "../../page-objects/Users.page.object";

test.describe("Admin is not allowed", () => {

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

  test("to change own role", async ({page}) => {
    const snackbar = page.locator('snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      await settingsPage.updateAndSaveUser(admin, void 0, void 0, 'Read')
    ]);

    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('Not allowed to change own role.');
    expect(type).toBe('Error');
    expect(await settingsPage.getUserRole(admin)).toBe('Admin')
  });

  test("to delete himself", async ({page}) => {
    const snackbar = page.locator('snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      settingsPage.deleteUser(admin)
    ]);
    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('Not allowed to remove yourself');
    expect(type).toBe('Error');
  });
});
