import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { OrdersHistoryPage } from './OrdersHistoryPage';
import { OrdersReviewPage } from './OrdersReviewPage';
import { CartPage } from './CartPage';
import { Page } from '@playwright/test';
export declare class POManager {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    ordersHistoryPage: OrdersHistoryPage;
    ordersReviewPage: OrdersReviewPage;
    cartPage: CartPage;
    page: Page;
    constructor(page: Page);
    getLoginPage(): LoginPage;
    getCartPage(): CartPage;
    getDashboardPage(): DashboardPage;
    getOrdersHistoryPage(): OrdersHistoryPage;
    getOrdersReviewPage(): OrdersReviewPage;
}
