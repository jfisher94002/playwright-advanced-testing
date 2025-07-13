# 

*This setup ensures your repository has professional-grade automation with AI-powered analysis configured.*

---

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Bedrock Troubleshooting](../BEDROCK-TROUBLESHOOTING.md)
- [CTRF Integration Guide](../CTRF-README.md)
- [AI Testing Setup Guide](../AI-TESTING-SETUP.md)
- [Main README](../README.md)

## 📚 Additional Resources

4. Review [Bedrock Troubleshooting Guide](../BEDROCK-TROUBLESHOOTING.md)
5. Verify model access permissions in AWS console
6. Check AWS service status and quotas
7. Run local diagnostics: `npm run debug:bedrock:full`

### AI Analysis Issues

4. Check if any external dependencies (AWS, APIs) are accessible
5. Ensure repository permissions allow Actions to run
6. Verify all required secrets are set
7. Check the Actions tab for detailed error logs

### Workflow Failures

## 🚨 Troubleshooting

- [ ] Bedrock integration functions: `npm run debug:bedrock:full`
- [ ] Issue templates are available
- [ ] PR template appears automatically
- [ ] Artifacts are uploaded correctly
- [ ] CTRF reports are generated
- [ ] AI analysis works (if AWS configured)
- [ ] Required status checks appear
- [ ] Workflows run successfully on push/PR
- [ ] Branch protection rules are active
- [ ] Repository secrets are configured

After setup, verify everything works:

## ✅ Verification Checklist

- **Rate limiting**: May occur with high test frequency - implement backoff
- __Region issues__: Ensure `AWS_REGION` is set to a Bedrock-supported region
- **Model access denied**: Request model access in AWS Bedrock console
- **Missing AWS credentials**: Add required secrets to repository

### Common CI Issues

4. Test locally with: `npm run debug:bedrock:full`
5. Review the workflow logs for specific error messages
6. Verify the AWS account has Bedrock model access
7. Check AWS credentials are properly set in repository secrets

### If AI Analysis Fails in CI

## 🔍 Debugging in CI/CD

- ✅ Integration with CTRF reporting format
- ✅ Error categorization and debugging hints
- ✅ Consolidated summary reports
- ✅ Actionable recommendations for fixes
- ✅ Failed test analysis with root cause identification

### AI Analysis Features

3. `anthropic.claude-instant-v1` (backup)
4. `anthropic.claude-3-haiku-20240307-v1:0` (fallback)
5. `anthropic.claude-3-sonnet-20240229-v1:0` (default)
   The release pipeline will attempt to use these models in order:

### Bedrock Models Tested

## 📊 AI Analysis Configuration

```md
});
  // test implementation
test('@regression Edge case handling', async ({ page }) => {
// Regression tests

});
  // test implementation
test('@e2e Complete user journey', async ({ page }) => {
// End-to-end scenarios

});
  // test implementation
test('@performance Page load time', async ({ page }) => {
// Performance tests

});
  // test implementation
test('@smoke Homepage loads', async ({ page }) => {
// Smoke tests (quick validation)

});
  // test implementation
test('@critical User login flow', async ({ page }) => {
// Critical path tests (run in release pipeline)
```javascript

Use these annotations in your tests for workflow filtering:

## 🎯 Test Annotations

- Extended AI analysis
- Performance benchmarks
- Cross-browser and cross-environment testing
- Scheduled comprehensive testing

  - Documentation updates
  - Security scanning
  - AWS Bedrock AI analysis
  - CTRF reporting
  - Critical path tests with `@critical` annotation
  - Smoke tests with `@smoke` annotation
- Runs comprehensive validation including:
- Triggers on version tags (v*)

- Uploads test artifacts
- Generates CTRF reports and AI analysis
- Tests across multiple browsers (Chromium, Firefox, WebKit)
- Runs on every push and PR

## 🔧 Workflow Configuration

```

npm test

# Run initial test to verify setup

npm run debug:bedrock:full

# Test Bedrock setup

aws configure

# Set up AWS credentials (Option 2: AWS CLI)

export AWS_REGION="us-west-2"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_ACCESS_KEY_ID="your-access-key"

# Set up AWS credentials (Option 1: Environment variables)

npx playwright install

# Install Playwright browsers

npm install

# Install dependencies

cd <repository-name>
git clone <repository-url>

# Clone the repository

```bash

Run these commands to set up your local environment:

## 🚀 Quick Setup Commands

- `in-progress` (blue) - Currently being worked on
- `needs-review` (orange) - Needs code review
- `ready-to-merge` (green) - Ready for merging

- `bedrock` (teal) - AWS Bedrock integration
- `ai-analysis` (purple) - AI analysis related
- `documentation` (green) - Documentation updates
- `enhancement` (blue) - Feature requests
- `bug` (red) - Bug reports

- `low` (green) - Low priority
- `medium` (yellow) - Medium priority
- `high` (orange) - High priority
- `critical` (red) - Critical issues requiring immediate attention

## 🏷️ Repository Labels

- `🤖 AI Analysis`
- `🧪 Smoke Tests`
- `🔒 Security Scan`
- `🎭 Playwright Tests`

   - ✅ Restrict pushes that create files larger than 100MB
   - ✅ Include administrators
   - ✅ Require up-to-date branches
   - ✅ Require status checks to pass
2. Add rule for `main` branch:
1. Go to Settings → Branches

## 🛡️ Repository Protection Rules

```

OPENAI_API_KEY=... (for OpenAI GPT models)
ANTHROPIC_API_KEY=... (for Claude API)

```text

```

AWS_REGION=us-west-2 (or your preferred Bedrock region)
AWS_SECRET_ACCESS_KEY=... (your AWS secret key)
AWS_ACCESS_KEY_ID=AKIA... (your AWS access key)

```ini

Navigate to your repository → Settings → Secrets and variables → Actions, then add:

## 🔑 Required Repository Secrets

This guide helps you configure GitHub Actions workflows and repository settings for the Playwright AI Testing framework.
 🚀 GitHub Actions & CI/CD Setup Guide
```