import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { insertTableSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const tables = await storage.getTables();
        res.status(200).json(tables);
        break;

      case 'POST':
        const validatedData = insertTableSchema.parse(req.body);
        const newTable = await storage.createTable(validatedData);
        res.status(201).json(newTable);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling tables request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}