# Contribuer

## Prérequis

- Node 22 (voir `.nvmrc`)
- pnpm 10 (`corepack enable` suffit)

```sh
pnpm install
pnpm format:check
pnpm build
pnpm test
```

## Circuit d'une modification

1. Une branche par sujet, depuis `main` : `feat/…`, `fix/…`, `docs/…`, `chore/…`.
2. Si le comportement d'un composant change, on modifie d'abord son contrat dans `docs/contracts/`.
3. Une décision structurante s'écrit dans une ADR (`docs/adr/`).
4. Pull request vers `main`, CI verte, revue humaine, puis fusion.

## Messages de commit

Format [Conventional Commits](https://www.conventionalcommits.org/fr/), vérifié en CI. Le changelog en est généré.

```
type(portée): description courte
```

- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`
- Portées : `tokens`, `icons`, `components`, `apps`, `docs`, `ci`, `repo` (facultatives)

Exemples : `feat(components): ajoute l'état loading au bouton`, `fix(tokens): corrige le contraste du focus en sombre`.

## Versions

Une seule version pour tous les paquets et pour la bibliothèque Figma. Voir [ADR 0004](docs/adr/0004-versioning-et-publication.md).
