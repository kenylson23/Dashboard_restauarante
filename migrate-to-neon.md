# Migração para Neon Database

## Passo 1: Criar Conta no Neon
1. Acesse https://neon.tech/
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string

## Passo 2: Configurar no Vercel
1. Vá para o dashboard do Vercel
2. Selecione seu projeto
3. Vá em Settings > Environment Variables
4. Adicione/atualize:
   - `DATABASE_URL` = sua connection string do Neon
   - `NODE_ENV` = production

## Passo 3: Executar Migrações
```bash
# No terminal do Replit
export DATABASE_URL="sua-connection-string-do-neon"
npm run db:push
```

## Passo 4: Deploy
```bash
vercel --prod
```

## Vantagens do Neon vs Replit Database

### Performance
- **Neon**: Edge locations globais, menor latência
- **Replit**: Pode ter latência alta do Vercel

### Reliability
- **Neon**: 99.9% uptime SLA
- **Replit**: Dependente do ambiente Replit

### Serverless
- **Neon**: Projetado para serverless, auto-scaling
- **Replit**: Conexões persistentes problemáticas

### Cost
- **Neon**: Gratuito até 512MB
- **Replit**: Gratuito mas limitado

## Código Já Compatível
O código atual já usa `@neondatabase/serverless`, então funcionará imediatamente:

```typescript
// api/index.ts - JÁ ESTÁ PRONTO
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

neonConfig.fetchConnectionCache = true;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });
```

## Resultado Esperado
- ✅ Erro 500 resolvido
- ✅ Performance melhorada
- ✅ Maior confiabilidade
- ✅ Sem mudanças no código