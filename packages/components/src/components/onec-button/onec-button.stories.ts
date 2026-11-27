import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { figmaDesign } from '../../../.storybook/figma';
import type { OnecParameters } from '../../../.storybook/blocks/CodeTabs';

const variants = ['contained', 'outlined', 'ghost'] as const;
const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'] as const;
const sizes = ['small', 'medium', 'large'] as const;
const themes = [
  ['b2c', 'light'],
  ['b2c', 'dark'],
  ['b2b', 'light'],
  ['b2b', 'dark'],
] as const;
const icons = [
  '',
  'arrow-left',
  'arrow-right',
  'check',
  'chevron-down',
  'download',
  'plus',
  'send',
  'trash-2',
];

type Args = {
  label: string;
  variant: (typeof variants)[number];
  color: (typeof colors)[number];
  size: (typeof sizes)[number];
  disabled: boolean;
  loading: boolean;
  type: 'button' | 'submit' | 'reset';
  iconStart: string;
  iconEnd: string;
};

const button = (a: Partial<Args>) => html`
  <onec-button
    variant=${ifDefined(a.variant)}
    color=${ifDefined(a.color)}
    size=${ifDefined(a.size)}
    type=${ifDefined(a.type)}
    ?disabled=${a.disabled}
    ?loading=${a.loading}
  >
    ${a.iconStart ? html`<onec-icon slot="icon-start" name=${a.iconStart}></onec-icon>` : nothing}
    ${a.label}
    ${a.iconEnd ? html`<onec-icon slot="icon-end" name=${a.iconEnd}></onec-icon>` : nothing}
  </onec-button>
`;

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Grille de toutes les combinaisons, répétée dans les 4 thèmes (utilisée par les tests visuels et axe). */
const allThemes = (content: () => unknown) => html`
  ${themes.map(
    ([brand, theme]) => html`
      <section class="onec-theme" data-brand=${brand} data-theme=${theme} style="min-height:0">
        <p style="margin:0 0 12px;font:600 12px/1 var(--onec-font-family-sans)">
          ${brand.toUpperCase()} · ${theme === 'light' ? 'clair' : 'sombre'}
        </p>
        ${content()}
      </section>
    `,
  )}
`;

const grid = (columns: number, items: unknown[]) =>
  html`<div
    style="display:grid;grid-template-columns:repeat(${columns},max-content);gap:12px;align-items:center"
  >
    ${items}
  </div>`;

