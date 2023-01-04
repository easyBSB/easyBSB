import { test } from "@playwright/test";
import { clearSession, loginAndCacheSession } from "../../support/authorize";

test.describe("App: sidebar", () => {

  test.beforeEach(async ({ page }) => {
    await loginAndCacheSession(page);
  });

  test.afterAll(async () => {
    await clearSession();
  });

  /**
   * @todo rework test for sidebar
   */
  test("should contain sidebar with settings icon", async ({ page }) => {
    await page.goto("http://localhost:4200/dashboard");
  });
});
