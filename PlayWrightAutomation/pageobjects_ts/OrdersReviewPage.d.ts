import { Locator, Page } from '@playwright/test';
export declare class OrdersReviewPage {
    country: Locator;
    dropdown: Locator;
    emailId: Locator;
    page: Page;
    submit: Locator;
    orderConfirmationText: Locator;
    orderId: Locator;
    constructor(page: Page);
    searchCountryAndSelect(countryCode: string, countryName: string): Promise<void>;
    VerifyEmailId(username: string): Promise<void>;
    SubmitAndGetOrderId(): Promise<string | null>;
}
