import { test, expect } from "@playwright/test";

test("Login Error", async ({ page }) => {
  await page.goto("http://localhost:4200/login", { waitUntil: "networkidle" });
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

  const snackbar = page.locator('mat-snack-bar-container');
  const [response] = await Promise.all([
    page.waitForResponse("http://localhost:4200/api/auth/login"),
    passwordControl.press("Enter"),
    snackbar.waitFor({ state: 'visible'}),
  ]);

  expect(await snackbar.count()).toBe(1);
  expect(response.status()).toBe(401);

  const [message, type] = await Promise.all([
    snackbar.locator('[matsnackbarlabel]').innerText(),
    snackbar.locator('[matsnackbaractions]').innerText()
  ]);

  expect(message).toBe("invalid username or password");
  expect(type).toBe("Error");
});
