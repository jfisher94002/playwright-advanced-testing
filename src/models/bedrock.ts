import { CtrfReport } from "../../types/ctrf";
import { Arguments } from "../index";
import { saveUpdatedReport, stripAnsi } from "../common";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { generateConsolidatedSummary } from "../consolidated-summary";
import { FAILED_TEST_SUMMARY_SYSTEM_PROMPT_CURRENT } from "../constants";

interface BedrockError {
    message: string;
    name?: string;
    $metadata?: {
        httpStatusCode?: number;
        requestId?: string;
    };
    Code?: string;
}

function getDetailedBedrockErrorMessage(error: BedrockError, modelId: string): string {
    const errorInfo = {
        message: error.message,
        code: error.name || error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
        model: modelId
    };

    let debugMessage = `❌ Bedrock AI Error: ${error.message}\n`;
    debugMessage += `   Model: ${modelId}\n`;
    debugMessage += `   Error Code: ${errorInfo.code || 'Unknown'}\n`;
    debugMessage += `   HTTP Status: ${errorInfo.statusCode || 'Unknown'}\n`;
    debugMessage += `   Request ID: ${errorInfo.requestId || 'Unknown'}\n`;

    // Specific error handling with actionable suggestions
    if (error.message.includes('security token') || error.message.includes('SignatureDoesNotMatch')) {
        debugMessage += `\n🔑 Authentication Issue:
   - Check AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
   - Verify ~/.aws/credentials file exists and is valid
   - If using temporary credentials, check if they expired
   - Run: aws sts get-caller-identity (to verify auth)`;
    } else if (error.message.includes('don\'t have access') || error.message.includes('ValidationException')) {
        debugMessage += `\n🚫 Model Access Issue:
   - Request access to the model in AWS Console > Bedrock > Model access
   - Available regions for Claude: us-east-1, us-west-2, eu-west-3
   - Some models require explicit access request
   - Try a different model like: anthropic.claude-instant-v1`;
    } else if (error.message.includes('not authorized') || error.message.includes('AccessDenied')) {
        debugMessage += `\n🛡️ Permission Issue:
   - Your AWS account may not have Bedrock enabled
   - IAM user/role may need Bedrock permissions
   - Required permissions: bedrock:InvokeModel, bedrock:GetFoundationModel
   - Contact your AWS administrator`;
    } else if (error.message.includes('UnrecognizedClientException') || error.message.includes('InvalidSignatureException')) {
        debugMessage += `\n🌍 Region/Configuration Issue:
   - Check AWS_REGION environment variable (current: ${process.env.AWS_REGION || 'us-west-2'})
   - Verify the model is available in your region
   - Try setting AWS_REGION=us-west-2 (most Bedrock models available there)`;
    } else if (error.message.includes('ThrottlingException') || error.message.includes('ServiceQuotaExceededException')) {
        debugMessage += `\n⏱️ Rate Limiting Issue:
   - You've hit API rate limits or quota limits
   - Wait a few minutes and try again
   - Consider implementing exponential backoff
   - Check AWS Console for quota limits`;
    } else if (error.message.includes('ModelNotReadyException') || error.message.includes('ResourceNotFoundException')) {
        debugMessage += `\n📦 Model Availability Issue:
   - The specified model may not exist or be available
   - Check model ID spelling: ${modelId}
   - Try a known working model: anthropic.claude-3-sonnet-20240229-v1:0
   - Verify model is available in your region`;
    } else if (error.message.includes('InternalServerException') || error.message.includes('ServiceUnavailableException')) {
        debugMessage += `\n🏥 AWS Service Issue:
   - AWS Bedrock service may be experiencing issues
   - This is usually temporary - try again in a few minutes
   - Check AWS Service Health Dashboard
   - Consider implementing retry logic`;
    } else if (error.message.includes('ValidationException') && error.message.includes('body')) {
        debugMessage += `\n📝 Request Format Issue:
   - The request body format may be incorrect for this model
   - Different models require different input formats
   - Check the model documentation for correct format
   - Verify JSON structure matches model requirements`;
    } else {
        debugMessage += `\n🔍 General Troubleshooting:
   - Run the debug script: node debug-bedrock.js
   - Check AWS CloudTrail logs for detailed error info
   - Verify your AWS account has Bedrock access
   - Try with a different model to isolate the issue`;
    }

    debugMessage += `\n\n💡 Quick Debug Commands:
   node debug-bedrock.js                    # Run comprehensive debug
   aws sts get-caller-identity              # Check authentication
   aws bedrock list-foundation-models       # List available models
   aws bedrock get-model-invocation-logging-configuration  # Check logging`;

    return debugMessage;
}

