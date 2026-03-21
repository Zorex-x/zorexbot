import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';
import { tools } from './tools.js';
const groq = new Groq({ apiKey: config.GROQ_API_KEY });
let genai = null;
if (config.GEMINI_API_KEY) {
    genai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
}
export async function chatCompletion(messages) {
    try {
        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            tools: tools,
            tool_choice: 'auto',
        });
        return completion.choices[0].message;
    }
    catch (err) {
        console.error('Groq failed, trying Gemini fallback...', err);
        if (!genai)
            throw new Error('Groq failed and Gemini is not configured');
        // Gemini fallback logic matching OpenAI structure roughly.
        // For simplicity, we drop complex tool requests if fallback triggers.
        const systemInstruction = messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
        const history = messages.filter(m => m.role !== 'system').map(m => {
            let text = m.content || '';
            if (m.tool_calls) {
                text += JSON.stringify(m.tool_calls);
            }
            return {
                role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
                parts: [{ text: text || 'empty message' }]
            };
        });
        const response = await genai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: { systemInstruction }
        });
        return {
            role: 'assistant',
            content: response.text || 'Gemini generated no text content.',
        };
    }
}
