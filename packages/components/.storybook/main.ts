import type { StorybookConfig } from '@storybook/web-components-vite';

// Storybook lit les composants compilés par Stencil (dist/components) : lancer `pnpm build` avant.
const config: StorybookConfig = {
  framework: '@storybook/web-components-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: { disableTelemetry: true },
};

export default config;
