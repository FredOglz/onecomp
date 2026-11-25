import { expect, test } from '@playwright/test';
import { openStory } from './helpers';

// Captures de référence. Après un changement voulu : pnpm e2e --update-snapshots, puis committer les images.
test('rendu de la matrice dans les 4 thèmes', async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 800 });
  await openStory(page, 'all-themes');
  await expect(page).toHaveScreenshot('matrice-4-themes.png', { fullPage: true });
});

for (const state of ['hover', 'focus'] as const) {
  test(`état ${state}`, async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 120 });
    await openStory(page, 'playground');
    const button = page.locator('onec-button');
    if (state === 'hover') await button.hover();
    else await page.keyboard.press('Tab');
    await expect(page).toHaveScreenshot(`etat-${state}.png`);
  });
}
