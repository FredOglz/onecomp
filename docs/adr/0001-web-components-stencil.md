# ADR 0001 : Web Components écrits avec Stencil

- Statut : accepté
- Date : 2026-11-25
- Décideurs : Fred

## Contexte

Les composants doivent servir des applications React et Angular à partir d'une seule implémentation. Les Web Components répondent à ce besoin : ce sont des éléments HTML standards, lisibles par tous les frameworks. Reste à choisir comment les écrire.

Contraintes :

- Une seule implémentation, avec des wrappers adaptés aux conventions de chaque framework.
- Les futurs composants de formulaire (champ, liste, case à cocher) devront se brancher aux formulaires Angular et React.
- Les composants doivent participer aux formulaires HTML natifs.

## Options

| Option | Pour | Contre |
| --- | --- | --- |
| **Stencil** | Wrappers React et Angular générés à chaque build, y compris la liaison aux formulaires Angular ; JSX et décorateurs, familiers aux devs React et Angular ; support de `formAssociated` ; chargement paresseux | Outil plus directif ; écosystème plus petit que Lit ; dépend de la feuille de route de l'équipe qui le maintient |
| **Lit** | Très léger (≈ 5 ko), très proche du standard, large adoption | Wrappers à écrire et maintenir à la main pour chaque framework ; liaison aux formulaires Angular à coder composant par composant |
| **Deux implémentations natives** (React et Angular) | Aucune couche intermédiaire | Deux codes à aligner : c'est le problème qu'on cherche à éviter |

## Décision

On écrit les composants avec **Stencil**, en Shadow DOM, avec les cibles de sortie `react` et `angular` pour générer les wrappers.

## Conséquences

- Paquet `packages/components` : composants Stencil, sortie `dist-custom-elements` et manifeste `custom-elements.json` pour la doc et les agents IA.
- Wrappers générés dans le même paquet (ou des sous-paquets) à chaque build ; ils ne se modifient jamais à la main.
- Storybook utilise le framework `web-components` ; les apps de démo React et Angular consomment les wrappers.
- Les tokens arrivent par des custom properties CSS qui traversent le Shadow DOM.
- Si Stencil devenait un frein, les composants restent des Web Components standards : on pourrait réécrire l'implémentation sans changer l'API publique.
