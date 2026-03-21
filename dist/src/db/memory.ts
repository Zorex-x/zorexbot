import Database from 'better-sqlite3';
import { config } from '../config/env.js';

// We serialize the entire message object to accommodate text, tools, and tool responses.
const db = new Database(config.DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id TEXT NOT NULL,
    message_json TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
`);

export function getMessages(threadId: string): any[] {
  const stmt = db.prepare('SELECT message_json FROM messages WHERE thread_id = ? ORDER BY timestamp ASC');
  const rows = stmt.all(threadId) as { message_json: string }[];
  return rows.map((r) => JSON.parse(r.message_json));
}

export function appendMessage(threadId: string, message: any): void {
  const stmt = db.prepare('INSERT INTO messages (thread_id, message_json, timestamp) VALUES (?, ?, ?)');
  stmt.run(threadId, JSON.stringify(message), Date.now());
}

export function clearThread(threadId: string): void {
  const stmt = db.prepare('DELETE FROM messages WHERE thread_id = ?');
  stmt.run(threadId);
}
