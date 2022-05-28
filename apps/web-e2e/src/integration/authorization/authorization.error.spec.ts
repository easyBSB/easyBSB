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

  const [response] = await Promise.all([
    page.waitForResponse("http://localhost:4200/api/auth/login"),
    passwordControl.press("Enter"),
  ]);

  // check response data
  expect(response.status()).toBe(401);

  // we should have been redirected to dashboard now
  expect(page.url()).toBe("http://localhost:4200/login");
  const error = page.locator('[data-e2e="authorization-login-error"]');

  expect((await error.textContent())?.trim()).toContain(
    "invalid username or password"
  );
});
