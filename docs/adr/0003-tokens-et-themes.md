# ADR 0003 : tokens DTCG à trois niveaux, thèmes marque × schéma

- Statut : accepté
- Date : 2026-11-25
- Décideurs : Fred

## Contexte

Le Button doit exister dans quatre thèmes : deux marques (B2C, B2B) et deux schémas (clair, sombre). Les décisions de design doivent vivre à un seul endroit et alimenter le code puis Figma. Dans ce projet, le code décide et Figma reçoit : les tokens sont écrits dans le repo, puis exportés vers les variables Figma.

## Décision

### Format et source

- Format **DTCG** (`$value`, `$type`, `$description`), fichiers JSON dans `packages/tokens/src/`.
- Ces fichiers sont la seule source. Les CSS, SCSS, JSON de sortie et les variables Figma en sont générés.
- Génération avec **Style Dictionary** (v5, support natif DTCG).

### Trois niveaux

| Niveau      | Rôle                         | Exemple de nom                                                              | Change avec                        |
| ----------- | ---------------------------- | --------------------------------------------------------------------------- | ---------------------------------- |
| Primitives  | Valeurs brutes, sans sens    | `color.orange.600`, `space.4`, `radius.2`                                   | Rien                               |
| Sémantiques | Intention d'usage            | `color.action.primary.background`, `color.text.default`, `color.focus.ring` | Marque, schéma                     |
| Composant   | Décision propre au composant | `button.contained.primary.background.hover`                                 | Rien (pointe vers les sémantiques) |

Le composant ne lit que ses tokens composant. Un token composant pointe toujours vers un sémantique, jamais vers une valeur brute.

### Deux axes de thème

- **Marque** (`b2c`, `b2b`) : choisit quelles palettes primitives portent les rôles `primary` et `secondary` (`brand.primary.*`, `brand.secondary.*`).
- **Schéma** (`light`, `dark`) : choisit quelle teinte de chaque palette sert chaque intention (fond, texte, bordure, focus).

Les sémantiques du schéma pointent vers les alias de marque, d'où quatre combinaisons sans dupliquer de valeur.

| Fichier source                          | Contenu                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `primitives.json`                       | Palettes, espacements, rayons, typographie                                  |
| `semantic.json`                         | Sémantiques indépendants du thème (tailles de contrôle, focus, typographie) |
| `brand/b2c.json`, `brand/b2b.json`      | Alias `brand.*` vers les palettes                                           |
| `scheme/light.json`, `scheme/dark.json` | Sémantiques, vers `brand.*` et les primitives                               |
| `components/button.json`                | Tokens `button.*`, vers les sémantiques                                     |

### Sorties

- CSS : custom properties sur `:root`, surchargées par `[data-brand="b2b"]` et `[data-theme="dark"]`. Les deux attributs se posent **ensemble sur le même élément** : une custom property qui en référence une autre est calculée là où elle est déclarée, puis héritée telle quelle, donc un `data-brand` seul sur un conteneur imbriqué ne recalculerait pas les couleurs héritées. Les tokens composant sont redéclarés sur chaque élément thémé pour suivre le thème local.
- SCSS : mêmes valeurs en variables, pour les projets qui en ont besoin.
- JSON aplati : pour Storybook et pour les agents IA.

### Figma (P7)

| Collection | Modes       |
| ---------- | ----------- |
| Primitives | un seul     |
| Brand      | B2C, B2B    |
| Scheme     | Light, Dark |
| Components | un seul     |

Mêmes noms qu'en code, avec `/` à la place de `.` (`button/contained/primary/background/hover`). Scopes de variables posés explicitement (fond, texte, bordure, espacement, rayon).

### Règles

- Noms en anglais, en minuscules avec tirets, sans numéro de version ni nom de produit.
- Typographie en rem.
- La CI refuse un nom hors convention et un contraste sous l'AA (texte 4,5:1, bordures et focus 3:1) dans l'un des quatre thèmes.

## Conséquences

- Ajouter une marque ou un schéma revient à ajouter un fichier, sans toucher aux composants.
- Les couleurs de départ sont indicatives et seront ajustées jusqu'à passer le contrôle AA.
- Le mode sombre est livré dès la 0.1.0, pas seulement préparé.
