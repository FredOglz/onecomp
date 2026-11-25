import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { openStory } from './helpers';

// La matrice affiche toutes les variantes, couleurs et états dans les 4 thèmes.
// Les boutons désactivés sont exclus du contraste par WCAG (1.4.3) et par axe.
test('axe : aucune violation WCAG 2.2 AA dans les 4 thèmes', async ({ page }) => {
  await openStory(page, 'all-themes');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id} : ${v.nodes.length} élément(s)`)).toEqual([]);
});
