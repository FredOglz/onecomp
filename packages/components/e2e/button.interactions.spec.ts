import { expect, test } from '@playwright/test';
import { openStory } from './helpers';

test.describe('onec-button : interactions', () => {
  test('clic souris', async ({ page }) => {
    await openStory(page, 'playground');
    const button = page.locator('onec-button');
    await button.evaluate((el) =>
      el.addEventListener(
        'click',
        () => ((window as any).clicks = ((window as any).clicks ?? 0) + 1),
      ),
    );
    await button.click();
    expect(await page.evaluate(() => (window as any).clicks)).toBe(1);
  });

  test('clavier : Tab pour atteindre, Entrée et Espace pour activer', async ({ page }) => {
    await openStory(page, 'playground');
    const button = page.locator('onec-button');
    await button.evaluate((el) =>
      el.addEventListener(
        'click',
        () => ((window as any).clicks = ((window as any).clicks ?? 0) + 1),
      ),
    );
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();
    const ring = await button.evaluate(
      (el) => getComputedStyle(el.shadowRoot!.querySelector('button')!).outlineStyle,
    );
    expect(ring).toBe('solid');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    expect(await page.evaluate(() => (window as any).clicks)).toBe(2);
  });

  test('formulaire : submit envoie name/value, reset réinitialise', async ({ page }) => {
    await openStory(page, 'form');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.locator('output')).toHaveText('plate=AB-123-CD, action=save');
    await page.getByLabel('Immatriculation').fill('ZZ-999-ZZ');
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByLabel('Immatriculation')).toHaveValue('AB-123-CD');
  });

  test('désactivé : hors tabulation et sans clic', async ({ page }) => {
    await openStory(page, 'states');
    const disabled = page.locator('onec-button[disabled]').first();
    await expect(page.getByRole('button', { name: 'Désactivé' }).first()).toBeDisabled();
    await disabled.evaluate((el) =>
      document.addEventListener('click', () => ((window as any).clicks = 1)),
    );
    await disabled.click({ force: true });
    expect(await page.evaluate(() => (window as any).clicks)).toBeUndefined();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(disabled).not.toBeFocused();
  });

  test('chargement : focalisable, annoncé occupé, sans clic', async ({ page }) => {
    await openStory(page, 'states');
    const loading = page.locator('onec-button[loading]').first();
    const inner = page.getByRole('button', { name: 'Envoi' }).first();
    await expect(inner).toHaveAttribute('aria-busy', 'true');
    await expect(inner).toHaveAttribute('aria-disabled', 'true');
    await loading.evaluate(() =>
      document.addEventListener('click', () => ((window as any).clicks = 1)),
    );
    await loading.click();
    expect(await page.evaluate(() => (window as any).clicks)).toBeUndefined();
    await loading.focus();
    await expect(loading).toBeFocused();
  });

  test('nom accessible = libellé, icônes masquées', async ({ page }) => {
    await openStory(page, 'with-icons');
    await expect(page.getByRole('button', { name: 'Ajouter', exact: true })).toBeVisible();
    await expect(page.getByRole('img')).toHaveCount(0);
  });
});
