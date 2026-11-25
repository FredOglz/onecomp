# @onec/angular

Composants Angular (standalone) des Web Components onec. Ils sont générés par le build de `@onec/components` (cible `@stencil/angular-output-target`) dans `src/generated/`, puis compilés avec ng-packagr. Ne pas modifier `src/generated/` à la main. Voir [ADR 0001](../../docs/adr/0001-web-components-stencil.md).

```ts
import { OnecButton, OnecIcon } from '@onec/angular';

@Component({
  imports: [OnecButton, OnecIcon],
  template: `
    <onec-button variant="outlined" color="neutral" (click)="save()">
      <onec-icon slot="icon-start" name="download"></onec-icon>
      Télécharger
    </onec-button>
  `,
})
export class SaveBar {}
```

- Ajouter la feuille de tokens (`@onec/tokens/dist/css/tokens.css`) aux `styles` de l'application.
- `ONEC_COMPONENTS` regroupe tous les composants, pour les importer d'un coup.
- Exemple complet : [apps/angular-demo](../../apps/angular-demo).
