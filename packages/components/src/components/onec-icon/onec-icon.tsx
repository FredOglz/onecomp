import { Component, Element, Host, Prop, h } from '@stencil/core';
import { icons, type IconName } from '@onec/icons';

/**
 * Affiche une icône du jeu onec (Lucide), en SVG inline.
 *
 * La couleur suit celle du texte parent (`currentColor`). La taille vient des tokens
 * `size.icon.*` ; un parent peut l'imposer avec la propriété CSS `--onec-icon-size`
 * (c'est ce que fait `<onec-button>`).
 *
 * @part svg - L'élément `<svg>`.
 */
@Component({
  tag: 'onec-icon',
  styleUrl: 'onec-icon.css',
  shadow: true,
})
export class OnecIcon {
  @Element() el!: HTMLElement;

  /** Nom de l'icône, tel qu'il apparaît dans `packages/icons/svg/`. */
  @Prop({ reflect: true }) name!: IconName;

  /** Taille, liée aux tokens `size.icon.small|medium|large` (16, 16 et 20 px). */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Texte alternatif. Sans lui, l'icône est décorative et masquée aux lecteurs d'écran.
   * À renseigner seulement si l'icône porte un sens que le texte voisin ne donne pas.
   */
  @Prop() label?: string;

  componentWillRender() {
    if (this.name && !icons[this.name]) {
      console.warn(`[onec-icon] icône inconnue : "${this.name}"`, this.el);
    }
  }

  render() {
    const content = icons[this.name] ?? '';
    const labelled = Boolean(this.label);
    return (
      <Host
        role={labelled ? 'img' : null}
        aria-label={labelled ? this.label : null}
        aria-hidden={labelled ? null : 'true'}
      >
        <svg
          part="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          focusable="false"
          // Stencil pose innerHTML comme attribut sur les éléments SVG : on l'écrit à la main.
          ref={(svg) => {
            if (svg && svg.innerHTML !== content) svg.innerHTML = content;
          }}
        ></svg>
      </Host>
    );
  }
}
