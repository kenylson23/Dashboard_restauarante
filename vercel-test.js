// Teste para verificar se a API funciona no ambiente Vercel
import { Pool } from '@neondatabase/serverless';

async function testConnection() {
  console.log('🧪 Testando conexão com Neon Database...');
  
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.log('❌ DATABASE_URL não encontrada');
    return;
  }

  try {
    const pool = new Pool({ connectionString: DATABASE_URL });
    const client = await pool.connect();
    
    // Teste básico de conexão
    const result = await client.query('SELECT NOW()');
    console.log('✅ Conexão com banco funcionando:', result.rows[0]);
    
    // Verificar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('✅ Tabelas encontradas:', tables.rows.map(r => r.table_name));
    
    client.release();
    console.log('✅ Teste concluído com sucesso');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

testConnection();