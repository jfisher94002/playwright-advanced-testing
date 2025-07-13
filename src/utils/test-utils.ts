import { Page } from '@playwright/test';
import { getTestEnvironment } from '../config/test-environment';

/**
 * Test utilities and helper functions
 */
export class TestUtils {
  private static environment = getTestEnvironment();

  /**
   * Generate a unique test identifier
   */
  static generateTestId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a timestamp string for file names
   */
  static getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  }

  /**
   * Wait for a specific condition with timeout
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    return false;
  }

  /**
   * Retry an operation with exponential backoff
   */
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw new Error(`Operation failed after ${maxRetries} attempts: ${lastError.message}`);
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Clear browser storage and cookies
   */
  static async clearBrowserData(page: Page): Promise<void> {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Set authentication state
   */
  static async setAuthState(page: Page, token: string): Promise<void> {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, token);
  }

  /**
   * Generate random email for testing
   */
  static generateRandomEmail(domain: string = 'example.com'): string {
    const randomString = Math.random().toString(36).substring(2, 15);
    return `test.${randomString}@${domain}`;
  }

  /**
   * Format currency for assertions
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get environment-specific URLs
   */
  static getUrl(urlKey: keyof typeof TestUtils.environment.baseUrls): string {
    return TestUtils.environment.baseUrls[urlKey];
  }

  /**
   * Get environment-specific credentials
   */
  static getCredentials(userType: 'validUser' | 'testUser') {
    return TestUtils.environment.credentials[userType];
  }

  /**
   * Get environment-specific timeouts
   */
  static getTimeout(timeoutType: keyof typeof TestUtils.environment.timeouts): number {
    return TestUtils.environment.timeouts[timeoutType];
  }

  /**
   * Take screenshot with error context
   */
  static async takeErrorScreenshot(page: Page, testName: string, error: Error): Promise<string> {
    const timestamp = TestUtils.getTimestamp();
    const filename = `error-${testName}-${timestamp}.png`;
    
    try {
      await page.screenshot({
        path: filename,
        fullPage: true,
      });
      
      console.error(`Screenshot saved: ${filename}`);
      console.error(`Error: ${error.message}`);
      console.error(`URL: ${page.url()}`);
      
      return filename;
    } catch (screenshotError) {
      console.error(`Failed to take error screenshot: ${screenshotError}`);
      throw error; // Re-throw the original error
    }
  }

  /**
   * Log test step with timestamp
   */
  static logStep(stepName: string, details?: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] STEP: ${stepName}${details ? ` - ${details}` : ''}`);
  }

  /**
   * Measure performance timing
   */
  static async measureTiming<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;
    
    console.log(`⏱️ ${operationName} completed in ${duration}ms`);
    
    return { result, duration };
  }

  /**
   * Compare arrays and return differences
   */
  static getArrayDifferences<T>(expected: T[], actual: T[]): {
    missing: T[];
    extra: T[];
    common: T[];
  } {
    const missing = expected.filter(item => !actual.includes(item));
    const extra = actual.filter(item => !expected.includes(item));
    const common = expected.filter(item => actual.includes(item));
    
    return { missing, extra, common };
  }
}

/**
 * Test data factories
 */
export class TestDataFactory {
  /**
   * Create user test data
   */
  static createUser(overrides: Partial<{ email: string; password: string }> = {}) {
    const env = getTestEnvironment();
    return {
      email: overrides.email || env.credentials.validUser.email,
      password: overrides.password || env.credentials.validUser.password,
    };
  }

  /**
   * Create product test data
   */
  static createProduct(productType: 'zaraCoat' | 'iphone' | 'adidas' = 'zaraCoat') {
    const env = getTestEnvironment();
    return {
      name: env.products[productType],
      type: productType,
    };
  }

  /**
   * Create order test data
   */
  static createOrder(overrides: Partial<{
    productName: string;
    quantity: number;
    country: string;
  }> = {}) {
    return {
      productName: overrides.productName || getTestEnvironment().products.zaraCoat,
      quantity: overrides.quantity || 1,
      country: overrides.country || 'India',
    };
  }

  /**
   * Create random test data
   */
  static createRandomTestData() {
    return {
      email: TestUtils.generateRandomEmail(),
      password: 'TestPass123!',
      firstName: `TestUser${Math.floor(Math.random() * 1000)}`,
      lastName: `User${Math.floor(Math.random() * 1000)}`,
    };
  }
}

/**
 * API testing utilities
 */
export class ApiUtils {
  private static baseUrl = getTestEnvironment().baseUrls.client.replace('/client', '/api');

  /**
   * Make authenticated API request
   */
  static async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<Response> {
    const url = `${ApiUtils.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Login via API and get token
   */
  static async loginAndGetToken(email: string, password: string): Promise<string> {
    const response = await ApiUtils.makeAuthenticatedRequest('/ecom/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userEmail: email, userPassword: password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  }

  /**
   * Create order via API
   */
  static async createOrder(token: string, orderData: any): Promise<any> {
    const response = await ApiUtils.makeAuthenticatedRequest('/ecom/order/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }, token);

    if (!response.ok) {
      throw new Error(`Order creation failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
