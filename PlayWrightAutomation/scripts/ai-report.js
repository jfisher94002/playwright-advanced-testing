#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ctrfReportPath = path.join(__dirname, '..', 'ctrf', 'ctrf-report.json');

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
        // Check if the main dist folder exists (parent directory)
        const mainDistPath = path.join(__dirname, '..', '..', 'dist', 'index.js');
        const localDistPath = path.join(__dirname, '..', 'dist', 'index.js');
        
        let aiCommand;
        if (fs.existsSync(mainDistPath)) {
          aiCommand = `node "${mainDistPath}" ollama "${ctrfReportPath}" --model llama3.2 --log --html`;
        } else if (fs.existsSync(localDistPath)) {
          aiCommand = `node "${localDistPath}" ollama "${ctrfReportPath}" --model llama3.2 --log --html`;
        } else {
          console.log('⚠️  AI reporter not built. Run: npm run build');
          process.exit(1);
        }
        
        console.log('💭 Running AI analysis...');
        execSync(aiCommand, { stdio: 'inherit' });
        
        console.log('\n✅ AI analysis complete!');
        console.log('📁 Check ai-reports/ directory for detailed insights');
        
      } catch (error) {
        console.log('⚠️  AI analysis failed:', error.message);
        console.log('💡 Make sure Ollama is running and llama3.2 model is available');
      }
    } else {
      console.log('🎉 No failed tests - no AI analysis needed!');
    }
    
  } catch (error) {
    console.log('❌ Error reading CTRF report:', error.message);
  }
} else {
  console.log('⚠️  No CTRF report found at:', ctrfReportPath);
  console.log('🔧 Run tests first to generate the report');
}

console.log('=' .repeat(50));
