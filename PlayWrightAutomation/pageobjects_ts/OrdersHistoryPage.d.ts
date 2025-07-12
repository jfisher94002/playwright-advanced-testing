import { Locator, Page } from '@playwright/test';
export declare class OrdersHistoryPage {
    orderdIdDetails: Locator;
    rows: Locator;
    ordersTable: Locator;
    page: Page;
    constructor(page: Page);
    searchOrderAndSelect(orderId: any): Promise<void>;
    getOrderId(): Promise<string | null>;
}
