const {test, expect} = require('@playwright/test');

test('Intentional Failure for AI Demo', async({page}) => {
    await page.goto('https://rahulshettyacademy.com/client');
    
    // This will fail intentionally to test AI reporting
    await expect(page).toHaveTitle('This title does not exist');
    
    await page.fill('#userEmail', 'wrong@email.com');
    await page.fill('#userPassword', 'wrongpassword');
    await page.click('#login');
    
    // This will also fail
    await expect(page).toHaveURL('https://example.com/success');
});