export async function bedrockAI(systemPrompt: string, prompt: string, args: Arguments): Promise<string | null> {
    const modelId = args.model || 'anthropic.claude-3-sonnet-20240229-v1:0';
    const region = process.env.AWS_REGION || 'us-west-2';
    
    // Enhanced credential validation
    if (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_PROFILE) {
        const errorMsg = `❌ AWS Credentials Missing:
   - Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
   - Or configure ~/.aws/credentials file with [default] profile
   - Or set AWS_PROFILE environment variable
   
   Quick setup:
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_REGION="${region}"`;
        console.error(errorMsg);
        return null;
    }

    // Configure client with proper credential handling
    const clientConfig: any = { region };
    
    // Only set explicit credentials if they exist
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        clientConfig.credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
        };
    }
    // If AWS_PROFILE is set but no explicit keys, let AWS SDK handle credentials
    
    const client = new BedrockRuntimeClient(clientConfig);

    try {
        // Log attempt for debugging
        if (args.log) {
            console.log(`🔄 Attempting Bedrock AI request...`);
            console.log(`   Model: ${modelId}`);
            console.log(`   Region: ${region}`);
            console.log(`   Prompt length: ${prompt.length} characters`);
        }

        // Prepare the request based on the model type
        let requestBody: any;

        if (modelId.includes('anthropic.claude')) {
            // Claude models on Bedrock
            requestBody = {
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: args.maxTokens || 300,
                temperature: args.temperature || 0.7,
                messages: [
                    {
                        role: "user",
                        content: `${systemPrompt}\n\n${stripAnsi(prompt)}`
                    }
                ]
            };
        } else if (modelId.includes('amazon.titan')) {
            // Amazon Titan models
            requestBody = {
                inputText: `${systemPrompt}\n\n${stripAnsi(prompt)}`,
                textGenerationConfig: {
                    maxTokenCount: args.maxTokens || 300,
                    temperature: args.temperature || 0.7,
                    topP: args.topP || 1,
                    stopSequences: []
                }
            };
        } else if (modelId.includes('ai21.j2')) {
            // AI21 Jurassic models
            requestBody = {
                prompt: `${systemPrompt}\n\n${stripAnsi(prompt)}`,
                maxTokens: args.maxTokens || 300,
                temperature: args.temperature || 0.7,
                topP: args.topP || 1
            };
        } else if (modelId.includes('cohere.command')) {
            // Cohere Command models
            requestBody = {
                prompt: `${systemPrompt}\n\n${stripAnsi(prompt)}`,
                max_tokens: args.maxTokens || 300,
                temperature: args.temperature || 0.7,
                p: args.topP || 1
            };
        } else if (modelId.includes('meta.llama')) {
            // Meta Llama models
            requestBody = {
                prompt: `${systemPrompt}\n\n${stripAnsi(prompt)}`,
                max_gen_len: args.maxTokens || 300,
                temperature: args.temperature || 0.7,
                top_p: args.topP || 1
            };
        } else {
            // Default format (try Claude format)
            requestBody = {
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: args.maxTokens || 300,
                temperature: args.temperature || 0.7,
                messages: [
                    {
                        role: "user",
                        content: `${systemPrompt}\n\n${stripAnsi(prompt)}`
                    }
                ]
            };
        }

        const command = new InvokeModelCommand({
            modelId,
            body: JSON.stringify(requestBody),
            contentType: "application/json",
            accept: "application/json"
        });

        const response = await client.send(command);
        
        if (!response.body) {
            console.error(`❌ No response body received from Bedrock for model ${modelId}`);
            return null;
        }

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        // Parse response based on model type
        let aiResponse: string;

        if (modelId.includes('anthropic.claude')) {
            aiResponse = responseBody.content?.[0]?.text || '';
        } else if (modelId.includes('amazon.titan')) {
            aiResponse = responseBody.results?.[0]?.outputText || '';
        } else if (modelId.includes('ai21.j2')) {
            aiResponse = responseBody.completions?.[0]?.data?.text || '';
        } else if (modelId.includes('cohere.command')) {
            aiResponse = responseBody.generations?.[0]?.text || '';
        } else if (modelId.includes('meta.llama')) {
            aiResponse = responseBody.generation || '';
        } else {
            // Default: try Claude format first, then fallback
            aiResponse = responseBody.content?.[0]?.text || responseBody.generation || responseBody.text || '';
        }

        if (!aiResponse || aiResponse.trim().length === 0) {
            console.error(`❌ Empty response from Bedrock model ${modelId}`);
            console.error('Response body:', JSON.stringify(responseBody, null, 2));
            return null;
        }

        if (args.log) {
            console.log(`✅ Bedrock AI response received successfully (${aiResponse.length} characters)`);
        }

        return aiResponse.trim();
    } catch (error) {
        const detailedError = getDetailedBedrockErrorMessage(error as BedrockError, modelId);
        console.error(detailedError);
        
        // Also log the raw error for developers
        if (args.log) {
            console.error('\n🔧 Raw error for debugging:', error);
        }
        
        return null;
    }
}

