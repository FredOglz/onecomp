# Changelog

Une seule version pour tous les paquets et pour la bibliothèque Figma (voir [ADR 0004](docs/adr/0004-versioning-et-publication.md)). Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions [semver](https://semver.org/lang/fr/).

## [0.1.0] - 2026-11-25

Première version : un Button complet, du token à Figma.

### Ajouté

- `@onec/tokens` : tokens DTCG sur trois niveaux (primitives, sémantique, composant), deux marques (B2C, B2B) × deux schémas (light, dark), contrôle de contraste AA en test, export CSS et export des variables Figma.
- `@onec/icons` : 12 icônes Lucide en SVG, avec leur table pour le composant `onec-icon`.
- `@onec/components` : Web Components Stencil `onec-button` (3 variants, 7 couleurs, 3 tailles, états désactivé et chargement, icônes de début et de fin, associé aux formulaires) et `onec-icon`.
- `@onec/react` et `@onec/angular` : composants générés pour React 18+ et Angular 19+ (standalone).
- Documentation : contrat du Button, ADR 0001 à 0004, Storybook avec page de doc, journal des difficultés.
- Tests : tests unitaires Stencil, tests navigateur Playwright, audit axe (WCAG 2.2 AA) et captures de référence sur les quatre thèmes.
- Figma (fichier one-comp) : 496 variables en 4 collections, 12 icônes et le composant Button (378 variantes) relié aux variables, avec sa page de documentation.

### Installation

Les paquets ne sont pas sur npm : les archives sont jointes à la release GitHub.

```sh
pnpm add https://github.com/FredOglz/onecomp/releases/download/v0.1.0/onec-tokens-0.1.0.tgz \
  https://github.com/FredOglz/onecomp/releases/download/v0.1.0/onec-icons-0.1.0.tgz \
  https://github.com/FredOglz/onecomp/releases/download/v0.1.0/onec-components-0.1.0.tgz
```

[0.1.0]: https://github.com/FredOglz/onecomp/releases/tag/v0.1.0
