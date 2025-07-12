#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ctrfReportPath = path.join(__dirname, '..', 'test-results', 'ctrf-report.json');

console.log('\n🤖 AI Test Report Generator (Ollama)');
console.log('=' .repeat(50));

if (fs.existsSync(ctrfReportPath)) {
  try {
    const report = JSON.parse(fs.readFileSync(ctrfReportPath, 'utf8'));
    const summary = report.results.summary;
    
    console.log(`📊 Processing ${summary.tests} tests...`);
    console.log(`❌ Failed tests to analyze: ${summary.failed}`);
    
    if (summary.failed > 0) {
      console.log('\n🔄 Generating AI insights with Ollama...');
      
      try {
        // Run the AI analysis using our built dist files
        const aiCommand = `node ${path.join(__dirname, '..', 'dist', 'index.js')} ollama "${ctrfReportPath}" --model llama3.2 --log --html`;
        
        console.log('💭 Running AI analysis...');
        execSync(aiCommand, { stdio: 'inherit' });
        
        console.log('\n✅ AI analysis complete!');
        
      } catch (error) {
        console.log('⚠️  AI analysis failed. Make sure Ollama is running:');
        console.log('   brew install ollama');
        console.log('   ollama serve');
        console.log('   ollama pull llama3.2');
        console.log(`\n📄 Error: ${error.message}`);
      }
      
    } else {
      console.log('✅ No failed tests to analyze - all tests passed!');
    }
    
    console.log('\n📁 Reports available:');
    console.log(`   📊 CTRF: ${ctrfReportPath}`);
    console.log(`   🌐 HTML: playwright-report/index.html`);
    
    // Check for AI HTML report
    const aiReports = fs.readdirSync('.').filter(file => file.startsWith('ai-test-report-'));
    if (aiReports.length > 0) {
      console.log(`   🤖 AI Report: ${aiReports[aiReports.length - 1]}`);
    }
    
  } catch (error) {
    console.log('❌ Error processing CTRF report:', error.message);
  }
} else {
  console.log('⚠️  No CTRF report found. Run tests first: npm test');
}

console.log('=' .repeat(50));
