#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Smart AI Test Reporter
 * Automatically selects the best available AI provider for test analysis
 */

const CTRF_PATH = 'ctrf/test-results/ctrf-report.json';

// AI Providers configuration with priority and environment requirements
const AI_PROVIDERS = [
  {
    name: 'ollama',
    command: 'ai-ctrf ollama',
    model: 'llama3.2',
    priority: 1,
    envVars: [], // Ollama typically runs locally without API keys
    description: 'Local Ollama (No API key required)',
    checkAvailability: () => {
      try {
        execSync('curl -s http://localhost:11434/api/tags', { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'gemini',
    command: 'ai-ctrf gemini',
    model: 'gemini-pro',
    priority: 2,
    envVars: ['GOOGLE_API_KEY'],
    description: 'Google Gemini (Free tier available)',
  },
  {
    name: 'deepseek',
    command: 'ai-ctrf deepseek',
    model: 'deepseek-reasoner',
    priority: 3,
    envVars: ['DEEPSEEK_API_KEY'],
    description: 'DeepSeek (Cost-effective)',
  },
  {
    name: 'mistral',
    command: 'ai-ctrf mistral',
    model: 'mistral-large-latest',
    priority: 4,
    envVars: ['MISTRAL_API_KEY'],
    description: 'Mistral AI (Free credits available)',
  },
  {
    name: 'openai',
    command: 'ai-ctrf openai',
    model: 'gpt-4o',
    priority: 5,
    envVars: ['OPENAI_API_KEY'],
    description: 'OpenAI GPT-4o',
  },
  {
    name: 'claude',
    command: 'ai-ctrf claude',
    model: 'claude-3-5-sonnet-20240620',
    priority: 6,
    envVars: ['ANTHROPIC_API_KEY'],
    description: 'Anthropic Claude',
  },
  {
    name: 'bedrock',
    command: 'ai-ctrf bedrock',
    model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    priority: 7,
    envVars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
    description: 'AWS Bedrock Claude',
  },
  {
    name: 'grok',
    command: 'ai-ctrf grok',
    model: 'grok-2-latest',
    priority: 8,
    envVars: ['GROK_API_KEY'],
    description: 'X.AI Grok',
  },
  {
    name: 'perplexity',
    command: 'ai-ctrf perplexity',
    model: 'pplx-7b-online',
    priority: 9,
    envVars: ['PERPLEXITY_API_KEY'],
    description: 'Perplexity AI',
  },
  {
    name: 'openrouter',
    command: 'ai-ctrf openrouter',
    model: 'anthropic/claude-3-opus',
    priority: 10,
    envVars: ['OPENROUTER_API_KEY'],
    description: 'OpenRouter (Multi-model access)',
  }
];

function checkEnvironmentVariables(envVars) {
  return envVars.every(envVar => process.env[envVar]);
}

function findAvailableProviders() {
  const available = [];
  
  for (const provider of AI_PROVIDERS) {
    let isAvailable = true;
    
    // Check environment variables
    if (provider.envVars.length > 0) {
      isAvailable = checkEnvironmentVariables(provider.envVars);
    }
    
    // Custom availability check (e.g., for Ollama)
    if (isAvailable && provider.checkAvailability) {
      isAvailable = provider.checkAvailability();
    }
    
    if (isAvailable) {
      available.push(provider);
    }
  }
  
  return available.sort((a, b) => a.priority - b.priority);
}

function checkCtrfReport() {
  if (!fs.existsSync(CTRF_PATH)) {
    console.error(`❌ CTRF report not found at: ${CTRF_PATH}`);
    console.log('🔍 Run tests first to generate a CTRF report:');
    console.log('   npx playwright test');
    process.exit(1);
  }
  
  // Check if report has failed tests
  try {
    const report = JSON.parse(fs.readFileSync(CTRF_PATH, 'utf8'));
    const failedTests = report.results?.summary?.failed || 0;
    
    if (failedTests === 0) {
      console.log('✅ No failed tests found in CTRF report.');
      console.log('🎉 All tests passed! No AI analysis needed.');
      process.exit(0);
    }
    
    console.log(`🔍 Found ${failedTests} failed test(s) for AI analysis.`);
    return failedTests;
  } catch (error) {
    console.error('❌ Error reading CTRF report:', error.message);
    process.exit(1);
  }
}

function runAiAnalysis(provider, specificProvider = null) {
  console.log(`\n🤖 Running AI analysis with ${provider.description}...`);
  console.log(`📊 Model: ${provider.model}`);
  console.log('─'.repeat(80));
  
  try {
    const command = `${provider.command} ${CTRF_PATH} --model ${provider.model}`;
    
    // Capture AI output for HTML generation
    const aiOutput = execSync(command, { encoding: 'utf8' });
    console.log(aiOutput); // Display in console as before
    
    console.log('─'.repeat(80));
    console.log(`✅ AI analysis completed successfully with ${provider.name}!`);
    
    // Save the enhanced report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonOutputFile = `ai-reports/ai-analysis-${provider.name}-${timestamp}.json`;
    const htmlOutputFile = `ai-reports/ai-analysis-${provider.name}-${timestamp}.html`;
    
    // Create ai-reports directory if it doesn't exist
    const aiReportsDir = 'ai-reports';
    if (!fs.existsSync(aiReportsDir)) {
      fs.mkdirSync(aiReportsDir, { recursive: true });
    }
    
    // Copy the enhanced CTRF report (JSON)
    if (fs.existsSync(CTRF_PATH)) {
      fs.copyFileSync(CTRF_PATH, jsonOutputFile);
      console.log(`📁 Enhanced JSON report saved to: ${jsonOutputFile}`);
    }
    
    // Generate HTML report
    try {
      const HTMLAIReporter = require('./html-ai-reporter.js');
      const htmlReporter = new HTMLAIReporter();
      const ctrfData = JSON.parse(fs.readFileSync(CTRF_PATH, 'utf8'));
      
      htmlReporter.generateReport(ctrfData, aiOutput, provider.name, htmlOutputFile);
      console.log(`🌐 HTML report generated: ${htmlOutputFile}`);
    } catch (htmlError) {
      console.warn(`⚠️  HTML generation failed: ${htmlError.message}`);
    }
    
  } catch (error) {
    console.error(`❌ AI analysis failed with ${provider.name}:`, error.message);
    
    if (!specificProvider) {
      console.log('🔄 Trying next available provider...');
      return false;
    } else {
      process.exit(1);
    }
  }
  
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const specificProvider = args[0];
  
  console.log('🤖 Smart AI Test Reporter');
  console.log('=' .repeat(80));
  
  // Check if CTRF report exists and has failed tests
  const failedTestCount = checkCtrfReport();
  
  if (specificProvider) {
    // Use specific provider
    const provider = AI_PROVIDERS.find(p => p.name === specificProvider);
    if (!provider) {
      console.error(`❌ Unknown provider: ${specificProvider}`);
      console.log('Available providers:', AI_PROVIDERS.map(p => p.name).join(', '));
      process.exit(1);
    }
    
    // Check if provider is available
    if (provider.envVars.length > 0 && !checkEnvironmentVariables(provider.envVars)) {
      console.error(`❌ Missing environment variables for ${provider.name}:`, provider.envVars.join(', '));
      process.exit(1);
    }
    
    runAiAnalysis(provider, true);
  } else {
    // Auto-select best available provider
    const availableProviders = findAvailableProviders();
    
    if (availableProviders.length === 0) {
      console.error('❌ No AI providers available.');
      console.log('\n🔧 Available providers and their requirements:');
      AI_PROVIDERS.forEach(provider => {
        console.log(`   ${provider.name}: ${provider.description}`);
        if (provider.envVars.length > 0) {
          console.log(`      Required: ${provider.envVars.join(', ')}`);
        }
      });
      process.exit(1);
    }
    
    console.log(`\n🎯 Found ${availableProviders.length} available AI provider(s):`);
    availableProviders.forEach((provider, index) => {
      console.log(`   ${index + 1}. ${provider.description}`);
    });
    
    // Try providers in order of priority
    for (const provider of availableProviders) {
      const success = runAiAnalysis(provider);
      if (success) {
        break;
      }
    }
  }
}

if (require.main === module) {
  main();
}
