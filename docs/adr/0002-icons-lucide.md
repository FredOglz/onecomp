# ADR 0002 : icônes Lucide, en SVG sources dans le repo

- Statut : accepté
- Date : 2026-11-25
- Décideurs : Fred

## Contexte

Le Button accepte une icône avant et après son libellé. Il faut une bibliothèque d'icônes compatible avec les Web Components, React, Angular et Figma, et une source unique pour que le code et Figma affichent les mêmes dessins.

## Options

| Option           | Pour                                                                                                                              | Contre                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Lucide**       | ≈ 1 600 icônes au trait, grille 24 px, épaisseur réglable ; licence ISC ; SVG statiques disponibles ; fichier Figma communautaire | Un seul style (trait)                                               |
| Phosphor         | 6 graisses ; paquet Web Components officiel ; MIT                                                                                 | Plus volumineux ; graisses peu utiles pour un seul bouton           |
| Remix Icon       | ≈ 3 000 icônes, trait et plein                                                                                                    | Licence propre à vérifier pour un usage client                      |
| Ionicons         | Web Component natif ; MIT                                                                                                         | Style marqué, moins d'icônes                                        |
| Material Symbols | 3 000+ icônes                                                                                                                     | Distribué surtout en police, ce qui va contre une source SVG unique |

## Décision

On utilise **Lucide**. Les SVG des icônes retenues sont copiés dans `packages/icons/svg/`, et un composant `<onec-icon name="…">` les affiche en SVG inline. Le paquet `@onec/icons` ne contient que les dessins (SVG et table générée) ; `<onec-icon>` vit dans `@onec/components`, avec les autres composants Stencil.

## Conséquences

- Seules les icônes utilisées entrent dans le repo, au fil des besoins : leur liste est dans `packages/icons/icons.json`, et un script les importe depuis le paquet `lucide-static` à une version fixée (1.80.0).
- Des icônes maison pourront s'ajouter dans le même dossier, préfixées `onec-`, au même format (grille 24, trait `currentColor`) ; le build refuse un SVG hors grille.
- `<onec-icon>` : taille pilotée par les tokens `size.icon.*` ou par `--onec-icon-size` posé par le parent, couleur héritée (`currentColor`), `aria-hidden="true"` par défaut, `role="img"` et `aria-label` quand `label` est renseigné.
- L'export Figma (P7) crée les composants icônes à partir des mêmes SVG.
- Licence ISC : la mention de licence de Lucide est conservée dans `packages/icons/LICENSE-lucide`.
