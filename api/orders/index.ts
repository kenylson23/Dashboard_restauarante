import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { insertOrderSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const orders = await storage.getOrders();
        res.status(200).json(orders);
        break;

      case 'POST':
        const validatedData = insertOrderSchema.parse(req.body);
        const newOrder = await storage.createOrder(validatedData);
        res.status(201).json(newOrder);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling orders request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}