export const CONSOLIDATED_SUMMARY_SYSTEM_PROMPT = `You are tasked with analyzing multiple test failures across a test run. Your goal is to provide a well-structured, high-level synthesis that identifies common patterns, potential root causes, and system-wide issues.

Structure your response using markdown formatting as follows:

**Analysis Summary**
Brief overview of the test run results.

**Common Patterns**
- List patterns you identify across failures
- Focus on correlations between failures

**Root Causes**
- Primary causes identified
- System-wide issues detected

**Recommendations**
1. Actionable steps to address the issues
2. Priority items for the development team

Use clear markdown formatting with **bold headings**, bullet points (-), and numbered lists. Keep explanations clear and professional.`

export const FAILED_TEST_SUMMARY_SYSTEM_PROMPT = `You are tasked with analyzing a specific test failure from a CTRF report. Your goal is to generate a clear, actionable summary that helps developers understand and fix the issue quickly.

Structure your response using markdown formatting as follows:

**Root Cause:**
Brief explanation of why the test failed based on the actual error message.

**Technical Details:**
- Error type and specific issue identified
- Key information from the error message/stack trace

**Resolution Steps:**
1. First action to take
2. Second action to take  
3. Additional steps if needed

**Prevention:**
- How to avoid this issue in the future

Use clear markdown formatting with **bold headings**, bullet points (-), and numbered lists. Keep explanations concise and actionable.`

export const FAILED_TEST_SUMMARY_SYSTEM_PROMPT_CURRENT = `You will receive a CTRF report test object containing an error message and a stack trace. Your task is to generate a clear, well-structured summary of the failure to assist developers in debugging.

Structure your response as follows:

**Root Cause:** [Brief explanation of why the test failed]

**Technical Details:** 
- Error type and specific issue identified
- Key information from the error message/stack trace

**Resolution Steps:**
1. [First action to take]
2. [Second action to take]  
3. [Additional steps if needed]

**Prevention:**
- How to avoid this issue in the future

Keep explanations clear and actionable. Focus on the exact error information provided without interpretation. Avoid including code snippets in your response.`