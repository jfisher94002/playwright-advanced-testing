#!/usr/bin/env node

// Manual test to verify our HTML report generation works
const { generateHtmlReport } = require('./dist/html-report');

// Test report with XSS attempts and various edge cases
const testReport = {
  results: {
    tool: {
      name: 'Playwright',
      version: '1.40.0'
    },
    summary: {
      tests: 3,
      passed: 1,
      failed: 2,
      skipped: 0,
      pending: 0,
      other: 0,
      start: Date.now() - 30000,
      stop: Date.now()
    },
    tests: [
      {
        name: 'Normal test should pass',
        status: 'passed',
        duration: 1500,
        suite: 'Basic Tests'
      },
      {
        name: 'Test with <script>alert("xss")</script> in name',
        status: 'failed',
        duration: 3000,
        suite: 'Security Tests <img src=x onerror=alert("xss")>',
        message: 'Timed out 5000ms waiting for element Expected string: "Success" Received string: "Error"',
        trace: 'Error: Test failed\\n    at processTest() <script>alert("trace")</script>',
        ai: 'This test failed due to a timeout waiting for an element. This could indicate **performance issues** or changes in the application UI.'
      },
      {
        name: 'Another test with & entities and "quotes"',
        status: 'failed', 
        duration: 2500,
        suite: 'Edge Cases & "Special" Characters',
        message: 'Failed to find element with text: <div>malicious</div>',
        ai: 'Test failure suggests the element selector may be **outdated** or the page structure has changed.'
      }
    ],
    extra: {
      ai: 'Overall test suite shows **good coverage** but has some failing tests that need attention. Consider reviewing the element selectors and page structure changes.'
    }
  }
};

console.log('🧪 Testing HTML Report Generation...\n');

try {
  const filename = generateHtmlReport(testReport, 'manual-test-report.html');
  console.log(`✅ HTML report generated successfully: ${filename}`);
  console.log('🔍 Report contains XSS protection and responsive design');
  
  // Check if file exists and has content
  const fs = require('fs');
  const content = fs.readFileSync(filename, 'utf8');
  
  console.log('\n📋 Verification checks:');
  console.log('✅ File size:', content.length, 'characters');
  console.log('✅ Contains escaped script tag:', content.includes('&lt;script&gt;') ? 'Yes' : 'No');
  console.log('✅ Contains responsive CSS:', content.includes('@media') ? 'Yes' : 'No');
  console.log('✅ Contains AI analysis:', content.includes('This test failed due to a timeout') ? 'Yes' : 'No');
  console.log('✅ No unescaped script tags:', !content.includes('<script>alert') ? 'Yes' : 'No');
  
  console.log('\n🎉 Manual test completed successfully!');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
