import fs from 'fs';
import path from 'path';
import { 
  generateHtmlReport, 
  createReportConfig, 
  DEFAULT_REPORT_CONFIG 
} from '../src/html-report';
import type { CtrfReport } from '../types/ctrf';
import type { ReportConfig } from '../src/html-report';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('HTML Report Generator', () => {
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
        start: 1609459200000, // 2021-01-01 00:00:00
        stop: 1609459260000   // 2021-01-01 00:01:00
      },
      tests: [
        {
          name: 'Login test should pass',
          status: 'passed',
          duration: 1250,
          suite: 'Authentication'
        },
        {
          name: 'Checkout test should pass',
          status: 'passed',
          duration: 2100,
          suite: 'E-commerce'
        },
        {
          name: 'Payment test should fail',
          status: 'failed',
          duration: 3200,
          suite: 'Payment',
          message: 'Payment validation failed',
          trace: 'Error: Invalid card\\n    at validate()',
          ai: 'This test failed due to invalid payment details'
        }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.writeFileSync.mockImplementation(() => {});
    mockFs.existsSync.mockReturnValue(true);
    mockFs.mkdirSync.mockImplementation(() => undefined);
  });

  describe('generateHtmlReport', () => {
    it('should generate HTML report with default configuration', () => {
      const filename = generateHtmlReport(mockReport);
      
      expect(filename).toMatch(/^ai-test-report-\\d{4}-\\d{2}-\\d{2}T\\d{2}-\\d{2}-\\d{2}\\.html$/);
      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(1);
      
      const [writtenFilename, content] = mockFs.writeFileSync.mock.calls[0];
      expect(writtenFilename).toBe(filename);
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('AI Test Report');
      expect(content).toContain('Login test should pass');
      expect(content).toContain('Payment test should fail');
    });

    it('should generate report with custom filename', () => {
      const customFilename = 'my-custom-report.html';
      const filename = generateHtmlReport(mockReport, customFilename);
      
      expect(filename).toBe(customFilename);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        customFilename,
        expect.any(String),
        'utf8'
      );
    });

    it('should sanitize unsafe custom filename', () => {
      const unsafeFilename = '../../../malicious<script>.html';
      const filename = generateHtmlReport(mockReport, unsafeFilename);
      
      expect(filename).toBe('___malicious_script_.html');
    });

    it('should generate report with custom configuration', () => {
      const customConfig = createReportConfig({
        maxDisplayedPassedTests: 1,
        colors: {
          primary: '#000000',
          success: '#00ff00',
          error: '#ff0000'
        }
      });

      const filename = generateHtmlReport(mockReport, undefined, customConfig);
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      
      expect(content).toContain('#000000');
      expect(content).toContain('#00ff00');
      expect(content).toContain('#ff0000');
    });

    it('should escape HTML in test names', () => {
      const reportWithHtml: CtrfReport = {
        ...mockReport,
        results: {
          ...mockReport.results,
          tests: [{
            name: 'Test with <script>alert("xss")</script> in name',
            status: 'passed',
            duration: 1000,
            suite: 'Security <test>'
          }]
        }
      };

      generateHtmlReport(reportWithHtml);
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      
      expect(content).toContain('&lt;script&gt;');
      expect(content).toContain('&lt;test&gt;');
      expect(content).not.toContain('<script>');
    });

    it('should handle missing AI analysis gracefully', () => {
      const reportWithoutAI: CtrfReport = {
        ...mockReport,
        results: {
          ...mockReport.results,
          tests: [{
            name: 'Test without AI',
            status: 'failed',
            duration: 1000,
            message: 'Test failed'
          }]
        }
      };

      expect(() => generateHtmlReport(reportWithoutAI)).not.toThrow();
    });

    it('should create directory if it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      generateHtmlReport(mockReport, 'subdir/report.html');
      
      expect(mockFs.mkdirSync).toHaveBeenCalledWith('subdir', { recursive: true });
    });

    it('should throw error for invalid report structure', () => {
      const invalidReport = {} as CtrfReport;
      
      expect(() => generateHtmlReport(invalidReport)).toThrow('Invalid report: missing results object');
    });

    it('should throw error when file write fails', () => {
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });
      
      expect(() => generateHtmlReport(mockReport)).toThrow('Failed to generate HTML report: Permission denied');
    });
  });

  describe('createReportConfig', () => {
    it('should merge partial config with defaults', () => {
      const customConfig = createReportConfig({
        maxDisplayedPassedTests: 10,
        colors: {
          primary: '#custom'
        }
      });

      expect(customConfig.maxDisplayedPassedTests).toBe(10);
      expect(customConfig.colors.primary).toBe('#custom');
      expect(customConfig.colors.success).toBe(DEFAULT_REPORT_CONFIG.colors.success);
      expect(customConfig.gradients).toEqual(DEFAULT_REPORT_CONFIG.gradients);
    });

    it('should return complete config when no customization provided', () => {
      const config = createReportConfig({});
      expect(config).toEqual(DEFAULT_REPORT_CONFIG);
    });
  });

  describe('Input Validation', () => {
    it('should validate required report fields', () => {
      const invalidReports = [
        { results: null },
        { results: { summary: null } },
        { results: { summary: {}, tests: 'not-array' } },
        { results: { summary: {}, tests: [], tool: {} } }
      ];

      invalidReports.forEach((report, index) => {
        expect(() => generateHtmlReport(report as any)).toThrow();
      });
    });
  });

  describe('Error Formatting', () => {
    it('should format timeout errors with clear messaging', () => {
      const timeoutReport: CtrfReport = {
        ...mockReport,
        results: {
          ...mockReport.results,
          tests: [{
            name: 'Timeout test',
            status: 'failed',
            duration: 5000,
            message: 'Timed out 5000ms waiting for element Expected string: "Welcome" Received string: "Loading"'
          }]
        }
      };

      generateHtmlReport(timeoutReport);
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      
      expect(content).toContain('⏱️ Timeout Error (5000ms)');
      expect(content).toContain('Expected: "Welcome"');
      expect(content).toContain('Received: "Loading"');
    });

    it('should clean ANSI color codes from error messages', () => {
      const ansiReport: CtrfReport = {
        ...mockReport,
        results: {
          ...mockReport.results,
          tests: [{
            name: 'ANSI test',
            status: 'failed',
            duration: 1000,
            message: '\\u001b[31mError message\\u001b[39m with \\u001b[2mcolors\\u001b[22m'
          }]
        }
      };

      generateHtmlReport(ansiReport);
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      
      expect(content).toContain('Error message with colors');
      expect(content).not.toContain('\\u001b[31m');
      expect(content).not.toContain('\\u001b[39m');
    });
  });

  describe('Performance and Content', () => {
    it('should limit displayed passed tests based on configuration', () => {
      const manyPassedTests: CtrfReport = {
        ...mockReport,
        results: {
          ...mockReport.results,
          tests: Array.from({ length: 10 }, (_, i) => ({
            name: `Passed test ${i + 1}`,
            status: 'passed' as const,
            duration: 1000
          }))
        }
      };

      const config = createReportConfig({ maxDisplayedPassedTests: 3 });
      generateHtmlReport(manyPassedTests, undefined, config);
      
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      expect(content).toContain('... and 7 more passed tests');
    });

    it('should generate responsive CSS with mobile support', () => {
      generateHtmlReport(mockReport);
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      
      expect(content).toContain('@media (max-width: 768px)');
      expect(content).toContain('grid-template-columns: 1fr 1fr');
    });
  });
});
