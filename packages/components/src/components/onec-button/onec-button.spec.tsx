import { newSpecPage } from '@stencil/core/testing';
import { OnecButton } from './onec-button';
import { OnecIcon } from '../onec-icon/onec-icon';

const render = (html: string) => newSpecPage({ components: [OnecButton, OnecIcon], html });
const inner = (page: { root?: Element }) => page.root!.shadowRoot!.querySelector('button')!;

describe('onec-button', () => {
  it('rend un vrai bouton natif avec les valeurs par défaut', async () => {
    const page = await render('<onec-button>Enregistrer</onec-button>');
    expect(page.root).toEqualAttribute('variant', 'contained');
    expect(page.root).toEqualAttribute('color', 'primary');
    expect(page.root).toEqualAttribute('size', 'medium');
    const button = inner(page);
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('part')).toBe('base');
    expect(button).not.toHaveAttribute('disabled');
  });

  it('reflète variante, couleur et taille pour la feuille de style', async () => {
    const page = await render(
      '<onec-button variant="outlined" color="error" size="large">Supprimer</onec-button>',
    );
    expect(page.root).toEqualAttribute('variant', 'outlined');
    expect(page.root).toEqualAttribute('color', 'error');
    expect(page.root).toEqualAttribute('size', 'large');
  });

  it('remplace une valeur inconnue par le défaut et prévient', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const page = await render('<onec-button variant="filled" size="xl">OK</onec-button>');
    expect(page.root).toEqualAttribute('variant', 'contained');
    expect(page.root).toEqualAttribute('size', 'medium');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('variant="filled"'),
      expect.anything(),
    );
    warn.mockRestore();
  });

  it('prévient quand le libellé manque', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await render(
      '<onec-button><onec-icon slot="icon-start" name="plus"></onec-icon></onec-button>',
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('libellé manquant'),
      expect.anything(),
    );
    warn.mockRestore();
  });

  it('affiche les conteneurs d’icônes seulement quand une icône est fournie', async () => {
    const page = await render(
      '<onec-button><onec-icon slot="icon-start" name="plus"></onec-icon>Ajouter</onec-button>',
    );
    const shadow = page.root!.shadowRoot!;
    expect(shadow.querySelector('[part="icon-start"]')).not.toHaveAttribute('hidden');
    expect(shadow.querySelector('[part="icon-end"]')).toHaveAttribute('hidden');
  });

  it('désactivé : bouton natif désactivé et clic bloqué', async () => {
    const page = await render('<onec-button disabled>Enregistrer</onec-button>');
    expect(inner(page)).toHaveAttribute('disabled');
    const spy = jest.fn();
    page.body.addEventListener('click', spy);
    page.root!.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('chargement : spinner à la place de l’icône, reste focalisable, annoncé occupé', async () => {
    const page = await render(
      '<onec-button loading><onec-icon slot="icon-start" name="send"></onec-icon>Envoyer</onec-button>',
    );
    const shadow = page.root!.shadowRoot!;
    const button = inner(page);
    expect(button).not.toHaveAttribute('disabled');
    expect(button).toEqualAttribute('aria-busy', 'true');
    expect(button).toEqualAttribute('aria-disabled', 'true');
    expect(shadow.querySelector('[part="spinner"]')).not.toBeNull();
    expect(shadow.querySelector('[part="icon-start"]')).toHaveAttribute('hidden');
    const spy = jest.fn();
    page.body.addEventListener('click', spy);
    page.root!.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('désactivé par un fieldset parent', async () => {
    const page = await render('<onec-button>OK</onec-button>');
    (page.rootInstance as OnecButton).formDisabledCallback(true);
    await page.waitForChanges();
    expect(inner(page)).toHaveAttribute('disabled');
  });
});
