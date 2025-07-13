/* eslint-disable */
import type { CtrfReport } from '../types/ctrf'
import fs from 'fs'
import { marked } from 'marked'

// Configure marked for cleaner HTML output
marked.setOptions({
  breaks: true,
  gfm: true
})

/**
 * Escapes HTML characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns Escaped HTML-safe text
 */
function escapeHtml(text: string): string {
  if (!text) {
    return text
  }
  
  // Manual escaping for better performance and security
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

function formatAiAnalysis(text: string): string {
  // Convert markdown to HTML while preserving structure
  return marked(text) as string
}

function cleanErrorMessage(text: string): string {
  if (!text) {
    return text
  }
  
  // Remove ANSI color codes and escape sequences
  return text
    .replace(/\[(\d+)m/g, '') // Remove ANSI color codes like [31m, [39m
    .replace(/\[(\d+);(\d+)m/g, '') // Remove complex ANSI codes
    .replace(/\[\d+m/g, '') // Remove any remaining ANSI codes
    .replace(/\[2m/g, '') // Remove dim text codes
    .replace(/\[22m/g, '') // Remove normal intensity codes
    .replace(/\[7m/g, '') // Remove reverse video codes
    .replace(/\[27m/g, '') // Remove normal video codes
    .trim()
}

function formatErrorForDisplay(message: string, trace?: string): { message: string; trace?: string } {
  const cleanMessage = cleanErrorMessage(message)
  const cleanTrace = trace ? cleanErrorMessage(trace) : undefined
  
  // Extract key information for better display
  let formattedMessage = cleanMessage
  
  // Format timeout errors more clearly
  if (cleanMessage.includes('Timed out') && cleanMessage.includes('waiting for')) {
    const timeoutMatch = cleanMessage.match(/Timed out (\d+)ms waiting for/)
    const expectedMatch = cleanMessage.match(/Expected string: "([^"]*)"/)
    const receivedMatch = cleanMessage.match(/Received string: "([^"]*)"/)
    
    if (timeoutMatch) {
      formattedMessage = `⏱️ Timeout Error (${timeoutMatch[1]}ms)\n`
      
      if (expectedMatch && receivedMatch) {
        formattedMessage += `\n📝 Title Mismatch:\n`
        formattedMessage += `Expected: "${expectedMatch[1]}"\n`
        formattedMessage += `Received: "${receivedMatch[1]}"\n`
        
        // Highlight the difference
        const expected = expectedMatch[1]
        const received = receivedMatch[1]
        if (expected !== received) {
          formattedMessage += `\n🔍 The main difference appears to be in the spelling: "${expected}" vs "${received}"`
        }
      }
    }
  }
  
  return {
    message: escapeHtml(formattedMessage),
    trace: cleanTrace ? escapeHtml(cleanTrace) : undefined
  }
}

export function generateHtmlReport(
  report: CtrfReport,
  htmlFilename?: string
): string {
  // Input validation
  if (!report || !report.results || !report.results.tests) {
    throw new Error('Failed to generate HTML report: Invalid report structure')
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const defaultFilename = `ai-test-report-${timestamp}.html`
  const filename = htmlFilename ?? defaultFilename
  
  const failedTests = report.results.tests.filter((test) => test.status === 'failed')
  const passedTests = report.results.tests.filter((test) => test.status === 'passed')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Test Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
        .header h1 { margin: 0 0 0.5rem 0; font-size: 2.5rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .summary-card { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .summary-card h3 { margin: 0 0 0.5rem 0; font-size: 2rem; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #6c757d; }
        .section { background: white; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section-header { background: #f8f9fa; padding: 1rem 1.5rem; border-bottom: 1px solid #e9ecef; border-radius: 8px 8px 0 0; }
        .section-content { padding: 1.5rem; }
        .test-item { border-left: 4px solid #e9ecef; padding: 1.5rem; margin-bottom: 1.5rem; background: #f8f9fa; border-radius: 4px; }
        .test-item.failed { border-left-color: #dc3545; background: #fff5f5; }
        .test-item.passed { border-left-color: #28a745; background: #f0fff4; }
        .test-name { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; }
        .test-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem; font-size: 0.9rem; }
        .ai-summary { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }
        .ai-summary h4 { margin: 0 0 1rem 0; }
        .error-details { background: #fff; border: 1px solid #dee2e6; border-radius: 4px; padding: 1rem; margin-top: 1rem; font-family: monospace; font-size: 0.875rem; }
        .error-message { color: #dc3545; font-weight: 600; margin-bottom: 0.5rem; line-height: 1.4; }
        .error-trace { color: #6c757d; margin-top: 0.5rem; line-height: 1.3; }
        .overall-summary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 8px; margin-top: 2rem; }
        
        /* Responsive design for mobile and tablet devices */
        @media (max-width: 768px) {
            body { padding: 10px; }
            .header { padding: 1.5rem; }
            .header h1 { font-size: 2rem; }
            .summary { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
            .summary-card { padding: 1rem; }
            .section-content { padding: 1rem; }
            .test-item { padding: 1rem; }
            .test-details { grid-template-columns: 1fr; gap: 0.5rem; }
            .overall-summary { padding: 1.5rem; }
        }
        
        @media (max-width: 480px) {
            .summary { grid-template-columns: 1fr; }
            .header h1 { font-size: 1.5rem; }
            .test-name { font-size: 1rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI Test Report</h1>
            <div>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3 class="passed">${report.results.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card">
                <h3 class="failed">${report.results.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card">
                <h3 class="skipped">${report.results.summary.skipped}</h3>
                <p>Skipped</p>
            </div>
            <div class="summary-card">
                <h3>${report.results.summary.tests}</h3>
                <p>Total Tests</p>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>Test Environment</h2>
            </div>
            <div class="section-content">
                <div class="test-details">
                    <div><strong>Tool:</strong> ${report.results.tool.name}</div>
                    <div><strong>Version:</strong> ${report.results.tool.version ?? 'N/A'}</div>
                    <div><strong>Duration:</strong> ${((report.results.summary.stop - report.results.summary.start) / 1000).toFixed(2)}s</div>
                </div>
            </div>
        </div>
        
        ${failedTests.length > 0 ? `
        <div class="section">
            <div class="section-header">
                <h2>❌ Failed Tests (${failedTests.length})</h2>
            </div>
            <div class="section-content">
                ${failedTests.map((test) => `
                <div class="test-item failed">
                    <div class="test-name">${escapeHtml(test.name)}</div>
                    
                    <div class="test-details">
                        <div><strong>Duration:</strong> ${test.duration}ms</div>
                        ${test.suite != null ? `<div><strong>Suite:</strong> ${escapeHtml(test.suite)}</div>` : ''}
                        ${test.retries != null && test.retries > 0 ? `<div><strong>Retries:</strong> ${test.retries}</div>` : ''}
                        ${test.flaky === true ? `<div><strong>Flaky:</strong> Yes</div>` : ''}
                    </div>
                    
                    ${test.message != null || test.trace != null ? `
                    <div class="error-details">
                        ${(() => {
                          const formatted = formatErrorForDisplay(test.message || '', test.trace || '')
                          return `
                            ${formatted.message ? `<div class="error-message">${formatted.message.replace(/\n/g, '<br>')}</div>` : ''}
                            ${formatted.trace && formatted.trace !== formatted.message ? `<div class="error-trace"><strong>Stack Trace:</strong><br>${formatted.trace.replace(/\n/g, '<br>')}</div>` : ''}
                          `
                        })()}
                    </div>
                    ` : ''}
                    
                    ${test.ai != null ? `
                    <div class="ai-summary">
                        <h4>🤖 AI Analysis</h4>
                        <div>${formatAiAnalysis(test.ai)}</div>
                    </div>
                    ` : ''}
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${passedTests.length > 0 ? `
        <div class="section">
            <div class="section-header">
                <h2>✅ Passed Tests (${passedTests.length})</h2>
            </div>
            <div class="section-content">
                ${passedTests.slice(0, 5).map((test) => `
                <div class="test-item passed">
                    <div class="test-name">${escapeHtml(test.name)}</div>
                    <div class="test-details">
                        <div><strong>Duration:</strong> ${test.duration}ms</div>
                        ${test.suite != null ? `<div><strong>Suite:</strong> ${escapeHtml(test.suite)}</div>` : ''}
                    </div>
                </div>
                `).join('')}
                ${passedTests.length > 5 ? `
                <div style="text-align: center; padding: 1rem; color: #6c757d;">
                    ... and ${passedTests.length - 5} more passed tests
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}
        
        ${report.results.extra?.ai != null ? `
        <div class="overall-summary">
            <h3>📋 Overall AI Summary</h3>
            <div>${formatAiAnalysis(report.results.extra.ai)}</div>
        </div>
        ` : ''}
        
        <div style="text-align: center; padding: 2rem; color: #6c757d; font-size: 0.9rem;">
            Generated by AI Test Reporter • ${new Date().toISOString()}
        </div>
    </div>
</body>
</html>`

  try {
    fs.writeFileSync(filename, html, 'utf8')
    return filename
  } catch (error) {
    console.error('Failed to generate HTML report:', error)
    throw error
  }
}
