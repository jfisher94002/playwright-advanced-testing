# 

This enhanced debugging system transforms Bedrock integration from a "black box" into a transparent, debuggable, and user-friendly component of the AI Test Reporter.

- **Clear feedback** during AI analysis
- **Multiple testing options** for verification
- **Quick problem resolution** with specific solutions
- **Self-service debugging** with comprehensive guides

### For Users

- **Multiple credential support** for different environments
- **Detailed error logs** for issue resolution
- **Environment validation** before deployments
- **Automated health checks** with debug scripts

### For DevOps/CI

- **Clear setup instructions** for different environments
- **Comprehensive diagnostics** in one command
- **Interactive testing** without writing test code
- **Faster troubleshooting** with specific error messages

### For Developers

## 🎉 Benefits

| Format Issues | Empty responses, parsing errors | Verify model parameters |
| Network | `NetworkingError`, `TimeoutError` | Check connectivity, firewall |
| Rate Limiting | `ThrottlingException` | Implement backoff, reduce requests |
| Region Issues | `UnrecognizedClientException` | Use supported region (us-west-2) |
| Permissions | `AccessDenied`, `not authorized` | Update IAM permissions |
| Model Access | `don't have access`, `ValidationException` | Request model access in AWS Console |
| Authentication | `security token`, `SignatureDoesNotMatch` | Check credentials, verify region |
|----------------|-----------|----------|
| Error Category | Detection | Solution |

## 📊 Error Categories and Solutions

4. **Verify fixes**: Re-run diagnostics
5. **Test specific scenarios**: Use interactive CLI
6. **Check troubleshooting guide**: Review `BEDROCK-TROUBLESHOOTING.md`
7. **Run full diagnostics**: `npm run debug:bedrock:full`

### Troubleshooting Issues

3. **Verbose analysis**: `npm run ai:bedrock -- --log`
4. **Model comparison**: Use `testall` command in CLI
5. **Interactive testing**: `npm run bedrock:cli`

### During Development

3. **Quick connectivity check**: `npm run bedrock:test`
4. **Test Bedrock access**: `npm run debug:bedrock:full`
5. **Verify credentials**: `npm run debug:aws`

### Before Running AI Analysis

## 🔄 Testing Workflow

- ✅ Quick resolution paths
- ✅ Success/failure statistics
- ✅ Verbose logging options
- ✅ Clear progress indicators

### User Experience

- ✅ Best practices and examples
- ✅ Common issue resolution
- ✅ Step-by-step setup instructions
- ✅ Comprehensive troubleshooting guide

### Documentation

- ✅ Real-time feedback
- ✅ Batch model testing
- ✅ Interactive testing capabilities
- ✅ Multi-level diagnostic tools

### Debugging Tools

- ✅ Clear setup instructions
- ✅ Proper credential validation
- ✅ Support for AWS profiles
- ✅ Support for environment variables

### Credential Management

- ✅ Fallback error recovery
- ✅ Comprehensive troubleshooting guidance
- ✅ Detailed AWS SDK error parsing
- ✅ Specific error messages with actionable solutions

### Error Handling

## 🎯 Key Improvements

5. **Verify with real analysis**: `npm run ai:bedrock -- --log`
6. **Test with CLI**: `npm run bedrock:cli`
7. **Follow suggested solutions**
8. **Check specific issues** in the output
9. **Run diagnostics**: `npm run debug:bedrock:full`

### Error Resolution Workflow

```sh
AWS_PROFILE=default npm run ai:bedrock -- --log
# Test with verbose logging

export AWS_PROFILE="default"
# Option 2: AWS Profile

export AWS_REGION="us-west-2"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_ACCESS_KEY_ID="your-key"
# Option 1: Environment variables
```bash

```

npm run bedrock:cli

# Interactive testing

npm run bedrock:test

# Quick connectivity test

npm run debug:bedrock:full

# Run comprehensive diagnostics

```bash

## 🚀 Usage Examples

