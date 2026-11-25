import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

// Les wrappers React et Angular sont générés à chaque build dans leurs paquets
// (packages/react, packages/angular). Ne jamais les modifier à la main (ADR 0001).
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
    reactOutputTarget({
      outDir: '../react/src/generated',
      stencilPackageName: '@onec/components',
      customElementsDir: 'components',
    }),
    angularOutputTarget({
      componentCorePackage: '@onec/components',
      outputType: 'standalone',
      customElementsDir: 'components',
      directivesProxyFile: '../angular/src/generated/proxies.ts',
      directivesArrayFile: '../angular/src/generated/index.ts',
    }),
    { type: 'docs-readme', footer: '' },
    { type: 'docs-json', file: 'dist/docs.json' },
    // Données pour l'éditeur (VS Code) : complétion des balises et attributs onec-*.
    {
      type: 'docs-vscode',
      file: 'dist/vscode-data.json',
      sourceCodeBaseUrl: 'https://github.com/FredOglz/onecomp/blob/main/packages/components',
    },
  ],
  testing: {
    browserHeadless: 'shell',
    // e2e/ contient les tests Playwright, lancés à part avec `pnpm e2e`.
    testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  },
};
