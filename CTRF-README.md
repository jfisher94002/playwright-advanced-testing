# 

4. **Notifications** - Use CTRF data for test result notifications
5. **Historical Tracking** - Archive CTRF reports for trend analysis
6. **Add Dashboard** - Consider tools like GitHub Actions or Jenkins plugins
7. **Integrate with CI/CD** - Use CTRF reports in your build pipeline

## Next Steps

```md
}
  }
    ]
      }
        "filePath": "/tests/UIBasicTest.spec.js"
        "duration": 14438,
        "status": "passed",
        "name": "Page Playwright Tests",
      {
    "tests": [
    },
      "duration": 20300
      "failed": 0,
      "passed": 4,
      "tests": 4,
    "summary": {
    "tool": { "name": "playwright" },
  "results": {
{
```json

## Example CTRF Output

🚀 **CI Integration** - Easy integration with build systems  
📈 **Trend Analysis** - Historical test data tracking  
🔗 **Tool Agnostic** - Can be processed by various reporting tools  
📊 **Rich Metadata** - Detailed test execution information  
🔄 **Standardized Format** - Works with any CI/CD pipeline  

## Benefits

- **Metadata**: Tool information, environment details
- **Suite Information**: Test file organization
- **Test Details**: Individual test results with timing
- **Summary**: Total tests, passed/failed counts, duration
The CTRF report includes:

## CTRF Report Structure

```

npm run ctrf:view     # View CTRF reports
npm run ctrf:summary  # Show test summary
npm run ctrf:merge    # Merge multiple CTRF reports
npm run test:report   # Show HTML report
npm run test:headed   # Run tests in headed mode
npm run test:ui       # Run tests in UI mode
npm test              # Run all tests

```bash

## Available NPM Scripts

- **`playwright-report/`** - Standard HTML report (still available)
- **`test-results/ctrf-report.json`** - Detailed test results in CTRF format
After running tests, you'll find:

## Generated Files

```

],
}]
testType: 'playwright'
minimal: false,
outputDir: 'test-results',
outputFile: 'ctrf-report.json',
['playwright-ctrf-json-reporter', {
['html'],
reporter: [

```typescript

The CTRF reporter is configured in `playwright.config.ts`:

## Configuration

✅ **NPM scripts** - Added convenient commands  
✅ **Reporter configured** - Added to `playwright.config.ts`  
✅ **ctrf CLI** - Installed for additional utilities  
✅ **playwright-ctrf-json-reporter** - Installed and configured  

## Setup Complete

CTRF (Common Test Report Format) is a standardized JSON format for test results that works across different testing frameworks. This allows for consistent reporting and analysis regardless of the testing tool used.

## What is CTRF?
 CTRF Reporting for Playwright
```