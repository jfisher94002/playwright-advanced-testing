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
exports.OrdersReviewPage = void 0;
const test_1 = require("@playwright/test");
class OrdersReviewPage {
    constructor(page) {
        this.page = page;
        this.country = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.emailId = page.locator(".user__name [type='text']").first();
        this.submit = page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }
    searchCountryAndSelect(countryCode, countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.country.pressSequentially("ind");
            // await this.country.fill(countryCode,{delay:100});
            yield this.dropdown.waitFor();
            const optionsCount = yield this.dropdown.locator("button").count();
            for (let i = 0; i < optionsCount; ++i) {
                let text;
                text = yield this.dropdown.locator("button").nth(i).textContent();
                if (text.trim() === countryName) {
                    yield this.dropdown.locator("button").nth(i).click();
                    break;
                }
            }
        });
    }
    VerifyEmailId(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.emailId).toHaveText(username);
        });
    }
    SubmitAndGetOrderId() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.submit.click();
            yield (0, test_1.expect)(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
            return yield this.orderId.textContent();
        });
    }
}
exports.OrdersReviewPage = OrdersReviewPage;
module.exports = { OrdersReviewPage };
