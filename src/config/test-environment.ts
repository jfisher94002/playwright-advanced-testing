import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Environment-specific test configuration
 */
export interface TestEnvironmentConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  workers?: number;
  projects?: PlaywrightTestConfig['projects'];
  use?: PlaywrightTestConfig['use'];
}

/**
 * Creates a Playwright configuration with environment-specific settings
 */
export function createPlaywrightConfig(config: TestEnvironmentConfig = {}): PlaywrightTestConfig {
  const environment = process.env.TEST_ENV || 'staging';
  
  // Base configuration
  const baseConfig: PlaywrightTestConfig = {
    testDir: './tests',
    testMatch: ['**/*.spec.ts', '**/*.spec.js', '**/e2e/*.spec.ts'],
    testIgnore: ['**/html-report.test.ts', '**/integration.ts'], // Exclude Jest tests
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : config.retries ?? 0,
    workers: process.env.CI ? 1 : config.workers ?? undefined,
    reporter: [
      ['html'],
      ['json', { outputFile: 'test-results/results.json' }],
      ['playwright-ctrf-json-reporter', { outputFile: 'test-results/ctrf-report.json' }],
    ],
    outputDir: 'test-results/',
    
    use: {
      baseURL: config.baseURL ?? getBaseURL(environment),
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      ...config.use,
    },

    projects: config.projects ?? [
      {
        name: 'chromium',
        use: { ...require('@playwright/test').devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...require('@playwright/test').devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...require('@playwright/test').devices['Desktop Safari'] },
      },
    ],
  };

  return baseConfig;
}

/**
 * Get base URL based on environment
 */
function getBaseURL(environment: string): string {
  switch (environment) {
    case 'production':
      return 'https://rahulshettyacademy.com';
    case 'staging':
      return 'https://rahulshettyacademy.com';
    case 'local':
      return 'http://localhost:3000';
    default:
      return 'https://rahulshettyacademy.com';
  }
}