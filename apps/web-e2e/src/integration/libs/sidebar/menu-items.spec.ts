import { test, expect } from '@playwright/test';
import { SidebarPageObject } from '@e2e/page-objects/Sidebar';

test.describe.parallel('Easybsb sidebar', () => {

  let sidebarPageObject: SidebarPageObject;

  test.beforeEach(async ({ page, request }) => {
    sidebarPageObject = new SidebarPageObject(page, request);
    await sidebarPageObject.bootstrap();
  });

  test(`should have menu entrys`, async () => {
    const devices = sidebarPageObject.getDevicesButton();
    const home = sidebarPageObject.getHomeButton();
    const users = sidebarPageObject.getUsersButton();

    await Promise.all([
      devices.waitFor(),
      home.waitFor(),
      users.waitFor()
    ]);

    expect(await devices.count()).toBe(1);
    expect(await home.count()).toBe(1);
    expect(await users.count()).toBe(1);
  })

  test(`should navigate to settings/devices page`, async ({ page }) => {
    await sidebarPageObject.clickMenuEntryDevices();
    await expect(page).toHaveURL('http://localhost:4200/settings/devices');
  })

  test(`should navigate to settings/users page`, async ({ page }) => {
    await sidebarPageObject.clickMenuEntryUsers();
    await expect(page).toHaveURL('http://localhost:4200/settings/users');
  })

  test(`should navigate to dashboard page`, async ({ page }) => {
    await sidebarPageObject.clickMenuEntryUsers();
    await expect(page).toHaveURL('http://localhost:4200/settings/users');

    await sidebarPageObject.clickMenuEntryHome();
    await expect(page).toHaveURL('http://localhost:4200/dashboard');
  })
})
