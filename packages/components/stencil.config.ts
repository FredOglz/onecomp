import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'onec',
  sourceMap: false,
  plugins: [sass()],
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
      externalRuntime: false,
    },
    { type: 'docs-readme', footer: '' },
    { type: 'docs-json', file: 'dist/docs.json' },
  ],
  testing: {
    browserHeadless: 'shell',
  },
};
