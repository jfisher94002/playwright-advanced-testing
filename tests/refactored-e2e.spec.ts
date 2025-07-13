import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage, CartPage, CheckoutPage, OrdersPage } from '../src/pages/BasePage';
import { getTestEnvironment, TEST_TAGS } from '../src/config/test-environment';

// Test data factory
const createTestUser = () => {
  const env = getTestEnvironment();
  return {
    validUser: env.credentials.validUser,
    testUser: env.credentials.testUser,
  };
};

const createTestProduct = () => {
  const env = getTestEnvironment();
  return {
    zaraCoat: env.products.zaraCoat,
    iphone: env.products.iphone,
    adidas: env.products.adidas,
  };
};

test.describe('E2E Order Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let ordersPage: OrdersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    ordersPage = new OrdersPage(page);
  });

  test(`${TEST_TAGS.E2E} ${TEST_TAGS.CRITICAL} Complete order flow - Zara Coat`, async ({ page }) => {
    const users = createTestUser();
    const products = createTestProduct();

    // Step 1: Login
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
      await expect(page).toHaveTitle("Let's Shop");
    });

    await test.step('Login with valid credentials', async () => {
      await loginPage.loginWithValidCredentials();
      const isLoggedIn = await loginPage.isLoginSuccessful();
      expect(isLoggedIn).toBeTruthy();
    });

    // Step 2: Add product to cart
    await test.step('Add Zara Coat to cart', async () => {
      await dashboardPage.waitForProducts();
      await dashboardPage.addProductToCart(products.zaraCoat);
      await dashboardPage.navigateToCart();
    });

    // Step 3: Verify cart and checkout
    await test.step('Verify product in cart and proceed to checkout', async () => {
      const isProductInCart = await cartPage.verifyProductInCart(products.zaraCoat);
      expect(isProductInCart).toBeTruthy();
      await cartPage.proceedToCheckout();
    });

    // Step 4: Complete checkout
    let orderId: string;
    await test.step('Fill shipping details and submit order', async () => {
      await checkoutPage.fillShippingDetails('India');
      orderId = await checkoutPage.submitOrder();
      await checkoutPage.expectOrderConfirmation();
      expect(orderId).toBeTruthy();
    });

    // Step 5: Verify order in order history
    await test.step('Verify order in order history', async () => {
      await dashboardPage.navigateToOrders();
      const orderFound = await ordersPage.findOrderById(orderId);
      expect(orderFound).toBeTruthy();
      
      const orderDetails = await ordersPage.getOrderDetails();
      expect(orderId).toContain(orderDetails);
    });
  });

  test(`${TEST_TAGS.SMOKE} Login validation - Invalid credentials`, async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });

    await test.step('Attempt login with invalid credentials', async () => {
      await loginPage.login('invalid@email.com', 'wrongpassword');
      const errorMessage = await loginPage.expectLoginError();
      expect(errorMessage).toContain('Incorrect');
    });
  });

  test(`${TEST_TAGS.REGRESSION} Product search and selection`, async ({ page }) => {
    const users = createTestUser();
    const products = createTestProduct();

    await test.step('Login', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginWithValidCredentials();
    });

    await test.step('Verify products are displayed', async () => {
      await dashboardPage.waitForProducts();
      const productTitles = await dashboardPage.getProductTitles();
      
      expect(productTitles.length).toBeGreaterThan(0);
      expect(productTitles).toContain(products.zaraCoat);
      expect(productTitles).toContain(products.iphone);
      expect(productTitles).toContain(products.adidas);
    });

    await test.step('Add multiple products to cart', async () => {
      await dashboardPage.addProductToCart(products.zaraCoat);
      await dashboardPage.addProductToCart(products.iphone);
      await dashboardPage.navigateToCart();
      
      // Verify both products are in cart
      const zaraInCart = await cartPage.verifyProductInCart(products.zaraCoat);
      const iphoneInCart = await cartPage.verifyProductInCart(products.iphone);
      
      expect(zaraInCart).toBeTruthy();
      expect(iphoneInCart).toBeTruthy();
    });
  });
});

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test(`${TEST_TAGS.SMOKE} Valid login redirects to dashboard`, async ({ page }) => {
    const users = createTestUser();
    
    await loginPage.login(users.validUser.email, users.validUser.password);
    
    const isSuccessful = await loginPage.isLoginSuccessful();
    expect(isSuccessful).toBeTruthy();
    
    // Verify we're on the dashboard
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('client');
  });

  test(`${TEST_TAGS.REGRESSION} Invalid email shows error`, async ({ page }) => {
    await loginPage.login('invalid-email', 'password123');
    
    const errorMessage = await loginPage.expectLoginError();
    expect(errorMessage.toLowerCase()).toContain('incorrect');
  });

  test(`${TEST_TAGS.REGRESSION} Empty fields validation`, async ({ page }) => {
    await loginPage.login('', '');
    
    // Should stay on login page
    const title = await loginPage.getTitle();
    expect(title).toBe("Let's Shop");
  });
});

test.describe('Dashboard Navigation', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.loginWithValidCredentials();
  });

  test(`${TEST_TAGS.SMOKE} Products are displayed correctly`, async ({ page }) => {
    await dashboardPage.waitForProducts();
    
    const productTitles = await dashboardPage.getProductTitles();
    expect(productTitles.length).toBeGreaterThan(0);
    
    // Each product should have a non-empty title
    productTitles.forEach(title => {
      expect(title.trim()).not.toBe('');
    });
  });

  test(`${TEST_TAGS.REGRESSION} Navigation to cart works`, async ({ page }) => {
    await dashboardPage.navigateToCart();
    
    const currentUrl = await dashboardPage.getCurrentUrl();
    expect(currentUrl).toContain('cart');
  });

  test(`${TEST_TAGS.REGRESSION} Navigation to orders works`, async ({ page }) => {
    await dashboardPage.navigateToOrders();
    
    const currentUrl = await dashboardPage.getCurrentUrl();
    expect(currentUrl).toContain('myorders');
  });
});
