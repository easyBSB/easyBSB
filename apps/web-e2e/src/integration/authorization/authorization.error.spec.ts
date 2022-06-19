import { test, expect } from "@playwright/test";

test("Login Error", async ({ page }) => {
  await page.goto("http://localhost:4200", { waitUntil: "networkidle" });
  expect(page.url()).toBe("http://localhost:4200/login");

  // do login
  const usernameControl = page.locator(
    '[data-e2e="authorization-login-username"] input[type="text"]'
  );
  const passwordControl = page.locator(
    '[data-e2e="authorization-login-password"] input[type="password"]'
  );

  await usernameControl.fill("UnknownUser");
  await passwordControl.fill(
    "SuperSecretUnknownPasswordButNobodyCaresBecauseNobodyKnows"
  );

  const snackbar = page.locator('snack-bar-container');
  const [response] = await Promise.all([
    page.waitForResponse("http://localhost:4200/api/auth/login"),
    snackbar.waitFor({ state: 'visible'}),
    passwordControl.press("Enter"),
  ]);
  expect(await snackbar.count()).toBe(1);
  expect(response.status()).toBe(401);

  const [message, type] = await Promise.all([
    snackbar.locator('.mat-simple-snack-bar-content').innerText(),
    snackbar.locator('.mat-simple-snackbar-action').innerText()
  ]);

  expect(message).toBe("invalid username or password");
  expect(type).toBe("Error");
});
