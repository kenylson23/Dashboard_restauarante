import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { updateStaffSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const staffId = parseInt(id as string);

  if (isNaN(staffId)) {
    return res.status(400).json({ message: 'Invalid staff ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const staff = await storage.getStaffMember(staffId);
        if (!staff) {
          return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json(staff);
        break;

      case 'PUT':
        const validatedData = updateStaffSchema.parse(req.body);
        const updatedStaff = await storage.updateStaffMember(staffId, validatedData);
        if (!updatedStaff) {
          return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json(updatedStaff);
        break;

      case 'DELETE':
        const deleted = await storage.deleteStaffMember(staffId);
        if (!deleted) {
          return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(204).end();
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling staff member request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}