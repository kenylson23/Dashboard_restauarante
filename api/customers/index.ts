import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { insertCustomerSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const customers = await storage.getCustomers();
        res.status(200).json(customers);
        break;

      case 'POST':
        const validatedData = insertCustomerSchema.parse(req.body);
        const newCustomer = await storage.createCustomer(validatedData);
        res.status(201).json(newCustomer);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling customers request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}