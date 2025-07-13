#!/usr/bin/env node

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { BedrockClient, ListFoundationModelsCommand } = require('@aws-sdk/client-bedrock');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');

async function debugBedrockSetup() {
    console.log('🔧 AWS Bedrock Debug Information');
    console.log('=' .repeat(50));
    
    // 1. Check environment variables
    console.log('\n📋 Environment Variables:');
    console.log(`AWS_REGION: ${process.env.AWS_REGION || 'not set'}`);
    console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'set' : 'not set'}`);
    console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'set' : 'not set'}`);
    console.log(`AWS_SESSION_TOKEN: ${process.env.AWS_SESSION_TOKEN ? 'set' : 'not set'}`);
    
    // 2. Check AWS credentials file
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    
    const credentialsPath = path.join(os.homedir(), '.aws', 'credentials');
    const configPath = path.join(os.homedir(), '.aws', 'config');
    
    console.log('\n📁 AWS Files:');
    console.log(`Credentials file: ${fs.existsSync(credentialsPath) ? '✅ exists' : '❌ missing'}`);
    console.log(`Config file: ${fs.existsSync(configPath) ? '✅ exists' : '❌ missing'}`);
    
    if (fs.existsSync(credentialsPath)) {
        const credContent = fs.readFileSync(credentialsPath, 'utf8');
        const hasDefault = credContent.includes('[default]');
        const hasAccessKey = credContent.includes('aws_access_key_id');
        const hasSecretKey = credContent.includes('aws_secret_access_key');
        console.log(`  - Has [default] profile: ${hasDefault ? '✅' : '❌'}`);
        console.log(`  - Has access key: ${hasAccessKey ? '✅' : '❌'}`);
        console.log(`  - Has secret key: ${hasSecretKey ? '✅' : '❌'}`);
    }
    
    // 3. Test AWS STS (identity verification)
    console.log('\n🔐 Testing AWS Identity (STS):');
    const stsClient = new STSClient({
        region: process.env.AWS_REGION || 'us-west-2'
    });
    
    try {
        const identity = await stsClient.send(new GetCallerIdentityCommand({}));
        console.log('✅ Successfully authenticated with AWS');
        console.log(`  - Account: ${identity.Account}`);
        console.log(`  - User ARN: ${identity.Arn}`);
        console.log(`  - User ID: ${identity.UserId}`);
    } catch (error) {
        console.error('❌ AWS Authentication failed:', error.message);
        console.log('💡 This suggests credential issues');
        return;
    }
    
    // 4. Test Bedrock service availability
    console.log('\n🏗️ Testing Bedrock Service Access:');
    const bedrockClient = new BedrockClient({
        region: process.env.AWS_REGION || 'us-west-2'
    });
    
    try {
        const models = await bedrockClient.send(new ListFoundationModelsCommand({}));
        console.log('✅ Successfully accessed Bedrock service');
        console.log(`  - Available models: ${models.modelSummaries?.length || 0}`);
        
        // Show some Claude models
        const claudeModels = models.modelSummaries?.filter(m => m.modelId?.includes('claude')).slice(0, 3);
        if (claudeModels?.length) {
            console.log('  - Claude models available:');
            claudeModels.forEach(model => {
                console.log(`    * ${model.modelId}`);
            });
        }
    } catch (error) {
        console.error('❌ Bedrock service access failed:', error.message);
        console.log('💡 Error details:', {
            code: error.name,
            statusCode: error.$metadata?.httpStatusCode,
            requestId: error.$metadata?.requestId
        });
        
        if (error.message.includes('security token')) {
            console.log('\n🚨 Security Token Issues:');
            console.log('- Your credentials might be expired');
            console.log('- You might be using temporary credentials that expired');
            console.log('- The credentials might not have Bedrock permissions');
        }
        
        if (error.message.includes('not authorized') || error.message.includes('AccessDenied')) {
            console.log('\n🚨 Access Denied Issues:');
            console.log('- Your AWS account might not have Bedrock enabled');
            console.log('- Your IAM user/role might not have Bedrock permissions');
            console.log('- You might need to request model access in AWS Console');
        }
        return;
    }
    
    // 5. Test actual Bedrock Runtime (invoke a model)
    console.log('\n🤖 Testing Bedrock Runtime (Model Invocation):');
    const runtimeClient = new BedrockRuntimeClient({
        region: process.env.AWS_REGION || 'us-west-2'
    });
    
    const testModelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
    const testPrompt = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 100,
        messages: [
            {
                role: "user",
                content: "Hello, can you respond with just 'Bedrock test successful'?"
            }
        ]
    };
    
    try {
        const command = new InvokeModelCommand({
            modelId: testModelId,
            body: JSON.stringify(testPrompt),
            contentType: "application/json",
            accept: "application/json"
        });
        
        const response = await runtimeClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const aiResponse = responseBody.content?.[0]?.text || 'No response text';
        
        console.log('✅ Successfully invoked Bedrock model!');
        console.log(`  - Model: ${testModelId}`);
        console.log(`  - Response: ${aiResponse.substring(0, 100)}...`);
        
    } catch (error) {
        console.error('❌ Bedrock model invocation failed:', error.message);
        console.log('💡 Error details:', {
            code: error.name,
            statusCode: error.$metadata?.httpStatusCode,
            requestId: error.$metadata?.requestId
        });
        
        if (error.message.includes('don\'t have access') || error.message.includes('ValidationException')) {
            console.log('\n🚨 Model Access Issues:');
            console.log('- You might need to request access to Claude models');
            console.log('- Go to AWS Console > Bedrock > Model access');
            console.log('- Request access to Anthropic Claude models');
        }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('🔍 Debug completed. Check the messages above for issues.');
}

// Add STS client dependency check
try {
    require('@aws-sdk/client-sts');
} catch (error) {
    console.log('Installing @aws-sdk/client-sts for debugging...');
    require('child_process').execSync('npm install @aws-sdk/client-sts', { stdio: 'inherit' });
}

debugBedrockSetup();
