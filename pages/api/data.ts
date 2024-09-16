import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const getDbConnection = async () => {
  const db = await open({
    filename: './chat.db',
    driver: sqlite3.Database
  });
  return db;
};

const saveToDatabase = async (conversation_id: string, userInput: string, cypherQuery: string, finalResponse: string) => {
  const db = await getDbConnection();
  
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT,
        user_input TEXT,
        cypher_query TEXT,
        final_response TEXT
      )
    `);

    const stmt = await db.prepare(`INSERT INTO chat_history (conversation_id, user_input, cypher_query, final_response) VALUES (?, ?, ?, ?)`);
    await stmt.run(conversation_id, userInput, cypherQuery, finalResponse);
    await stmt.finalize();
  } catch (error) {
    console.error('Error saving to database:', error);
    throw new Error('Error saving to database');
  } finally {
    await db.close();
  }
};

const getMessagesFromDatabase = async (conversation_id: string) => {
  const db = await getDbConnection();
  
  try {
    const rows = await db.all(`SELECT user_input, cypher_query, final_response FROM chat_history WHERE conversation_id = ?`, conversation_id);
    return rows;
  } catch (error) {
    console.error('Error retrieving messages:', error);
    throw new Error('Error retrieving messages');
  } finally {
    await db.close();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { conversation_id, userInput, cypherQuery, finalResponse } = req.body;

    if (!conversation_id || !userInput || !cypherQuery || !finalResponse) {
      return res.status(400).json({ error: 'Bad Request: Missing required fields' });
    }

    try {
      await saveToDatabase(conversation_id, userInput, cypherQuery, finalResponse);
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const { conversation_id } = req.query;

    if (!conversation_id || typeof conversation_id !== 'string') {
      return res.status(400).json({ error: 'Bad Request: Invalid or missing conversation_id' });
    }

    try {
      const messages = await getMessagesFromDatabase(conversation_id);
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
