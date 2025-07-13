import { CtrfReport } from "../../types/ctrf";
import { Arguments } from "../index";
import { saveUpdatedReport, stripAnsi } from "../common";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { generateConsolidatedSummary } from "../consolidated-summary";
import { FAILED_TEST_SUMMARY_SYSTEM_PROMPT_CURRENT } from "../constants";

export async function bedrockAI(systemPrompt: string, prompt: string, args: Arguments): Promise<string | null> {
    const client = new BedrockRuntimeClient({
        region: process.env.AWS_REGION || 'us-west-2',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
        }
    });

    try {
        // Prepare the request based on the model type
        const modelId = args.model || 'anthropic.claude-3-sonnet-20240229-v1:0';
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

        return aiResponse.trim() || null;
    } catch (error) {
        console.error(`Error invoking Bedrock AI with model ${args.model}:`, error);
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

    let logged = false;
    let messageCount = 0;

    for (const test of failedTests) {
        if (args.maxMessages && messageCount >= args.maxMessages) {
            break;
        }

        const prompt = `Report:\n${JSON.stringify(test, null, 2)}.\n\nTool:${report.results.tool.name}.\n\n Please provide a human-readable failure summary that explains why you think the test might have failed and ways to fix`;
        const systemPrompt = args.systemPrompt || FAILED_TEST_SUMMARY_SYSTEM_PROMPT_CURRENT;

        try {
            const aiResponse = await bedrockAI(systemPrompt, prompt, args);
            if (aiResponse !== null) {
                test.ai = aiResponse;
                messageCount++;
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
            }
        } catch (error) {
            console.error(`Error processing test ${test.name}:`, error);
        }
    }

    if (args.consolidate) {
        await generateConsolidatedSummary(report, "bedrock", args);
    }

    if (file) {
        saveUpdatedReport(file, report);
    }

    return report;
}
