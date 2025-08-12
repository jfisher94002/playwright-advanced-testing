const {test, expect} = require('@playwright/test');

test.describe('AI Demo Tests - Intentional Failures', () => {
    test('Intentional Failure for AI Demo', async({page}) => {
        // Mark this test as expected to fail for AI reporting demo
        test.fail(); // This tells Playwright this test is expected to fail
        
        test.info().annotations.push({
            type: 'intentional-failure',
            description: 'This test is designed to fail to demonstrate AI failure analysis'
        });
        
        await page.goto('https://rahulshettyacademy.com/client');
        
        // This will fail intentionally to test AI reporting system
        console.log('🤖 AI DEMO: Testing intentional title mismatch for AI analysis');
        await expect(page).toHaveTitle('This title does not exist');
        
        // Additional failures for comprehensive AI analysis testing
        console.log('🤖 AI DEMO: Testing invalid login credentials for AI analysis');
        await page.fill('#userEmail', 'wrong@email.com');
        await page.fill('#userPassword', 'wrongpassword');
        await page.click('#login');
        
        // This will also fail to test URL assertion failures
        console.log('🤖 AI DEMO: Testing incorrect URL expectation for AI analysis');
        await expect(page).toHaveURL('https://example.com/success');
    });
});
