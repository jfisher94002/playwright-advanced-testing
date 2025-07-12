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
exports.OrdersHistoryPage = void 0;
class OrdersHistoryPage {
    constructor(page) {
        this.page = page;
        this.ordersTable = page.locator("tbody");
        this.rows = page.locator("tbody tr");
        this.orderdIdDetails = page.locator(".col-text");
    }
    searchOrderAndSelect(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ordersTable.waitFor();
            for (let i = 0; i < (yield this.rows.count()); ++i) {
                const rowOrderId = yield this.rows.nth(i).locator("th").textContent();
                if (orderId.includes(rowOrderId)) {
                    yield this.rows.nth(i).locator("button").first().click();
                    break;
                }
            }
        });
    }
    getOrderId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderdIdDetails.textContent();
        });
    }
}
exports.OrdersHistoryPage = OrdersHistoryPage;
module.exports = { OrdersHistoryPage };
