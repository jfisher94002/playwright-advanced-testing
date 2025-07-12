import { Locator, Page } from '@playwright/test';
export declare class CartPage {
    cartProducts: Locator;
    productsText: Locator;
    cart: Locator;
    orders: Locator;
    checkout: Locator;
    page: Page;
    constructor(page: Page);
    VerifyProductIsDisplayed(productName: string): Promise<void>;
    Checkout(): Promise<void>;
    getProductLocator(productName: string): Locator;
}
