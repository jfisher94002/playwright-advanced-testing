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
exports.CartPage = void 0;
const test_1 = require("@playwright/test");
class CartPage {
    constructor(page) {
        this.page = page;
        this.cartProducts = page.locator("div li").first();
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
        this.checkout = page.locator("text=Checkout");
    }
    VerifyProductIsDisplayed(productName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cartProducts.waitFor();
            const bool = yield this.getProductLocator(productName).isVisible();
            (0, test_1.expect)(bool).toBeTruthy();
        });
    }
    Checkout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkout.click();
        });
    }
    getProductLocator(productName) {
        return this.page.locator("h3:has-text('" + productName + "')");
    }
}
exports.CartPage = CartPage;
module.exports = { CartPage };
