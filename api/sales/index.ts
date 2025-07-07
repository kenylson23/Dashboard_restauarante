import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { insertSaleSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const sales = await storage.getSales();
        res.status(200).json(sales);
        break;

      case 'POST':
        const validatedData = insertSaleSchema.parse(req.body);
        const newSale = await storage.createSale(validatedData);
        res.status(201).json(newSale);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling sales request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}