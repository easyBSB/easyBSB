import { Page } from "@playwright/test"

/**
 * @description login and save sessionStorageDump
 */
export async function loginAndCacheSession(page: Page, username='easybsb', password ='easybsb') {
  if (!process.env['SESSION_STORAGE']) {
    page.goto('http://localhost:4200/login')

    const usernameControl = page.locator('[data-e2e="authorization-login-username"] input[type="text"]')
    const passwordControl = page.locator('[data-e2e="authorization-login-password"] input[type="password"]')
    await usernameControl.fill(username)
    await passwordControl.fill(password)

    await Promise.all([
      page.waitForResponse('http://localhost:4200/api/auth/login'),
      passwordControl.press('Enter')
    ])

    process.env['SESSION_STORAGE'] = await page.evaluate(() => JSON.stringify(sessionStorage))
    return
  }

  page.addInitScript((sessionStorageDump: string) => {
    const keyValue = Object.entries<string>(JSON.parse(sessionStorageDump))
    for (const [key, value] of keyValue) {
      window.sessionStorage.setItem(key, value)
    }
  }, process.env['SESSION_STORAGE'])
}

/**
 * @description clear all session data
 */
export async function clearSession() {
  delete process.env['SESSION_STORAGE']
}
