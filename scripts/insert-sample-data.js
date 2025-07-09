import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ 
  connectionString: process.env.EXTERNAL_NEON_URL,
  ssl: { rejectUnauthorized: false }
});

async function insertData() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Inserindo dados de exemplo...');
    
    // Verificar se já existem dados
    const menuCount = await client.query('SELECT COUNT(*) FROM menu_items');
    const tableCount = await client.query('SELECT COUNT(*) FROM tables');
    
    if (menuCount.rows[0].count == '0') {
      await client.query(`
        INSERT INTO menu_items (name, description, price, category, available) VALUES 
        ('Pizza Margherita', 'Pizza tradicional com molho de tomate e manjericão', 28.90, 'Pizzas', true),
        ('Hambúrguer Artesanal', 'Hambúrguer 180g com queijo e molho especial', 32.50, 'Lanches', true),
        ('Risotto de Camarão', 'Risotto cremoso com camarões frescos', 45.00, 'Pratos Principais', true),
        ('Salada Caesar', 'Alface, croutons e molho caesar', 22.90, 'Saladas', true),
        ('Tiramisu', 'Sobremesa italiana com café e mascarpone', 18.50, 'Sobremesas', true)
      `);
      console.log('✅ Menu items inseridos');
    }
    
    if (tableCount.rows[0].count == '0') {
      await client.query(`
        INSERT INTO tables (number, capacity, status) VALUES 
        (1, 4, 'available'),
        (2, 2, 'available'), 
        (3, 6, 'available'),
        (4, 4, 'occupied'),
        (5, 8, 'available'),
        (6, 2, 'reserved')
      `);
      console.log('✅ Tables inseridas');
    }
    
    const staffCount = await client.query('SELECT COUNT(*) FROM staff');
    if (staffCount.rows[0].count == '0') {
      await client.query(`
        INSERT INTO staff (name, position, email, phone, status, shift_start, shift_end, hourly_rate) VALUES 
        ('João Silva', 'Garçom', 'joao@restaurant.com', '(11) 99999-1111', 'active', '08:00', '16:00', 15.50),
        ('Maria Santos', 'Chefe de Cozinha', 'maria@restaurant.com', '(11) 99999-2222', 'active', '10:00', '22:00', 25.00),
        ('Pedro Costa', 'Barista', 'pedro@restaurant.com', '(11) 99999-3333', 'active', '06:00', '14:00', 18.00),
        ('Ana Oliveira', 'Hostess', 'ana@restaurant.com', '(11) 99999-4444', 'on_break', '12:00', '20:00', 16.50)
      `);
      console.log('✅ Staff inserido');
    }
    
    // Verificar resultado final
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas no seu banco Neon:');
    result.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));
    
    console.log('🎉 Migração para seu painel Neon concluída com sucesso!');
    console.log('📍 Endpoint: ep-morning-dew-a4gdfkje');
    console.log('🔄 Atualize seu painel do Neon para ver as tabelas.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

insertData();