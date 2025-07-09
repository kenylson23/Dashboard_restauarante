import { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  insertMenuItemSchema, insertTableSchema, insertOrderSchema, 
  insertInventorySchema, insertStaffSchema, insertCustomerSchema, 
  insertSaleSchema, updateOrderSchema, updateTableSchema, 
  updateInventorySchema, updateStaffSchema
} from '../shared/schema';

// Import database directly for serverless environment
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

// Configure neon for serverless environment (Vercel compatible)
neonConfig.fetchConnectionCache = true;
if (typeof WebSocket === 'undefined') {
  // For Node.js environment, import ws
  const ws = require('ws');
  neonConfig.webSocketConstructor = ws;
}

let cachedDb: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!cachedDb) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set');
    }
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    cachedDb = drizzle({ client: pool, schema });
  }
  return cachedDb;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  const path = new URL(url || '', `http://${req.headers.host}`).pathname;
  
  try {
    // Dashboard routes
    if (path === '/api/dashboard/stats' && method === 'GET') {
      const db = getDb();
      const orders = await db.select().from(schema.orders);
      const tables = await db.select().from(schema.tables);
      const staff = await db.select().from(schema.staff);
      const inventory = await db.select().from(schema.inventory);
      
      const stats = {
        dailyRevenue: 0,
        activeOrders: orders.filter(o => o.status === 'preparing' || o.status === 'pending').length,
        occupiedTables: tables.filter(t => t.status === 'occupied').length,
        totalTables: tables.length,
        staffPresent: staff.filter(s => s.status === 'active').length,
        totalStaff: staff.length,
        lowStockItems: inventory.filter(i => i.lowStock).length,
      };
      
      return res.status(200).json(stats);
    }
    
    // Menu routes
    if (path === '/api/menu' && method === 'GET') {
      const db = getDb();
      const items = await db.select().from(schema.menuItems);
      return res.status(200).json(items);
    }
    
    if (path === '/api/menu' && method === 'POST') {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const db = getDb();
      const [item] = await db.insert(schema.menuItems).values(validatedData).returning();
      return res.status(201).json(item);
    }
    
    if (path.startsWith('/api/menu/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const [item] = await db.select().from(schema.menuItems).where(eq(schema.menuItems.id, id));
      if (!item) return res.status(404).json({ message: 'Menu item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/menu/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = insertMenuItemSchema.parse(req.body);
      const db = getDb();
      const [item] = await db.update(schema.menuItems).set(validatedData).where(eq(schema.menuItems.id, id)).returning();
      if (!item) return res.status(404).json({ message: 'Menu item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/menu/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const result = await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));
      if (result.rowCount === 0) return res.status(404).json({ message: 'Menu item not found' });
      return res.status(204).send('');
    }
    
    // Tables routes
    if (path === '/api/tables' && method === 'GET') {
      const db = getDb();
      const tables = await db.select().from(schema.tables);
      return res.status(200).json(tables);
    }
    
    if (path === '/api/tables' && method === 'POST') {
      const validatedData = insertTableSchema.parse(req.body);
      const table = await storage.createTable(validatedData);
      return res.status(201).json(table);
    }
    
    if (path.startsWith('/api/tables/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const table = await storage.getTable(id);
      if (!table) return res.status(404).json({ message: 'Table not found' });
      return res.status(200).json(table);
    }
    
    if (path.startsWith('/api/tables/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateTableSchema.parse(req.body);
      const table = await storage.updateTable(id, validatedData);
      if (!table) return res.status(404).json({ message: 'Table not found' });
      return res.status(200).json(table);
    }
    
    if (path.startsWith('/api/tables/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const success = await storage.deleteTable(id);
      if (!success) return res.status(404).json({ message: 'Table not found' });
      return res.status(204).send('');
    }
    
    // Orders routes
    if (path === '/api/orders' && method === 'GET') {
      const { status } = req.query;
      if (status && typeof status === 'string') {
        const orders = await storage.getOrdersByStatus(status);
        return res.status(200).json(orders);
      }
      const db = getDb();
      const orders = await db.select().from(schema.orders);
      return res.status(200).json(orders);
    }
    
    if (path === '/api/orders' && method === 'POST') {
      try {
        console.log('Creating order with data:', req.body);
        
        // Ensure total is a string for decimal field
        const bodyData = {
          ...req.body,
          total: typeof req.body.total === 'number' ? req.body.total.toString() : req.body.total
        };
        
        const validatedData = insertOrderSchema.parse(bodyData);
        console.log('Validated data:', validatedData);
        
        // Create order directly with database
        const db = getDb();
        const [newOrder] = await db.insert(schema.orders).values(validatedData).returning();
        
        console.log('Order created:', newOrder);
        return res.status(201).json(newOrder);
      } catch (error) {
        console.error('Error creating order:', error);
        
        // More detailed error info
        if (error instanceof Error) {
          console.error('Error stack:', error.stack);
        }
        
        return res.status(500).json({ 
          message: 'Internal server error', 
          error: error instanceof Error ? error.message : 'Unknown error',
          details: error instanceof Error ? error.stack : undefined
        });
      }
    }
    
    if (path.startsWith('/api/orders/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const order = await storage.getOrder(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json(order);
    }
    
    if (path.startsWith('/api/orders/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateOrderSchema.parse(req.body);
      const order = await storage.updateOrder(id, validatedData);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json(order);
    }
    
    if (path.startsWith('/api/orders/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const success = await storage.deleteOrder(id);
      if (!success) return res.status(404).json({ message: 'Order not found' });
      return res.status(204).send('');
    }
    
    // Inventory routes
    if (path === '/api/inventory' && method === 'GET') {
      const inventory = await storage.getInventory();
      return res.status(200).json(inventory);
    }
    
    if (path === '/api/inventory' && method === 'POST') {
      const validatedData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      return res.status(201).json(item);
    }
    
    if (path === '/api/inventory/low-stock' && method === 'GET') {
      const items = await storage.getLowStockItems();
      return res.status(200).json(items);
    }
    
    if (path.startsWith('/api/inventory/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const item = await storage.getInventoryItem(id);
      if (!item) return res.status(404).json({ message: 'Inventory item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/inventory/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateInventorySchema.parse(req.body);
      const item = await storage.updateInventoryItem(id, validatedData);
      if (!item) return res.status(404).json({ message: 'Inventory item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/inventory/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const success = await storage.deleteInventoryItem(id);
      if (!success) return res.status(404).json({ message: 'Inventory item not found' });
      return res.status(204).send('');
    }
    
    // Staff routes
    if (path === '/api/staff' && method === 'GET') {
      const staff = await storage.getStaff();
      return res.status(200).json(staff);
    }
    
    if (path === '/api/staff' && method === 'POST') {
      const validatedData = insertStaffSchema.parse(req.body);
      const member = await storage.createStaffMember(validatedData);
      return res.status(201).json(member);
    }
    
    if (path.startsWith('/api/staff/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const member = await storage.getStaffMember(id);
      if (!member) return res.status(404).json({ message: 'Staff member not found' });
      return res.status(200).json(member);
    }
    
    if (path.startsWith('/api/staff/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateStaffSchema.parse(req.body);
      const member = await storage.updateStaffMember(id, validatedData);
      if (!member) return res.status(404).json({ message: 'Staff member not found' });
      return res.status(200).json(member);
    }
    
    if (path.startsWith('/api/staff/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const success = await storage.deleteStaffMember(id);
      if (!success) return res.status(404).json({ message: 'Staff member not found' });
      return res.status(204).send('');
    }
    
    // Customers routes
    if (path === '/api/customers' && method === 'GET') {
      const customers = await storage.getCustomers();
      return res.status(200).json(customers);
    }
    
    if (path === '/api/customers' && method === 'POST') {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      return res.status(201).json(customer);
    }
    
    if (path.startsWith('/api/customers/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const customer = await storage.getCustomer(id);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      return res.status(200).json(customer);
    }
    
    if (path.startsWith('/api/customers/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.updateCustomer(id, validatedData);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      return res.status(200).json(customer);
    }
    
    if (path.startsWith('/api/customers/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const success = await storage.deleteCustomer(id);
      if (!success) return res.status(404).json({ message: 'Customer not found' });
      return res.status(204).send('');
    }
    
    // Sales routes
    if (path === '/api/sales' && method === 'GET') {
      const { startDate, endDate } = req.query;
      if (startDate && endDate) {
        const sales = await storage.getSalesByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
        return res.status(200).json(sales);
      }
      const sales = await storage.getSales();
      return res.status(200).json(sales);
    }
    
    if (path === '/api/sales' && method === 'POST') {
      const validatedData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(validatedData);
      return res.status(201).json(sale);
    }
    
    // Route not found
    return res.status(404).json({ message: 'Route not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}