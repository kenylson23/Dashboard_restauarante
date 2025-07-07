import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const lowStockItems = await storage.getLowStockItems();
    res.status(200).json(lowStockItems);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}