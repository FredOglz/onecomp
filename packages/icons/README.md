# @onec/icons

Icônes Lucide en SVG sources, et la table qui alimente `<onec-icon>` (dans [`@onec/components`](../components)). Voir [ADR 0002](../../docs/adr/0002-icons-lucide.md).

## Contenu

| Chemin               | Rôle                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| `icons.json`         | Liste des icônes Lucide utilisées par le design system               |
| `svg/`               | SVG sources, une icône par fichier (grille 24, trait `currentColor`) |
| `scripts/import.mjs` | Copie les icônes listées depuis `lucide-static` (version fixée)      |
| `scripts/build.mjs`  | Vérifie les SVG et génère `dist/index.js` (table nom → dessin)       |
| `LICENSE-lucide`     | Licence ISC de Lucide, à conserver                                   |

## Ajouter une icône

1. Ajouter son nom Lucide dans `icons.json` (liste sur [lucide.dev/icons](https://lucide.dev/icons)).
2. `pnpm --filter @onec/icons import`, puis `pnpm build`.
3. Committer `icons.json` et le nouveau fichier de `svg/`.

Une icône maison se dépose directement dans `svg/`, préfixée `onec-` (par exemple `onec-logo.svg`), sur la même grille 24 × 24 avec un trait `currentColor` d'épaisseur 2. Le build refuse un SVG qui ne respecte pas cette grille.

## Utilisation

```js
import { icons, iconNames } from '@onec/icons';
// icons.download === '<path d="M12 15V3"></path>…'
```

Les SVG bruts sont aussi exportés : `@onec/icons/svg/download.svg`.
