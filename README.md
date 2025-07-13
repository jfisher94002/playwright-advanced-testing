# 

4. Create an issue in the repository
5. Review the [documentation](./AI-TESTING-SETUP.md)
6. Run the diagnostic tools: `npm run debug:bedrock:full`
7. Check the [troubleshooting guide](./BEDROCK-TROUBLESHOOTING.md)

If you encounter issues:

## 📞 Support

- [Ollama](https://ollama.ai/) - Local AI models
- [OpenAI](https://openai.com/) - GPT models
- [Anthropic Claude](https://www.anthropic.com/) - AI analysis
- [AWS Bedrock](https://aws.amazon.com/bedrock/) - Foundation models
- [CTRF](https://ctrf.io/) - Common Test Report Format
- [Playwright](https://playwright.dev/) - Modern browser testing

## 🙏 Acknowledgments

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📄 License

- Follow AWS security best practices
- Regularly rotate API keys
- Use GitHub secrets for CI/CD
- Store sensitive credentials in environment variables

## 🔒 Security

- `@performance` - Performance benchmarks
- `@e2e` - End-to-end scenarios
- `@regression` - Full regression suite
- `@critical` - Critical path tests
- `@smoke` - Quick validation tests

Use these annotations in your tests for workflow filtering:

## 📋 Test Categories

6. Submit a pull request
7. Run the test suite
8. Add tests if needed
9. Make your changes
10. Create a feature branch
11. Fork the repository

## 🤝 Contributing

- [Attribution](./ATTRIBUTION.md)
- [GitHub Actions Setup](./.github/SETUP.md)
- [Bedrock Troubleshooting](./BEDROCK-TROUBLESHOOTING.md)
- [CTRF Integration Guide](./CTRF-README.md)
- [AI Testing Setup Guide](./AI-TESTING-SETUP.md)

## 📚 Documentation

```yaml
OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
```yaml

For CI/CD, set these secrets in GitHub:


- `release.yml` - Release automation
- `environment-testing.yml` - Multi-environment testing
- `dependency-updates.yml` - Automated dependency management
- `nightly-tests.yml` - Scheduled comprehensive testing
- `playwright.yml` - Main test workflow

The project includes several workflow files:


## 🚢 CI/CD Integration

| Quick Test | Simple connectivity | `npm run bedrock:test` |
| Interactive CLI | Model testing | `npm run bedrock:cli` |
| AWS CLI Test | Authentication verification | `npm run debug:aws` |
| Basic Debug | Quick connectivity test | `npm run debug:bedrock` |
| Enhanced Debug | Comprehensive Bedrock diagnostics | `npm run debug:bedrock:full` |
|------|---------|---------|
| Tool | Purpose | Command |


3. Try different AWS regions
2. Verify firewall/proxy settings
1. Check internet connectivity
#### Network Issues

3. Request model access if needed
2. Check region availability (`us-west-2` recommended)
1. Verify model access in AWS Console
#### Model Access Issues

```

npm run bedrock:cli

# Test specific model

npm run debug:bedrock:full

# Full diagnostics

npm run debug:aws

# Check credentials

```bash
#### Bedrock Authentication


## 🔍 Debugging Guide

```

# No configuration needed if running on localhost:11434

# Ollama (runs locally)

export OPENAI_API_KEY="your-key"

# OpenAI

export ANTHROPIC_API_KEY="your-key"

# Claude

export AWS_REGION="us-west-2"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_ACCESS_KEY_ID="your-key"

# AWS Bedrock

```bash

Configure AI providers through environment variables:


- CTRF reporter configuration
- Timeouts
- Parallel execution
- Test directories
- Browser settings
Edit `playwright.config.ts` to customize:


## 🛠️ Configuration

```

npm run ai-ctrf            # Run compiled AI analyzer
npm run build              # Compile TypeScript

```bash

```

npm run bedrock:test       # Quick Bedrock connectivity test
npm run bedrock:cli        # Interactive Bedrock CLI
npm run debug:aws          # AWS authentication test
npm run debug:bedrock      # Basic Bedrock test
npm run debug:bedrock:full # Comprehensive Bedrock diagnostics

```bash

```

npm run ctrf:merge         # Merge CTRF reports
npm run ctrf:view          # View CTRF report
npm run ctrf:summary       # Generate CTRF summary

```bash

```

npm run ai:ollama          # Use local Ollama
npm run ai:openai          # Use OpenAI API
npm run ai:claude          # Use Claude API
npm run ai:bedrock         # Use AWS Bedrock
npm run ai:report          # Generate AI analysis

```bash

```

npm run test:bedrock       # Tests with Bedrock AI analysis
npm run test:ai            # Tests with AI analysis
npm run test:headed        # Tests in headed mode
npm run test:ui            # Tests in UI mode
npm run test:only          # Tests without AI analysis
npm test                    # Full test suite with AI analysis

```bash

## 🔧 Available Scripts

- `playwright-report/` - Standard Playwright reports
- `ai-reports/` - AI analysis HTML reports
- `test-results/ctrf-report.json` - CTRF format
Reports are saved in:

- Consolidated summaries
- Actionable recommendations
- Root cause analysis
- Individual test failure explanations
AI analysis generates:


```

npm run ctrf:merge

# Merge multiple CTRF reports

npm run ctrf:view

# View CTRF report

npm run ctrf:summary

# Generate CTRF summary

```bash


## 📊 Reporting

For detailed troubleshooting, see [BEDROCK-TROUBLESHOOTING.md](./BEDROCK-TROUBLESHOOTING.md)

```

npm run bedrock:test

# Quick connectivity test

npm run bedrock:cli

# Interactive CLI testing

npm run debug:bedrock

# Basic connectivity test

npm run debug:bedrock:full

# Comprehensive diagnostics

```bash
#### Troubleshooting

3. Request access to desired models (Claude, Titan, etc.)
2. Navigate to "Model access"
1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
#### Model Access

```

npm run debug:bedrock:full

# Test the setup

export AWS_PROFILE="default"

# Option 2: AWS Profile

export AWS_REGION="us-west-2"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_ACCESS_KEY_ID="your-access-key"

# Option 1: Environment variables

```bash
#### Quick Setup

AWS Bedrock provides access to multiple foundation models. Here's how to set it up:


| Ollama (Local) | `npm run ai:ollama` | Ollama running locally |
| OpenAI | `npm run ai:openai` | OPENAI_API_KEY |
| Claude (Anthropic) | `npm run ai:claude` | ANTHROPIC_API_KEY |
| AWS Bedrock | `npm run ai:bedrock` | AWS credentials |
|----------|---------|----------------|
| Provider | Command | Setup Required |


This framework supports multiple AI providers for intelligent test failure analysis:

## 🤖 AI Test Analysis

```

npm run test:headed

# Run tests in headed mode

npm run test:ui

# Run tests in UI mode

npm run test:only

# Run tests without AI analysis

npm test

# Run tests with AI analysis

```bash


```

npx playwright install

# Install Playwright browsers

npm install

# Install dependencies

cd udemy-playwright-javascript-062125
git clone <repository-url>

# Clone the repository

```bash


- npm or yarn
- Node.js 18+ 


## 🚀 Quick Start

- 📱 **Cross-Platform** - Works on macOS, Linux, Windows
- 🌐 **Multi-Browser Support** - Chromium, Firefox, WebKit
- 🛠️ **Advanced Debugging** - Comprehensive diagnostic tools
- 🔄 **CI/CD Integration** - GitHub Actions workflows
- 📊 **CTRF Reporting** - Standardized test reporting format
- 🤖 **AI-Powered Test Analysis** - Multiple AI providers (Claude, OpenAI, Ollama, AWS Bedrock)
- 🎭 **Playwright Test Framework** - Modern browser testing

## ✨ Features

A comprehensive Playwright JavaScript testing framework with advanced AI-powered test analysis, CTRF reporting, and robust CI/CD integration.
 🎭 Advanced Playwright Testing with AI Analysis
```