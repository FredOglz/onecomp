# @onec/tokens

Tokens DTCG à trois niveaux et quatre thèmes (marque B2C ou B2B × schéma clair ou sombre). Les décisions sont expliquées dans l'[ADR 0003](../../docs/adr/0003-tokens-et-themes.md).

## Sources

Les fichiers de `src/` sont la seule source. Tout le reste en est généré.

| Fichier                                 | Niveau                            | Contenu                                                                                                       |
| --------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `primitives.json`                       | Primitives                        | Palettes (purple, indigo, teal, slate, green, amber, red, blue), espacements, rayons, épaisseurs, typographie |
| `semantic.json`                         | Sémantiques indépendants du thème | Tailles de contrôle, espacements internes, rayon, focus, typographie                                          |
| `brand/b2c.json`, `brand/b2b.json`      | Marque                            | `brand.primary.*` et `brand.secondary.*` vers les palettes                                                    |
| `scheme/light.json`, `scheme/dark.json` | Sémantiques de couleur            | Surface, texte, désactivé, focus, et les 7 rôles d'action                                                     |
| `components/button.json`                | Composant                         | `button.*` : dimensions, typographie, couleurs par variante, couleur et état                                  |

| Marque | primary | secondary |
| ------ | ------- | --------- |
| B2C    | purple  | indigo    |
| B2B    | indigo  | teal      |

## Commandes

```sh
pnpm --filter @onec/tokens build   # génère dist/
pnpm --filter @onec/tokens test    # nommage + contrastes AA, écrit dist/contrast-report.md
```

## Sorties

| Fichier                                  | Usage                                                                |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `dist/css/tokens.css`                    | Custom properties `--onec-*`, références conservées en `var()`       |
| `dist/json/{b2c,b2b}-{light,dark}.json`  | Valeurs résolues par thème : doc, agents IA, export Figma, contrôles |
| `dist/scss/_{b2c,b2b}-{light,dark}.scss` | Variables Sass résolues par thème                                    |
| `dist/contrast-report.md`                | Détail des 284 contrôles de contraste                                |

## Appliquer un thème

```html
<link rel="stylesheet" href="@onec/tokens/css" />
<html data-brand="b2b" data-theme="dark">
  …
</html>
```

Sans attribut : B2C clair. **Les deux attributs se posent ensemble sur le même élément.** Une custom property qui en référence une autre est calculée sur l'élément qui la déclare, puis héritée telle quelle : un `data-brand` seul sur un conteneur imbriqué ne recalcule pas les couleurs sémantiques héritées du parent.
