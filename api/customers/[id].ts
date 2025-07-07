import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const customerId = parseInt(id as string);

  if (isNaN(customerId)) {
    return res.status(400).json({ message: 'Invalid customer ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const customer = await storage.getCustomer(customerId);
        if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
        break;

      case 'PUT':
        const updatedCustomer = await storage.updateCustomer(customerId, req.body);
        if (!updatedCustomer) {
          return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
        break;

      case 'DELETE':
        const deleted = await storage.deleteCustomer(customerId);
        if (!deleted) {
          return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(204).end();
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling customer request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}