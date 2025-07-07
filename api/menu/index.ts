import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { insertMenuItemSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const menuItems = await storage.getMenuItems();
        res.status(200).json(menuItems);
        break;

      case 'POST':
        const validatedData = insertMenuItemSchema.parse(req.body);
        const newItem = await storage.createMenuItem(validatedData);
        res.status(201).json(newItem);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling menu request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}