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
exports.DashboardPage = void 0;
class DashboardPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
    }
    searchProductAddCart(productName) {
        return __awaiter(this, void 0, void 0, function* () {
            const titles = yield this.productsText.allTextContents();
            console.log(titles);
            const count = yield this.products.count();
            for (let i = 0; i < count; ++i) {
                if ((yield this.products.nth(i).locator("b").textContent()) === productName) {
                    //add to cart
                    yield this.products.nth(i).locator("text= Add To Cart").click();
                    break;
                }
            }
        });
    }
    navigateToOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.orders.click();
        });
    }
    navigateToCart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cart.click();
        });
    }
}
exports.DashboardPage = DashboardPage;
module.exports = { DashboardPage };
