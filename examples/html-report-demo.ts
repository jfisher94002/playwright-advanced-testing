#!/usr/bin/env npx ts-node

import { generateHtmlReport, createReportConfig, DEFAULT_REPORT_CONFIG } from '../src/html-report';
import type { CtrfReport } from '../types/ctrf';

/**
 * Demo script showcasing the refactored HTML report generator
 */

// Sample CTRF report data
const sampleReport: CtrfReport = {
  results: {
    tool: {
      name: 'Playwright',
      version: '1.40.0'
    },
    summary: {
      tests: 5,
      passed: 3,
      failed: 2,
      skipped: 0,
      pending: 0,
      other: 0,
      start: Date.now() - 60000,
      stop: Date.now()
    },
    tests: [
      {
        name: 'Login with valid credentials should succeed',
        status: 'passed',
        duration: 1250,
        suite: 'Authentication Tests'
      },
      {
        name: 'Shopping cart functionality should work correctly',
        status: 'passed',
        duration: 2100,
        suite: 'E-commerce Tests'
      },
      {
        name: 'User profile update should save changes',
        status: 'passed',
        duration: 890,
        suite: 'User Management Tests'
      },
      {
        name: 'Payment process should handle invalid card',
        status: 'failed',
        duration: 3200,
        suite: 'Payment Tests',
        message: 'Payment validation failed: Invalid card number',
        trace: 'Error: Invalid card number\n    at PaymentValidator.validate (payment.js:45:12)\n    at processPayment (checkout.js:23:8)',
        ai: 'This test failed because the payment validation logic correctly rejected an invalid card number. This is expected behavior and indicates the validation is working properly. Consider updating the test to use a valid test card number or create a separate test for invalid card scenarios.'
      },
      {
        name: 'Search functionality should return relevant results',
        status: 'failed',
        duration: 2500,
        suite: 'Search Tests',
        message: 'Timed out 5000ms waiting for title',
        trace: 'TimeoutError: Waiting for title to match "Search Results"\n    at Page.waitForTitle (page.js:123:15)',
        ai: 'The search functionality test timed out while waiting for the page title to update. This could indicate a performance issue with the search feature or a timing problem in the test. Consider increasing the timeout or investigating the search response time.',
        retries: 2,
        flaky: true
      }
    ],
    extra: {
      ai: 'Overall test execution shows good coverage of core functionality. The payment validation test failure is actually positive as it demonstrates proper security measures. The search timeout issue should be investigated for potential performance optimization. Test suite reliability is at 60% which is acceptable but could be improved by addressing the flaky search test.'
    }
  }
};

async function demonstrateReporting() {
  console.log('🚀 HTML Report Generator Demo\n');

  // 1. Generate report with default configuration
  console.log('📄 Generating report with default configuration...');
  const defaultReport = generateHtmlReport(sampleReport, 'demo-default-report.html');
  console.log(`✅ Default report generated: ${defaultReport}\n`);

  // 2. Generate report with custom configuration
  console.log('🎨 Generating report with custom dark theme...');
  const customConfig = createReportConfig({
    maxDisplayedPassedTests: 2,
    colors: {
      primary: '#1a1a1a',
      secondary: '#333333',
      success: '#00d084',
      error: '#ff6b6b',
      warning: '#ffb347',
      muted: '#888888'
    },
    gradients: {
      header: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
      aiSummary: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
      overallSummary: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
    }
  });

  const customReport = generateHtmlReport(sampleReport, 'demo-custom-report.html', customConfig);
  console.log(`✅ Custom themed report generated: ${customReport}\n`);

  // 3. Show configuration options
  console.log('⚙️ Default Configuration Options:');
  console.log(JSON.stringify(DEFAULT_REPORT_CONFIG, null, 2));

  console.log('\n🎉 Demo completed! Check the generated HTML files.');
}

// Run the demo
demonstrateReporting().catch(console.error);
