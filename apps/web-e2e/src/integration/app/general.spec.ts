import { expect, test } from "@playwright/test";
import { AppMainPage } from "../../support/App.po";
import { clearSession, loginAndCacheSession } from "../../support/authorize";

test.describe("App: sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await loginAndCacheSession(page);
  });

  test.afterAll(async () => {
    await clearSession();
  });

  test("should contain sidebar with settings icon", async ({ page }) => {
    const appPage = new AppMainPage(page);
    await Promise.all([
      page.goto("http://localhost:4200"),
      page.waitForNavigation({ url: "http://localhost:4200/dashboard" }),
    ]);

    // check settings button to have icon and url
    const settings = appPage.settingsButton;
    await expect(settings).toHaveAttribute('href', '/settings');

    await appPage.gotoSettings();
    expect(page.url()).toContain("/settings");

    await appPage.gotoHome();
    expect(page.url()).toContain("/dashboard");
  });
});
