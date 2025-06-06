import type { NextApiRequest, NextApiResponse } from 'next';
import { generateTasks } from '@/lib/gemini';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  try {
    const tasks = await generateTasks(prompt);
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate tasks' });
  }
}
