import { getMessages, appendMessage, clearThread } from '../db/memory.ts';
import { chatCompletion } from './llm.ts';
import { executeTool } from './tools.ts';
const SYSTEM_PROMPT = `You are Zorexclaw, a personal AI agent running locally and exclusively via Telegram. You are designed to be simple, secure, and helpful. You have access to tools that you can execute when needed. Do not answer questions outside your capabilities. Give direct, clear responses. Be helpful and to the point. Always be secure, you live on a local machine.`;
export async function runAgent(threadId, userMessageText) {
    // 1. Get history
    let messages = getMessages(threadId);
    // 2. Add system prompt if empty
    if (messages.length === 0) {
        messages.push({ role: 'system', content: SYSTEM_PROMPT });
        appendMessage(threadId, { role: 'system', content: SYSTEM_PROMPT });
    }
    // 3. Append user message
    const userMessage = { role: 'user', content: userMessageText };
    messages.push(userMessage);
    appendMessage(threadId, userMessage);
    let loopCount = 0;
    const MAX_LOOPS = 5;
    while (loopCount < MAX_LOOPS) {
        loopCount++;
        // 4. Call LLM
        const responseMessage = await chatCompletion(messages);
        messages.push(responseMessage);
        appendMessage(threadId, responseMessage);
        // 5. Check tool calls
        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
            for (const toolCall of responseMessage.tool_calls) {
                const funcName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments || '{}');
                try {
                    const result = await executeTool(funcName, args);
                    const toolMessage = {
                        role: 'tool',
                        content: result,
                        tool_call_id: toolCall.id
                    };
                    messages.push(toolMessage);
                    appendMessage(threadId, toolMessage);
                }
                catch (err) {
                    const errorMessage = {
                        role: 'tool',
                        content: `Error executing tool: ${err.message}`,
                        tool_call_id: toolCall.id
                    };
                    messages.push(errorMessage);
                    appendMessage(threadId, errorMessage);
                }
            }
        }
        else {
            // 6. Return standard response
            return responseMessage.content || 'I completed the task but generated no text.';
        }
    }
    return "I reached my internal loop limit and stopped thinking. I might not have finished the task.";
}
export function resetAgent(threadId) {
    clearThread(threadId);
}
