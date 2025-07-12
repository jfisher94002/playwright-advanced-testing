import { Locator, Page } from '@playwright/test';
export declare class DashboardPage {
    products: Locator;
    productsText: Locator;
    cart: Locator;
    orders: Locator;
    page: Page;
    constructor(page: Page);
    searchProductAddCart(productName: string): Promise<void>;
    navigateToOrders(): Promise<void>;
    navigateToCart(): Promise<void>;
}
