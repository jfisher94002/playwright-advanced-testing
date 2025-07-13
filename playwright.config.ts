import { defineConfig } from '@playwright/test';
import { createPlaywrightConfig } from './src/config/test-environment';

/**
 * Main Playwright configuration using our centralized config system
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(
  createPlaywrightConfig({
    // Override specific settings if needed
    projects: [
      {
        name: 'chromium',
        use: { 
          ...require('@playwright/test').devices['Desktop Chrome'],
          // Add any Chrome-specific settings
        },
      },
      // Commented out other browsers for faster local testing
      // Uncomment for full cross-browser testing
      // {
      //   name: 'firefox',
      //   use: { ...devices['Desktop Firefox'] },
      // },
      // {
      //   name: 'webkit',
      //   use: { ...devices['Desktop Safari'] },
      // },
    ],
  })
);
