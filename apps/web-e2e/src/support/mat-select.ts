import { Locator, Page } from "@playwright/test";

export async function matSelectValue(
  page: Page,
  selectCtrl: Locator,
  option: string
): Promise<void> {
  const ctrl = selectCtrl.first();

  const trigger = ctrl.locator('.mat-select-trigger');
  await trigger.click()

  const overlayId = await trigger.getAttribute('aria-owns');

  const matOption = page.locator(`#${overlayId} .mat-option-text`, { hasText: option });
  await matOption.click();
}
