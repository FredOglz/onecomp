import type { StorybookConfig } from '@storybook/web-components-vite';
import remarkGfm from 'remark-gfm';

// Storybook lit les composants compilés par Stencil (dist/components) : lancer `pnpm build` avant.
const config: StorybookConfig = {
  framework: '@storybook/web-components-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // remark-gfm : tableaux Markdown dans les pages MDX.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
  ],
  core: { disableTelemetry: true },
};

export default config;
