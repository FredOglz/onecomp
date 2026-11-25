# @onec/components

Web Components écrits avec Stencil. Voir [ADR 0001](../../docs/adr/0001-web-components-stencil.md) et le [contrat du Button](../../docs/contracts/button.md).

| Composant       | Rôle                                | Doc                                          |
| --------------- | ----------------------------------- | -------------------------------------------- |
| `<onec-icon>`   | Icône Lucide en SVG inline          | [readme](src/components/onec-icon/readme.md) |
| `<onec-button>` | Bouton (contained, outlined, ghost) | à venir en P4                                |

## Utilisation

Les composants lisent les tokens : charger leur CSS une fois dans la page.

```html
<link rel="stylesheet" href="node_modules/@onec/tokens/dist/css/tokens.css" />
<script type="module" src="node_modules/@onec/components/dist/onec/onec.esm.js"></script>

<onec-button variant="outlined" color="neutral">
  <onec-icon slot="icon-start" name="download"></onec-icon>
  Télécharger
</onec-button>
```

Avec un bundler, on peut importer un composant à la fois (ses dépendances, comme `<onec-icon>`, sont définies avec lui) :

```js
import { defineCustomElement } from '@onec/components/components/onec-button.js';
defineCustomElement();
```

Les styles sont écrits en Sass (`*.scss`) : une boucle relie chaque combinaison variante × couleur à ses tokens `--onec-button-*`.

## Scripts

| Commande     | Effet                                                             |
| ------------ | ----------------------------------------------------------------- |
| `pnpm build` | Compile les composants et régénère les readme de chaque composant |
| `pnpm start` | Build en continu avec serveur local                               |
| `pnpm test`  | Tests unitaires (spec)                                            |

Les fichiers `src/components.d.ts` et `src/components/*/readme.md` sont générés par Stencil au build : les committer, ne pas les modifier à la main (sauf le texte au-dessus de « Auto Generated Below »).

## Tests navigateur

`e2e/` contient trois familles de tests Playwright, lancés sur les stories du Storybook statique :

| Fichier                       | Vérifie                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| `button.interactions.spec.ts` | Clic, clavier (Tab, Entrée, Espace), formulaire, désactivé, chargement |
| `button.a11y.spec.ts`         | axe, WCAG 2.2 AA, sur la matrice des 4 thèmes                          |
| `button.visual.spec.ts`       | Captures de référence : matrice 4 thèmes, survol, focus                |

Les captures de référence sont produites par la CI GitHub : le rendu du texte varie d'une machine à l'autre, et une capture locale ne correspond pas à celle de la CI. Après un changement visuel voulu, poser le label `mettre-a-jour-captures` sur la pull request : un workflow régénère les images et les committe sur la branche. Vérifier les images dans la PR avant de fusionner. En local, `pnpm e2e e2e/button.interactions.spec.ts e2e/button.a11y.spec.ts` lance les autres tests.
