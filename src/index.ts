import { bot } from './bot/telegram.ts';
import { config } from './config/env.ts';

console.log('Booting Zorexclaw local node...');
console.log(`Whitelisted Telegram User IDs: ${config.ALLOWED_USER_IDS.join(', ')}`);
console.log(`Using Database Path: ${config.DB_PATH}`);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, '=> reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Start the bot with long polling
bot.start({
    onStart: (botInfo) => {
        console.log(`Zorexclaw is alive and running as @${botInfo.username}`);
    }
});
