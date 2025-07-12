"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POManager = void 0;
const LoginPage_1 = require("./LoginPage");
const DashboardPage_1 = require("./DashboardPage");
const OrdersHistoryPage_1 = require("./OrdersHistoryPage");
const OrdersReviewPage_1 = require("./OrdersReviewPage");
const CartPage_1 = require("./CartPage");
class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage_1.LoginPage(this.page);
        this.dashboardPage = new DashboardPage_1.DashboardPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage_1.OrdersHistoryPage(this.page);
        this.ordersReviewPage = new OrdersReviewPage_1.OrdersReviewPage(this.page);
        this.cartPage = new CartPage_1.CartPage(this.page);
    }
    getLoginPage() {
        return this.loginPage;
    }
    getCartPage() {
        return this.cartPage;
    }
    getDashboardPage() {
        return this.dashboardPage;
    }
    getOrdersHistoryPage() {
        return this.ordersHistoryPage;
    }
    getOrdersReviewPage() {
        return this.ordersReviewPage;
    }
}
exports.POManager = POManager;
module.exports = { POManager };
