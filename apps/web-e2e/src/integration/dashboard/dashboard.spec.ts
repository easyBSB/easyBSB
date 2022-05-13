import { expect, test } from "@playwright/test";
import { clearSession, loginAndCacheSession } from "../../support/authorize";

test.describe('Dashboard', () => {

  test.beforeEach(async({ page }) => {
    await loginAndCacheSession(page)
  })

  test.afterAll(async() => {
    await clearSession()
  })

  test('should contain header', async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard', { waitUntil: "networkidle"})
    expect(page.url()).toContain('/dashboard')
    await expect(page.locator('h1')).toHaveText('Dashboard')
  })
})
