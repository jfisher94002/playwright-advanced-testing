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
const { exec } = require("child_process");
const { defineParameterType, When, Given, Then } = require("@cucumber/cucumber");
const path = require("path");
let poManager;
const playwright = require('@playwright/test');
const test_1 = require("@playwright/test");
const { POManager } = require('../../pageobjects/POManager');
const assert = require("assert");
const binDir = path.resolve(__dirname, "../../bin");
console.log(binDir);
defineParameterType({
    name: "command",
    regexp: /`(.+)`/,
    transformer: (cmd) => cmd,
});
When("I run {string}", function (string) {
    console.log(string);
    this.stdout = string;
});
Then('Verify order is present in the OrderHistory', function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Write code here that turns the phrase above into concrete actions
        yield this.dashboardPage.navigateToOrders();
        const ordersHistoryPage = poManager.getOrdersHistoryPage();
        yield ordersHistoryPage.searchOrderAndSelect(this.orderId);
        (0, test_1.expect)(this.orderId.includes(yield ordersHistoryPage.getOrderId())).toBeTruthy();
    });
});
When('Enter valid details and Place the Order', function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Write code here that turns the phrase above into concrete actions
        yield this.cartPage.Checkout();
        const ordersReviewPage = poManager.getOrdersReviewPage();
        yield ordersReviewPage.searchCountryAndSelect("ind", "India");
        this.orderId = yield ordersReviewPage.SubmitAndGetOrderId();
        console.log(this.orderId);
    });
});
Then('Verify {string} is displayed in the Cart', function (productName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Write code here that turns the phrase above into concrete actions
        this.cartPage = poManager.getCartPage();
        yield this.cartPage.VerifyProductIsDisplayed(productName);
    });
});
When('Add {string} to Cart', function (productName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Write code here that turns the phrase above into concrete actions
        this.dashboardPage = poManager.getDashboardPage();
        yield this.dashboardPage.searchProductAddCart(productName);
        yield this.dashboardPage.navigateToCart();
    });
});
Given('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 1000 }, function (username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        poManager = new POManager(this.page);
        //js file- Login js, DashboardPage
        const products = this.page.locator(".card-body");
        const loginPage = poManager.getLoginPage();
        yield loginPage.goTo();
        yield loginPage.validLogin(username, password);
    });
});
Then("the stdout should contain {string}", function (string) {
    assert.equal(this.stdout, string);
});
Given(/^a table step$/, function (table) {
    const expected = [
        ['Apricot', '5'],
        ['Brocolli', '2'],
        ['Cucumber', '10']
    ];
    assert.deepEqual(table.rows(), expected);
});
Given('a login to Ecommerce2 application with {string} and {string}', { timeout: 100 * 1000 }, function (username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
        const userName = this.page.locator('#username');
        const signIn = this.page.locator("#signInBtn");
        const cardTitles = this.page.locator(".card-body a");
        yield this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        console.log(yield this.page.title());
        //css 
        yield userName.fill("rahulshetty");
        yield this.page.locator("[type='password']").fill("learning");
        yield signIn.click();
    });
});
Then('Verify Error message is displayed', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, test_1.expect)(this.page.locator("[style*='block']")).toContainText('Incorrect');
    });
});
