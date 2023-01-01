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

    const snackbar = page.locator('mat-snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      usersPage.createUser(`TestUser`, `TestUser`, `Write`)
    ]);

    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('[matsnackbarlabel]').innerText(),
      snackbar.locator('[matsnackbaractions]').innerText()
    ]);

    expect(message).toBe('User TestUser added');
    expect(type).toBe('Success');
  });

  test("TestUser should exists", async () => {
    const testUser = await usersPage.findUser('TestUser');
    expect(await testUser.count()).toBe(1);

    const data = await Promise.all([
      usersPage.getUserName(testUser),
      usersPage.getUserRole(testUser)
    ]);
    expect(data).toStrictEqual(['TestUser', 'write']);
  });

  test("duplicate username is forbidden", async ({page}) => {
    const snackbar = page.locator('mat-snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      usersPage.createUser(`TestUser`, `TestUser`, `read`)
    ]);
    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('[matsnackbarlabel]').innerText(),
      snackbar.locator('[matsnackbaractions]').innerText()
    ]);

    expect(message).toBe('Username allready taken');
    expect(type).toBe('Error');
  });
});
