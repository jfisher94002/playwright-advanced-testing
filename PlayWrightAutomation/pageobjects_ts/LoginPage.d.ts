import { Locator, Page } from '@playwright/test';
export declare class LoginPage {
    signInbutton: Locator;
    userName: Locator;
    password: Locator;
    page: Page;
    constructor(page: Page);
    goTo(): Promise<void>;
    validLogin(username: string, password: string): Promise<void>;
}
