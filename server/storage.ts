import { 
  users, menuItems, tables, orders, inventory, staff, customers, sales,
  type User, type InsertUser, type MenuItem, type InsertMenuItem, 
  type Table, type InsertTable, type Order, type InsertOrder,
  type Inventory, type InsertInventory, type Staff, type InsertStaff,
  type Customer, type InsertCustomer, type Sale, type InsertSale,
  type OrderItem, type DashboardStats
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Menu methods
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;

  // Table methods
  getTables(): Promise<Table[]>;
  getTable(id: number): Promise<Table | undefined>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: number, updates: Partial<Table>): Promise<Table | undefined>;
  deleteTable(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  // Inventory methods
  getInventory(): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, updates: Partial<Inventory>): Promise<Inventory | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  getLowStockItems(): Promise<Inventory[]>;

  // Staff methods
  getStaff(): Promise<Staff[]>;
  getStaffMember(id: number): Promise<Staff | undefined>;
  createStaffMember(staff: InsertStaff): Promise<Staff>;
  updateStaffMember(id: number, updates: Partial<Staff>): Promise<Staff | undefined>;
  deleteStaffMember(id: number): Promise<boolean>;

  // Customer methods
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;

  // Sales methods
  getSales(): Promise<Sale[]>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;

  // Dashboard methods
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private menuItems: Map<number, MenuItem> = new Map();
  private tables: Map<number, Table> = new Map();
  private orders: Map<number, Order> = new Map();
  private inventory: Map<number, Inventory> = new Map();
  private staff: Map<number, Staff> = new Map();
  private customers: Map<number, Customer> = new Map();
  private sales: Map<number, Sale> = new Map();

  private userIdCounter = 1;
  private menuItemIdCounter = 1;
  private tableIdCounter = 1;
  private orderIdCounter = 1;
  private inventoryIdCounter = 1;
  private staffIdCounter = 1;
  private customerIdCounter = 1;
  private saleIdCounter = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed tables
    for (let i = 1; i <= 25; i++) {
      const table: Table = {
        id: this.tableIdCounter++,
        number: i,
        capacity: i <= 10 ? 2 : i <= 20 ? 4 : 6,
        status: i <= 18 ? "occupied" : i <= 22 ? "available" : "reserved",
        reservedBy: i > 22 ? "Cliente Reserva" : null,
        reservedAt: i > 22 ? new Date() : null,
      };
      this.tables.set(table.id, table);
    }

    // Seed inventory
    const inventoryItems = [
      { name: "Tomate", category: "Vegetais", currentStock: "5", unit: "kg", minThreshold: "10", maxThreshold: "50" },
      { name: "Queijo Mussarela", category: "Laticínios", currentStock: "2", unit: "kg", minThreshold: "5", maxThreshold: "20" },
      { name: "Pão de Hambúrguer", category: "Padaria", currentStock: "15", unit: "unidades", minThreshold: "20", maxThreshold: "100" },
      { name: "Carne Bovina", category: "Carnes", currentStock: "25", unit: "kg", minThreshold: "10", maxThreshold: "50" },
      { name: "Alface", category: "Vegetais", currentStock: "8", unit: "kg", minThreshold: "5", maxThreshold: "20" },
    ];

    inventoryItems.forEach(item => {
      const inventory: Inventory = {
        id: this.inventoryIdCounter++,
        name: item.name,
        category: item.category,
        currentStock: item.currentStock,
        unit: item.unit,
        minThreshold: item.minThreshold,
        maxThreshold: item.maxThreshold,
        pricePerUnit: "5.50",
        supplier: "Fornecedor Local",
        lastUpdated: new Date(),
      };
      this.inventory.set(inventory.id, inventory);
    });

    // Seed staff
    const staffMembers = [
      { name: "Maria Silva", position: "Gerente", status: "active", email: "maria@restaurant.com" },
      { name: "João Santos", position: "Cozinheiro", status: "active", email: "joao@restaurant.com" },
      { name: "Ana Costa", position: "Garçonete", status: "active", email: "ana@restaurant.com" },
      { name: "Carlos Lima", position: "Garçom", status: "on_break", email: "carlos@restaurant.com" },
    ];

    staffMembers.forEach(member => {
      const staff: Staff = {
        id: this.staffIdCounter++,
        name: member.name,
        position: member.position,
        email: member.email,
        phone: "(11) 99999-9999",
        status: member.status,
        shiftStart: "08:00",
        shiftEnd: "16:00",
        hourlyRate: "15.00",
      };
      this.staff.set(staff.id, staff);
    });

    // Seed menu items
    const menuItemsData = [
      { name: "Hambúrguer Clássico", description: "Hambúrguer com queijo, alface e tomate", price: "25.90", category: "Hambúrgueres" },
      { name: "Pizza Margherita", description: "Pizza com molho de tomate, mussarela e manjericão", price: "32.50", category: "Pizzas" },
      { name: "Salada Caesar", description: "Salada com alface, croutons e molho caesar", price: "18.90", category: "Saladas" },
      { name: "Batata Frita", description: "Porção de batata frita crocante", price: "12.50", category: "Acompanhamentos" },
      { name: "Refrigerante", description: "Coca-Cola, Pepsi ou Guaraná", price: "5.50", category: "Bebidas" },
    ];

    menuItemsData.forEach(item => {
      const menuItem: MenuItem = {
        id: this.menuItemIdCounter++,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: true,
        image: null,
      };
      this.menuItems.set(menuItem.id, menuItem);
    });

    // Seed orders
    const ordersData = [
      { tableNumber: 12, status: "preparing", items: [{ menuItemId: 1, name: "Hambúrguer Clássico", quantity: 2, price: 25.90 }, { menuItemId: 4, name: "Batata Frita", quantity: 1, price: 12.50 }], total: "64.30" },
      { tableNumber: 7, status: "ready", items: [{ menuItemId: 2, name: "Pizza Margherita", quantity: 1, price: 32.50 }, { menuItemId: 5, name: "Refrigerante", quantity: 2, price: 5.50 }], total: "43.50" },
      { tableNumber: 3, status: "pending", items: [{ menuItemId: 3, name: "Salada Caesar", quantity: 2, price: 18.90 }, { menuItemId: 5, name: "Refrigerante", quantity: 1, price: 5.50 }], total: "43.30" },
    ];

    ordersData.forEach(orderData => {
      const order: Order = {
        id: this.orderIdCounter++,
        tableNumber: orderData.tableNumber,
        status: orderData.status,
        items: JSON.stringify(orderData.items),
        total: orderData.total,
        customerName: `Cliente Mesa ${orderData.tableNumber}`,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.orders.set(order.id, order);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.userIdCounter++ };
    this.users.set(user.id, user);
    return user;
  }

  // Menu methods
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const menuItem: MenuItem = { ...item, id: this.menuItemIdCounter++ };
    this.menuItems.set(menuItem.id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...updates };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Table methods
  async getTables(): Promise<Table[]> {
    return Array.from(this.tables.values());
  }

  async getTable(id: number): Promise<Table | undefined> {
    return this.tables.get(id);
  }

  async createTable(table: InsertTable): Promise<Table> {
    const newTable: Table = { ...table, id: this.tableIdCounter++ };
    this.tables.set(newTable.id, newTable);
    return newTable;
  }

  async updateTable(id: number, updates: Partial<Table>): Promise<Table | undefined> {
    const table = this.tables.get(id);
    if (!table) return undefined;
    const updated = { ...table, ...updates };
    this.tables.set(id, updated);
    return updated;
  }

  async deleteTable(id: number): Promise<boolean> {
    return this.tables.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.status === status);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = { 
      ...order, 
      id: this.orderIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Inventory methods
  async getInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    return this.inventory.get(id);
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    const newItem: Inventory = { ...item, id: this.inventoryIdCounter++, lastUpdated: new Date() };
    this.inventory.set(newItem.id, newItem);
    return newItem;
  }

  async updateInventoryItem(id: number, updates: Partial<Inventory>): Promise<Inventory | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...updates, lastUpdated: new Date() };
    this.inventory.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventory.delete(id);
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(item => 
      parseFloat(item.currentStock) <= parseFloat(item.minThreshold)
    );
  }

  // Staff methods
  async getStaff(): Promise<Staff[]> {
    return Array.from(this.staff.values());
  }

  async getStaffMember(id: number): Promise<Staff | undefined> {
    return this.staff.get(id);
  }

  async createStaffMember(staff: InsertStaff): Promise<Staff> {
    const newStaff: Staff = { ...staff, id: this.staffIdCounter++ };
    this.staff.set(newStaff.id, newStaff);
    return newStaff;
  }

  async updateStaffMember(id: number, updates: Partial<Staff>): Promise<Staff | undefined> {
    const staffMember = this.staff.get(id);
    if (!staffMember) return undefined;
    const updated = { ...staffMember, ...updates };
    this.staff.set(id, updated);
    return updated;
  }

  async deleteStaffMember(id: number): Promise<boolean> {
    return this.staff.delete(id);
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const newCustomer: Customer = { 
      ...customer, 
      id: this.customerIdCounter++,
      totalOrders: 0,
      totalSpent: "0",
      lastVisit: null
    };
    this.customers.set(newCustomer.id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    const updated = { ...customer, ...updates };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Sales methods
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(sale => 
      sale.date >= startDate && sale.date <= endDate
    );
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const newSale: Sale = { ...sale, id: this.saleIdCounter++, date: new Date() };
    this.sales.set(newSale.id, newSale);
    return newSale;
  }

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailySales = Array.from(this.sales.values()).filter(sale => {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });

    const dailyRevenue = dailySales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const activeOrders = Array.from(this.orders.values()).filter(order => 
      order.status === "pending" || order.status === "preparing"
    ).length;

    const allTables = Array.from(this.tables.values());
    const occupiedTables = allTables.filter(table => table.status === "occupied").length;
    const totalTables = allTables.length;

    const allStaff = Array.from(this.staff.values());
    const staffPresent = allStaff.filter(staff => staff.status === "active").length;
    const totalStaff = allStaff.length;

    const lowStockItems = (await this.getLowStockItems()).length;

    return {
      dailyRevenue,
      activeOrders,
      occupiedTables,
      totalTables,
      staffPresent,
      totalStaff,
      lowStockItems,
    };
  }
}

export const storage = new MemStorage();
