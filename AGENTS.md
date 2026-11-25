# AGENTS.md

Instructions pour les agents IA (et les humains) qui utilisent ou modifient ce design system.

## Le projet

Un design system réduit à un composant, le Button, construit de bout en bout : contrat, tokens, code, tests, documentation, Figma, publication. Le code décide, Figma reçoit.

| Chemin                               | Contenu                                                              |
| ------------------------------------ | -------------------------------------------------------------------- |
| `docs/contracts/button.md`           | Contrat du Button : **source de vérité** (API, états, accessibilité) |
| `docs/adr/`                          | Décisions d'architecture (Stencil, Lucide, tokens, versions)         |
| `docs/journal.md`                    | Journal des difficultés et du temps                                  |
| `packages/tokens/src/`               | Tokens DTCG : primitives → sémantiques (marque × schéma) → composant |
| `packages/icons/`                    | Icônes Lucide (`icons.json`, `svg/`)                                 |
| `packages/components/`               | Web Components Stencil (`onec-button`, `onec-icon`), stories, tests  |
| `packages/react`, `packages/angular` | Wrappers générés : ne jamais modifier `src/generated/`               |
| `apps/`                              | Démos React et Angular                                               |

## Utiliser le Button

```html
<link rel="stylesheet" href="@onec/tokens/dist/css/tokens.css" />
<div data-brand="b2c" data-theme="light">
  <onec-button variant="contained" color="primary" size="medium">
    <onec-icon slot="icon-start" name="check"></onec-icon>
    Enregistrer
  </onec-button>
</div>
```

- `variant` : `contained` (action principale, une par zone) · `outlined` · `ghost`
- `color` : `primary` · `secondary` (suivent la marque) · `neutral` · `success` · `warning` · `error` · `info`
- `size` : `small` (32 px) · `medium` (40 px) · `large` (48 px)
- `disabled`, `loading`, `type` (`button` · `submit` · `reset`), `name`, `value`
- Slots : libellé (obligatoire), `icon-start`, `icon-end`. Pas de bouton sans texte, pas de navigation (`href`).
- Thème : `data-brand` (`b2c` · `b2b`) **et** `data-theme` (`light` · `dark`) posés ensemble sur le même conteneur.
- React : `import { OnecButton, OnecIcon } from '@onec/react'`. Angular : `import { OnecButton, OnecIcon } from '@onec/angular'` (standalone).

Données lisibles par machine, générées au build :

| Fichier                                            | Contenu                                             |
| -------------------------------------------------- | --------------------------------------------------- |
| `packages/components/dist/docs.json`               | Props, slots, parts, événements de chaque composant |
| `packages/components/dist/vscode-data.json`        | Complétion des balises et attributs pour VS Code    |
| `packages/tokens/dist/json/{marque}-{schéma}.json` | Valeurs résolues des tokens par thème               |
| `packages/icons/icons.json`                        | Noms des icônes disponibles                         |

## Modifier le design system

1. **Contrat d'abord** : toute évolution de l'API ou du comportement commence par `docs/contracts/button.md`.
2. **Tokens ensuite** : une couleur, une taille ou un espacement se change dans `packages/tokens/src/`, jamais dans le composant. Un token composant pointe toujours vers un sémantique.
3. **Code** : le composant ne lit que ses tokens `--onec-button-*`.
4. **Tests et doc** : stories, tests et page MDX dans `packages/components/src/components/onec-button/` et `packages/components/e2e/`.

Règles :

- Préfixe `onec` partout (balises, paquets, variables CSS). Noms en anglais, minuscules et tirets. Aucun nom de client, de produit ou de marque réelle dans le code, les tokens, la doc ou Figma.
- Contraste AA obligatoire dans les 4 thèmes : `pnpm --filter @onec/tokens test` le vérifie.
- Commits conventionnels (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`), scopes `tokens`, `icons`, `components`, `apps`, `docs`, `ci`, `repo`.
- Changement visuel voulu : poser le label `mettre-a-jour-captures` sur la PR pour régénérer les captures de référence.

## Commandes

```sh
pnpm install
pnpm build                                  # tokens, icônes, composants, wrappers, démos
pnpm test                                   # contrastes AA + tests unitaires
pnpm format:check
node scripts/pack.mjs                       # archives des paquets dans release/ (après pnpm build)
pnpm --filter @onec/components storybook    # Storybook local (port 6006)
pnpm --filter @onec/components build-storybook && pnpm --filter @onec/components e2e
```
