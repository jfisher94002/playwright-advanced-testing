"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customTest = void 0;
const test_1 = require("@playwright/test");
;
exports.customTest = test_1.test.extend({
    testDataForOrder: {
        username: "anshika@gmail.com",
        password: "Iamking@000",
        productName: "ADIDAS ORIGINAL"
    }
});
