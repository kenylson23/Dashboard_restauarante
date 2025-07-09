-- Script para forçar criação das tabelas no seu painel Neon
-- Execute este script diretamente no Editor SQL do seu painel Neon

-- 1. Verificar conexão
SELECT 
  current_database() as database_name,
  current_schema() as schema_name,
  inet_server_addr() as server_ip,
  version() as postgres_version;

-- 2. Criar tabelas do sistema (se não existirem)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  image TEXT
);

CREATE TABLE IF NOT EXISTS tables (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  capacity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  reserved_by TEXT,
  reserved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  table_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  items TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  customer_name TEXT,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  current_stock DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  min_threshold DECIMAL(10, 2) NOT NULL,
  max_threshold DECIMAL(10, 2) NOT NULL,
  price_per_unit DECIMAL(10, 2),
  supplier TEXT,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  shift_start TEXT,
  shift_end TEXT,
  hourly_rate DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
  last_visit TIMESTAMP,
  preferences TEXT
);

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  order_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0
);

-- 3. Inserir dados de exemplo
INSERT INTO menu_items (name, description, price, category, available) VALUES 
('Pizza Margherita', 'Pizza tradicional italiana com molho de tomate, mozzarella e manjericão fresco', 28.90, 'Pizzas', true),
('Hambúrguer Artesanal', 'Hambúrguer de carne angus 180g, queijo cheddar, alface, tomate e molho especial', 32.50, 'Lanches', true),
('Risotto de Camarão', 'Risotto cremoso com camarões frescos, aspargos e ervas finas', 45.00, 'Pratos Principais', true),
('Salada Caesar', 'Alface americana, croutons artesanais, parmesão e molho caesar', 22.90, 'Saladas', true),
('Tiramisu', 'Sobremesa italiana com café espresso, mascarpone e cacau', 18.50, 'Sobremesas', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO tables (number, capacity, status) VALUES 
(1, 4, 'available'),
(2, 2, 'available'), 
(3, 6, 'available'),
(4, 4, 'occupied'),
(5, 8, 'available'),
(6, 2, 'reserved')
ON CONFLICT (number) DO NOTHING;

INSERT INTO staff (name, position, email, phone, status, shift_start, shift_end, hourly_rate) VALUES 
('João Silva', 'Garçom', 'joao@restaurant.com', '(11) 99999-1111', 'active', '08:00', '16:00', 15.50),
('Maria Santos', 'Chefe de Cozinha', 'maria@restaurant.com', '(11) 99999-2222', 'active', '10:00', '22:00', 25.00),
('Pedro Costa', 'Barista', 'pedro@restaurant.com', '(11) 99999-3333', 'active', '06:00', '14:00', 18.00),
('Ana Oliveira', 'Hostess', 'ana@restaurant.com', '(11) 99999-4444', 'on_break', '12:00', '20:00', 16.50)
ON CONFLICT (email) DO NOTHING;

-- 4. Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 5. Contar registros
SELECT 
  'menu_items' as tabela, COUNT(*) as registros FROM menu_items
UNION ALL
SELECT 'tables' as tabela, COUNT(*) as registros FROM tables  
UNION ALL  
SELECT 'staff' as tabela, COUNT(*) as registros FROM staff
UNION ALL
SELECT 'inventory' as tabela, COUNT(*) as registros FROM inventory;