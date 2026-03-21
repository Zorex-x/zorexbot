import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config = {
  TELEGRAM_BOT_TOKEN: requireEnv('TELEGRAM_BOT_TOKEN'),
  GROQ_API_KEY: requireEnv('GROQ_API_KEY'),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '', // Optional fallback
  DB_PATH: process.env.DB_PATH || './memory.db',
  ALLOWED_USER_IDS: requireEnv('ALLOWED_USER_IDS')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0),
};
