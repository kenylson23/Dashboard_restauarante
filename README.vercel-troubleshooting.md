# Troubleshooting Vercel Deployment - Erro 500 ao Criar Pedidos

## Problema
Erro 500 (Internal Server Error) ao criar pedidos através da API no Vercel.

## Soluções Implementadas

### 1. API Otimizada para Serverless
- ✅ Removido uso do `DatabaseStorage` que pode causar problemas com imports
- ✅ Implementação direta das queries usando Drizzle ORM
- ✅ Cache de conexão de banco para evitar multiple connections
- ✅ Configuração `neonConfig.fetchConnectionCache = true` para melhor performance
- ✅ Logs detalhados para debugging

### 2. Tratamento de Tipos de Dados
- ✅ Conversão automática de `total` para string (compatível com campos decimal)
- ✅ Validação robusta com Zod antes de inserir no banco
- ✅ Error handling melhorado com stack traces

### 3. Configuração Serverless
- ✅ Removido import problemático do `ws` (websocket) da API
- ✅ Conexão direta com Neon Database sem middleware desnecessário
- ✅ Implementação de cache para evitar reconexões

## Sugestões para Resolver o Erro 500

### Opção 1: Verificar Logs no Vercel
1. Acesse o dashboard do Vercel
2. Vá para "Functions" > "View Function Logs"
3. Procure pelos logs da função API durante o erro 500
4. Verifique se aparecem os console.log que adicionei

### Opção 2: Verificar Environment Variables
Certifique-se de que estas variáveis estão configuradas no Vercel:
- `DATABASE_URL` - URL de conexão com o PostgreSQL
- `NODE_ENV=production`

### Opção 3: Deploy da Versão Otimizada
A API foi otimizada para funcionar melhor no ambiente serverless do Vercel:
- Removidas dependências problemáticas
- Implementação direta das queries
- Cache de conexão otimizado

### Opção 4: Fallback para MemStorage
Se o problema persistir, podemos temporariamente usar MemStorage:
```typescript
// No api/index.ts, trocar:
const db = getDb();
// Por:
import { MemStorage } from '../server/storage';
const storage = new MemStorage();
```

## Debugging no Vercel

### 1. Verificar Logs
```bash
vercel logs --tail
```

### 2. Testar API Local vs Vercel
```bash
# Local (deve funcionar)
curl -X POST http://localhost:5000/api/orders -H "Content-Type: application/json" -d '{"tableNumber": 1, "status": "pending", "items": "[]", "total": "0.00"}'

# Vercel (verificar se funciona)
curl -X POST https://seu-app.vercel.app/api/orders -H "Content-Type: application/json" -d '{"tableNumber": 1, "status": "pending", "items": "[]", "total": "0.00"}'
```

### 3. Verificar Dependências
O problema pode estar relacionado a:
- Versão do Node.js no Vercel
- Dependências do WebSocket (ws) que não funcionam em serverless
- Problemas de timeout em conexões de banco

## Próximos Passos
1. Fazer deploy da versão otimizada
2. Verificar os logs no Vercel
3. Testar a API de criação de pedidos
4. Se ainda der erro, implementar MemStorage temporariamente