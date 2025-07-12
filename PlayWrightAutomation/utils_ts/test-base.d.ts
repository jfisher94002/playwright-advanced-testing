interface TestDataForOrder {
    username: string;
    password: string;
    productName: string;
}
export declare const customTest: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & {
    testDataForOrder: TestDataForOrder;
}, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
export {};
