import { NextApiRequest, NextApiResponse } from 'next';

interface Author {
  name: string;
}

interface Message {
  conversation_id: number;
  user_input: string;
  cypher_query: string;
  final_response: string;
  author: Author;
  timestamp: number;
}

const messageStore: Message[] = [];
const MESSAGE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const saveToMemory = (conversation_id: number, userInput: string, cypherQuery: string, finalResponse: string) => {
  const message: Message = {
    conversation_id,
    user_input: userInput,
    cypher_query: cypherQuery,
    final_response: finalResponse,
    author: { name: "ai" }, // Adding the author field
    timestamp: Date.now(),
  };

  messageStore.push(message);
};

const getMessagesFromMemory = () => {
  const now = Date.now();
  return messageStore.filter(
    (message) => now - message.timestamp < MESSAGE_EXPIRATION_TIME
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { conversation_id, userInput, cypherQuery, finalResponse } = req.body;

    if (!conversation_id || !userInput || !cypherQuery || !finalResponse) {
      return res.status(400).json({ error: 'Bad Request: Missing required fields' });
    }

    try {
      saveToMemory(conversation_id, userInput, cypherQuery, finalResponse);
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const messages = getMessagesFromMemory(); // Get all messages from the last 5 minutes
    res.status(200).json({ messages });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
