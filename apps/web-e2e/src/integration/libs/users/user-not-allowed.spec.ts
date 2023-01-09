
import { expect, test } from "@playwright/test";
import { User } from "../../../fixtures/User";
import { UsersPageObject } from "@e2e/page-objects/Users";
import { resolveSessionToken } from "../../../utils/authorize";
import { createUser, removeUser, updateUser } from "../../../utils/user.support";

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

  test(`shoud have unauthorized user`, async () => {
    const user = await usersPage.findUser(username);
    expect (await user.count()).toBe(1);
  })

  test.skip(`shoud not be allowed to add a new user`, async ({page}) => {
    await usersPage.createUser('IAdmin', 'IAdmin', 'admin')

    const snackbar = page.locator('snack-bar-container');
    await snackbar.waitFor({ state: 'visible'}),
    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('Forbidden');
    expect(type).toBe('Error');
  })

  test(`should be see only himself`, async () => {
    const user = await usersPage.findUser(username);
    expect(await user.count()).toBe(1);

    const [name, role] = await Promise.all([
      usersPage.getUserName(user),
      usersPage.getUserRole(user)
    ])

    expect(name).toEqual(username);
    expect(role).toEqual('read');
  })

  test.skip(`shoud not be allowed to delete himself`, async ({page}) => {
    const user = await usersPage.findUser(username);

    const snackbar = page.locator('snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      usersPage.deleteUser(user)
    ]);

    const message = await snackbar.locator('.mat-simple-snack-bar-content').innerText();
    const type = await snackbar.locator('.mat-simple-snackbar-action').innerText();

    expect(message).toBe('Forbidden');
    expect(type).toBe('Error');
  })

  test.skip(`shoud not be allowed to change role`, async ({page}) => {
    const user = await usersPage.findUser(username);
    await usersPage.updateAndSaveUser(user, void 0, void 0, 'admin')

    const snackbar = page.locator('snack-bar-container');
    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('Not allowed to change own role.');
    expect(type).toBe('Error');
  })

  test.skip(`shoud not be allowed to change username`, async ({page}) => {
    const user = await usersPage.findUser(username);
    const snackbar = page.locator('snack-bar-container');
    await usersPage.updateAndSaveUser(user, 'klaus');
    const message = await snackbar.locator('.mat-simple-snack-bar-content').innerText();
    const type = await snackbar.locator('.mat-simple-snackbar-action').innerText();

    expect(message).toBe('Not allowed to change own name.');
    expect(type).toBe('Error');
  })

  test(`should be not allowed to update custom user`, async ({request}) => {
    const sessionToken = await resolveSessionToken(request, username, password);
    const victim = await createUser(request, adminToken, {
      name: `AdminUser-` + Math.random().toString(32),
      password: `Testuser2Password`,
      role: `admin`
    });

    const result = await updateUser(request, sessionToken, victim.id, { password: 'hack3d' });
    expect(result).toBe('error');
  })
});
