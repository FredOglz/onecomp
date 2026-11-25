import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

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

export const WithIcons: Story = {
  name: 'Avec icônes',
  render: () =>
    grid(3, [
      button({ label: 'Ajouter', iconStart: 'plus' }),
      button({ label: 'Continuer', iconEnd: 'arrow-right' }),
      button({
        label: 'Télécharger',
        variant: 'outlined',
        color: 'neutral',
        iconStart: 'download',
        iconEnd: 'chevron-down',
      }),
    ]),
};

export const Variants: Story = {
  name: 'Variantes et couleurs',
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
  render: () =>
    grid(
      3,
      sizes.map((size) => button({ size, label: capitalize(size), iconStart: 'plus' })),
    ),
};

export const States: Story = {
  name: 'États',
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

export const Form: Story = {
  name: 'Dans un formulaire',
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
  parameters: { themes: 'all' },
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
