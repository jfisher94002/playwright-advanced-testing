#!/usr/bin/env npx ts-node

/**
 * Integration tests for the HTML report generator
 * These tests verify the core functionality without external test frameworks
 */

import fs from 'fs';
import path from 'path';
import { 
  generateHtmlReport, 
  createReportConfig, 
  DEFAULT_REPORT_CONFIG 
} from '../src/html-report';
import type { CtrfReport } from '../types/ctrf';

// Test utilities
class TestRunner {
  private passed = 0;
  private failed = 0;
  private tests: Array<{ name: string; result: 'PASS' | 'FAIL'; error?: string }> = [];

  test(name: string, testFn: () => void): void {
    try {
      testFn();
      this.passed++;
      this.tests.push({ name, result: 'PASS' });
      console.log(`✅ ${name}`);
    } catch (error) {
      this.failed++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.tests.push({ name, result: 'FAIL', error: errorMessage });
      console.log(`❌ ${name}: ${errorMessage}`);
    }
  }

  assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertContains(content: string, substring: string, message?: string): void {
    if (!content.includes(substring)) {
      throw new Error(message || `Expected content to contain "${substring}"`);
    }
  }

  summary(): void {
    console.log(`\n📊 Test Summary: ${this.passed} passed, ${this.failed} failed`);
    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

// Mock CTRF report for testing
const mockReport: CtrfReport = {
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
      start: Date.now() - 60000,
      stop: Date.now()
    },
    tests: [
      {
        name: 'Login test should pass',
        status: 'passed',
        duration: 1250,
        suite: 'Authentication'
      },
      {
        name: 'Payment test should fail',
        status: 'failed',
        duration: 3200,
        suite: 'Payment',
        message: 'Timed out 5000ms waiting for element Expected string: "Welcome" Received string: "Loading"',
        trace: 'Error: Payment validation failed\\n    at validate()',
        ai: 'This test failed due to timeout while waiting for page elements'
      },
      {
        name: 'Test with <script>alert("xss")</script> in name',
        status: 'passed',
        duration: 1100,
        suite: 'Security <test>'
      }
    ],
    extra: {
      ai: 'Overall test execution shows good coverage with some timeout issues that need investigation.'
    }
  }
};

// Run tests
async function runTests(): Promise<void> {
  console.log('🧪 Starting HTML Report Generator Integration Tests\n');
  
  const runner = new TestRunner();
  const testOutputDir = 'test-output';
  
  // Ensure test output directory exists
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }

  runner.test('Generate basic HTML report', () => {
    const filename = generateHtmlReport(mockReport, `${testOutputDir}/basic-test.html`);
    
    runner.assert(fs.existsSync(filename), 'Report file should be created');
    
    const content = fs.readFileSync(filename, 'utf8');
    runner.assertContains(content, '<!DOCTYPE html>', 'Should contain valid HTML');
    runner.assertContains(content, 'AI Test Report', 'Should contain report title');
    runner.assertContains(content, 'Login test should pass', 'Should contain test names');
    runner.assertContains(content, 'Payment test should fail', 'Should contain failed test');
  });

  runner.test('Generate report with custom configuration', () => {
    const customConfig = createReportConfig({
      maxDisplayedPassedTests: 1,
      colors: {
        ...DEFAULT_REPORT_CONFIG.colors,
        primary: '#000000',
        success: '#00ff00',
        error: '#ff0000'
      }
    });

    const filename = generateHtmlReport(mockReport, `${testOutputDir}/custom-test.html`, customConfig);
    const content = fs.readFileSync(filename, 'utf8');
    
    runner.assertContains(content, '#000000', 'Should contain custom primary color');
    runner.assertContains(content, '#00ff00', 'Should contain custom success color');
    runner.assertContains(content, '#ff0000', 'Should contain custom error color');
  });

  runner.test('HTML escaping prevents XSS', () => {
    const filename = generateHtmlReport(mockReport, `${testOutputDir}/security-test.html`);
    const content = fs.readFileSync(filename, 'utf8');
    
    runner.assertContains(content, '&lt;script&gt;', 'Should escape HTML in test names');
    runner.assertContains(content, '&lt;test&gt;', 'Should escape HTML in suite names');
    runner.assert(!content.includes('<script>'), 'Should not contain unescaped script tags');
  });

  runner.test('Error formatting handles timeouts', () => {
    const filename = generateHtmlReport(mockReport, `${testOutputDir}/timeout-test.html`);
    const content = fs.readFileSync(filename, 'utf8');
    
    runner.assertContains(content, '⏱️ Timeout Error (5000ms)', 'Should format timeout errors');
    runner.assertContains(content, 'Expected: "Welcome"', 'Should extract expected values');
    runner.assertContains(content, 'Received: "Loading"', 'Should extract received values');
  });

  runner.test('Config merging works correctly', () => {
    const partialConfig = createReportConfig({
      maxDisplayedPassedTests: 10
    });
    
    runner.assert(partialConfig.maxDisplayedPassedTests === 10, 'Should override specific values');
    runner.assert(partialConfig.colors.success === DEFAULT_REPORT_CONFIG.colors.success, 'Should preserve default values');
    runner.assert(partialConfig.gradients.header === DEFAULT_REPORT_CONFIG.gradients.header, 'Should preserve default gradients');
  });

  runner.test('Safe filename generation', () => {
    const unsafeFilename = '../../../malicious<script>.html';
    const filename = generateHtmlReport(mockReport, unsafeFilename);
    
    const expectedSafe = '___malicious_script_.html';
    runner.assert(filename === expectedSafe, `Should sanitize unsafe filename. Expected: ${expectedSafe}, Got: ${filename}`);
  });

  runner.test('Responsive CSS generation', () => {
    const filename = generateHtmlReport(mockReport, `${testOutputDir}/responsive-test.html`);
    const content = fs.readFileSync(filename, 'utf8');
    
    runner.assertContains(content, '@media (max-width: 768px)', 'Should include mobile media queries');
    runner.assertContains(content, 'grid-template-columns: 1fr 1fr', 'Should include responsive grid');
  });

  runner.test('AI analysis formatting', () => {
    const filename = generateHtmlReport(mockReport, `${testOutputDir}/ai-test.html`);
    const content = fs.readFileSync(filename, 'utf8');
    
    runner.assertContains(content, '🤖 AI Analysis', 'Should include AI analysis section');
    runner.assertContains(content, '📋 Overall AI Summary', 'Should include overall AI summary');
    runner.assertContains(content, 'timeout while waiting', 'Should include AI analysis content');
  });

  runner.test('Error validation works', () => {
    let errorThrown = false;
    try {
      generateHtmlReport({} as CtrfReport);
    } catch (error) {
      errorThrown = true;
      runner.assert(error instanceof Error, 'Should throw Error instance');
      if (error instanceof Error) {
        runner.assertContains(error.message, 'Invalid report', 'Should provide descriptive error message');
      }
    }
    runner.assert(errorThrown, 'Should throw error for invalid report');
  });

  // Cleanup test files
  runner.test('Cleanup test files', () => {
    const files = fs.readdirSync(testOutputDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(testOutputDir, file));
    });
    fs.rmdirSync(testOutputDir);
    
    runner.assert(!fs.existsSync(testOutputDir), 'Should clean up test directory');
  });

  runner.summary();
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };
