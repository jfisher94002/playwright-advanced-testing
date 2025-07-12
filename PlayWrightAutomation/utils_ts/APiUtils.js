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
exports.APiUtils = void 0;
class APiUtils {
    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const loginResponse = yield this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
                data: this.loginPayLoad
            }); //200,201,
            const loginResponseJson = yield loginResponse.json();
            const token = loginResponseJson.token;
            console.log(token);
            return token;
        });
    }
    createOrder(orderPayLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = { token: String, orderId: String };
            response.token = yield this.getToken();
            const orderResponse = yield this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
                data: orderPayLoad,
                headers: {
                    'Authorization': response.token,
                    'Content-Type': 'application/json'
                },
            });
            const orderResponseJson = yield orderResponse.json();
            console.log(orderResponseJson);
            const orderId = orderResponseJson.orders[0];
            response.orderId = orderId;
            return response;
        });
    }
}
exports.APiUtils = APiUtils;
module.exports = { APiUtils };
