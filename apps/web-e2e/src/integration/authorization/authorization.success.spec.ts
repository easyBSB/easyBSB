import { test, expect } from '@playwright/test';

test.describe.serial('Test Authorization', () => {

  /**
   * @description log in to app, and save the sessionStorage inside the
   * process environment variable
   */
  test('Login success', async ({ page, context }) => {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle'});
    expect(page.url()).toBe('http://localhost:4200/login')

    // do login
    const usernameControl = page.locator('[data-e2e="authorization-login-username"] input[type="text"]')
    const passwordControl = page.locator('[data-e2e="authorization-login-password"] input[type="password"]')
    await usernameControl.fill('easybsb')
    await passwordControl.fill('easybsb')

    // send data and wait for response
    const [response] = await Promise.all([
      page.waitForResponse('http://localhost:3333/api/auth/login'),
      page.waitForNavigation({ url: 'http://localhost:4200/dashboard' }),
      passwordControl.press('Enter')
    ])

    const body = await response.body()
    const data = JSON.parse(body.toString('utf-8'));

    expect(response.status()).toBe(201)
    expect(Object.keys(data)).toContain('jwt')

    // should redirect now
    expect(page.url()).toBe('http://localhost:4200/dashboard')
    
    // save session storage values so we can use it again
    process.env['SESSION_STORAGE'] = await page.evaluate(() => JSON.stringify(sessionStorage));
  })

  /**
   * @description as soon we have received a session token it should not be required that we have
   * to login again since we are authorized now
   */
  test('Should stay logged in an not redirect if jwt is inside storage', async ({ context }) => {
    const sessionStorageDump = JSON.parse(process.env['SESSION_STORAGE'] ?? '{}');
    await context.addInitScript((storage: Record<string, string>) => {
      for (const [key, value] of Object.entries(storage)) {
        window.sessionStorage.setItem(key, value as string)
      }
    }, sessionStorageDump)

    // go to page
    const page = await context.newPage()
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle'});

    // test and clean up
    expect(page.url()).toBe('http://localhost:4200/dashboard')
    delete process.env['SESSION_STORAGE']
  })
})
