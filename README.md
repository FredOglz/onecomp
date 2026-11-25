# onecomp

Un composant de design system, de bout en bout : contrat, tokens, Web Component, tests, documentation et export Figma.

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
```

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour le circuit des modifications et le format des commits.
