#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ctrfReportPath = path.join(__dirname, '..', 'test-results', 'ctrf-report.json');

console.log('\n🤖 AI Test Report Generator');
console.log('=' .repeat(50));

if (fs.existsSync(ctrfReportPath)) {
  try {
    const report = JSON.parse(fs.readFileSync(ctrfReportPath, 'utf8'));
    const summary = report.results.summary;
    
    console.log(`📊 Processing ${summary.tests} tests...`);
    console.log(`❌ Failed tests to analyze: ${summary.failed}`);
    
    if (summary.failed > 0) {
      console.log('\n🔄 Generating AI insights...');
      
      try {
        // Check if we should use Bedrock, Ollama, or other providers
        const provider = process.env.AI_PROVIDER || 'ollama';
        let aiCommand;
        
        if (provider === 'bedrock') {
          const model = process.env.BEDROCK_MODEL || 'anthropic.claude-3-sonnet-20240229-v1:0';
          console.log(`🔧 Using AWS Bedrock with model: ${model}`);
          aiCommand = `node ${path.join(__dirname, '..', 'dist', 'index.js')} bedrock "${ctrfReportPath}" --model "${model}" --log --html`;
        } else if (provider === 'claude') {
          const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620';
          console.log(`🔧 Using Anthropic Claude with model: ${model}`);
          aiCommand = `node ${path.join(__dirname, '..', 'dist', 'index.js')} claude "${ctrfReportPath}" --model "${model}" --log --html`;
        } else if (provider === 'openai') {
          const model = process.env.OPENAI_MODEL || 'gpt-4o';
          console.log(`🔧 Using OpenAI with model: ${model}`);
          aiCommand = `node ${path.join(__dirname, '..', 'dist', 'index.js')} openai "${ctrfReportPath}" --model "${model}" --log --html`;
        } else {
          // Default to Ollama
          const model = process.env.OLLAMA_MODEL || 'llama3.2';
          console.log(`🔧 Using Ollama with model: ${model}`);
          aiCommand = `node ${path.join(__dirname, '..', 'dist', 'index.js')} ollama "${ctrfReportPath}" --model "${model}" --log --html`;
        }
        
        console.log('💭 Running AI analysis...');
        execSync(aiCommand, { stdio: 'inherit' });
        
        console.log('\n✅ AI analysis complete!');
        console.log('📁 Check ai-reports/ directory for detailed insights');
        
      } catch (error) {
        console.log(`⚠️  AI analysis failed: ${error.message}`);
        
        if (provider === 'bedrock') {
          console.log('💡 Make sure AWS credentials are configured:');
          console.log('   export AWS_ACCESS_KEY_ID="your-key"');
          console.log('   export AWS_SECRET_ACCESS_KEY="your-secret"');
          console.log('   export AWS_REGION="us-west-2"');
        } else if (provider === 'claude') {
          console.log('💡 Make sure ANTHROPIC_API_KEY is set');
        } else if (provider === 'openai') {
          console.log('💡 Make sure OPENAI_API_KEY is set');
        } else {
          console.log('💡 Make sure Ollama is running and model is available:');
          console.log('   brew install ollama');
          console.log('   ollama serve');
          console.log('   ollama pull llama3.2');
        }
      }
      
    } else {
      console.log('🎉 No failed tests - no AI analysis needed!');
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
  console.log('⚠️  No CTRF report found at:', ctrfReportPath);
  console.log('🔧 Run tests first to generate the report');
}

console.log('=' .repeat(50));
