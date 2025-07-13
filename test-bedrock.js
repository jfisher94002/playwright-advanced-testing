#!/usr/bin/env node

const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');
const { BedrockClient, ListFoundationModelsCommand } = require('@aws-sdk/client-bedrock');

async function testBedrockConnection() {
    console.log('🔧 Testing AWS Bedrock Connection...');
    console.log('Region:', process.env.AWS_REGION || 'us-west-2');
    
    const client = new BedrockClient({
        region: process.env.AWS_REGION || 'us-west-2'
    });

    try {
        // Test connection by listing available models
        const command = new ListFoundationModelsCommand({});
        const response = await client.send(command);
        
        console.log('✅ Successfully connected to AWS Bedrock!');
        console.log(`📊 Found ${response.modelSummaries?.length || 0} available models`);
        
        // Show first few Claude models
        const claudeModels = response.modelSummaries?.filter(model => 
            model.modelId?.includes('anthropic.claude')
        ).slice(0, 3);
        
        if (claudeModels?.length) {
            console.log('\n🤖 Available Claude Models (first 3):');
            claudeModels.forEach(model => {
                console.log(`  - ${model.modelId} (${model.modelName})`);
            });
        }
        
        return true;
    } catch (error) {
        console.error('❌ Failed to connect to AWS Bedrock:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Check your AWS credentials in ~/.aws/credentials');
        console.log('2. Ensure your AWS account has Bedrock access');
        console.log('3. Verify the region (us-west-2) has Bedrock available');
        console.log('4. Check if you need to request model access in AWS Console');
        return false;
    }
}

testBedrockConnection();
