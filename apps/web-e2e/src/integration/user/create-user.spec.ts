import { expect, Page, test, Response } from "@playwright/test";
import { clearSession, resolveSessionToken, writeSessionToken } from "../../support/authorize";

async function fillUserForm(
  page: Page,
  username: string,
  password: string,
  role: 'admin' | 'read' | 'write'
): Promise<void> {
  const nameCtrl = page.locator('input[data-e2e="easybsb-users-manage-name"]')
  const pwdCtrl = page.locator('input[data-e2e="easybsb-users-manage-password"]')
  const roleCtrl = page.locator('select[data-e2e="easybsb-users-manage-role"]')

  await nameCtrl.fill(username)
  await pwdCtrl.fill(password)
  await roleCtrl.selectOption(role)
}

test.describe('User is admin and can add new users', () => {

  test.afterAll(async() => {
    await clearSession()
  })

  test('should contain a list with default user easybsb', async ({ page, request }) => {

    const token = await resolveSessionToken(request)
    await writeSessionToken(page, token)
    await page.goto('http://localhost:4200/users', { waitUntil: 'networkidle' })

    // angular is not ready now we have to wait for it
    const rows =  page.locator('table[data-e2e="easybsb-users-list"] tbody tr')
    expect(await rows.count()).toBe(1);

    const cells = rows.locator('td');
    await expect(cells).toContainText(['easybsb', 'admin']);
  })

  test('logged in user should have access rights to add new users', async ({ page, request }) => {

    const token = await resolveSessionToken(request)
    await writeSessionToken(page, token)
    await page.goto('http://localhost:4200/users', { waitUntil: 'networkidle' })

    const createUserButton = page.locator('button[data-e2e="easybsb-user-add"]')
    await Promise.all([
      page.waitForNavigation({ url: 'http://localhost:4200/users/new' }),
      createUserButton.click()
    ])

    // should navigate to new page
    await fillUserForm(page, 'easybsbE2E', 'easybsbE2E', 'write')

    /**
     * wait for 2 calls to complete
     * 
     * 1 is create a user (POST) on /api/users
     * 2 is read all users (GET) on /api/users
     */
    let requests: string[] = [];
    const createAndRedirect = page.waitForResponse((response: Response) => {
      const requestMethod = response.request().method().toUpperCase()
      if (response.url() === 'http://localhost:4200/api/users') {
        requests.push(requestMethod);
        if (requestMethod === 'GET') {
          expect(requests).toEqual(['POST', 'GET'])
          expect(response.status()).toBe(200);
          return true;
        }
        expect(response.status()).toBe(201);
      }
      return false
    })

    // submit and wait
    await Promise.all([
      createAndRedirect,
      page.waitForNavigation({ url: 'http://localhost:4200/users' }),
      page.locator('button[data-e2e="easybsb-users-manage-submit"]').click()
    ])
  })

  test('should contain 2 users', async ({ page, request }) => {

    const token = await resolveSessionToken(request)
    await writeSessionToken(page, token)
    await page.goto('http://localhost:4200/users', { waitUntil: 'networkidle' })

    // we expect 2 calls here 1 post second get
    const rows = page.locator('table[data-e2e="easybsb-users-list"] tbody tr')
    const cells = rows.locator('td');

    expect(await rows.count()).toBe(2);
    await expect(cells).toContainText(['easybsb', 'admin', 'easybsbE2E', 'write']);
  })

  test('New user should not be allowed to create new Users with role "write"', async ({ page, request }) => {

    const token = await resolveSessionToken(request, 'easybsbE2E', 'easybsbE2E')
    await writeSessionToken(page, token)
    await page.goto('http://localhost:4200/users', { waitUntil: 'networkidle' })

    const createUserButton = page.locator('button[data-e2e="easybsb-user-add"]')
    await Promise.all([
      page.waitForNavigation({ url: 'http://localhost:4200/users/new' }),
      createUserButton.click()
    ])

    await fillUserForm(page, 'IGiveMySelfAdminRoles', 'h4ck3d', 'admin');
    await Promise.all([
      page.waitForResponse(async (response: Response) => {

        const body = JSON.parse(await response.text());

        expect(response.status()).toBe(403)
        expect(body.message).toBe('Forbidden: not allowed to add new users.')
        return true
      }),
      page.locator('button[data-e2e="easybsb-users-manage-submit"]').click()
    ])
  })
})
