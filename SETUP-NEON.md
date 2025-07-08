# Configuração do Neon Database para Vercel

## ✅ Status das Migrações
- **Migrações criadas:** `migrations/0000_fresh_talos.sql`
- **8 tabelas configuradas:**
  - users (usuários do sistema)
  - menu_items (cardápio)
  - tables (mesas)
  - orders (pedidos)
  - inventory (estoque)
  - staff (funcionários)
  - customers (clientes)
  - sales (vendas)

## 🚀 Passos para conectar com Neon

### 1. Criar conta no Neon
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto PostgreSQL
4. Copie a **Connection String** (DATABASE_URL)

### 2. Aplicar as migrações no Neon
Depois de ter a connection string do Neon:

```bash
# Configurar a variável de ambiente temporariamente
export DATABASE_URL="sua_connection_string_do_neon"

# Aplicar as migrações
npm run db:push
```

**OU** execute direto o SQL da migração no console do Neon:
- Cole o conteúdo de `migrations/0000_fresh_talos.sql` no SQL Editor do Neon

### 3. Configurar no Vercel
No dashboard do Vercel, adicione estas variáveis de ambiente:

```
DATABASE_URL = sua_connection_string_do_neon
NODE_ENV = production
```

### 4. Deploy no Vercel
Seu projeto já está 100% pronto para deploy serverless!

## 📁 Estrutura do Banco
```sql
-- 8 tabelas criadas:
CREATE TABLE "users" (...)         -- Sistema de login
CREATE TABLE "menu_items" (...)    -- Cardápio do restaurante
CREATE TABLE "tables" (...)        -- Controle de mesas
CREATE TABLE "orders" (...)        -- Pedidos dos clientes
CREATE TABLE "inventory" (...)     -- Controle de estoque
CREATE TABLE "staff" (...)         -- Funcionários
CREATE TABLE "customers" (...)     -- Base de clientes
CREATE TABLE "sales" (...)         -- Registro de vendas
```

## 🔧 Comandos úteis

```bash
# Ver migrações disponíveis
ls migrations/

# Gerar novas migrações (após mudanças no schema)
npx drizzle-kit generate

# Aplicar migrações
npm run db:push

# Ver status do banco
npx drizzle-kit introspect
```

## ⚡ Vantagens do Neon
- **Serverless**: Escala automaticamente
- **Branching**: Crie branches do banco para testes
- **Free tier**: 512MB grátis
- **Compatível com Vercel**: Zero configuração extra
- **Backups automáticos**

## ✅ Correções Aplicadas para Vercel

### Problema resolvido: Import do schema
- **Problema:** `api/index.js` não conseguia importar `/shared/schema` no Vercel
- **Solução:** Criado `api/schema.ts` com cópia local do schema
- **Resultado:** Imports funcionando corretamente no ambiente serverless

### Configuração WebSocket para Neon
- Adicionada configuração automática do WebSocket para Node.js
- Cache de conexão habilitado para melhor performance
- Compatível com ambiente serverless do Vercel

## 🆘 Troubleshooting
Se houver problemas na conexão:
1. Verifique se a DATABASE_URL está correta no Vercel
2. Confirme que o projeto Neon está ativo
3. Verifique se todas as environment variables estão configuradas
4. Consulte os logs de deployment no Vercel
5. A API local está funcionando: ✅ testada com sucesso