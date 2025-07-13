#!/usr/bin/env node

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const readline = require('readline');

class BedrockCLI {
    constructor() {
        this.region = process.env.AWS_REGION || 'us-west-2';
        this.client = new BedrockRuntimeClient({ region: this.region });
        this.models = [
            'anthropic.claude-3-sonnet-20240229-v1:0',
            'anthropic.claude-3-haiku-20240307-v1:0',
            'anthropic.claude-instant-v1',
            'amazon.titan-text-express-v1',
            'ai21.j2-ultra-v1',
            'cohere.command-text-v14'
        ];
        this.currentModel = this.models[0];
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async testModel(prompt, modelId = this.currentModel) {
        try {
            console.log(`\n🤖 Testing ${modelId}...`);
            
            let requestBody;
            
            if (modelId.includes('anthropic.claude')) {
                requestBody = {
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: 200,
                    messages: [{ role: "user", content: prompt }]
                };
            } else if (modelId.includes('amazon.titan')) {
                requestBody = {
                    inputText: prompt,
                    textGenerationConfig: { maxTokenCount: 200, temperature: 0.7 }
                };
            } else if (modelId.includes('ai21.j2')) {
                requestBody = {
                    prompt: prompt,
                    maxTokens: 200,
                    temperature: 0.7
                };
            } else if (modelId.includes('cohere.command')) {
                requestBody = {
                    prompt: prompt,
                    max_tokens: 200,
                    temperature: 0.7
                };
            } else {
                // Default to Claude format
                requestBody = {
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: 200,
                    messages: [{ role: "user", content: prompt }]
                };
            }

            const command = new InvokeModelCommand({
                modelId,
                body: JSON.stringify(requestBody),
                contentType: "application/json",
                accept: "application/json"
            });

            const response = await this.client.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            
            let aiResponse;
            if (modelId.includes('anthropic.claude')) {
                aiResponse = responseBody.content?.[0]?.text || 'No response';
            } else if (modelId.includes('amazon.titan')) {
                aiResponse = responseBody.results?.[0]?.outputText || 'No response';
            } else if (modelId.includes('ai21.j2')) {
                aiResponse = responseBody.completions?.[0]?.data?.text || 'No response';
            } else if (modelId.includes('cohere.command')) {
                aiResponse = responseBody.generations?.[0]?.text || 'No response';
            } else {
                aiResponse = responseBody.content?.[0]?.text || responseBody.generation || 'No response';
            }
            
            console.log(`✅ Response: ${aiResponse}\n`);
            return true;
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}\n`);
            return false;
        }
    }

    async testAllModels(prompt) {
        console.log(`\n🧪 Testing all models with prompt: "${prompt}"\n`);
        let successCount = 0;
        
        for (const model of this.models) {
            const success = await this.testModel(prompt, model);
            if (success) successCount++;
            
            // Add delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`📊 Results: ${successCount}/${this.models.length} models successful\n`);
    }

    showMenu() {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 Bedrock Interactive CLI Test Tool');
        console.log('='.repeat(60));
        console.log(`Current Region: ${this.region}`);
        console.log(`Current Model: ${this.currentModel}`);
        console.log('\nCommands:');
        console.log('  test <prompt>     - Test current model with a prompt');
        console.log('  testall <prompt>  - Test all models with a prompt');
        console.log('  model <number>    - Switch model (1-6)');
        console.log('  models            - List available models');
        console.log('  quick             - Run quick connectivity test');
        console.log('  help              - Show this menu');
        console.log('  exit              - Exit the tool');
        console.log('');
    }

    listModels() {
        console.log('\n📋 Available Models:');
        this.models.forEach((model, index) => {
            const marker = model === this.currentModel ? '👉' : '  ';
            console.log(`${marker} ${index + 1}. ${model}`);
        });
        console.log('');
    }

    switchModel(number) {
        const index = parseInt(number) - 1;
        if (index >= 0 && index < this.models.length) {
            this.currentModel = this.models[index];
            console.log(`✅ Switched to: ${this.currentModel}\n`);
        } else {
            console.log(`❌ Invalid model number. Use 1-${this.models.length}\n`);
        }
    }

    async quickTest() {
        console.log('\n⚡ Running quick connectivity test...\n');
        await this.testModel('Hello, please respond with "Bedrock test successful"');
    }

    async processCommand(input) {
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        switch (command) {
            case 'test':
                if (args) {
                    await this.testModel(args);
                } else {
                    console.log('❌ Please provide a prompt. Example: test Hello world\n');
                }
                break;
                
            case 'testall':
                if (args) {
                    await this.testAllModels(args);
                } else {
                    console.log('❌ Please provide a prompt. Example: testall Hello world\n');
                }
                break;
                
            case 'model':
                if (args) {
                    this.switchModel(args);
                } else {
                    console.log('❌ Please provide model number. Example: model 2\n');
                }
                break;
                
            case 'models':
                this.listModels();
                break;
                
            case 'quick':
                await this.quickTest();
                break;
                
            case 'help':
                this.showMenu();
                break;
                
            case 'exit':
            case 'quit':
                console.log('👋 Goodbye!');
                this.rl.close();
                return;
                
            default:
                if (input.trim()) {
                    console.log('❌ Unknown command. Type "help" for available commands.\n');
                }
                break;
        }
        
        this.prompt();
    }

    prompt() {
        this.rl.question('bedrock> ', (input) => {
            this.processCommand(input);
        });
    }

    async start() {
        console.log('🔧 Initializing Bedrock CLI...\n');
        
        // Test initial connection
        console.log('🔍 Testing initial connection...');
        const success = await this.testModel('Hello', this.currentModel);
        
        if (success) {
            console.log('✅ Bedrock connection successful!');
            this.showMenu();
            this.prompt();
        } else {
            console.log('❌ Initial connection failed. Please check your configuration.');
            console.log('💡 Run "npm run debug:bedrock:full" for detailed diagnostics.\n');
            this.rl.close();
        }
    }
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.length > 0) {
    const cli = new BedrockCLI();
    const command = args[0];
    const prompt = args.slice(1).join(' ');
    
    if (command === 'test' && prompt) {
        cli.testModel(prompt).then(() => process.exit(0));
    } else if (command === 'testall' && prompt) {
        cli.testAllModels(prompt).then(() => process.exit(0));
    } else if (command === 'quick') {
        cli.quickTest().then(() => process.exit(0));
    } else {
        console.log('Usage:');
        console.log('  node bedrock-cli.js                    # Interactive mode');
        console.log('  node bedrock-cli.js test "your prompt" # Single test');
        console.log('  node bedrock-cli.js testall "prompt"   # Test all models');
        console.log('  node bedrock-cli.js quick              # Quick test');
        process.exit(1);
    }
} else {
    // Interactive mode
    const cli = new BedrockCLI();
    cli.start();
}
