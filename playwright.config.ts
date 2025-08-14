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
          // Chromium browser engine
        },
      },
      {
        name: 'chrome',
        use: { 
          ...require('@playwright/test').devices['Desktop Chrome'],
          channel: 'chrome',
          // Google Chrome browser
        },
      },
      {
        name: 'firefox',
        use: { 
          ...require('@playwright/test').devices['Desktop Firefox'],
          // Firefox browser
        },
      },
    ],
  })
);
