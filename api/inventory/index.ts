import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { insertInventorySchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const inventory = await storage.getInventory();
        res.status(200).json(inventory);
        break;

      case 'POST':
        const validatedData = insertInventorySchema.parse(req.body);
        const newItem = await storage.createInventoryItem(validatedData);
        res.status(201).json(newItem);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling inventory request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}