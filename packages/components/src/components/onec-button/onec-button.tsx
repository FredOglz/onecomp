import {
  AttachInternals,
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';

const VARIANTS = ['contained', 'outlined', 'ghost'] as const;
const COLORS = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'] as const;
const SIZES = ['small', 'medium', 'large'] as const;
const TYPES = ['button', 'submit', 'reset'] as const;

export type ButtonVariant = (typeof VARIANTS)[number];
export type ButtonColor = (typeof COLORS)[number];
export type ButtonSize = (typeof SIZES)[number];
export type ButtonType = (typeof TYPES)[number];

/**
 * Déclenche une action dans la page : envoyer un formulaire, ouvrir une fenêtre, confirmer un choix.
 * Contrat : `docs/contracts/button.md`.
 *
 * @slot - Le libellé, en texte. Obligatoire.
 * @slot icon-start - Une `<onec-icon>` avant le libellé.
 * @slot icon-end - Une `<onec-icon>` après le libellé.
 *
 * @part base - Le `<button>` natif : fond, bordure, rayon, anneau de focus.
 * @part label - Le conteneur du libellé.
 * @part icon-start - Le conteneur de l'icône de début.
 * @part icon-end - Le conteneur de l'icône de fin.
 * @part spinner - L'indicateur de chargement.
 */
@Component({
  tag: 'onec-button',
  styleUrl: 'onec-button.scss',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class OnecButton {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** Niveau d'emphase. */
  @Prop({ reflect: true, mutable: true }) variant: ButtonVariant = 'contained';

  /** Rôle de couleur. `primary` et `secondary` suivent la marque. */
  @Prop({ reflect: true, mutable: true }) color: ButtonColor = 'primary';

  /** Taille : 32, 40 ou 48 px de haut. */
  @Prop({ reflect: true, mutable: true }) size: ButtonSize = 'medium';

  /** Désactive le bouton et le retire de la tabulation. */
  @Prop({ reflect: true }) disabled = false;

  /** Action en cours : le bouton n'est plus activable mais reste focalisable. */
  @Prop({ reflect: true }) loading = false;

  /** Comportement dans un formulaire. */
  @Prop({ mutable: true }) type: ButtonType = 'button';

  /** Nom envoyé avec le formulaire quand ce bouton le soumet. */
  @Prop({ reflect: true }) name?: string;

  /** Valeur envoyée avec le formulaire quand ce bouton le soumet. */
  @Prop() value?: string;

  @State() hasIconStart = false;
  @State() hasIconEnd = false;

  /** Désactivé par un `<fieldset disabled>` parent. */
  @State() formDisabled = false;

  private get inactive() {
    return this.disabled || this.formDisabled || this.loading;
  }

  @Watch('variant')
  @Watch('color')
  @Watch('size')
  @Watch('type')
  validate() {
    this.variant = check('variant', this.variant, VARIANTS, 'contained', this.el);
    this.color = check('color', this.color, COLORS, 'primary', this.el);
    this.size = check('size', this.size, SIZES, 'medium', this.el);
    this.type = check('type', this.type, TYPES, 'button', this.el);
  }

  componentWillLoad() {
    this.validate();
    this.updateSlots();
  }

  componentDidLoad() {
    const label = Array.from(this.el.childNodes)
      .filter(
        (node) =>
          !(node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).hasAttribute('slot')),
      )
      .map((node) => node.textContent ?? '')
      .join('')
      .trim();
    if (!label) {
      console.warn(
        '[onec-button] libellé manquant : un bouton doit avoir un texte. Pour une icône seule, utiliser le futur IconButton.',
        this.el,
      );
    }
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  /** Bloque le clic (et sa propagation) quand le bouton est désactivé ou en chargement. */
  @Listen('click', { capture: true })
  onHostClick(event: MouseEvent) {
    if (this.inactive) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /**
   * Soumet ou réinitialise le formulaire parent. Écoute l'hôte, pas le bouton interne,
   * pour que `el.click()` en JavaScript se comporte comme un vrai clic.
   */
  @Listen('click')
  onClick(event: MouseEvent) {
    const form = this.internals.form;
    if (!form || this.inactive || event.defaultPrevented) return;
    if (this.type === 'submit') {
      // Le bouton interne n'appartient pas au formulaire : on transmet name/value le temps de la soumission.
      if (this.name) this.internals.setFormValue(this.value ?? '');
      form.requestSubmit();
      this.internals.setFormValue(null);
    } else if (this.type === 'reset') {
      form.reset();
    }
  }

  private updateSlots = () => {
    const slots = Array.from(this.el.children).map((child) => child.getAttribute('slot'));
    this.hasIconStart = slots.includes('icon-start');
    this.hasIconEnd = slots.includes('icon-end');
  };

  render() {
    const disabled = this.disabled || this.formDisabled;
    return (
      <Host>
        <button
          part="base"
          class="base"
          type="button"
          disabled={disabled}
          aria-disabled={!disabled && this.loading ? 'true' : null}
          aria-busy={this.loading ? 'true' : null}
        >
          {this.loading && (
            <span part="spinner" class="icon">
              <onec-icon class="spinner" name="loader-circle"></onec-icon>
            </span>
          )}
          <span part="icon-start" class="icon" hidden={!this.hasIconStart || this.loading}>
            <slot name="icon-start" onSlotchange={this.updateSlots}></slot>
          </span>
          <span part="label" class="label">
            <slot></slot>
          </span>
          <span part="icon-end" class="icon" hidden={!this.hasIconEnd}>
            <slot name="icon-end" onSlotchange={this.updateSlots}></slot>
          </span>
        </button>
      </Host>
    );
  }
}

function check<T extends string>(
  prop: string,
  value: T,
  allowed: readonly T[],
  fallback: T,
  el: HTMLElement,
): T {
  if (allowed.includes(value)) return value;
  console.warn(
    `[onec-button] ${prop}="${value}" inconnu, remplacé par "${fallback}". Valeurs : ${allowed.join(', ')}.`,
    el,
  );
  return fallback;
}
