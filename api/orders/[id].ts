import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { updateOrderSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const orderId = parseInt(id as string);

  if (isNaN(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const order = await storage.getOrder(orderId);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
        break;

      case 'PUT':
        const validatedData = updateOrderSchema.parse(req.body);
        const updatedOrder = await storage.updateOrder(orderId, validatedData);
        if (!updatedOrder) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
        break;

      case 'DELETE':
        const deleted = await storage.deleteOrder(orderId);
        if (!deleted) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(204).end();
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling order request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}