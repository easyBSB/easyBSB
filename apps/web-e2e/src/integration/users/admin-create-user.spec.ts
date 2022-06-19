import { expect, test } from "@playwright/test";
import { UsersPageObject } from "../../page-objects/Users.page.object";

test.describe("Create new user", () => {

  let usersPage: UsersPageObject;

  test.beforeEach(async ({ page, request }) => {
    usersPage = new UsersPageObject(page, request);
    await usersPage.bootstrap();
  });

  test.afterAll(async () => {
    const testUser = await usersPage.findUser('TestUser');
    expect(await testUser.count()).toBe(1);
    await usersPage.deleteUser(testUser);
  })

  test("can create new user", async ({page}) => {

    const snackbar = page.locator('snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      usersPage.createUser(`TestUser`, `TestUser`, `Write`)
    ]);
    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('User TestUser added.');
    expect(type).toBe('Success');
  });

  test("TestUser should exists", async ({page}) => {
    const testUser = await usersPage.findUser('TestUser');
    expect(await testUser.count()).toBe(1);

    const data = await Promise.all([
      usersPage.getUserName(testUser),
      usersPage.getUserRole(testUser)
    ]);
    expect(data).toStrictEqual(['TestUser', 'Write']);
  });

  test("duplicate username is forbidden", async ({page}) => {
    const snackbar = page.locator('snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      usersPage.createUser(`TestUser`, `TestUser`, `Read`)
    ]);
    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('Username allready taken');
    expect(type).toBe('Error');
  });
});
