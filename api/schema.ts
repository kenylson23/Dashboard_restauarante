import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  available: boolean("available").notNull().default(true),
  image: text("image"),
});

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  capacity: integer("capacity").notNull(),
  status: text("status").notNull().default("available"), // available, occupied, reserved, cleaning
  reservedBy: text("reserved_by"),
  reservedAt: timestamp("reserved_at"),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableNumber: integer("table_number").notNull(),
  status: text("status").notNull().default("pending"), // pending, preparing, ready, served, cancelled
  items: text("items").notNull(), // JSON string of order items
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  customerName: text("customer_name"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // kg, units, liters, etc.
  minThreshold: decimal("min_threshold", { precision: 10, scale: 2 }).notNull(),
  maxThreshold: decimal("max_threshold", { precision: 10, scale: 2 }).notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  supplier: text("supplier"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  status: text("status").notNull().default("active"), // active, inactive, on_break
  shiftStart: text("shift_start"),
  shiftEnd: text("shift_end"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  address: text("address"),
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).notNull().default("0"),
  lastVisit: timestamp("last_visit"),
  preferences: text("preferences"),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  orderId: integer("order_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertTableSchema = createInsertSchema(tables).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true, lastUpdated: true });
export const insertStaffSchema = createInsertSchema(staff).omit({ id: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, totalOrders: true, totalSpent: true, lastVisit: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true, date: true });

// Update schemas
export const updateOrderSchema = createInsertSchema(orders).partial().omit({ id: true, createdAt: true });
export const updateTableSchema = createInsertSchema(tables).partial().omit({ id: true });
export const updateInventorySchema = createInsertSchema(inventory).partial().omit({ id: true });
export const updateStaffSchema = createInsertSchema(staff).partial().omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Table = typeof tables.$inferSelect;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

// Order item interface
export interface OrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

// Dashboard stats interface
export interface DashboardStats {
  dailyRevenue: number;
  activeOrders: number;
  occupiedTables: number;
  totalTables: number;
  staffPresent: number;
  totalStaff: number;
  lowStockItems: number;
}