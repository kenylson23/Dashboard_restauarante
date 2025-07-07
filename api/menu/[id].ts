import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { updateMenuItemSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const menuItemId = parseInt(id as string);

  if (isNaN(menuItemId)) {
    return res.status(400).json({ message: 'Invalid menu item ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const menuItem = await storage.getMenuItem(menuItemId);
        if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json(menuItem);
        break;

      case 'PUT':
        const validatedData = updateMenuItemSchema.parse(req.body);
        const updatedItem = await storage.updateMenuItem(menuItemId, validatedData);
        if (!updatedItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json(updatedItem);
        break;

      case 'DELETE':
        const deleted = await storage.deleteMenuItem(menuItemId);
        if (!deleted) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(204).end();
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling menu item request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}