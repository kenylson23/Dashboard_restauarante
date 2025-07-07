import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { updateTableSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const tableId = parseInt(id as string);

  if (isNaN(tableId)) {
    return res.status(400).json({ message: 'Invalid table ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const table = await storage.getTable(tableId);
        if (!table) {
          return res.status(404).json({ message: 'Table not found' });
        }
        res.status(200).json(table);
        break;

      case 'PUT':
        const validatedData = updateTableSchema.parse(req.body);
        const updatedTable = await storage.updateTable(tableId, validatedData);
        if (!updatedTable) {
          return res.status(404).json({ message: 'Table not found' });
        }
        res.status(200).json(updatedTable);
        break;

      case 'DELETE':
        const deleted = await storage.deleteTable(tableId);
        if (!deleted) {
          return res.status(404).json({ message: 'Table not found' });
        }
        res.status(204).end();
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling table request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}