import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/storage';
import { 
  insertMenuItemSchema, insertTableSchema, insertOrderSchema, 
  insertInventorySchema, insertStaffSchema, insertCustomerSchema, 
  insertSaleSchema, updateOrderSchema, updateTableSchema, 
  updateInventorySchema, updateStaffSchema
} from '../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  const path = new URL(url || '', `http://${req.headers.host}`).pathname;
  
  try {
    // Dashboard routes
    if (path === '/api/dashboard/stats' && method === 'GET') {
      const stats = await storage.getDashboardStats();
      return res.status(200).json(stats);
    }
    
    // Menu routes
    if (path === '/api/menu' && method === 'GET') {
      const items = await storage.getMenuItems();
      return res.status(200).json(items);
    }
    
    if (path === '/api/menu' && method === 'POST') {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      return res.status(201).json(item);
    }
    
    if (path.startsWith('/api/menu/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      const item = await storage.getMenuItem(id);
      if (!item) return res.status(404).json({ message: 'Menu item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/menu/') && method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '');
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.updateMenuItem(id, validatedData);
      if (!item) return res.status(404).json({ message: 'Menu item not found' });
      return res.status(200).json(item);
    }
    
    if (path.startsWith('/api/menu/') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '');
      const success = await storage.deleteMenuItem(id);
      if (!success) return res.status(404).json({ message: 'Menu item not found' });
      return res.status(204).send('');
    }
    
    // Tables routes
    if (path === '/api/tables' && method === 'GET') {
      const tables = await storage.getTables();
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
      const orders = await storage.getOrders();
      return res.status(200).json(orders);
    }
    
    if (path === '/api/orders' && method === 'POST') {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      return res.status(201).json(order);
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