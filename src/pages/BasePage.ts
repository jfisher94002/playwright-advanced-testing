import { Page, Locator, expect } from '@playwright/test';
import { getTestEnvironment, SELECTORS } from '../config/test-environment';

/**
 * Base Page Object class with common functionality
 */
export abstract class BasePage {
  protected page: Page;
  protected environment = getTestEnvironment();

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL with error handling
   */
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    try {
      await this.page.goto(url, {
        waitUntil: options?.waitUntil || 'networkidle',
        timeout: this.environment.timeouts.navigation,
      });
    } catch (error) {
      throw new Error(`Failed to navigate to ${url}: ${error}`);
    }
  }

  /**
   * Wait for an element to be visible with custom timeout
   */
  async waitForElement(selector: string, timeout?: number): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ 
      state: 'visible', 
      timeout: timeout || this.environment.timeouts.element 
    });
    return locator;
  }

  /**
   * Fill input field with validation
   */
  async fillInput(selector: string, value: string, options?: { clear?: boolean }): Promise<void> {
    const input = this.page.locator(selector);
    await input.waitFor({ state: 'visible' });
    
    if (options?.clear) {
      await input.clear();
    }
    
    await input.fill(value);
    
    // Verify the value was entered correctly
    const actualValue = await input.inputValue();
    if (actualValue !== value) {
      throw new Error(`Input value mismatch. Expected: "${value}", Actual: "${actualValue}"`);
    }
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string, options?: { force?: boolean; retries?: number }): Promise<void> {
    const maxRetries = options?.retries || 3;
    const element = this.page.locator(selector);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await element.waitFor({ state: 'visible' });
        await element.click({ force: options?.force });
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(`Failed to click ${selector} after ${maxRetries} attempts: ${error}`);
        }
        await this.page.waitForTimeout(1000); // Wait 1 second before retry
      }
    }
  }

  /**
   * Get text content with error handling
   */
  async getTextContent(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    const text = await element.textContent();
    
    if (text === null) {
      throw new Error(`Could not get text content from ${selector}`);
    }
    
    return text.trim();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    return filename;
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}

/**
 * Login Page Object
 */
export class LoginPage extends BasePage {
  private get emailInput(): Locator {
    return this.page.locator(SELECTORS.login.emailInput);
  }

  private get passwordInput(): Locator {
    return this.page.locator(SELECTORS.login.passwordInput);
  }

  private get loginButton(): Locator {
    return this.page.locator(SELECTORS.login.loginButton);
  }

  private get errorMessage(): Locator {
    return this.page.locator(SELECTORS.login.errorMessage);
  }

  async navigateToLogin(): Promise<void> {
    await this.goto(this.environment.baseUrls.client);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(SELECTORS.login.emailInput, email);
    await this.fillInput(SELECTORS.login.passwordInput, password);
    await this.clickElement(SELECTORS.login.loginButton);
    await this.waitForPageLoad();
  }

  async loginWithValidCredentials(): Promise<void> {
    const { email, password } = this.environment.credentials.validUser;
    await this.login(email, password);
  }

  async expectLoginError(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isLoginSuccessful(): Promise<boolean> {
    try {
      // Check if we're redirected away from login page
      await this.page.waitForURL(/.*\/dashboard|.*\/client/, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Dashboard Page Object
 */
export class DashboardPage extends BasePage {
  private get productCards(): Locator {
    return this.page.locator(SELECTORS.dashboard.productCards);
  }

  private get productTitles(): Locator {
    return this.page.locator(SELECTORS.dashboard.productTitles);
  }

  private get cartLink(): Locator {
    return this.page.locator(SELECTORS.dashboard.cartLink);
  }

  async waitForProducts(): Promise<void> {
    await this.productTitles.first().waitFor({ state: 'visible' });
  }

  async getProductTitles(): Promise<string[]> {
    await this.waitForProducts();
    return await this.productTitles.allTextContents();
  }

  async addProductToCart(productName: string): Promise<void> {
    const productCount = await this.productCards.count();
    
    for (let i = 0; i < productCount; i++) {
      const product = this.productCards.nth(i);
      const title = await product.locator('b').textContent();
      
      if (title === productName) {
        await product.locator(SELECTORS.dashboard.addToCartButton).click();
        return;
      }
    }
    
    throw new Error(`Product "${productName}" not found on the page`);
  }

  async navigateToCart(): Promise<void> {
    await this.clickElement(SELECTORS.dashboard.cartLink);
    await this.waitForPageLoad();
  }

  async navigateToOrders(): Promise<void> {
    await this.clickElement(SELECTORS.orders.ordersLink);
    await this.waitForPageLoad();
  }
}

/**
 * Cart Page Object
 */
export class CartPage extends BasePage {
  async waitForCartItems(): Promise<void> {
    await this.page.locator(SELECTORS.cart.cartItems).first().waitFor({ state: 'visible' });
  }

  async verifyProductInCart(productName: string): Promise<boolean> {
    await this.waitForCartItems();
    const productLocator = this.page.locator(SELECTORS.cart.productTitle(productName));
    return await productLocator.isVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickElement(SELECTORS.cart.checkoutButton);
    await this.waitForPageLoad();
  }
}

/**
 * Checkout Page Object
 */
export class CheckoutPage extends BasePage {
  async fillShippingDetails(country: string = 'India'): Promise<void> {
    // Fill country
    await this.fillInput(SELECTORS.checkout.countryInput, 'ind');
    
    // Wait for dropdown and select country
    const dropdown = this.page.locator(SELECTORS.checkout.countryDropdown);
    await dropdown.waitFor({ state: 'visible' });
    
    const options = dropdown.locator(SELECTORS.checkout.countryOption);
    const optionCount = await options.count();
    
    for (let i = 0; i < optionCount; i++) {
      const optionText = await options.nth(i).textContent();
      if (optionText?.trim() === country) {
        await options.nth(i).click();
        break;
      }
    }
  }

  async submitOrder(): Promise<string> {
    await this.clickElement(SELECTORS.checkout.submitButton);
    
    // Wait for order confirmation
    await this.page.locator(SELECTORS.checkout.orderConfirmation).waitFor({ state: 'visible' });
    
    // Get order ID
    const orderIdElement = this.page.locator(SELECTORS.checkout.orderId);
    const orderId = await orderIdElement.textContent();
    
    if (!orderId) {
      throw new Error('Order ID not found');
    }
    
    return orderId.trim();
  }

  async expectOrderConfirmation(): Promise<void> {
    await expect(this.page.locator(SELECTORS.checkout.orderConfirmation))
      .toHaveText(' Thankyou for the order. ');
  }
}

/**
 * Orders Page Object
 */
export class OrdersPage extends BasePage {
  async waitForOrdersTable(): Promise<void> {
    await this.page.locator(SELECTORS.orders.ordersTable).waitFor({ state: 'visible' });
  }

  async findOrderById(orderId: string): Promise<boolean> {
    await this.waitForOrdersTable();
    
    const rows = this.page.locator(SELECTORS.orders.orderRows);
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowOrderId = await row.locator(SELECTORS.orders.orderIdCell).textContent();
      
      if (orderId.includes(rowOrderId || '')) {
        await row.locator(SELECTORS.orders.viewButton).first().click();
        return true;
      }
    }
    
    return false;
  }

  async getOrderDetails(): Promise<string> {
    return await this.getTextContent(SELECTORS.orders.orderDetails);
  }
}
