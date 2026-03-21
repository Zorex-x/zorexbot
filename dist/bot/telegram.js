import { Bot } from 'grammy';
import { config } from '../config/env.js';
import { runAgent, resetAgent } from '../agent/loop.js';
export const bot = new Bot(config.TELEGRAM_BOT_TOKEN);
// Whitelist middleware
bot.use(async (ctx, next) => {
    const userId = ctx.from?.id.toString();
    if (!userId || !config.ALLOWED_USER_IDS.includes(userId)) {
        console.log(`Unauthorized access attempt from User ID: ${userId}`);
        return; // Drop silently and gracefully
    }
    await next();
});
bot.command('start', async (ctx) => {
    const threadId = ctx.from?.id.toString() || 'unknown';
    resetAgent(threadId);
    await ctx.reply('Hello! I am Zorexclaw, your personal AI agent. How can I help you today?');
});
bot.command('reset', async (ctx) => {
    const threadId = ctx.from?.id.toString() || 'unknown';
    resetAgent(threadId);
    await ctx.reply('Memory cleared. Starting a fresh thread.');
});
bot.on('message:text', async (ctx) => {
    const threadId = ctx.from.id.toString();
    const text = ctx.message.text;
    // Indicate we are thinking
    await ctx.replyWithChatAction('typing');
    try {
        const response = await runAgent(threadId, text);
        await ctx.reply(response);
    }
    catch (err) {
        console.error('Error during agent execution:', err);
        await ctx.reply(`Encountered an internal error: ${err.message}`);
    }
});
