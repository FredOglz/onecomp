# ADR 0004 : une version commune, publiée par tag et release GitHub

- Statut : accepté
- Date : 2026-11-25
- Décideurs : Fred

## Contexte

Tokens, icônes, composants et bibliothèque Figma doivent porter le même numéro pour qu'on sache quelle version de Figma correspond à quel code. Le projet est un test : un registre de packages n'est pas nécessaire.

## Décision

- **Une seule version** (semver) pour tous les paquets du monorepo et pour la bibliothèque Figma.
- **Commits conventionnels** (`feat:`, `fix:`, `docs:`, `chore:`…) ; le changelog est généré à partir d'eux.
- **Publication** : un tag `vX.Y.Z` déclenche une release GitHub avec le changelog et les archives `npm pack` de chaque paquet en pièces jointes. Pas de registre npm.
- **Figma** : la bibliothèque one-comp est publiée avec une note de version qui reprend le même numéro et le lien vers la release.
- **Avant 1.0.0** : une version mineure peut contenir un changement cassant, signalé dans le changelog.

## Conséquences

- Les apps de démo installent les paquets depuis les archives de la release, comme le ferait un projet tiers.
- Une modification d'un seul paquet fait monter la version de tous : plus simple à suivre, au prix de versions sans changement pour certains paquets.
- Passer plus tard à un registre (npm ou GitHub Packages) ne change ni les noms ni les numéros.
