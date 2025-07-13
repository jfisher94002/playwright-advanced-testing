import { devices, PlaywrightTestConfig } from '@playwright/test';

/**
 * Test Environment Configuration
 * Centralized configuration for all test environments and data
 */
export interface TestEnvironment {
  name: string;
  baseUrls: {
    client: string;
    loginPractice: string;
    seleniumPractice: string;
    automation: string;
    uploadDownload: string;
    angular: string;
    home: string;
  };
  credentials: {
    validUser: {
      email: string;
      password: string;
    };
    testUser: {
      email: string;
      password: string;
    };
  };
  products: {
    zaraCoat: string;
    iphone: string;
    adidas: string;
  };
  timeouts: {
    default: number;
    navigation: number;
    element: number;
    apiRequest: number;
  };
}

/**
 * Environment configurations
 */
export const ENVIRONMENTS: Record<string, TestEnvironment> = {
  development: {
    name: 'Development',
    baseUrls: {
      client: 'https://rahulshettyacademy.com/client',
      loginPractice: 'https://rahulshettyacademy.com/loginpagePractise/',
      seleniumPractice: 'https://rahulshettyacademy.com/seleniumPractise/#/offers',
      automation: 'https://rahulshettyacademy.com/AutomationPractice/',
      uploadDownload: 'https://rahulshettyacademy.com/upload-download-test/index.html',
      angular: 'https://rahulshettyacademy.com/angularpractice/',
      home: 'https://rahulshettyacademy.com/',
    },
    credentials: {
      validUser: {
        email: 'anshika@gmail.com',
        password: 'Iamking@000',
      },
      testUser: {
        email: 'test.user@example.com',
        password: 'TestPassword123',
      },
    },
    products: {
      zaraCoat: 'ZARA COAT 3',
      iphone: 'iphone 13 pro',
      adidas: 'ADIDAS ORIGINAL',
    },
    timeouts: {
      default: 30000,
      navigation: 10000,
      element: 5000,
      apiRequest: 15000,
    },
  },
  staging: {
    name: 'Staging',
    baseUrls: {
      client: 'https://staging.rahulshettyacademy.com/client',
      loginPractice: 'https://staging.rahulshettyacademy.com/loginpagePractise/',
      seleniumPractice: 'https://staging.rahulshettyacademy.com/seleniumPractise/#/offers',
      automation: 'https://staging.rahulshettyacademy.com/AutomationPractice/',
      uploadDownload: 'https://staging.rahulshettyacademy.com/upload-download-test/index.html',
      angular: 'https://staging.rahulshettyacademy.com/angularpractice/',
      home: 'https://staging.rahulshettyacademy.com/',
    },
    credentials: {
      validUser: {
        email: 'staging.user@example.com',
        password: 'StagingPassword123',
      },
      testUser: {
        email: 'test.staging@example.com',
        password: 'TestStaging123',
      },
    },
    products: {
      zaraCoat: 'ZARA COAT 3',
      iphone: 'iphone 13 pro',
      adidas: 'ADIDAS ORIGINAL',
    },
    timeouts: {
      default: 45000,
      navigation: 15000,
      element: 8000,
      apiRequest: 20000,
    },
  },
};

/**
 * Get current test environment configuration
 */
export function getTestEnvironment(): TestEnvironment {
  const envName = process.env.TEST_ENV || 'development';
  const environment = ENVIRONMENTS[envName];
  
  if (!environment) {
    throw new Error(`Unknown test environment: ${envName}. Available: ${Object.keys(ENVIRONMENTS).join(', ')}`);
  }
  
  return environment;
}

/**
 * Browser configuration for different test types
 */
export const BROWSER_CONFIGS = {
  smoke: {
    browsers: ['chromium'],
    headless: true,
    workers: 4,
  },
  regression: {
    browsers: ['chromium', 'firefox', 'webkit'],
    headless: true,
    workers: 2,
  },
  debug: {
    browsers: ['chromium'],
    headless: false,
    workers: 1,
  },
};

/**
 * Test data selectors and locators
 */
export const SELECTORS = {
  // Login page
  login: {
    emailInput: '#userEmail',
    passwordInput: '#userPassword',
    loginButton: '[value="Login"]',
    errorMessage: '.toast-error, .alert-danger, .error, [class*="toast"], [class*="error"], [role="alert"]',
  },
  
  // Dashboard
  dashboard: {
    productCards: '.card-body',
    productTitles: '.card-body b',
    addToCartButton: 'text= Add To Cart',
    cartLink: '[routerlink*="cart"]',
  },
  
  // Cart
  cart: {
    cartItems: 'div li',
    checkoutButton: 'text=Checkout',
    productTitle: (productName: string) => `h3:has-text('${productName}')`,
  },
  
  // Checkout
  checkout: {
    countryInput: '[placeholder*="Country"]',
    countryDropdown: '.ta-results',
    countryOption: 'button',
    submitButton: '.action__submit',
    orderConfirmation: '.hero-primary',
    orderId: '.em-spacer-1 .ng-star-inserted',
  },
  
  // Orders
  orders: {
    ordersLink: 'button[routerlink*="myorders"]',
    ordersTable: 'tbody',
    orderRows: 'tbody tr',
    orderIdCell: 'th',
    viewButton: 'button',
    orderDetails: '.col-text',
  },
} as const;

/**
 * Test annotations for categorization
 */
export const TEST_TAGS = {
  SMOKE: '@smoke',
  CRITICAL: '@critical',
  REGRESSION: '@regression',
  E2E: '@e2e',
  PERFORMANCE: '@performance',
  API: '@api',
  UI: '@ui',
} as const;

/**
 * Default Playwright configuration with environment support
 */
export function createPlaywrightConfig(overrides: Partial<PlaywrightTestConfig> = {}): PlaywrightTestConfig {
  const env = getTestEnvironment();
  
  return {
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    timeout: env.timeouts.default,
    
    reporter: [
      ['html'],
      ['playwright-ctrf-json-reporter', {
        outputFile: 'ctrf-report.json',
        outputDir: 'test-results',
        minimal: false,
        testType: 'playwright',
        appName: 'Udemy Playwright Tests',
        appVersion: '1.0.0',
        osPlatform: process.platform,
        osRelease: process.version,
        osVersion: process.version,
        buildName: process.env.BUILD_NAME || 'Local Build',
        buildNumber: process.env.BUILD_NUMBER || Date.now().toString(),
      }],
    ],
    
    use: {
      baseURL: env.baseUrls.client,
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      actionTimeout: env.timeouts.element,
      navigationTimeout: env.timeouts.navigation,
    },
    
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
    ],
    
    ...overrides,
  };
}
