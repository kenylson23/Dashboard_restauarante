import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { updateInventorySchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const inventoryId = parseInt(id as string);

  if (isNaN(inventoryId)) {
    return res.status(400).json({ message: 'Invalid inventory ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const item = await storage.getInventoryItem(inventoryId);
        if (!item) {
          return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(item);
        break;

      case 'PUT':
        const validatedData = updateInventorySchema.parse(req.body);
        const updatedItem = await storage.updateInventoryItem(inventoryId, validatedData);
        if (!updatedItem) {
          return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(updatedItem);
        break;

      case 'DELETE':
        const deleted = await storage.deleteInventoryItem(inventoryId);
        if (!deleted) {
          return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(204).end();
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling inventory item request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}