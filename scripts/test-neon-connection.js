import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';

async function testConnection() {
  console.log('🔍 Testando conexão com seu painel Neon...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@'));
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const result = await pool.query(`
      SELECT 
        current_database() as database_name,
        current_schema() as schema_name,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port,
        version() as postgres_version
    `);
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Informações do servidor:', result.rows[0]);
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas encontradas:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();