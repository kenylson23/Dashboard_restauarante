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
import { eq, and, gte, lte, lt } from 'drizzle-orm';
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
        dailyRevenue: orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0),
        activeOrders: orders.filter((order: any) => order.status === 'preparing' || order.status === 'pending').length,
        occupiedTables: tables.filter((table: any) => table.status === 'occupied').length,
        totalTables: tables.length,
        staffPresent: staff.filter((member: any) => member.status === 'active').length,
        totalStaff: staff.length,
        lowStockItems: inventory.filter((item: any) => parseFloat(item.currentStock) < parseFloat(item.minThreshold)).length
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
      const db = getDb();
      const [table] = await db.insert(schema.tables).values(validatedData).returning();
      return res.status(201).json(table);
    }
    
    if (path.startsWith('/api/tables/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const [table] = await db.select().from(schema.tables).where(eq(schema.tables.id, id));
      if (!table) return res.status(404).json({ message: 'Table not found' });
      return res.status(200).json(table);
    }
    
    if (path.startsWith('/api/tables/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateTableSchema.parse(req.body);
      const db = getDb();
      const [table] = await db.update(schema.tables).set(validatedData).where(eq(schema.tables.id, id)).returning();
      if (!table) return res.status(404).json({ message: 'Table not found' });
      return res.status(200).json(table);
    }
    
    if (path.startsWith('/api/tables/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const result = await db.delete(schema.tables).where(eq(schema.tables.id, id));
      if (result.rowCount === 0) return res.status(404).json({ message: 'Table not found' });
      return res.status(204).send('');
    }
    
    // Orders routes
    if (path === '/api/orders' && method === 'GET') {
      const db = getDb();
      const { status } = req.query;
      if (status && typeof status === 'string') {
        const orders = await db.select().from(schema.orders).where(eq(schema.orders.status, status));
        return res.status(200).json(orders);
      } else {
        const orders = await db.select().from(schema.orders);
        return res.status(200).json(orders);
      }
    }
    
    if (path === '/api/orders' && method === 'POST') {
      const validatedData = insertOrderSchema.parse(req.body);
      const db = getDb();
      const [order] = await db.insert(schema.orders).values(validatedData).returning();
      return res.status(201).json(order);
    }
    
    if (path.startsWith('/api/orders/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json(order);
    }
    
    if (path.startsWith('/api/orders/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateOrderSchema.parse(req.body);
      const db = getDb();
      const [order] = await db.update(schema.orders).set(validatedData).where(eq(schema.orders.id, id)).returning();
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json(order);
    }
    
    if (path.startsWith('/api/orders/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const result = await db.delete(schema.orders).where(eq(schema.orders.id, id));
      if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
      return res.status(204).send('');
    }
    
    // Inventory routes
    if (path === '/api/inventory' && method === 'GET') {
      const db = getDb();
      const inventory = await db.select().from(schema.inventory);
      return res.status(200).json(inventory);
    }
    
    if (path === '/api/inventory' && method === 'POST') {
      const validatedData = insertInventorySchema.parse(req.body);
      const db = getDb();
      const [item] = await db.insert(schema.inventory).values(validatedData).returning();
      return res.status(201).json(item);
    }
    
    if (path === '/api/inventory/low-stock' && method === 'GET') {
      const db = getDb();
      const items = await db.select().from(schema.inventory);
      const lowStockItems = items.filter(item => parseFloat(item.currentStock) < parseFloat(item.minThreshold));
      return res.status(200).json(lowStockItems);
    }
    
    if (path.startsWith('/api/inventory/') && method === 'GET' && !path.includes('low-stock')) {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const [item] = await db.select().from(schema.inventory).where(eq(schema.inventory.id, id));
      if (!item) return res.status(404).json({ message: 'Inventory item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/inventory/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateInventorySchema.parse(req.body);
      const db = getDb();
      const [item] = await db.update(schema.inventory).set(validatedData).where(eq(schema.inventory.id, id)).returning();
      if (!item) return res.status(404).json({ message: 'Inventory item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/inventory/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const result = await db.delete(schema.inventory).where(eq(schema.inventory.id, id));
      if (result.rowCount === 0) return res.status(404).json({ message: 'Inventory item not found' });
      return res.status(204).send('');
    }
    
    // Staff routes
    if (path === '/api/staff' && method === 'GET') {
      const db = getDb();
      const staff = await db.select().from(schema.staff);
      return res.status(200).json(staff);
    }
    
    if (path === '/api/staff' && method === 'POST') {
      const validatedData = insertStaffSchema.parse(req.body);
      const db = getDb();
      const [member] = await db.insert(schema.staff).values(validatedData).returning();
      return res.status(201).json(member);
    }
    
    if (path.startsWith('/api/staff/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const [member] = await db.select().from(schema.staff).where(eq(schema.staff.id, id));
      if (!member) return res.status(404).json({ message: 'Staff member not found' });
      return res.status(200).json(member);
    }
    
    if (path.startsWith('/api/staff/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = updateStaffSchema.parse(req.body);
      const db = getDb();
      const [member] = await db.update(schema.staff).set(validatedData).where(eq(schema.staff.id, id)).returning();
      if (!member) return res.status(404).json({ message: 'Staff member not found' });
      return res.status(200).json(member);
    }
    
    if (path.startsWith('/api/staff/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const result = await db.delete(schema.staff).where(eq(schema.staff.id, id));
      if (result.rowCount === 0) return res.status(404).json({ message: 'Staff member not found' });
      return res.status(204).send('');
    }
    
    // Customers routes
    if (path === '/api/customers' && method === 'GET') {
      const db = getDb();
      const customers = await db.select().from(schema.customers);
      return res.status(200).json(customers);
    }
    
    if (path === '/api/customers' && method === 'POST') {
      const validatedData = insertCustomerSchema.parse(req.body);
      const db = getDb();
      const [customer] = await db.insert(schema.customers).values(validatedData).returning();
      return res.status(201).json(customer);
    }
    
    if (path.startsWith('/api/customers/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const [customer] = await db.select().from(schema.customers).where(eq(schema.customers.id, id));
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      return res.status(200).json(customer);
    }
    
    if (path.startsWith('/api/customers/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = insertCustomerSchema.parse(req.body);
      const db = getDb();
      const [customer] = await db.update(schema.customers).set(validatedData).where(eq(schema.customers.id, id)).returning();
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      return res.status(200).json(customer);
    }
    
    if (path.startsWith('/api/customers/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const db = getDb();
      const result = await db.delete(schema.customers).where(eq(schema.customers.id, id));
      if (result.rowCount === 0) return res.status(404).json({ message: 'Customer not found' });
      return res.status(204).send('');
    }
    
    // Sales routes
    if (path === '/api/sales' && method === 'GET') {
      const db = getDb();
      const { startDate, endDate } = req.query;
      
      if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
        const sales = await db.select().from(schema.sales).where(
          and(
            gte(schema.sales.date, new Date(startDate)),
            lte(schema.sales.date, new Date(endDate))
          )
        );
        return res.status(200).json(sales);
      } else {
        const sales = await db.select().from(schema.sales);
        return res.status(200).json(sales);
      }
    }
    
    if (path === '/api/sales' && method === 'POST') {
      const validatedData = insertSaleSchema.parse(req.body);
      const db = getDb();
      const [sale] = await db.insert(schema.sales).values(validatedData).returning();
      return res.status(201).json(sale);
    }
    
    return res.status(404).json({ message: 'Route not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}