# onec-icon



<!-- Auto Generated Below -->


## Overview

Affiche une icône du jeu onec (Lucide), en SVG inline.

La couleur suit celle du texte parent (`currentColor`). La taille vient des tokens
`size.icon.*` ; un parent peut l'imposer avec la propriété CSS `--onec-icon-size`
(c'est ce que fait `<onec-button>`).

## Properties

| Property            | Attribute | Description                                                                                                                                                           | Type                                                                                                                                                                 | Default     |
| ------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `label`             | `label`   | Texte alternatif. Sans lui, l'icône est décorative et masquée aux lecteurs d'écran. À renseigner seulement si l'icône porte un sens que le texte voisin ne donne pas. | `string`                                                                                                                                                             | `undefined` |
| `name` _(required)_ | `name`    | Nom de l'icône, tel qu'il apparaît dans `packages/icons/svg/`.                                                                                                        | `"arrow-left" \| "arrow-right" \| "check" \| "chevron-down" \| "download" \| "external-link" \| "loader-circle" \| "plus" \| "search" \| "send" \| "trash-2" \| "x"` | `undefined` |
| `size`              | `size`    | Taille, liée aux tokens `size.icon.small\|medium\|large` (16, 16 et 20 px).                                                                                           | `"large" \| "medium" \| "small"`                                                                                                                                     | `'medium'`  |


## Shadow Parts

| Part    | Description        |
| ------- | ------------------ |
| `"svg"` | L'élément `<svg>`. |


----------------------------------------------


