const {test, expect} = require('@playwright/test');
test('Browser Context Playwright Tests', async({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/');
    await expect(page).toHaveTitle('Selenium, API Testing, Software Testing & More QA Tutorials | Rahul Shetty Academy');
    await context.close();
});

test('Page Playwright Tests', async({page}) => {
    const userName = page.locator('#userEmail');
    const userPassword = page.locator('#userPassword');
    await page.goto('https://rahulshettyacademy.com/client');
    // Debug: Current page title
    await expect(page).toHaveTitle("Let's Shop");
    
    // Fill login form with valid test credentials
    await userName.fill('rahulshetty@gmail.com');
    
    await userPassword.fill('Iamking@000');
    await page.click('#login');
    
    // Negative test. Wait for error message to appear, then capture ALL details
    try {
        const errorMessage = await page.locator('.toast-error, .alert-danger, .error, [class*="toast"], [class*="error"], [role="alert"]').first();
        await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        
        console.log('Error message found:', await errorMessage.textContent());
        
        // Get detailed information about the error element
        const tagName = await errorMessage.evaluate(el => el.tagName);
        const className = await errorMessage.evaluate(el => el.className);
        const id = await errorMessage.evaluate(el => el.id);
        const outerHTML = await errorMessage.evaluate(el => el.outerHTML);
        
        console.log('Tag Name:', tagName);
        console.log('Class Name:', className);
        console.log('ID:', id);
        console.log('Full HTML:', outerHTML);
        
        // Take a screenshot while the error is visible
        await page.screenshot({ path: 'error-message-visible.png' });
        
        // Wait for it to disappear to ensure we don't interfere with next steps
        await errorMessage.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (error) {
        console.log('No error message found or timeout waiting for error message - login likely successful');
        // Take screenshot to see what's on the page
        await page.screenshot({ path: 'no-error-message.png' });
    }
    
    // Wait a moment for navigation after successful login
    await page.waitForTimeout(2000);
    
    console.log('Current URL after login:', page.url());
    
    // Try to wait for dashboard, but with a shorter timeout to fail faster
    try {
        await page.waitForURL('**/client/#/dashboard/**', { timeout: 10000 });
        await expect(page).toHaveURL(/.*\/client\/#\/dashboard\/.*/);
        console.log('Login successful!');
    } catch (error) {
        console.log('Login failed - still on login page');
        // Take a screenshot for debugging
        await page.screenshot({ path: 'login-failure.png' });
        throw error;
    }
    // now we are on the shopping page, we can add more tests here
    // let's check if we can see the products
    await page.waitForLoadState('networkidle'); // Wait for page to fully load
    
    const products = await page.locator('.card-body b');
    await products.first().waitFor({ state: 'visible' }); // Wait for at least one product to be visible

    const productCount = await products.count();
    console.log(`Number of products displayed: ${productCount}`);

    for (let i = 0; i < productCount; i++) {
        try {
            // Wait for the specific product card to be visible first
            await products.nth(i).waitFor({ state: 'visible' });
            
            // Try different possible selectors for product names
            const productCard = products.nth(i);
            let productName = await productCard.textContent(); // Added 'await' here
            //productName = productName.split('\n')[0].trim(); // Get first line
            
            console.log(`Product ${i + 1}: ${productName}`);
        } catch (error) {
            console.log(`Product ${i + 1}: Could not get product name - ${error.message}`);
            // Take screenshot of the problematic product card
            await products.nth(i).screenshot({ path: `product-${i}-error.png` });
        }
    }
    await page.screenshot({ path: 'products-visible.png' });
});
