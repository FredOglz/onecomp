import type { Preview } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@onec/tokens/css';
// Éléments autonomes (dist-custom-elements) : le chargement paresseux de Stencil ne passe pas le bundling de Vite.
import { defineCustomElement as defineButton } from '../dist/components/onec-button.js';
import { defineCustomElement as defineIcon } from '../dist/components/onec-icon.js';
import './preview.css';

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
    (story, { globals, parameters }) =>
      parameters.themes === 'all'
        ? story()
        : html`<div class="onec-theme" data-brand=${globals.brand} data-theme=${globals.theme}>
            ${story()}
          </div>`,
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
