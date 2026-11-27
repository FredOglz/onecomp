import type { Preview } from '@storybook/web-components-vite';
import { figmaDesign } from './figma';
import { html } from 'lit';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@onec/tokens/css';
// Éléments autonomes (dist-custom-elements) : le chargement paresseux de Stencil ne passe pas le bundling de Vite.
import { defineCustomElement as defineButton } from '../dist/components/onec-button.js';
import { defineCustomElement as defineIcon } from '../dist/components/onec-icon.js';
import './preview.css';
import './docs.css';

defineButton();
defineIcon();

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Marque',
      toolbar: {
        title: 'Marque',
        icon: 'paintbrush',
        items: [
          { value: 'b2c', title: 'B2C' },
          { value: 'b2b', title: 'B2B' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Schéma',
      toolbar: {
        title: 'Schéma',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Clair' },
          { value: 'dark', title: 'Sombre' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { brand: 'b2c', theme: 'light' },
  decorators: [
    (story, { globals, parameters, viewMode }) =>
      parameters.themes === 'all'
        ? story()
        : html`<div
            class="onec-theme ${viewMode === 'docs' ? 'onec-theme--docs' : ''}"
            data-brand=${globals.brand}
            data-theme=${globals.theme}
          >
            ${story()}
          </div>`,
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    docs: {
      // Le code s'affiche sous chaque exemple, à onglets React / Angular / HTML (blocks/Example.tsx) :
      // on masque le bloc « Show code » par défaut de Storybook, qui ne connaît que le HTML.
      canvas: { sourceState: 'none' },
    },
    // Panneau « Design » : la maquette Figma du composant (surchargé par story).
    design: figmaDesign('buttonComponentSet'),
    options: {
      storySort: {
        order: [
          'Introduction',
          'Démarrer',
          ['Designers', 'Développeurs React', 'Développeurs Angular', 'HTML'],
          'Design tokens',
          [
            'Vue d’ensemble',
            'Couleurs',
            'Typographie',
            'Espacements et dimensions',
            'Tokens du Button',
            'Utiliser les tokens',
          ],
          'Composants',
          ['Button', ['Documentation', '*']],
        ],
      },
    },
  },
};

export default preview;
