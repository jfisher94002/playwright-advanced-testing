#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Simple HTML Viewer Script
 * Creates a local index.html file listing all available reports
 */

function createReportIndex() {
  const reportsDir = 'ai-reports';
  const playwrightReportDir = 'playwright-report';
  
  if (!fs.existsSync(reportsDir)) {
    console.log('No ai-reports directory found.');
    return;
  }
  
  const files = fs.readdirSync(reportsDir);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Reports Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .report-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .report-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid;
        }
        
        .report-card.ai-html {
            border-left-color: #28a745;
        }
        
        .report-card.ai-json {
            border-left-color: #17a2b8;
        }
        
        .report-card.playwright {
            border-left-color: #6f42c1;
        }
        
        .report-card h3 {
            margin-top: 0;
            margin-bottom: 15px;
        }
        
        .report-card p {
            color: #666;
            margin-bottom: 15px;
        }
        
        .report-link {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        
        .report-link:hover {
            background: #5a6fd8;
        }
        
        .timestamp {
            font-size: 0.9em;
            color: #888;
            margin-top: 10px;
        }
        
        .no-reports {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 Test Reports Dashboard</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="report-grid">`;

  // Add Playwright HTML report if it exists
  if (fs.existsSync(path.join(playwrightReportDir, 'index.html'))) {
    htmlContent += `
            <div class="report-card playwright">
                <h3>🎭 Playwright HTML Report</h3>
                <p>Standard Playwright test execution report with detailed test results, traces, and screenshots.</p>
                <a href="${playwrightReportDir}/index.html" class="report-link" target="_blank">View Report</a>
                <div class="timestamp">Playwright Official Report</div>
            </div>`;
  }

  // Add AI HTML reports
  htmlFiles.forEach(file => {
    const filePath = path.join(reportsDir, file);
    const stats = fs.statSync(filePath);
    const timestamp = stats.mtime.toLocaleString();
    
    // Extract provider from filename
    const providerMatch = file.match(/ai-analysis-(\w+)-/);
    const provider = providerMatch ? providerMatch[1].toUpperCase() : 'UNKNOWN';
    
    htmlContent += `
            <div class="report-card ai-html">
                <h3>🤖 AI Analysis Report (${provider})</h3>
                <p>AI-powered test failure analysis with intelligent insights and recommendations.</p>
                <a href="${reportsDir}/${file}" class="report-link" target="_blank">View AI Report</a>
                <div class="timestamp">Generated: ${timestamp}</div>
            </div>`;
  });

  // Add AI JSON reports
  jsonFiles.forEach(file => {
    const filePath = path.join(reportsDir, file);
    const stats = fs.statSync(filePath);
    const timestamp = stats.mtime.toLocaleString();
    
    // Extract provider from filename
    const providerMatch = file.match(/ai-analysis-(\w+)-/);
    const provider = providerMatch ? providerMatch[1].toUpperCase() : 'UNKNOWN';
    
    htmlContent += `
            <div class="report-card ai-json">
                <h3>📄 AI Analysis Data (${provider})</h3>
                <p>Raw CTRF JSON data with AI analysis results for programmatic access.</p>
                <a href="${reportsDir}/${file}" class="report-link" target="_blank">View JSON</a>
                <div class="timestamp">Generated: ${timestamp}</div>
            </div>`;
  });

  if (htmlFiles.length === 0 && jsonFiles.length === 0 && !fs.existsSync(path.join(playwrightReportDir, 'index.html'))) {
    htmlContent += `
            <div class="no-reports">
                <h3>No Reports Available</h3>
                <p>Run tests to generate reports: <code>npm run test:ai-smart:html</code></p>
            </div>`;
  }

  htmlContent += `
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #666;">
            <p>Use <code>npm run test:ai-smart:html</code> to generate new reports</p>
        </div>
    </div>
</body>
</html>`;

  const indexPath = 'test-reports-dashboard.html';
  fs.writeFileSync(indexPath, htmlContent, 'utf8');
  console.log(`📊 Test reports dashboard created: ${indexPath}`);
  console.log(`🌐 Open in browser: file://${path.resolve(indexPath)}`);
  
  return indexPath;
}

if (require.main === module) {
  createReportIndex();
}
