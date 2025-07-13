#!/usr/bin/env npx ts-node

/**
 * Simple verification test for the HTML report generator
 * Tests basic functionality with the current implementation
 */

import fs from 'fs';
import { generateHtmlReport } from '../src/html-report';
import type { CtrfReport } from '../types/ctrf';

console.log('🧪 Testing HTML Report Generator...\n');

// Create a test report
const testReport: CtrfReport = {
  results: {
    tool: {
      name: 'Playwright',
      version: '1.40.0'
    },
    summary: {
      tests: 3,
      passed: 2,
      failed: 1,
      skipped: 0,
      pending: 0,
      other: 0,
      start: Date.now() - 30000,
      stop: Date.now()
    },
    tests: [
      {
        name: 'Login should work',
        status: 'passed',
        duration: 1500,
        suite: 'Authentication'
      },
      {
        name: 'Checkout should work',
        status: 'passed',
        duration: 2200,
        suite: 'E-commerce'
      },
      {
        name: 'Payment with <script>alert("xss")</script> should fail',
        status: 'failed',
        duration: 3000,
        suite: 'Security Tests',
        message: 'Timed out 5000ms waiting for element Expected string: "Success" Received string: "Error"',
        trace: 'Error: Payment failed\\n    at processPayment()',
        ai: 'This test failed due to a timeout waiting for a payment confirmation element. The payment processing may be slower than expected.'
      }
    ],
    extra: {
      ai: 'Overall test suite shows good coverage. The payment timeout suggests potential performance issues that should be investigated.'
    }
  }
};

try {
  // Test 1: Basic report generation
  console.log('📄 Testing basic report generation...');
  const filename = generateHtmlReport(testReport, 'test-report.html');
  
  if (fs.existsSync(filename)) {
    console.log('✅ Report file created successfully');
    
    // Test 2: Verify content
    const content = fs.readFileSync(filename, 'utf8');
    
    const checks = [
      { test: 'HTML structure', condition: content.includes('<!DOCTYPE html>') },
      { test: 'Report title', condition: content.includes('AI Test Report') },
      { test: 'Test names', condition: content.includes('Login should work') },
      { test: 'Failed test', condition: content.includes('Payment with') },
      { test: 'XSS prevention', condition: content.includes('&lt;script&gt;') && !content.includes('<script>alert') },
      { test: 'AI analysis', condition: content.includes('timeout waiting') },
      { test: 'Error formatting', condition: content.includes('⏱️ Timeout Error (5000ms)') },
      { test: 'Responsive CSS', condition: content.includes('@media') },
      { test: 'Professional styling', condition: content.includes('linear-gradient') }
    ];
    
    console.log('\\n🔍 Content verification:');
    let passed = 0;
    let failed = 0;
    
    checks.forEach(check => {
      if (check.condition) {
        console.log(`✅ ${check.test}`);
        passed++;
      } else {
        console.log(`❌ ${check.test}`);
        failed++;
      }
    });
    
    // Test 3: Error handling
    console.log('\\n🛡️ Testing error handling...');
    try {
      generateHtmlReport({} as CtrfReport);
      console.log('❌ Should have thrown error for invalid report');
      failed++;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Failed to generate HTML report')) {
        console.log('✅ Error handling works correctly');
        passed++;
      } else {
        console.log('❌ Unexpected error type');
        failed++;
      }
    }
    
    // Cleanup
    fs.unlinkSync(filename);
    console.log('\\n🧹 Cleaned up test files');
    
    // Summary
    console.log(`\\n📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
      console.log('\\n🎉 All tests passed! The HTML report generator is working correctly.');
    } else {
      console.log('\\n⚠️ Some tests failed. Please review the implementation.');
      process.exit(1);
    }
    
  } else {
    console.log('❌ Report file was not created');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test failed with error:', error);
  process.exit(1);
}