export async function bedrockFailedTestSummary(report: CtrfReport, args: Arguments, file?: string, log = false): Promise<CtrfReport> {
    const failedTests = report.results.tests.filter(test => test.status === 'failed');
    failedTests.forEach(test => {
        if (test.extra) {
            delete test.extra;
        }
    });

    if (failedTests.length === 0) {
        if (log) {
            console.log('✅ No failed tests to analyze');
        }
        return report;
    }

    let logged = false;
    let messageCount = 0;
    let successCount = 0;
    let errorCount = 0;

    if (log) {
        console.log(`\n🔍 Analyzing ${failedTests.length} failed test${failedTests.length > 1 ? 's' : ''} with AWS Bedrock...`);
    }

    for (const test of failedTests) {
        if (args.maxMessages && messageCount >= args.maxMessages) {
            if (log) {
                console.log(`⏹️ Reached maximum message limit (${args.maxMessages})`);
            }
            break;
        }

        const prompt = `Report:\n${JSON.stringify(test, null, 2)}.\n\nTool:${report.results.tool.name}.\n\n Please provide a human-readable failure summary that explains why you think the test might have failed and ways to fix`;
        const systemPrompt = args.systemPrompt || FAILED_TEST_SUMMARY_SYSTEM_PROMPT_CURRENT;

        try {
            if (log) {
                console.log(`🔄 Processing: ${test.name}`);
            }

            const aiResponse = await bedrockAI(systemPrompt, prompt, args);
            if (aiResponse !== null) {
                test.ai = aiResponse;
                messageCount++;
                successCount++;
                
                if (args.log && !logged) {
                    console.log(`\n─────────────────────────────────────────────────────────────────────────────────────────────────────────────`);
                    console.log(`✨ AI Test Reporter Summary (AWS Bedrock)`);
                    console.log(`─────────────────────────────────────────────────────────────────────────────────────────────────────────────\n`);
                    logged = true;
                }
                if (args.log) {
                    console.log(`❌ Failed Test: ${test.name}\n`)
                    console.log(`${aiResponse}\n`);
                }
            } else {
                errorCount++;
                if (log) {
                    console.log(`❌ Failed to get AI analysis for: ${test.name}`);
                }
            }
        } catch (error) {
            errorCount++;
            console.error(`❌ Error processing test "${test.name}":`, error);
            
            // Add some basic fallback information
            if (!test.ai) {
                test.ai = `AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check Bedrock configuration.`;
            }
        }
    }

    if (log) {
        console.log(`\n📊 Analysis Summary:`);
        console.log(`   ✅ Successfully analyzed: ${successCount} tests`);
        console.log(`   ❌ Failed to analyze: ${errorCount} tests`);
        console.log(`   📝 Total processed: ${messageCount} tests`);
        
        if (errorCount > 0) {
            console.log(`\n💡 If you're seeing analysis failures, try:`);
            console.log(`   - Run: node debug-bedrock.js`);
            console.log(`   - Check AWS credentials and permissions`);
            console.log(`   - Verify model access in AWS Console`);
        }
    }

    if (args.consolidate) {
        try {
            await generateConsolidatedSummary(report, "bedrock", args);
        } catch (error) {
            console.error('❌ Error generating consolidated summary:', error);
        }
    }

    if (file) {
        try {
            saveUpdatedReport(file, report);
            if (log) {
                console.log(`💾 Report saved to: ${file}`);
            }
        } catch (error) {
            console.error(`❌ Error saving report to ${file}:`, error);
        }
    }

    return report;
}
