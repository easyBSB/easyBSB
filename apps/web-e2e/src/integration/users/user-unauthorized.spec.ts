
import { expect, test } from "@playwright/test";
import { UsersPageObject } from "../../page-objects/Users.page.object";
import { resolveSessionToken } from "../../support/authorize";

test.describe("Create new user", () => {

  let usersPage: UsersPageObject;

  const username = `unauthorizedUser-${Math.random().toString(32)}`;
  const password = `unauthorizedUser`;
  const role = 'read';

  test.beforeEach(async({page, request}) => {
    // better solution for this ?
    usersPage = new UsersPageObject(page, request);
    await usersPage.bootstrap();

    const snackbar = page.locator('snack-bar-container');
    await Promise.all([
      snackbar.waitFor({ state: 'visible'}),
      usersPage.createUser(username, password, role)
    ]);

    // close message
    await snackbar.locator('.mat-simple-snackbar-action').click();
    
    const token = await resolveSessionToken(request, username, password);
    await usersPage.setSessionToken(token);
  })

  test.afterEach(async () => {
    const user = await usersPage.findUser(username);
    await usersPage.execAsAdmin<UsersPageObject>('deleteUser', user);
  })

  test(`shoud have unauthorized user`, async () => {
    const user = await usersPage.findUser(username);
    expect (await user.count()).toBe(1);
  })

  test(`shoud not be allowed to add a new user`, async ({page}) => {
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

  test(`shoud not be allowed to delete an user`, async ({page}) => {
    const easybsb = await usersPage.findUser('easybsb');
    await usersPage.deleteUser(easybsb);

    const snackbar = page.locator('snack-bar-container');
    snackbar.waitFor({ state: 'visible'});
    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('Forbidden');
    expect(type).toBe('Error');
  })

  test(`shoud not be allowed edit a user`, async ({page}) => {
    const easybsb = await usersPage.findUser('easybsb');
    await usersPage.updateAndSaveUser(easybsb, void 0, 'PassWordChanged', void 0)

    const snackbar = page.locator('snack-bar-container');
    snackbar.waitFor({ state: 'visible'});
    expect(await snackbar.count()).toBe(1);

    const [message, type] = await Promise.all([
      snackbar.locator('.mat-simple-snack-bar-content').innerText(),
      snackbar.locator('.mat-simple-snackbar-action').innerText()
    ]);

    expect(message).toBe('Forbidden');
    expect(type).toBe('Error');
  })
});
