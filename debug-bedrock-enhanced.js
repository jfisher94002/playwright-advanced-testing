#!/usr/bin/env node

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { BedrockClient, ListFoundationModelsCommand, GetFoundationModelCommand } = require('@aws-sdk/client-bedrock');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Configuration
const DEFAULT_REGION = 'us-west-2';
const TEST_MODELS = [
    'anthropic.claude-3-sonnet-20240229-v1:0',
    'anthropic.claude-3-haiku-20240307-v1:0',
    'anthropic.claude-instant-v1',
    'amazon.titan-text-express-v1',
    'ai21.j2-ultra-v1',
    'cohere.command-text-v14'
];

class BedrockDebugger {
    constructor() {
        this.region = process.env.AWS_REGION || DEFAULT_REGION;
        this.hasCredentials = false;
        this.isAuthenticated = false;
        this.canAccessBedrock = false;
        this.availableModels = [];
        this.errors = [];
    }

    log(message, type = 'info') {
        const emoji = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️',
            debug: '🔧'
        };
        console.log(`${emoji[type]} ${message}`);
    }

    logSection(title) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔍 ${title}`);
        console.log(`${'='.repeat(60)}`);
    }

    async checkEnvironmentVariables() {
        this.logSection('Environment Variables');
        
        const envVars = [
            { name: 'AWS_REGION', value: process.env.AWS_REGION, required: false },
            { name: 'AWS_ACCESS_KEY_ID', value: process.env.AWS_ACCESS_KEY_ID, required: true, mask: true },
            { name: 'AWS_SECRET_ACCESS_KEY', value: process.env.AWS_SECRET_ACCESS_KEY, required: true, mask: true },
            { name: 'AWS_SESSION_TOKEN', value: process.env.AWS_SESSION_TOKEN, required: false, mask: true },
            { name: 'AWS_PROFILE', value: process.env.AWS_PROFILE, required: false }
        ];

        let hasRequiredVars = true;
        
        for (const envVar of envVars) {
            let displayValue = 'not set';
            if (envVar.value) {
                displayValue = envVar.mask ? 
                    `set (${envVar.value.length} chars)` : envVar.value;
            } else if (envVar.required) {
                hasRequiredVars = false;
            }
            
            const status = envVar.value ? '✅' : (envVar.required ? '❌' : '⚪');
            console.log(`${status} ${envVar.name}: ${displayValue}`);
        }

        this.hasCredentials = hasRequiredVars || process.env.AWS_PROFILE;
        
        if (!this.hasCredentials) {
            this.log('Missing required AWS credentials!', 'error');
            this.log('Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, or configure AWS_PROFILE', 'warning');
        }
        
        this.log(`Using region: ${this.region}`, 'info');
        return this.hasCredentials;
    }

    async checkAwsFiles() {
        this.logSection('AWS Configuration Files');
        
        const credentialsPath = path.join(os.homedir(), '.aws', 'credentials');
        const configPath = path.join(os.homedir(), '.aws', 'config');
        
        // Check credentials file
        if (fs.existsSync(credentialsPath)) {
            this.log('Credentials file exists', 'success');
            try {
                const credContent = fs.readFileSync(credentialsPath, 'utf8');
                const profiles = credContent.match(/\[([^\]]+)\]/g) || [];
                this.log(`Found profiles: ${profiles.join(', ')}`, 'info');
                
                const hasDefault = credContent.includes('[default]');
                const hasAccessKey = credContent.includes('aws_access_key_id');
                const hasSecretKey = credContent.includes('aws_secret_access_key');
                
                console.log(`   - Has [default] profile: ${hasDefault ? '✅' : '❌'}`);
                console.log(`   - Has access key: ${hasAccessKey ? '✅' : '❌'}`);
                console.log(`   - Has secret key: ${hasSecretKey ? '✅' : '❌'}`);
            } catch (error) {
                this.log(`Error reading credentials file: ${error.message}`, 'error');
            }
        } else {
            this.log('Credentials file missing', 'warning');
        }
        
        // Check config file
        if (fs.existsSync(configPath)) {
            this.log('Config file exists', 'success');
            try {
                const configContent = fs.readFileSync(configPath, 'utf8');
                const regionMatch = configContent.match(/region\s*=\s*([^\s\n]+)/);
                if (regionMatch) {
                    this.log(`Config file region: ${regionMatch[1]}`, 'info');
                }
            } catch (error) {
                this.log(`Error reading config file: ${error.message}`, 'error');
            }
        } else {
            this.log('Config file missing', 'warning');
        }
    }

    async testAuthentication() {
        this.logSection('AWS Authentication Test');
        
        if (!this.hasCredentials) {
            this.log('Skipping authentication test - no credentials found', 'warning');
            return false;
        }

        const stsClient = new STSClient({ region: this.region });
        
        try {
            const identity = await stsClient.send(new GetCallerIdentityCommand({}));
            this.log('Successfully authenticated with AWS', 'success');
            console.log(`   - Account: ${identity.Account}`);
            console.log(`   - User ARN: ${identity.Arn}`);
            console.log(`   - User ID: ${identity.UserId}`);
            this.isAuthenticated = true;
        } catch (error) {
            this.log(`Authentication failed: ${error.message}`, 'error');
            this.errors.push({
                section: 'Authentication',
                error: error.message,
                suggestion: 'Check AWS credentials and region settings'
            });
            this.isAuthenticated = false;
        }
        
        return this.isAuthenticated;
    }

    async testBedrockAccess() {
        this.logSection('Bedrock Service Access Test');
        
        if (!this.isAuthenticated) {
            this.log('Skipping Bedrock test - authentication failed', 'warning');
            return false;
        }

        const bedrockClient = new BedrockClient({ region: this.region });
        
        try {
            const models = await bedrockClient.send(new ListFoundationModelsCommand({}));
            this.log('Successfully accessed Bedrock service', 'success');
            this.availableModels = models.modelSummaries || [];
            this.log(`Available models: ${this.availableModels.length}`, 'info');
            
            // Show Claude models specifically
            const claudeModels = this.availableModels.filter(m => m.modelId?.includes('claude'));
            if (claudeModels.length > 0) {
                this.log('Claude models available:', 'success');
                claudeModels.slice(0, 5).forEach(model => {
                    console.log(`   - ${model.modelId} (${model.modelLifecycle?.status || 'unknown status'})`);
                });
            } else {
                this.log('No Claude models found - may need to request access', 'warning');
            }
            
            this.canAccessBedrock = true;
        } catch (error) {
            this.log(`Bedrock access failed: ${error.message}`, 'error');
            this.errors.push({
                section: 'Bedrock Access',
                error: error.message,
                suggestion: this.getBedrockErrorSuggestion(error)
            });
            this.canAccessBedrock = false;
        }
        
        return this.canAccessBedrock;
    }

    async testModelInvocation() {
        this.logSection('Model Invocation Test');
        
        if (!this.canAccessBedrock) {
            this.log('Skipping model test - Bedrock access failed', 'warning');
            return false;
        }

        const runtimeClient = new BedrockRuntimeClient({ region: this.region });
        let successfulModels = 0;
        
        for (const modelId of TEST_MODELS) {
            // Check if model is available
            const isAvailable = this.availableModels.some(m => m.modelId === modelId);
            if (!isAvailable) {
                this.log(`Skipping ${modelId} - not available in region`, 'warning');
                continue;
            }
            
            try {
                this.log(`Testing ${modelId}...`, 'info');
                
                const requestBody = this.buildRequestBody(modelId);
                const command = new InvokeModelCommand({
                    modelId,
                    body: JSON.stringify(requestBody),
                    contentType: "application/json",
                    accept: "application/json"
                });
                
                const response = await runtimeClient.send(command);
                const responseBody = JSON.parse(new TextDecoder().decode(response.body));
                const aiResponse = this.parseResponse(modelId, responseBody);
                
                if (aiResponse) {
                    this.log(`✅ ${modelId} - SUCCESS`, 'success');
                    console.log(`   Response: ${aiResponse.substring(0, 100)}...`);
                    successfulModels++;
                } else {
                    this.log(`❌ ${modelId} - Empty response`, 'error');
                }
                
            } catch (error) {
                this.log(`❌ ${modelId} - ${error.message}`, 'error');
                this.errors.push({
                    section: 'Model Invocation',
                    model: modelId,
                    error: error.message,
                    suggestion: this.getModelErrorSuggestion(error, modelId)
                });
            }
        }
        
        this.log(`Successfully tested ${successfulModels} models`, successfulModels > 0 ? 'success' : 'error');
        return successfulModels > 0;
    }

    buildRequestBody(modelId) {
        const basePrompt = "Hello, respond with 'Bedrock test successful'";
        
        if (modelId.includes('anthropic.claude')) {
            return {
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 50,
                messages: [{ role: "user", content: basePrompt }]
            };
        } else if (modelId.includes('amazon.titan')) {
            return {
                inputText: basePrompt,
                textGenerationConfig: { maxTokenCount: 50, temperature: 0.7 }
            };
        } else if (modelId.includes('ai21.j2')) {
            return {
                prompt: basePrompt,
                maxTokens: 50,
                temperature: 0.7
            };
        } else if (modelId.includes('cohere.command')) {
            return {
                prompt: basePrompt,
                max_tokens: 50,
                temperature: 0.7
            };
        }
        
        // Default to Claude format
        return {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 50,
            messages: [{ role: "user", content: basePrompt }]
        };
    }

    parseResponse(modelId, responseBody) {
        if (modelId.includes('anthropic.claude')) {
            return responseBody.content?.[0]?.text || '';
        } else if (modelId.includes('amazon.titan')) {
            return responseBody.results?.[0]?.outputText || '';
        } else if (modelId.includes('ai21.j2')) {
            return responseBody.completions?.[0]?.data?.text || '';
        } else if (modelId.includes('cohere.command')) {
            return responseBody.generations?.[0]?.text || '';
        }
        
        return responseBody.content?.[0]?.text || responseBody.generation || responseBody.text || '';
    }

    getBedrockErrorSuggestion(error) {
        if (error.message.includes('not authorized') || error.message.includes('AccessDenied')) {
            return 'Request Bedrock access in AWS Console > Bedrock > Model access';
        } else if (error.message.includes('security token')) {
            return 'Check if AWS credentials are valid and not expired';
        } else if (error.message.includes('region')) {
            return `Try a different region - Bedrock is available in: us-east-1, us-west-2, eu-west-3`;
        }
        return 'Check AWS permissions and Bedrock service availability';
    }

    getModelErrorSuggestion(error, modelId) {
        if (error.message.includes('don\'t have access') || error.message.includes('ValidationException')) {
            return `Request access to ${modelId} in AWS Console > Bedrock > Model access`;
        } else if (error.message.includes('ThrottlingException')) {
            return 'You\'ve hit rate limits - wait a few minutes and try again';
        }
        return 'Check model availability and access permissions';
    }

    printSummaryAndRecommendations() {
        this.logSection('Summary and Recommendations');
        
        // Overall status
        const overallStatus = this.isAuthenticated && this.canAccessBedrock;
        this.log(`Overall Bedrock Status: ${overallStatus ? 'READY' : 'NOT READY'}`, 
                 overallStatus ? 'success' : 'error');
        
        // Detailed recommendations
        if (this.errors.length > 0) {
            console.log('\n🚨 Issues Found:');
            this.errors.forEach((err, index) => {
                console.log(`\n${index + 1}. ${err.section}${err.model ? ` (${err.model})` : ''}`);
                console.log(`   Error: ${err.error}`);
                console.log(`   💡 Suggestion: ${err.suggestion}`);
            });
        }
        
        // Quick fixes
        console.log('\n💡 Quick Setup Commands:');
        console.log('# Set up credentials:');
        console.log('export AWS_ACCESS_KEY_ID="your-access-key"');
        console.log('export AWS_SECRET_ACCESS_KEY="your-secret-key"');
        console.log(`export AWS_REGION="${this.region}"`);
        console.log('\n# Or configure AWS CLI:');
        console.log('aws configure');
        console.log('\n# Test authentication:');
        console.log('aws sts get-caller-identity');
        console.log('\n# List Bedrock models:');
        console.log('aws bedrock list-foundation-models --region us-west-2');
        
        if (!overallStatus) {
            console.log('\n🔗 Helpful Links:');
            console.log('• AWS Bedrock Console: https://console.aws.amazon.com/bedrock/');
            console.log('• Model Access Request: https://console.aws.amazon.com/bedrock/home#/modelaccess');
            console.log('• AWS CLI Setup: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html');
        }
    }

    async run() {
        console.log('🧪 Comprehensive AWS Bedrock Debug Tool');
        console.log('🎯 This tool will help diagnose Bedrock integration issues\n');
        
        await this.checkEnvironmentVariables();
        await this.checkAwsFiles();
        await this.testAuthentication();
        await this.testBedrockAccess();
        await this.testModelInvocation();
        this.printSummaryAndRecommendations();
        
        console.log('\n✨ Debug completed! Use the information above to fix any issues.');
    }
}

// Run the debugger
if (require.main === module) {
    const bedrockDebugger = new BedrockDebugger();
    bedrockDebugger.run().catch(error => {
        console.error('❌ Debug tool crashed:', error);
        process.exit(1);
    });
}

module.exports = BedrockDebugger;
