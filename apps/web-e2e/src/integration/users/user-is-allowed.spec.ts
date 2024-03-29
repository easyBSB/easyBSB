
import { expect, test } from "@playwright/test";
import { User } from "../../fixtures/User";
import { UsersPageObject } from "../../page-objects/Users.page.object";
import { resolveSessionToken } from "../../support/authorize";
import { createUser, removeUser } from "../../support/user.support";

test.describe("Create new user", () => {

  let usersPage: UsersPageObject;
  let adminToken: string;
  let createdUser: User;

  const username = `unauthorizedUser-${Math.random().toString(32)}`;
  const password = `unauthorizedUser`;
  const role = 'read';

  test.beforeAll(async ({request}) => {
    // create user
    adminToken = await resolveSessionToken(request);
    createdUser = await createUser(request, adminToken, {
      name: username,
      password,
      role
    });
  })

  test.beforeEach(async({page, request}) => {
    usersPage = new UsersPageObject(page, request);
    await usersPage.bootstrap(username, password);
  })

  test.afterAll(async ({ request }) => {
    await removeUser(request, adminToken, createdUser.id);
  })

  test.skip(`should be allowed to update his own password`, async ({page, request}) => {
    const user = await usersPage.findUser(username);
    const snackbar = page.locator('snack-bar-container');

    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      usersPage.updateAndSaveUser(user, void 0, 'changedpassword')
    ]);

    expect(await snackbar.count()).toBe(1);
    const message = await snackbar.locator('.mat-simple-snack-bar-content').innerText();
    const type = await snackbar.locator('.mat-simple-snackbar-action').innerText();

    try {
      const token = await resolveSessionToken(request, username, 'changedpassword');
      expect(token).toBeDefined();
    } catch(error) {
      console.error(error);
      expect(true).toBeFalsy();
    }

    expect(message).toBe(`User ${username} saved`);
    expect(type).toBe('Success');
  })
});
