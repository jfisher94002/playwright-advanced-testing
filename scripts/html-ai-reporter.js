#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * HTML AI Test Reporter
 * Converts AI analysis results to HTML format for better visualization
 */

class HTMLAIReporter {
  constructor() {
    this.htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Test Analysis Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header .subtitle {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid;
        }
        
        .summary-card.passed {
            border-left-color: #28a745;
        }
        
        .summary-card.failed {
            border-left-color: #dc3545;
        }
        
        .summary-card.total {
            border-left-color: #17a2b8;
        }
        
        .summary-card.ai-provider {
            border-left-color: #6f42c1;
        }
        
        .summary-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .summary-card .label {
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
        }
        
        .ai-analysis {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .ai-analysis h2 {
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eee;
        }
        
        .test-failure {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .test-failure h3 {
            color: #c53030;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .test-failure h3::before {
            content: "❌";
            margin-right: 10px;
            font-size: 1.2em;
        }
        
        .ai-insight {
            background: #f0f8ff;
            border: 1px solid #bee3f8;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
        }
        
        .ai-insight h4 {
            color: #2b6cb0;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .ai-insight h4::before {
            content: "🤖";
            margin-right: 10px;
        }
        
        .ai-insight p {
            color: #2d3748;
            line-height: 1.7;
        }
        
        .metadata {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .metadata h3 {
            color: #4a5568;
            margin-bottom: 15px;
        }
        
        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .metadata-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #4299e1;
        }
        
        .metadata-item .key {
            font-weight: 600;
            color: #4a5568;
        }
        
        .metadata-item .value {
            color: #2d3748;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.9em;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
        }
        
        .timestamp {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .no-failures {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            color: #22543d;
        }
        
        .no-failures::before {
            content: "✅";
            display: block;
            font-size: 3em;
            margin-bottom: 10px;
        }
        
        @media (max-width: 768px) {
            .summary-grid {
                grid-template-columns: 1fr;
            }
            
            .metadata-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        {{CONTENT}}
    </div>
</body>
</html>`;
  }

  /**
   * Generate HTML report from CTRF data and AI analysis
   */
  generateReport(ctrfData, aiAnalysis, provider, outputPath) {
    try {
      const summary = ctrfData.results?.summary || {};
      const tests = ctrfData.results?.tests || [];
      const failedTests = tests.filter(test => test.status === 'failed');
      
      const timestamp = new Date().toLocaleString();
      
      let content = `
        <div class="header">
            <h1>🤖 AI Test Analysis Report</h1>
            <div class="subtitle">Intelligent Test Failure Analysis • Generated ${timestamp}</div>
        </div>
        
        <div class="timestamp">
            <strong>Report Generated:</strong> ${timestamp} | <strong>AI Provider:</strong> ${provider.toUpperCase()}
        </div>
        
        <div class="summary-grid">
            <div class="summary-card passed">
                <div class="number">${summary.passed || 0}</div>
                <div class="label">Passed</div>
            </div>
            <div class="summary-card failed">
                <div class="number">${summary.failed || 0}</div>
                <div class="label">Failed</div>
            </div>
            <div class="summary-card total">
                <div class="number">${summary.tests || 0}</div>
                <div class="label">Total Tests</div>
            </div>
            <div class="summary-card ai-provider">
                <div class="number">${provider.toUpperCase()}</div>
                <div class="label">AI Provider</div>
            </div>
        </div>`;

      if (summary.failed > 0 && failedTests.length > 0) {
        content += `
        <div class="ai-analysis">
            <h2>🔍 AI Failure Analysis</h2>`;
        
        failedTests.forEach((test, index) => {
          const testName = test.name || `Test ${index + 1}`;
          const aiInsight = this.extractAIInsight(aiAnalysis, testName);
          
          content += `
            <div class="test-failure">
                <h3>${this.escapeHtml(testName)}</h3>
                <div class="metadata">
                    <div class="metadata-grid">
                        <div class="metadata-item">
                            <span class="key">Duration:</span>
                            <span class="value">${test.duration}ms</span>
                        </div>
                        <div class="metadata-item">
                            <span class="key">Status:</span>
                            <span class="value">${test.status}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="key">File:</span>
                            <span class="value">${test.filePath ? path.basename(test.filePath) : 'Unknown'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="ai-insight">
                    <h4>AI Analysis</h4>
                    <p>${this.escapeHtml(aiInsight || 'No AI analysis available for this test failure.')}</p>
                </div>
            </div>`;
        });
        
        content += `</div>`;
      } else {
        content += `
        <div class="no-failures">
            <h2>All Tests Passed!</h2>
            <p>No test failures detected. Great job! 🎉</p>
        </div>`;
      }

      // Add metadata section
      content += `
        <div class="metadata">
            <h3>📊 Test Execution Details</h3>
            <div class="metadata-grid">
                <div class="metadata-item">
                    <span class="key">Tool:</span>
                    <span class="value">${ctrfData.results?.tool?.name || 'Unknown'}</span>
                </div>
                <div class="metadata-item">
                    <span class="key">Start Time:</span>
                    <span class="value">${summary.start ? new Date(summary.start).toLocaleString() : 'Unknown'}</span>
                </div>
                <div class="metadata-item">
                    <span class="key">End Time:</span>
                    <span class="value">${summary.stop ? new Date(summary.stop).toLocaleString() : 'Unknown'}</span>
                </div>
                <div class="metadata-item">
                    <span class="key">Total Duration:</span>
                    <span class="value">${summary.stop && summary.start ? (summary.stop - summary.start) + 'ms' : 'Unknown'}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            Generated by AI-CTRF HTML Reporter • Powered by ${provider.toUpperCase()} AI Analysis
        </div>`;

      const finalHtml = this.htmlTemplate.replace('{{CONTENT}}', content);
      
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, finalHtml, 'utf8');
      console.log(`📄 HTML AI report generated: ${outputPath}`);
      
      return outputPath;
    } catch (error) {
      console.error('❌ Error generating HTML report:', error.message);
      throw error;
    }
  }

  /**
   * Extract AI insight from analysis output
   */
  extractAIInsight(aiAnalysis, testName) {
    if (!aiAnalysis) {
      return null;
    }
    
    // If aiAnalysis is a string (console output), try to extract relevant parts
    if (typeof aiAnalysis === 'string') {
      const lines = aiAnalysis.split('\n');
      let insight = '';
      let capturing = false;
      
      for (const line of lines) {
        if (line.includes('❌ Failed Test:') && line.includes(testName)) {
          capturing = true;
          continue;
        }
        if (capturing && line.trim() && !line.includes('────')) {
          insight += line.trim() + ' ';
        }
        if (capturing && (line.includes('✅') || line.includes('❌ Failed Test:'))) {
          break;
        }
      }
      
      return insight.trim() || 'AI analysis completed but no specific insights captured.';
    }
    
    // If it's an object, try to extract from structured data
    if (typeof aiAnalysis === 'object') {
      return aiAnalysis.summary || aiAnalysis.insight || 'AI analysis data available in structured format.';
    }
    
    return 'AI analysis completed successfully.';
  }

  /**
   * Escape HTML characters to prevent XSS
   */
  escapeHtml(text) {
    if (!text) {
      return '';
    }
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

module.exports = HTMLAIReporter;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: node html-ai-reporter.js <ctrf-file> <ai-analysis-file> <output-html>');
    process.exit(1);
  }
  
  const [ctrfFile, aiAnalysisFile, outputHtml] = args;
  
  try {
    const ctrfData = JSON.parse(fs.readFileSync(ctrfFile, 'utf8'));
    const aiAnalysis = fs.readFileSync(aiAnalysisFile, 'utf8');
    
    const reporter = new HTMLAIReporter();
    reporter.generateReport(ctrfData, aiAnalysis, 'cli', outputHtml);
    
    console.log('✅ HTML report generated successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}
