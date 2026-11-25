# Contrat de composant : Button

| Champ              | Valeur                                       |
| ------------------ | -------------------------------------------- |
| Statut             | Proposé (à valider en revue de pull request) |
| Version du contrat | 0.1.0                                        |
| Balise             | `<onec-button>`                              |
| Composant Figma    | `Button` (fichier one-comp)                  |
| Phase              | P0 · Cadrage et contrat                      |

Ce contrat est la source de vérité du Button. Le code, les tests, la documentation et l'export Figma en découlent. Toute évolution passe par une pull request qui modifie d'abord ce fichier.

---

## 1. Rôle

Le Button déclenche une action dans la page : envoyer un formulaire, ouvrir une fenêtre, confirmer un choix.

**À utiliser** pour une action. **À ne pas utiliser** pour naviguer vers une autre page : c'est le rôle du futur composant Link. Un bouton avec une icône seule et sans libellé est un autre composant (IconButton, hors périmètre).

## 2. Anatomie

```
┌──────────────────────────────────────────┐
│  [icon-start]   Libellé   [icon-end]     │   ← base (conteneur)
└──────────────────────────────────────────┘
         ↘ en chargement : spinner à la place de icon-start (ou devant le libellé sans icône)
```

| Élément      | Obligatoire | Description                                                                   |
| ------------ | ----------- | ----------------------------------------------------------------------------- |
| `base`       | oui         | Conteneur cliquable, porte le fond, la bordure, le rayon et l'anneau de focus |
| `label`      | oui         | Libellé texte, une seule ligne, jamais tronqué                                |
| `icon-start` | non         | Icône avant le libellé                                                        |
| `icon-end`   | non         | Icône après le libellé                                                        |
| `spinner`    | non         | Indicateur de chargement, affiché seulement si `loading`                      |

On parle de `start` et `end`, pas de gauche et droite : en lecture de droite à gauche, les icônes s'inversent sans changer l'API.

## 3. API

### Propriétés et attributs

| Propriété  | Attribut   | Type                                                                                   | Défaut        | Description                           |
| ---------- | ---------- | -------------------------------------------------------------------------------------- | ------------- | ------------------------------------- |
| `variant`  | `variant`  | `'contained' \| 'outlined' \| 'ghost'`                                                 | `'contained'` | Niveau d'emphase                      |
| `color`    | `color`    | `'primary' \| 'secondary' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'`   | Rôle de couleur                       |
| `size`     | `size`     | `'small' \| 'medium' \| 'large'`                                                       | `'medium'`    | Taille                                |
| `disabled` | `disabled` | `boolean`                                                                              | `false`       | Désactive le bouton                   |
| `loading`  | `loading`  | `boolean`                                                                              | `false`       | Action en cours, bouton non activable |
| `type`     | `type`     | `'button' \| 'submit' \| 'reset'`                                                      | `'button'`    | Comportement dans un formulaire       |
| `name`     | `name`     | `string`                                                                               | —             | Nom envoyé avec le formulaire         |
| `value`    | `value`    | `string`                                                                               | —             | Valeur envoyée avec le formulaire     |

Une valeur inconnue retombe sur le défaut et affiche un avertissement en console en développement.

### Slots

| Slot         | Contenu attendu      |
| ------------ | -------------------- |
| (défaut)     | Le libellé, en texte |
| `icon-start` | Une `<onec-icon>`    |
| `icon-end`   | Une `<onec-icon>`    |

### Événements

| Événement       | Quand                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| `click` (natif) | Activation par souris, toucher, Entrée ou Espace. Jamais émis si `disabled` ou `loading` |

Pas d'événement personnalisé : le `click` natif suffit et marche tel quel dans React et Angular.

### Parts CSS (`::part`)

`base`, `label`, `icon-start`, `icon-end`, `spinner`. Les parts servent aux ajustements exceptionnels ; la personnalisation normale passe par les tokens.

### Exemple

```html
<onec-button variant="outlined" color="neutral" size="large">
  <onec-icon slot="icon-start" name="download"></onec-icon>
  Télécharger
</onec-button>
```

## 4. Variantes et couleurs

| Variante    | Fond           | Bordure                              | Texte et icônes           |
| ----------- | -------------- | ------------------------------------ | ------------------------- |
| `contained` | Couleur pleine | Aucune (ou même couleur que le fond) | Couleur « on » contrastée |
| `outlined`  | Transparent    | Couleur du rôle                      | Couleur du rôle           |
| `ghost`     | Transparent    | Aucune                               | Couleur du rôle           |

Les 7 couleurs sont des rôles, pas des teintes : `primary` et `secondary` portent la marque (elles changent entre B2C et B2B), `neutral` sert les actions secondaires sans marque, `success`, `warning`, `error`, `info` portent un signal. Le signal ne repose jamais sur la couleur seule : le libellé doit le dire (« Supprimer », pas « OK » en rouge).

Combinaisons : 3 variantes × 7 couleurs = 21 styles, chacun dans les 4 thèmes.

## 5. Tailles

| Taille   | Hauteur | Padding horizontal | Espace icône-libellé | Texte            | Icône |
| -------- | ------- | ------------------ | -------------------- | ---------------- | ----- |
| `small`  | 32 px   | 12 px              | 8 px                 | 12 px, semi-gras | 16 px |
| `medium` | 40 px   | 16 px              | 8 px                 | 14 px, semi-gras | 16 px |
| `large`  | 48 px   | 16 px              | 16 px                | 16 px, semi-gras | 20 px |

Rayon : 8 px pour toutes les tailles. Bordure de `outlined` : 1 px. Largeur : s'adapte au contenu (pas de pleine largeur dans cette version).

