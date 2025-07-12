"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const test_base_1 = require("../utils_ts/test-base");
const POManager_1 = require("../pageobjects_ts/POManager");
//Json->string->js object
const dataset = JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));
for (const data of dataset) {
    (0, test_1.test)(`@Webs Client App login for ${data.productName}`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const poManager = new POManager_1.POManager(page);
        //js file- Login js, DashboardPage
        const products = page.locator(".card-body");
        const loginPage = poManager.getLoginPage();
        yield loginPage.goTo();
        yield loginPage.validLogin(data.username, data.password);
        const dashboardPage = poManager.getDashboardPage();
        yield dashboardPage.searchProductAddCart(data.productName);
        yield dashboardPage.navigateToCart();
        const cartPage = poManager.getCartPage();
        yield cartPage.VerifyProductIsDisplayed(data.productName);
        yield cartPage.Checkout();
        const ordersReviewPage = poManager.getOrdersReviewPage();
        yield ordersReviewPage.searchCountryAndSelect("ind", "India");
        let orderId;
        orderId = yield ordersReviewPage.SubmitAndGetOrderId();
        console.log(orderId);
        yield dashboardPage.navigateToOrders();
        const ordersHistoryPage = poManager.getOrdersHistoryPage();
        yield ordersHistoryPage.searchOrderAndSelect(orderId);
        (0, test_1.expect)(orderId.includes(yield ordersHistoryPage.getOrderId())).toBeTruthy();
    }));
}
(0, test_base_1.customTest)(`Client App login`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, testDataForOrder }) {
    const poManager = new POManager_1.POManager(page);
    //js file- Login js, DashboardPage
    const products = page.locator(".card-body");
    const loginPage = poManager.getLoginPage();
    yield loginPage.goTo();
    yield loginPage.validLogin(testDataForOrder.username, testDataForOrder.password);
    const dashboardPage = poManager.getDashboardPage();
    yield dashboardPage.searchProductAddCart(testDataForOrder.productName);
    yield dashboardPage.navigateToCart();
    const cartPage = poManager.getCartPage();
    yield cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
    yield cartPage.Checkout();
}));
//test files will trigger parallel
//individual tests in the file will run in sequence
