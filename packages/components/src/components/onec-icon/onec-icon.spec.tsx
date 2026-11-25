import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { icons } from '@onec/icons';
import { OnecIcon } from './onec-icon';

describe('onec-icon', () => {
  it('rend le dessin de l’icône demandée', async () => {
    const page = await newSpecPage({
      components: [OnecIcon],
      template: () => <onec-icon name="download"></onec-icon>,
    });
    const svg = page.root!.shadowRoot!.querySelector('svg')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.innerHTML).toBe(icons.download);
  });

  it('est décorative par défaut', async () => {
    const page = await newSpecPage({
      components: [OnecIcon],
      html: '<onec-icon name="check"></onec-icon>',
    });
    expect(page.root).toEqualAttribute('aria-hidden', 'true');
    expect(page.root).not.toHaveAttribute('role');
  });

  it('devient une image nommée avec label', async () => {
    const page = await newSpecPage({
      components: [OnecIcon],
      html: '<onec-icon name="check" label="Validé"></onec-icon>',
    });
    expect(page.root).toEqualAttribute('role', 'img');
    expect(page.root).toEqualAttribute('aria-label', 'Validé');
    expect(page.root).not.toHaveAttribute('aria-hidden');
  });

  it('reflète la taille pour la feuille de style', async () => {
    const page = await newSpecPage({
      components: [OnecIcon],
      html: '<onec-icon name="plus" size="large"></onec-icon>',
    });
    expect(page.root).toEqualAttribute('size', 'large');
  });

  it('prévient quand le nom est inconnu', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await newSpecPage({
      components: [OnecIcon],
      html: '<onec-icon name="nope"></onec-icon>',
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"nope"'), expect.anything());
    warn.mockRestore();
  });
});