Le texte est exprimé en rem dans le code (12 px = 0,75 rem) pour suivre le réglage de taille du navigateur.

## 6. États

| État       | Déclencheur                      | Rendu                                                                                                                                                                           | Comportement                                         |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `default`  | —                                | Couleurs de base                                                                                                                                                                | Activable                                            |
| `hover`    | Pointeur au-dessus               | Fond ou teinte plus soutenu                                                                                                                                                     | Activable                                            |
| `active`   | Pression en cours                | Fond encore plus soutenu                                                                                                                                                        | Activable                                            |
| `focus`    | Focus clavier (`:focus-visible`) | Anneau de focus de 2 px, décalé de 2 px, en plus de l'état courant                                                                                                              | Activable                                            |
| `disabled` | `disabled`                       | Couleurs atténuées, curseur `not-allowed`                                                                                                                                       | Non activable, retiré de la tabulation               |
| `loading`  | `loading`                        | Spinner à la place de `icon-start`, libellé conservé. Largeur inchangée si une icône de début est présente ; sinon le spinner s'ajoute devant le libellé et le bouton s'élargit | Non activable, reste focalisable, annoncé « occupé » |

`focus` se combine avec `hover` et `active`. `disabled` l'emporte sur tous les autres. En Figma, chaque état est une variante (6 états × 21 styles × 3 tailles = 378 variantes).

## 7. Accessibilité

- **Sémantique** : un vrai `<button>` natif dans le Shadow DOM, focus délégué à l'hôte. Pas de `div` cliquable.
- **Formulaires** : le composant est associé aux formulaires (`formAssociated`). `type="submit"` envoie le formulaire parent, `type="reset"` le réinitialise, `name` et `value` sont transmis.
- **Clavier** : Tab pour atteindre, Entrée et Espace pour activer. Aucun raccourci propre.
- **Lecteur d'écran** : le nom accessible est le libellé. Les icônes sont décoratives (`aria-hidden="true"`). En chargement, `aria-busy="true"` et `aria-disabled="true"`, le libellé reste lu.
- **Libellé obligatoire** : un bouton sans texte affiche un avertissement en développement. Pour une icône seule, utiliser le futur IconButton.
- **Contrastes (AA)** : texte et icônes à 4,5:1 minimum sur leur fond, dans chaque état sauf `disabled`, et dans les 4 thèmes. Bordure de `outlined` et anneau de focus à 3:1 minimum sur le fond de page. Vérifié en CI à partir des tokens.
- **Cible** : 32 px minimum, au-delà des 24 px demandés par le critère WCAG 2.2 (2.5.8).
- **Mouvement** : le spinner s'arrête si `prefers-reduced-motion: reduce` ; un indicateur fixe le remplace.
- **Zoom** : pas de hauteur fixe sur le texte ; à 200 % le libellé reste entier.

## 8. Contenu

- Un verbe d'action, au plus trois mots : « Enregistrer », « Ajouter un véhicule ».
- Majuscule en début de libellé seulement.
- Pas de ponctuation finale.

## 9. Tokens utilisés

Le composant ne lit que des tokens de niveau composant ; ceux-ci pointent vers les tokens sémantiques (voir ADR 0003).

| Groupe      | Tokens                                                                                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dimensions  | `button.height.{small,medium,large}`, `button.padding-x.{size}`, `button.gap.{size}`, `button.icon-size.{size}`, `button.border-radius`, `button.border-width` |
| Typographie | `button.font-size.{size}`, `button.font-weight`, `button.line-height`                                                                                          |
| Couleurs    | `button.{variant}.{color}.background.{state}`, `button.{variant}.{color}.border.{state}`, `button.{variant}.{color}.foreground.{state}`                        |
| Focus       | `button.focus-ring.color`, `button.focus-ring.width`, `button.focus-ring.offset`                                                                               |

`{state}` vaut `default`, `hover`, `active`, `disabled`. Le focus et le chargement n'ont pas de couleur propre : ils ajoutent l'anneau ou le spinner à l'état courant.

## 10. Correspondance Figma ↔ code

| Figma (component set `Button`)                                      | Code                                        |
| ------------------------------------------------------------------- | ------------------------------------------- |
| Variante `variant`                                                  | `variant`                                   |
| Variante `color`                                                    | `color`                                     |
| Variante `size`                                                     | `size`                                      |
| Variante `state` (default, hover, active, focus, disabled, loading) | Pseudo-classes CSS + `disabled` + `loading` |
| Booléen `icon-start` + échange d'instance `icon-start icon`         | Slot `icon-start`                           |
| Booléen `icon-end` + échange d'instance `icon-end icon`             | Slot `icon-end`                             |
| Texte `label`                                                       | Slot par défaut                             |

Les noms sont identiques des deux côtés pour qu'un designer, un développeur ou un agent IA retrouve la même chose.

## 11. Critères de « livré »

- [ ] Contrat validé (ce fichier fusionné)
- [ ] Tokens composant générés et contrastes AA verts dans les 4 thèmes
- [ ] `<onec-button>` conforme aux sections 3 à 7
- [ ] Wrappers React et Angular fonctionnels dans les apps de démo
- [ ] Stories pour chaque variante, couleur, taille et état, dans les 4 thèmes
- [ ] Tests d'interaction (clic, clavier, formulaire), axe sans violation, captures visuelles de référence
- [ ] Documentation Storybook et contexte agents publiés
- [ ] Component set Figma exporté, aucune valeur en dur, description renseignée
- [ ] Version 0.1.0 publiée

## 12. Hors périmètre de cette version

Bouton icône seule, bouton lien (`href`), pleine largeur, bouton bascule, bouton divisé, groupe de boutons.
