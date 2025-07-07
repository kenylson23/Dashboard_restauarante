import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../../server/storage';
import { insertStaffSchema } from '../../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const staff = await storage.getStaff();
        res.status(200).json(staff);
        break;

      case 'POST':
        const validatedData = insertStaffSchema.parse(req.body);
        const newStaff = await storage.createStaffMember(validatedData);
        res.status(201).json(newStaff);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling staff request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}