# @onec/react

Composants React des Web Components onec. Les wrappers sont générés par le build de `@onec/components` (cible `@stencil/react-output-target`) dans `src/generated/` : ne pas les modifier à la main. Voir [ADR 0001](../../docs/adr/0001-web-components-stencil.md).

```tsx
import '@onec/tokens/css';
import { OnecButton, OnecIcon } from '@onec/react';

<OnecButton variant="outlined" color="neutral" onClick={save}>
  <OnecIcon slot="icon-start" name="download" />
  Télécharger
</OnecButton>;
```

- Les props et l'événement `onClick` sont typés à partir du composant Stencil.
- Le composant s'enregistre au premier rendu : rien d'autre à importer.
- Exemple complet : [apps/react-demo](../../apps/react-demo).