const meta: Meta<Args> = {
  title: 'Composants/Button',
  component: 'onec-button',
  render: button,
  args: {
    label: 'Enregistrer',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    type: 'button',
    iconStart: '',
    iconEnd: '',
  },
  argTypes: {
    label: { description: 'Libellé (slot par défaut)' },
    variant: { control: 'inline-radio', options: variants, description: "Niveau d'emphase" },
    color: { control: 'select', options: colors, description: 'Rôle de couleur' },
    size: { control: 'inline-radio', options: sizes, description: 'Taille : 32, 40 ou 48 px' },
    disabled: { description: 'Désactive le bouton et le retire de la tabulation' },
    loading: { description: 'Action en cours : non activable, reste focalisable' },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    iconStart: { control: 'select', options: icons, description: 'Slot icon-start' },
    iconEnd: { control: 'select', options: icons, description: 'Slot icon-end' },
  },
  parameters: {
    design: figmaDesign('buttonComponentSet'),
    // Code affiché sous l'exemple (React, Angular, HTML), recalculé quand les contrôles changent.
    onec: { examples: (args) => [args] } satisfies OnecParameters,
    docs: {
      description: {
        component:
          'Déclenche une action dans la page. Contrat complet : `docs/contracts/button.md`. Les couleurs viennent uniquement des tokens `--onec-button-*` ; la marque et le schéma se choisissent dans la barre d’outils.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

const withIcons = [
  { label: 'Ajouter', iconStart: 'plus' },
  { label: 'Continuer', iconEnd: 'arrow-right' },
  {
    label: 'Télécharger',
    variant: 'outlined',
    color: 'neutral',
    iconStart: 'download',
    iconEnd: 'chevron-down',
  },
] satisfies Partial<Args>[];

export const WithIcons: Story = {
  name: 'Avec icônes',
  parameters: { onec: { examples: withIcons } satisfies OnecParameters },
  render: () => grid(3, withIcons.map(button)),
};

export const Variants: Story = {
  name: 'Variantes et couleurs',
  parameters: {
    design: figmaDesign('buttonComponent'),
    onec: {
      // Un extrait par variante : la couleur se change de la même façon pour les 21 combinaisons.
      examples: [
        { label: 'Enregistrer' },
        { label: 'Modifier', variant: 'outlined', color: 'secondary' },
        { label: 'Annuler', variant: 'ghost', color: 'neutral' },
        { label: 'Supprimer', color: 'error' },
      ],
    } satisfies OnecParameters,
  },
  render: () =>
    grid(
      7,
      variants.flatMap((variant) =>
        colors.map((color) => button({ variant, color, label: capitalize(color) })),
      ),
    ),
};

export const Sizes: Story = {
  name: 'Tailles',
  parameters: {
    onec: {
      examples: sizes.map((size) => ({ size, label: capitalize(size), iconStart: 'plus' })),
    } satisfies OnecParameters,
  },
  render: () =>
    grid(
      3,
      sizes.map((size) => button({ size, label: capitalize(size), iconStart: 'plus' })),
    ),
};

export const States: Story = {
  name: 'États',
  parameters: {
    onec: {
      examples: [
        { label: 'Désactivé', disabled: true },
        { label: 'Envoi', loading: true, iconStart: 'send' },
      ],
    } satisfies OnecParameters,
  },
  render: () =>
    grid(4, [
      button({ label: 'Par défaut' }),
      button({ label: 'Désactivé', disabled: true }),
      button({ label: 'Envoi', loading: true, iconStart: 'send' }),
      button({ label: 'Envoi', loading: true }),
      button({ label: 'Par défaut', variant: 'outlined' }),
      button({ label: 'Désactivé', variant: 'outlined', disabled: true }),
      button({ label: 'Envoi', variant: 'outlined', loading: true, iconStart: 'send' }),
      button({ label: 'Envoi', variant: 'outlined', loading: true }),
    ]),
};

const formCode = {
  react: `import { useState, type FormEvent } from 'react';
import { OnecButton } from '@onec/react';

export function PlateForm() {
  const [result, setResult] = useState('');
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget); // contient action=save
    setResult([...data].map(([k, v]) => \`\${k}=\${v}\`).join(', '));
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Immatriculation <input name="plate" defaultValue="AB-123-CD" />
      </label>
      <OnecButton type="submit" name="action" value="save">
        Enregistrer
      </OnecButton>
      <OnecButton type="reset" variant="ghost" color="neutral">
        Annuler
      </OnecButton>
      <output>{result}</output>
    </form>
  );
}`,
  angular: `import { Component, signal } from '@angular/core';
import { OnecButton } from '@onec/angular';

@Component({
  selector: 'app-plate-form',
  imports: [OnecButton],
  template: \`
    <form (submit)="onSubmit($event)">
      <label>Immatriculation <input name="plate" value="AB-123-CD" /></label>
      <onec-button type="submit" name="action" value="save">Enregistrer</onec-button>
      <onec-button type="reset" variant="ghost" color="neutral">Annuler</onec-button>
      <output>{{ result() }}</output>
    </form>
  \`,
})
export class PlateForm {
  readonly result = signal('');

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement); // contient action=save
    this.result.set([...data].map(([k, v]) => \`\${k}=\${v}\`).join(', '));
  }
}`,
  html: `<form>
  <label>Immatriculation <input name="plate" value="AB-123-CD" /></label>
  <onec-button type="submit" name="action" value="save">Enregistrer</onec-button>
  <onec-button type="reset" variant="ghost" color="neutral">Annuler</onec-button>
</form>`,
};

export const Form: Story = {
  name: 'Dans un formulaire',
  parameters: { onec: { code: formCode } satisfies OnecParameters },
  render: () => html`
    <form
      id="demo-form"
      style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        form.querySelector('output')!.value = [...new FormData(form)]
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
      }}
    >
      <label>Immatriculation <input name="plate" value="AB-123-CD" /></label>
      <onec-button type="submit" name="action" value="save">Enregistrer</onec-button>
      <onec-button type="reset" variant="ghost" color="neutral">Annuler</onec-button>
      <output name="result" style="flex-basis:100%"></output>
    </form>
  `,
};

/** Toutes les variantes, couleurs et états dans les 4 thèmes. Référence des tests visuels et axe. */
export const AllThemes: Story = {
  name: 'Matrice 4 thèmes',
  parameters: {
    themes: 'all',
    design: figmaDesign('buttonThemes'),
    onec: {
      code: {
        html: `<link rel="stylesheet" href="@onec/tokens/dist/css/tokens.css" />

<!-- data-brand et data-theme se posent ensemble, sur le même conteneur -->
<div data-brand="b2b" data-theme="dark">
  <onec-button>Enregistrer</onec-button>
</div>`,
        react: `// main.tsx : la feuille de tokens, une fois pour toute l'application
import '@onec/tokens/css';
import { OnecButton } from '@onec/react';

export function App({ brand, scheme }: { brand: 'b2c' | 'b2b'; scheme: 'light' | 'dark' }) {
  // data-brand et data-theme se posent ensemble, sur le même conteneur
  return (
    <main data-brand={brand} data-theme={scheme}>
      <OnecButton>Enregistrer</OnecButton>
    </main>
  );
}`,
        angular: `// angular.json > projects.*.architect.build.options.styles :
//   ["node_modules/@onec/tokens/dist/css/tokens.css"]
import { Component, signal } from '@angular/core';
import { OnecButton } from '@onec/angular';

@Component({
  selector: 'app-root',
  imports: [OnecButton],
  // data-brand et data-theme se posent ensemble, sur le même conteneur
  template: \`
    <main [attr.data-brand]="brand()" [attr.data-theme]="scheme()">
      <onec-button>Enregistrer</onec-button>
    </main>
  \`,
})
export class App {
  readonly brand = signal<'b2c' | 'b2b'>('b2c');
  readonly scheme = signal<'light' | 'dark'>('light');
}`,
      },
    } satisfies OnecParameters,
  },
  render: () =>
    allThemes(() =>
      grid(7, [
        ...variants.flatMap((variant) =>
          colors.map((color) => button({ variant, color, label: capitalize(color) })),
        ),
        ...variants.map((variant) => button({ variant, label: 'Désactivé', disabled: true })),
        button({ label: 'Envoi', loading: true, iconStart: 'send' }),
        ...sizes.map((size) => button({ size, label: capitalize(size), iconStart: 'plus' })),
      ]),
    ),
};

const matrixStates = ['default', 'hover', 'active', 'focus', 'disabled', 'loading'] as const;
const stateLabels: Record<(typeof matrixStates)[number], string> = {
  default: 'Par défaut',
  hover: 'Survol',
  active: 'Appui',
  focus: 'Focus',
  disabled: 'Désactivé',
  loading: 'Chargement',
};

/**
 * Bouton figé dans un état, pour la doc : survol et appui sont simulés en redirigeant, sur l'élément,
 * les tokens « default » vers ceux de l'état ; le focus reprend l'anneau des tokens de focus.
 * Rien de tout cela n'existe dans le composant : en usage réel, ces états viennent du navigateur.
 */
const frozen = (variant: string, color: string, state: (typeof matrixStates)[number]) => {
  const style: Record<string, string> = {};
  if (state === 'hover' || state === 'active') {
    for (const part of ['background', 'border', 'foreground'])
      style[`--onec-button-${variant}-${color}-${part}-default`] =
        `var(--onec-button-${variant}-${color}-${part}-${state})`;
  }
  if (state === 'focus') {
    Object.assign(style, {
      outline: 'var(--onec-button-focus-ring-width) solid var(--onec-button-focus-ring-color)',
      'outline-offset': 'var(--onec-button-focus-ring-offset)',
      'border-radius': 'var(--onec-button-border-radius)',
    });
  }
  return html`<onec-button
    variant=${variant}
    color=${color}
    style=${styleMap(style)}
    ?disabled=${state === 'disabled'}
    ?loading=${state === 'loading'}
    >${capitalize(color)}</onec-button
  >`;
};

/** Variantes × couleurs × états, dans le thème de la barre d'outils (ou les 4 avec le réglage « all »). */
const statesMatrix = () => html`
  <table class="onec-states-matrix">
    <thead>
      <tr>
        <th scope="col">Variante</th>
        ${matrixStates.map((s) => html`<th scope="col">${stateLabels[s]}</th>`)}
      </tr>
    </thead>
    <tbody>
      ${variants.flatMap((variant) =>
        colors.map(
          (color, i) => html`
            <tr>
              <th scope="row">${i === 0 ? capitalize(variant) : ''}</th>
              ${matrixStates.map((s) => html`<td>${frozen(variant, color, s)}</td>`)}
            </tr>
          `,
        ),
      )}
    </tbody>
  </table>
`;

/** Matrice variantes × couleurs × états (survol, appui et focus figés). Suit la marque et le schéma choisis. */
export const StatesMatrix: Story = {
  name: 'Matrice des états',
  parameters: {
    design: figmaDesign('buttonComponent'),
    onec: {
      code: {
        html: `<!-- Survol, appui et focus viennent du navigateur : rien à écrire.
     Seuls disabled et loading se posent à la main. -->
<onec-button disabled>Enregistrer</onec-button>
<onec-button loading>Enregistrer</onec-button>`,
        react: `<OnecButton disabled>Enregistrer</OnecButton>
<OnecButton loading={isSaving}>Enregistrer</OnecButton>`,
        angular: `<onec-button [disabled]="true">Enregistrer</onec-button>
<onec-button [loading]="isSaving()">Enregistrer</onec-button>`,
      },
    } satisfies OnecParameters,
  },
  render: statesMatrix,
};

/** La même matrice dans les 4 thèmes côte à côte. */
export const StatesMatrixAllThemes: Story = {
  name: 'Matrice des états, 4 thèmes',
  parameters: { themes: 'all', design: figmaDesign('buttonThemes') },
  render: () => allThemes(statesMatrix),
};
