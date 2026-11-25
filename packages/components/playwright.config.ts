import { defineConfig, devices } from '@playwright/test';

// Les tests ouvrent les stories de Storybook (build statique) dans Chromium.
// Prérequis : pnpm build && pnpm build-storybook
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:6007',
    ...devices['Desktop Chrome'],
    deviceScaleFactor: 1,
    trace: 'off',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  webServer: {
    command: 'node scripts/serve.mjs storybook-static 6007',
    url: 'http://localhost:6007/iframe.html',
    reuseExistingServer: !process.env.CI,
  },
});
