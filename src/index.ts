import express from 'express';
import { bot } from "./bot/telegram.ts";
import { config } from "./config/env.ts";

console.log('Booting Zorexclaw local node...');
console.log(`Whitelisted Telegram User IDs: ${config.ALLOWED_USER_IDS.join(', ')}`);
console.log(`Using Database Path: ${config.DB_PATH}`);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, '=> reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Setup Express server for Railway health checks and port binding
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Zorexclaw Agent is running!');
});

app.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
});

// Start the bot with long polling
bot.start({
    onStart: (botInfo) => {
        console.log(`Zorexclaw is alive and running as @${botInfo.username}`);
    }
});
