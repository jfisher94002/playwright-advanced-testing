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
exports.LoginPage = void 0;
class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInbutton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }
    goTo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto("https://rahulshettyacademy.com/client");
        });
    }
    validLogin(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userName.fill(username);
            yield this.password.fill(password);
            yield this.signInbutton.click();
            yield this.page.waitForLoadState('networkidle');
        });
    }
}
exports.LoginPage = LoginPage;
module.exports = { LoginPage };
