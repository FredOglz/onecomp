# onecomp

Un composant de design system, de bout en bout : contrat, tokens, Web Component, tests, documentation et export Figma.

- **Documentation** : [Storybook](https://fredoglz.github.io/onecomp/) (publié à chaque fusion sur `main`)
- **Contrat du Button** : [docs/contracts/button.md](docs/contracts/button.md)
- **Agents IA** : [AGENTS.md](AGENTS.md)
- **Versions** : [CHANGELOG.md](CHANGELOG.md) et [releases GitHub](https://github.com/FredOglz/onecomp/releases) (archives des paquets jointes)
- **Figma** : bibliothèque one-comp, même numéro de version que le code

## Structure

```
docs/
  contracts/      contrats de composants (source de vérité)
  adr/            décisions d'architecture
  journal.md      journal des difficultés et du temps
packages/
  tokens/         @onec/tokens : tokens DTCG et thèmes
  icons/          @onec/icons : icônes Lucide (SVG sources)
  components/     @onec/components : Web Components Stencil
  react/          @onec/react : wrappers React générés
  angular/        @onec/angular : composants Angular générés
apps/             démos React et Angular
```

## Démarrer

```sh
corepack enable
pnpm install
pnpm build
pnpm test
pnpm --filter @onec/components storybook
```

## Publier une version

1. Monter la version dans tous les `package.json` et ajouter la section au [CHANGELOG.md](CHANGELOG.md), dans une PR.
2. Après fusion, pousser le tag (`git tag v0.1.0 && git push origin v0.1.0`) ou lancer le workflow Release à la main depuis l'onglet Actions. Il construit, teste et joint les archives (`node scripts/pack.mjs`).
3. Publier la bibliothèque Figma avec le même numéro et le lien vers la release.

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour le circuit des modifications et le format des commits.