- **Environment Configuration** - Credential setup options
- **Debug Commands** - All available debugging tools
- **Troubleshooting** - Quick reference and links
- **AWS Bedrock Setup** - Complete setup instructions
#### Enhanced Sections


- Response format issues
- Network connectivity
- Rate limiting
- Region availability
- Permission problems
- Model access issues
- Authentication errors
#### Coverage

- **Advanced Troubleshooting** - Expert-level debugging
- **Environment Setup Examples** - Configuration templates
- **Recommended Models** - Model selection guidance
- **Debug Commands Reference** - Complete command guide
- **Common Issues and Solutions** - Detailed problem/solution pairs
- **Quick Diagnosis** - Immediate troubleshooting steps
#### Sections


## 📚 Documentation Enhancements

```

}
"bedrock:test": "node bedrock-cli.js quick"
"bedrock:cli": "node bedrock-cli.js",
"debug:aws": "aws sts get-caller-identity && aws bedrock list-foundation-models --region us-west-2",
"debug:bedrock:full": "node debug-bedrock-enhanced.js",
"debug:bedrock": "node debug-bedrock.js",
{

```json
#### New Debug Commands


```

node bedrock-cli.js quick
node bedrock-cli.js testall "Analyze this"
node bedrock-cli.js test "Hello world"

# Command line mode

npm run bedrock:cli

# Interactive mode

```bash
#### CLI Usage Examples

```

exit              # Exit tool
help              # Show help menu
quick             # Quick connectivity test
models            # List available models
model <number>    # Switch model
testall <prompt>  # Test all models
test <prompt>     # Test current model

```bash
#### Commands

- **Command-Line Interface** - Single commands for quick testing
- **Batch Testing** - Test all available models with one command
- **Model Switching** - Easy switching between different models
- **Interactive Mode** - Real-time testing and exploration
#### Features


- Service unavailability
- Rate limiting
- Region availability
- Permission errors
- Model access problems
- Authentication issues
#### Error Categorization

  - Meta Llama models (when available)
  - Cohere Command models
  - AI21 Jurassic models
  - Amazon Titan models
  - Anthropic Claude models
- Tests 6 different model types:
#### Test Coverage

- **Summary and Recommendations** - Actionable troubleshooting steps
- **Detailed Error Analysis** - Specific suggestions for each error type
- **Model Invocation Testing** - Tests multiple models with different formats
- **Bedrock Service Access** - Lists available models and regions
- **Authentication Testing** - Uses STS to verify credentials
- **AWS File Validation** - Examines ~/.aws/credentials and ~/.aws/config
- **Environment Variable Analysis** - Checks all AWS-related env vars
#### Features

A comprehensive class-based debugging tool with:


## 🔍 New Debugging Tools

- Enhanced error handling for consolidation and file saving
- Comprehensive logging and status reporting
- Better error recovery with fallback messages
- Success/error counting with detailed statistics
- Progress tracking during analysis
#### Improved `bedrockFailedTestSummary()`


- Raw error logging for developers
- Response validation and character count reporting
- Request attempt logging with model, region, and prompt details
#### Verbose Logging

- Improved error messages with setup instructions
- Proper credential validation before API calls
- Supports both environment variables and AWS profiles
#### Enhanced Credential Handling

  - Model response format issues
  - Network connectivity problems
  - Rate limiting and quota issues
  - Region configuration issues
  - Permission errors (AccessDenied, not authorized)
  - Model access errors (ValidationException, access denied)
  - Authentication errors (SignatureDoesNotMatch, security token issues)
- Covers all common error scenarios:
- `getDetailedBedrockErrorMessage()` - Provides specific error diagnosis and actionable solutions
#### Detailed Error Analysis Function

```

}
Code?: string;
};
requestId?: string;
httpStatusCode?: number;
$metadata?: {
name?: string;
message: string;
interface BedrockError {

```typescript
#### Enhanced Error Interface


## 🛠️ Enhanced Components

This document summarizes the comprehensive debugging and error handling improvements added to the AWS Bedrock integration in the AI Test Reporter.

## Overview
 🔧 Bedrock Debugging Enhancements Summary
```