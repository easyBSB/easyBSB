import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:4200');
  const pingEl = page.locator('[data-e2e="ping"]');
  await expect(pingEl).toHaveText('We ping the server and he respond with: pong');
});