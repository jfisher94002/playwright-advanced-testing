#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ctrfReportPath = path.join(__dirname, '..', 'ctrf', 'ctrf-report.json');

console.log('\n📊 CTRF Report Auto-Summary');
console.log('=' .repeat(50));

// Wait a moment for the file to be written
setTimeout(() => {
  if (fs.existsSync(ctrfReportPath)) {
    try {
      const report = JSON.parse(fs.readFileSync(ctrfReportPath, 'utf8'));
      const summary = report.results.summary;
      
      console.log(`\n✅ Tests Passed: ${summary.passed}`);
      console.log(`❌ Tests Failed: ${summary.failed}`);
      console.log(`⏭️  Tests Skipped: ${summary.skipped}`);
      console.log(`📝 Total Tests: ${summary.tests}`);
      console.log(`⏱️  Duration: ${(summary.stop - summary.start)}ms`);
      
      if (summary.failed > 0) {
        console.log('\n🔍 Failed Tests:');
        report.results.tests
          .filter(test => test.status === 'failed')
          .forEach(test => {
            console.log(`  - ${test.name} (${test.filePath})`);
          });
      }
      
      console.log(`\n📁 Full Report: ctrf/ctrf-report.json`);
      console.log(`🌐 HTML Report: playwright-report/index.html`);
      
    } catch (error) {
      console.log('❌ Error reading CTRF report:', error.message);
    }
  } else {
    console.log('⚠️  No CTRF report found at:', ctrfReportPath);
  }
  
  console.log('=' .repeat(50));
}, 1000); // Wait 1 second for file to be written
