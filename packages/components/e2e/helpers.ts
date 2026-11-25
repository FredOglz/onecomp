import type { Page } from '@playwright/test';

/** Ouvre une story seule (sans l'interface Storybook) et attend que les composants soient prêts. */
export async function openStory(page: Page, id: string, globals = 'brand:b2c;theme:light') {
  await page.goto(`/iframe.html?id=composants-button--${id}&viewMode=story&globals=${globals}`);
  await page.locator('onec-button.hydrated').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
}
