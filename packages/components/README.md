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

<onec-icon name="download"></onec-icon>
```

Avec un bundler, on peut importer un composant à la fois :

```js
import { defineCustomElement } from '@onec/components/components/onec-icon.js';
defineCustomElement();
```

## Scripts

| Commande     | Effet                                                             |
| ------------ | ----------------------------------------------------------------- |
| `pnpm build` | Compile les composants et régénère les readme de chaque composant |
| `pnpm start` | Build en continu avec serveur local                               |
| `pnpm test`  | Tests unitaires (spec)                                            |

Les fichiers `src/components.d.ts` et `src/components/*/readme.md` sont générés par Stencil au build : les committer, ne pas les modifier à la main (sauf le texte au-dessus de « Auto Generated Below »).
