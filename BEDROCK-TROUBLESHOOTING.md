# 

If you see AI analysis results in your CTRF report, Bedrock integration is working correctly!

```sh
cat test-results/ctrf-report.json | grep -A 5 '"ai":'
# 4. Check the results

npm run test:bedrock
# 3. Run a simple AI analysis

npm run debug:bedrock
# 2. Test Bedrock access

aws sts get-caller-identity
# 1. Test authentication
```bash

After fixing issues, verify everything works:

## Success Verification

```

set AWS_REGION=us-west-2
set AWS_SECRET_ACCESS_KEY=...
set AWS_ACCESS_KEY_ID=AKIA...

```cmd

```

region = us-west-2
[profile bedrock-user]

output = json
region = us-west-2
[default]

```ini

```

aws_secret_access_key = ...
aws_access_key_id = AKIA...
[bedrock-user]

aws_secret_access_key = ...
aws_access_key_id = AKIA...
[default]

```ini

## Common Configuration Files

   - [AWS Community Forums](https://forums.aws.amazon.com/)
   - [AWS Bedrock FAQs](https://aws.amazon.com/bedrock/faqs/)
   - [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
4. **Community Resources:**

   - For model access requests
   - For service limit increases
   - For account/billing issues
3. **AWS Support:**

2. **Check AWS CloudTrail logs** for detailed API call information

```

npm run debug:bedrock:full

```bash
1. **Run the debug script first:**

## Getting Help

```

npm run ai:bedrock -- --max-messages 3

```bash

```

npm run ai:bedrock -- --system-prompt "Analyze this test failure concisely"

```bash

```

npm run ai:bedrock -- --model anthropic.claude-3-haiku-20240307-v1:0 --log

```bash

```

npm run ai:bedrock -- --log

```bash

## Advanced Troubleshooting

```

ENV AWS_REGION=us-west-2
ENV AWS_SECRET_ACCESS_KEY=your-secret
ENV AWS_ACCESS_KEY_ID=your-key

```dockerfile

```

AWS_REGION: us-west-2
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
env:

# GitHub Actions

```yaml

```

AI_PROVIDER=bedrock
AWS_REGION=us-west-2
AWS_SECRET_ACCESS_KEY=xxx...
AWS_ACCESS_KEY_ID=AKIA...

# .env file

```bash

## Environment Setup Examples

- `cohere.command-text-v14`
- `ai21.j2-ultra-v1`
- `amazon.titan-text-express-v1`

- `anthropic.claude-3-opus-20240229-v1:0`
- `anthropic.claude-3-sonnet-20240229-v1:0` (default)

- `anthropic.claude-instant-v1`
- `anthropic.claude-3-haiku-20240307-v1:0`

## Recommended Models by Use Case

| `aws bedrock list-foundation-models` | List available models |
| `aws sts get-caller-identity` | Verify AWS authentication |
| `npm run debug:aws` | Test AWS authentication and list models |
| `npm run debug:bedrock` | Basic Bedrock connectivity test |
| `npm run debug:bedrock:full` | Comprehensive Bedrock diagnostics |
|---------|---------|
| Command | Purpose |

## Debug Commands Reference

```

npm run ai:bedrock -- --max-tokens 300 --temperature 0.7

```bash
3. **Verify model parameters:**

```

aws bedrock list-foundation-models --region us-west-2 | grep claude

```bash
2. **Check model availability:**

```

npm run ai:bedrock -- --model anthropic.claude-3-haiku-20240307-v1:0

```bash
1. **Try different model:**
**Solutions:**

- Parsing errors
- `ResponseBody is not valid JSON`
- Empty AI responses
**Symptoms:**


4. Check AWS service status
3. Try different region
2. Verify corporate firewall/proxy settings
1. Check internet connection
**Solutions:**

- `Connection timeout`
- `TimeoutError`
- `NetworkingError`
**Symptoms:**


```

npm run ai:bedrock -- --max-messages 5

# Test with limited messages

```bash

3. **Request quota increase:** In AWS Console > Service Quotas > Amazon Bedrock
2. **Reduce concurrent requests:** Use `--max-messages` parameter
1. **Wait and retry:** Rate limits reset over time
**Solutions:**

- `TooManyRequestsException`
- `ServiceQuotaExceededException`
- `ThrottlingException`
**Symptoms:**


```

aws bedrock list-foundation-models --region us-west-2

```bash
**Verify region support:**

```

export AWS_REGION="eu-west-3"  # For EU users

# OR

export AWS_REGION="us-east-1"  # Alternative

# OR

export AWS_REGION="us-west-2"  # Recommended - most models available

```bash

Use a supported region for Bedrock:
**Solution:**

- `UnrecognizedClientException`
- `The model is not available in the region`
- `InvalidParameterValueException`
**Symptoms:**


```

}
]
}
"Resource": "*"
],
"bedrock:ListFoundationModels"
"bedrock:GetFoundationModel",
"bedrock:InvokeModel",
"Action": [
"Effect": "Allow",
{
"Statement": [
"Version": "2012-10-17",
{

```json

Ensure your IAM user/role has these permissions:
**Solution:**

- `User is not authorized`
- `not authorized to perform`
- `AccessDenied`
**Symptoms:**


**Note:** Some models require approval and may take time to activate.

   - Meta Llama models
   - Cohere Command models
   - AI21 Jurassic models
   - Amazon Titan models
   - Anthropic Claude 3 models
4. Enable access for the models you want to use:
3. Click "Request model access"
2. Navigate to "Model access" in the left sidebar
1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
**Solution:**

- `You don't have access to the requested model`
- `ValidationException`
- `don't have access to the model`
**Symptoms:**


```

aws sts get-caller-identity

```bash
**Verify Authentication:**

```

# Follow prompts to enter credentials and region

aws configure

```bash
#### Option C: AWS CLI Setup

```

region = us-west-2
[default]

# Create/edit ~/.aws/config

aws_secret_access_key = your-secret-key-here
aws_access_key_id = your-access-key-here
[default]

# Create/edit ~/.aws/credentials

```bash
#### Option B: AWS Credentials File

```

export AWS_REGION="us-west-2"
export AWS_SECRET_ACCESS_KEY="your-secret-key-here"
export AWS_ACCESS_KEY_ID="your-access-key-here"

```bash
#### Option A: Environment Variables

**Solutions:**

- `UnrecognizedClientException`
- `security token`
- `InvalidUserID.NotFound`
- `SignatureDoesNotMatch`
**Symptoms:**


## Common Issues and Solutions

```

npm run debug:bedrock

```bash

Or use the basic debug script:

```

npm run debug:bedrock:full

```bash

Run the comprehensive debug script to identify issues:

## Quick Diagnosis

This guide helps you diagnose and fix common issues with AWS Bedrock integration in the AI Test Reporter.
 AWS Bedrock Troubleshooting Guide
```