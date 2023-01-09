import { test, expect } from "@playwright/test";
import { loginAndCacheSession, clearSession } from "../../utils/authorize";

test.describe("Login page guard", () => {

  test.beforeEach(async ({ page }) => {
    await loginAndCacheSession(page);
  });

  test.afterAll(async () => {
    await clearSession();
  });

  test("should not enter login page if we are authorized", async ({ page }) => {
    await page.goto("http://localhost:4200/login"),
    await page.waitForURL('http://localhost:4200/dashboard')

    expect(page.url()).toContain("/dashboard");
  });
});
