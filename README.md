# AI Test Reporter

AI Test Reporter is a powerful tool that generates intelligent summaries of test results using a wide range of AI models. With access to over 300 models through various providers (OpenAI, Anthropic Claude, Google Gemini, Mistral, Perplexity, OpenRouter, and more), it analyzes failing tests and provides actionable insights about what went wrong and how to fix it.

<div align="center">
<div style="padding: 1.5rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #30363d;">
<span style="font-size: 23px;">💚</span>
<h3 style="margin: 1rem 0;">CTRF tooling is open source and free to use</h3>
<p style="font-size: 16px;">You can support the project with a follow and a star</p>

<div style="margin-top: 1.5rem;">
<a href="https://github.com/ctrf-io/ai-test-reporter">
<img src="https://img.shields.io/github/stars/ctrf-io/ai-test-reporter?style=for-the-badge&color=2ea043" alt="GitHub stars">
</a>
<a href="https://github.com/ctrf-io">
<img src="https://img.shields.io/github/followers/ctrf-io?style=for-the-badge&color=2ea043" alt="GitHub followers">
</a>
</div>
</div>

<p style="font-size: 14px; margin: 1rem 0;">
Maintained by <a href="https://github.com/ma11hewthomas">Matthew Thomas</a><br/>
Contributions are very welcome! <br/>
Explore more <a href="https://www.ctrf.io/integrations">integrations</a>
</p>
</div>

## Why Use AI Test Reporter?

- 🤖 **Smart Analysis**: Get AI-powered explanations of why tests failed and suggestions for fixes
- 🔌 **Multiple Providers**: Choose from 300+ AI models across different providers
- 💰 **Cost-Effective Options**: Start with providers offering free credits like Mistral and Google Gemini
- 🔄 **Developer Tool Integration**: Seamlessly integrate AI summaries into your workflow:
   - GitHub Actions and Pull Requests
   - Slack / Teams notifications
   - And more through standardized CTRF reports

- 🎯 **Consolidated Insights**: Get high-level summaries of test suite failures to identify patterns and root causes
- ⚡ **Framework Agnostic**: Works with any testing framework through CTRF reports
- 📊 **Flexible Reporting**: AI summaries are embedded in your CTRF JSON report, allowing you to:
   - Include AI analysis in your existing reporting workflows
   - Programmatically customize how and where summaries appear in your Developer Tools

## Models

> [!TIP]
> The following integrations are available with free tiers so are great to try out AI test reporter:
>
> - __Google Gemini__: Offers a free tier with lower rate limits. [Pricing details](https://ai.google.dev/pricing#2_0flash)
> - **Mistral AI**: Provides a free API tier to explore the service. [Tier details](https://docs.mistral.ai/deployment/laplateforme/tier/#usage-tiers)

You can use any of the models supported by the following providers:

- OpenAI
- Anthropic Claude
- Google Gemini
- Mistral
- Grok
- DeepSeek
- Azure OpenAI
- Perplexity
- OpenRouter

You use your own API keys for the models you select.

## Usage

Generate a CTRF report using your testing framework. [CTRF reporters](https://github.com/orgs/ctrf-io/repositories) are available for most testing frameworks and easy to install.

**No CTRF reporter? No problem!**

Use [junit-to-ctrf](https://github.com/ctrf-io/junit-to-ctrf) to convert a JUnit report to CTRF

## OpenAI

Run the following command:

```bash
npx ai-ctrf openai <path-to-ctrf-report>
```

An AI summary for each failed test will be added to your test report.

The package interacts with the OpenAI API, you must set `OPENAI_API_KEY` environment variable.

You will be responsible for any charges incurred from using your selected OpenAI model. Make sure you are aware of the associated cost.

A message is sent to OpenAI for each failed test.

### Options

`--model`: OpenAI model to use (default: gpt-3.5-turbo).

`--systemPrompt`: Custom system prompt to guide the AI response.

`--frequencyPenalty`: OpenAI frequency penalty parameter (default: 0).

`--maxTokens`: Maximum number of tokens for the response.

`--presencePenalty`: OpenAI presence penalty parameter (default: 0).

`--temperature`: Sampling temperature (conflicts with topP).

`--topP`: Top-p sampling parameter (conflicts with temperature).

`--log`: Whether to log the AI responses to the console (default: true).

`--maxMessages`: Limit the number of failing tests to send for summarization in the LLM request. This helps avoid overwhelming the model when dealing with reports that have many failing tests. (default: 10)

`consolidate`: Consolidate and summarize multiple AI summaries into a higher-level overview (default: true)

## Azure OpenAI

Run the following command:

Run the following command:

```bash
npx ai-ctrf claude <path-to-ctrf-report>
```

An AI summary for each failed test will be added to your test report.

The package interacts with the Anthropic API, you must set `ANTHROPIC_API_KEY` environment variable.

You will be responsible for any charges incurred from using your selected Claude model. Make sure you are aware of the associated costs.

A message is sent to Claude for each failed test.

### Claude Options

`--model`: Claude model to use (default: claude-3-5-sonnet-20240620).

`--systemPrompt`: Custom system prompt to guide the AI response.

`--maxTokens`: Maximum number of tokens for the response.

`--temperature`: Sampling temperature.

`--log`: Whether to log the AI responses to the console (default: true).

`--maxMessages`: Limit the number of failing tests to send for summarization in the LLM request. This helps avoid overwhelming the model when dealing with reports that have many failing tests. (default: 10)

`consolidate`: Consolidate and summarize multiple AI summaries into a higher-level overview (default: true)

## Grok

Run the following command:

