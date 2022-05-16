import { APIRequestContext, Page } from "@playwright/test"

/**
 * @description login and save sessionStorageDump
 */
export async function loginAndCacheSession(page: Page, username='easybsb', password ='easybsb', override = false) {
  if (override || !process.env['SESSION_STORAGE']) {
    await page.goto('http://localhost:4200/login')

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

export async function resolveSessionToken(request: APIRequestContext, username = 'easybsb', password = 'easybsb'): Promise<string> {
  return request.post(`http://localhost:4200/api/auth/login`, {data: { username, password }})
    .then((response) => response.json())
    .then((data) => data.jwt)
}

export async function writeSessionToken(page: Page, token: string) {
  page.addInitScript((sessionStorageDump: string) => {
    const keyValue = Object.entries<string>(JSON.parse(sessionStorageDump))
    for (const [key, value] of keyValue) {
      window.sessionStorage.setItem(key, value)
    }
  }, JSON.stringify({ Authorization: token }))
}

/**
 * @description clear all session data
 */
export async function clearSession() {
  delete process.env['SESSION_STORAGE']
}
